const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");

// Require all models


const PORT = process.env.PORT || 3000;

const app = express();


app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.engine("handlebars", handlebars({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
mongoose.connect(
  process.env.MONGODB_URI ||
  "mongodb://root:root@192.168.99.101/mongoscraper?authSource=admin"
, { useNewUrlParser: true });


// Routes
const routes = require("./controllers/routes");
app.use(routes);

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
