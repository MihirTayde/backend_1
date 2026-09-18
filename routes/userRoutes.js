const express = require("express");
const AuthController = require("../controllers/userAuthController");
const jobController = require("../controllers/jobController");
const partController = require("../controllers/partController");
const ImageController = require("../controllers/ImageController");
const router = express.Router();

router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
console.log("Type of createJob:", typeof jobController.createJob);

router.post("/jobs", jobController.createJob);
router.put("/jobs/:id", jobController.updateJob);
router.get("/jobs/:id", jobController.getJobById);

router.delete("/jobs/:id", jobController.deleteJob);

router.post("/parts", partController.addPart);
router.put("/parts/:id", partController.updatePart);

router.delete("/parts/:id", partController.deletePart);

router.post("/jobs/:jobId/images", ImageController.uploadImage);
router.delete("/jobs/:jobId/images/:imageName", ImageController.deleteImage);

router.get("/jobs/", jobController.filterJobsByStatus);

router.get("/jobs/completed", jobController.getCompletedJobs);

module.exports = router;
