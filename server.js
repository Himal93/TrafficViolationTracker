const cors = require("cors");
const path = require("path");
const express = require("express");
const app = express();
const db = require("./db");
require("dotenv").config({ path: "./.env" });
const cookieParser = require("cookie-parser");

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const bodyParser = require("body-parser");
app.use(bodyParser.json());
// app.use(express.json());
app.use(cookieParser());

// import the router files
const userRoutes = require("./routes/userRoutes");
const pedrecordRoutes = require("./routes/pedrecordsRoutes");
const admin = require("./routes/admin");
const search = require("./routes/search");

// use the routers using api
app.use("/user", userRoutes);
app.use("/pedrecord", pedrecordRoutes);
app.use("/api/admin", admin);
app.use("/searchRecords", search);

// // Serve static files from the React app
app.use(express.static(path.join(__dirname, "build")));

// // // Handle React routing, return all requests to React app
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
