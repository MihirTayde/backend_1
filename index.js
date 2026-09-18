const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;

const userRoutes = require("./routes/userRoutes");

app.use(express.json());
app.use("/api/users", userRoutes);

app.use(cors());
app.listen(PORT);

console.log(`Server is running on port ${PORT}`);

app.get("/health", (req, res, next) => res.send("status OK"));
