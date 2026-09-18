const { User } = require("../models");
const { Job } = require("../models");
const { Part } = require("../models");

const jwt = require("jsonwebtoken");
const { jwtDecode } = require("jwt-decode");

const addPart = async (req, res) => {
  try {
    const { partName, unitPrice, quantity } = req.body;

    if (!partName || !unitPrice || !quantity) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    const decoded = jwtDecode(token);
    if (decoded.role !== "worker") {
      return res.status(403).json({
        message: "Access denied. Only worker users can add parts.",
      });
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    if (!jwt.verify(token, process.env.JWT_SECRET)) {
      return res.status(403).json({ message: "Invalid token." });
    }

    const newPart = await Part.create({
      partName: partName.trim(),
      unitPrice: unitPrice.trim(),
      quantity: quantity.trim(),
      totalPrice: (
        parseFloat(unitPrice.trim()) * parseInt(quantity.trim())
      ).toString(),
      createdBy: decoded.id,
    });

    return res.status(201).json({
      message: "Part created successfully",
      part: newPart,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updatePart = async (req, res) => {
  try {
    const { partName, unitPrice, quantity } = req.body;

    if (!partName || !unitPrice || !quantity) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const decoded = jwtDecode(token);
    if (decoded.role !== "worker") {
      return res.status(403).json({
        message: "Access denied. Only worker users can update parts.",
      });
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    if (!jwt.verify(token, process.env.JWT_SECRET)) {
      return res.status(403).json({ message: "Invalid token." });
    }

    const partId = req.params.id;
    const part = await Part.findOne({ where: { id: partId } });
    if (!part) {
      return res.status(404).json({ message: "Part not found" });
    }
    const isOwner = part.createdBy === decoded.id;

    if (!isOwner) {
      return res.status(403).json({
        message: "Access denied. You can only update your own parts.",
      });
    }

    const updatePart = await Part.update(
      {
        partName: partName.trim(),
        unitPrice: unitPrice.trim(),
        quantity: quantity.trim(),
        totalPrice: (
          parseFloat(unitPrice.trim()) * parseInt(quantity.trim())
        ).toString(),
        updatedBy: decoded.id,
      },
      { where: { id: partId } },
    );

    return res.status(201).json({
      message: "Part updated successfully",

      partName: partName.trim(),
      unitPrice: unitPrice.trim(),
      quantity: quantity.trim(),
      totalPrice: (
        parseFloat(unitPrice.trim()) * parseInt(quantity.trim())
      ).toString(),
      updatedBy: decoded.id,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const deletePart = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const decoded = jwtDecode(token);
    if (decoded.role !== "worker") {
      return res.status(403).json({
        message: "Access denied. Only worker users can delete parts.",
      });
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    if (!jwt.verify(token, process.env.JWT_SECRET)) {
      return res.status(403).json({ message: "Invalid token." });
    }

    const partId = req.params.id;
    const part = await Part.findOne({ where: { id: partId } });
    if (!part) {
      return res.status(404).json({ message: "Part not found" });
    }
    const isOwner = part.createdBy === decoded.id;

    if (!isOwner) {
      return res.status(403).json({
        message: "Access denied. You can only delete your own parts.",
      });
    }

    await Part.destroy({ where: { id: partId } });

    return res.status(200).json({
      message: "Part deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  addPart,
  updatePart,
  deletePart,
};
