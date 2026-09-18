const { User } = require("../models");
const { Job } = require("../models");
const jwt = require("jsonwebtoken");
const { jwtDecode } = require("jwt-decode");
const { Op } = require("sequelize");

const createJob = async (req, res) => {
  try {
    const {
      jobTitle,
      description,
      customerName,
      customerContact,
      address,
      assignedWorker,
      priority,
      status,
      createdBy,
    } = req.body;

    if (
      !jobTitle ||
      !description ||
      !customerName ||
      !customerContact ||
      !address ||
      !assignedWorker ||
      !priority ||
      !status ||
      !createdBy
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    if (!jwt.verify(token, process.env.JWT_SECRET)) {
      return res.status(403).json({ message: "Invalid token." });
    }

    if (
      req.body.status !== "active" ||
      req.body.status !== "pending" ||
      req.body.status !== "inProgress" ||
      req.body.status !== "completed" ||
      req.body.status !== "cancelled"
    ) {
      res.status(400).json({
        message:
          "Invalid job status. Status must be one of the following: active, pending, inProgress, completed, cancelled",
      });
    }

    // if (req.user.role !== "admin") {
    //   return res.status(400).json({
    //     message: "only admin can create jobs",
    //   });
    // }

    const newJob = await Job.create({
      jobTitle: jobTitle.trim(),
      description: description.trim(),
      customerName: customerName.trim(),
      customerContact: customerContact.trim(),
      address: address.trim(),
      assignedWorker: assignedWorker.trim(),
      priority: priority.trim(),
      status: status.trim(),
      createdBy: createdBy.trim(),
    });

    return res.status(201).json({
      message: "Job created successfully",
      job: newJob,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateJob = async (req, res) => {
  try {
    const {
      jobTitle,
      description,
      customerName,
      customerContact,
      address,
      assignedWorker,
      priority,
      status,
      createdBy,
    } = req.body;

    if (
      !jobTitle ||
      !description ||
      !customerName ||
      !customerContact ||
      !address ||
      !assignedWorker ||
      !priority ||
      !status ||
      !createdBy
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // const queryString = window.location.search;
    // const urlParams = new URLSearchParams(queryString);
    // const id = urlParams.get("id");

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    if (!jwt.verify(token, process.env.JWT_SECRET)) {
      return res.status(403).json({ message: "Invalid token." });
    }

    const id = req.params.id;
    const findJob = await Job.findByPk(id);
    if (!findJob) {
      return res.status(404).json({
        message: "Job not found",
      });
    }
    if (
      req.body.status !== "active" ||
      req.body.status !== "pending" ||
      req.body.status !== "inProgress" ||
      req.body.status !== "completed" ||
      req.body.status !== "cancelled"
    ) {
      res.status(400).json({
        message:
          "Invalid job status. Status must be one of the following: active, pending, inProgress, completed, cancelled",
      });
    }

    const updatedJob = await Job.update(
      {
        jobTitle: jobTitle.trim(),
        description: description.trim(),
        customerName: customerName.trim(),
        customerContact: customerContact.trim(),
        address: address.trim(),
        assignedWorker: assignedWorker.trim(),
        priority: priority.trim(),
        status: status.trim(),
        createdBy: createdBy.trim(),
      },
      { where: { id: req.params.id } },
    );

    return res.status(201).json({
      message: "Job updated successfully",
      jobTitle,
      description,
      customerName,
      customerContact,
      address,
      assignedWorker,
      priority,
      status,
      createdBy,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getJobById = async (req, res) => {
  try {
    // const {
    //   jobTitle,
    //   description,
    //   customerName,
    //   customerContact,
    //   address,
    //   assignedWorker,
    //   priority,
    //   status,
    //   createdBy,
    // } = req.body;

    // if (
    //   !jobTitle ||
    //   !description ||
    //   !customerName ||
    //   !customerContact ||
    //   !address ||
    //   !assignedWorker ||
    //   !priority ||
    //   !status ||
    //   !createdBy
    // ) {
    //   return res.status(400).json({
    //     message: "All fields are required",
    //   });
    // }

    // const queryString = window.location.search;
    // const urlParams = new URLSearchParams(queryString);
    // const id = urlParams.get("id");

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    if (!jwt.verify(token, process.env.JWT_SECRET)) {
      return res.status(403).json({ message: "Invalid token." });
    }

    const id = req.params.id;
    const findJob = await Job.findByPk(id);
    if (!findJob) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // const job = await Job.findByPk(id);
    // if (!job) {
    //   return res.status(404).json({
    //     message: "Job not found",
    //   });
    // }

    return res.status(200).json({
      message: "Job details retrieved successfully",
      findJob,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const deleteJob = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  if (!jwt.verify(token, process.env.JWT_SECRET)) {
    return res.status(403).json({ message: "Invalid token." });
  }

  const id = req.params.id;
  const findJob = await Job.findByPk(id);
  if (!findJob) {
    return res.status(404).json({
      message: "Job not found",
    });
  }

  await Job.destroy({ where: { id: req.params.id } });

  return res.status(200).json({
    message: "Job deleted successfully",
  });
};

const filterJobsByStatus = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status;
  const search = req.query.search;

  const offset = (page - 1) * limit;

  const whereClause = {};

  if (status) {
    whereClause.status = status;
  }

  if (search) {
    whereClause[Op.or] = [{ customerName: { [Op.like]: `%${search}%` } }];
  }

  try {
    const { count, rows } = await Job.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      itemsPerPage: limit,
      jobs: rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCompletedJobs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const jobs = await Job.findAndCountAll({
    where: { status: "completed" },
    limit: limit,
    offset: offset,
    order: [["createdAt", "DESC"]],
  });
  res.json({
    totalItems: jobs.count,
    totalPages: Math.ceil(jobs.count / limit),
    currentPage: page,
    itemsPerPage: limit,
    jobs: jobs.rows,
  });
};

module.exports = {
  createJob,
  updateJob,
  getJobById,
  deleteJob,
  filterJobsByStatus,
  getCompletedJobs,
};
