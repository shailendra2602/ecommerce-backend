
import express from "express";
import Address from "../models/Address.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. Save address for logged-in user
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      address,
      city,
      postalCode,
      phone,
    } = req.body;

    if (
      !firstName?.trim() ||
      !lastName?.trim() ||
      !email?.trim() ||
      !address?.trim() ||
      !city?.trim() ||
      !postalCode?.trim() ||
      !phone?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all address fields",
      });
    }

    const savedAddress = await Address.create({
      user: req.userId,
      firstName,
      lastName,
      email,
      address,
      city,
      postalCode,
      phone,
    });

    return res.status(201).json({
      success: true,
      message: "Address saved successfully",
      address: savedAddress,
    });
  } catch (error) {
    console.error("Save address error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to save address",
    });
  }
});

// 2. Get addresses of logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const addresses = await Address.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: addresses.length,
      addresses,
    });
  } catch (error) {
    console.error("Get addresses error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch addresses",
    });
  }
});

// 3. Update an address owned by the logged-in user
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const allowedFields = [
      "firstName",
      "lastName",
      "email",
      "address",
      "city",
      "postalCode",
      "phone",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (
          typeof req.body[field] !== "string" ||
          !req.body[field].trim()
        ) {
          return res.status(400).json({
            success: false,
            message: `${field} must be a non-empty string`,
          });
        }

        updates[field] = req.body[field].trim();
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide fields to update",
      });
    }

    const updatedAddress = await Address.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.userId,
      },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address: updatedAddress,
    });
  } catch (error) {
    console.error("Update address error:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update address",
    });
  }
});

// 4. Delete an address owned by the logged-in user
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedAddress = await Address.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!deletedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Delete address error:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to delete address",
    });
  }
});

export default router;
