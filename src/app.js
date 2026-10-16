const path = require("node:path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("./config");
const routes = require("./routes");
const { notFound, errorHandler } = require("./middlewares/error.middleware");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (config.env === "development") app.use(morgan("dev"));

// Uploaded product images.
app.use(`/${config.uploads.dir}`, express.static(path.resolve(config.uploads.dir)));

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
