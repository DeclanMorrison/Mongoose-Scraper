const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models");

// router.post("/", (req, res) => {
//   res.render("index", req.body);
// });

router.get("/", (req, res) => {
  axios.get("https://old.reddit.com/r/webdev").then(response => {
    const $ = cheerio.load(response.data);
    let results = [];

    $("a.thumbnail").each(function (index, elem){
      let result = {};

      result.img = $(this)
                    .children()
                    .attr("src");

      //If no image is returned, use a stock image as placeholder.
      if (result.img === undefined){
        result.img = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/OOjs_UI_icon_article-ltr.svg/2000px-OOjs_UI_icon_article-ltr.svg.png"
      };

      result.title = $(this)
                      .siblings(".entry")
                      .find("a.title")
                      .text();

      result.link = $(this)
                      .siblings(".entry")
                      .find("a.title")
                      .attr("href");

      result.tagline = $(this)
                        .siblings(".entry")
                        .find("p.tagline")
                        .text();

      //If the first character of a link is "/", then assume it's a reddit self-link and prepend the old.reddit domain. 
      if (result.link.charAt(0) === "/"){
        result.link = `https://old.reddit.com${result.link}`;
      };

      results.push(result);
      
    });
    const articles = {results : results}
    res.render("index", articles);
  });
});

router.post("/articles/save", (req, res) => {
  // console.log(req.body);
  db.Article.create(req.body).then(artRes => {
    // console.log(artRes);
    db.Note.create({title: "Title...", body: "Body..."}).then(noteRes => {
      // console.log(noteRes);
      console.log("Article ID: ", artRes._id);
      console.log("Note ID :", noteRes._id);
      db.Article.findByIdAndUpdate(artRes._id, {NoteID: noteRes._id});
    });
  });
});

router.get("/articles/saved", (req, res) => {
  db.Article.find().populate("noteID").then(savedRes => {
    console.log(savedRes);
  });
});

module.exports = router;