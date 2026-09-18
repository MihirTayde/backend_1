const bcrypt = require("bcrypt");
const { User } = require("../models");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const { userName, email, password, role } = req.body;

    if (!userName || !email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    if (role !== "admin" && role !== "worker") {
      return res.status(400).json({
        message: "Role must be either 'admin' or 'worker'",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      userName: userName.trim(),
      email: normalizedEmail,
      password: passwordHash,
      role: role,
    });

    return res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Email, password, and role are required",
      });
    }
    if (role !== "admin" && role !== "worker") {
      return res.status(400).json({
        message: "Role must be either 'admin' or 'worker'",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      where: {
        email: normalizedEmail,
        role: role,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const logout = (req, res) => {
  return res.status(200).json({
    message: "Logged out successfully delete token from frontend",
  });
};

module.exports = { signup, login, logout };
