const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const uuid = require("uuid");
const multer = require("multer");
const feedRouter = require("./routes/feed");
const authRouter = require("./routes/auth");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, uuid.v4());
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json());
app.use(multer({ storage: storage, fileFilter: fileFilter }).single("image"));
app.use("/images", express.static(path.join(__dirname, "/images")));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization");
  next();
});

app.use("/feed", feedRouter);
app.use("/auth", authRouter);

app.use((error, req, res, next) => {
  const { statusCode, message, data } = error;
  res.status(statusCode || 500).json(message, data);
});

mongoose
  .connect(process.env.MONGODB_URL)
  .then((result) => {
    const httpserver = require("http").createServer(app);
    const io = require("./socket").init(httpserver, {
      cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      },
    });
    httpserver.listen(8080);
    io.on("connection", (socket) => {
      console.log("Client connected");
    });
  })
  .catch((err) => console.log(err));
