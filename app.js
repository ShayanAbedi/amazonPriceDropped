const express = require("express");
const app = express();
const rp = require("request-promise");
const cheerio = require("cheerio");
const bodyParser = require("body-parser");

app.use(bodyParser.json());

/*
get the url and scrapping the webpage
*/
const uriReq = (uri) => {
  const options = {
    uri,
    transform: function (body) {
      return cheerio.load(body);
    },
  };

  rp(options)
    .then(($) => {
      console.log("###");
      doStuff($);
    })
    .catch(function (err) {
      console.log(err);
    });
};

const doStuff = async ($) => {
  // const productTitle = $("#productTitle").text().trim();
  // let price = $("#priceblock_ourprice").text();
  // if (price.length === 0) {
  //   price = $(".priceBlockStrikePriceString").text();
  // }
  // const dealPrice = $("#priceblock_dealprice").text();
  // const save = $(".priceBlockSavingsString").text();

  // return { productTitle, price, dealPrice, save };
  const title = await $(".title").text().trim();
  console.log(title);

  return title;
};

app.get("/api", (req, res) => {
  res.json({ message: "Welcome to Amazon Price Dropped 🏷" });
});

app.post("/api/uri", (req, res) => {
  const URI = req.body.uri;
  const w = uriReq(URI);
  console.log("w", w);

  res.send(w);
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/api`);
});
