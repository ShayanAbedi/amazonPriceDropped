const axios = require("axios");
const cheerio = require("cheerio");
const bodyParser = require("body-parser");
const express = require("express");

const app = express();

app.use(bodyParser.json());

const getHTML = async (productURL) => {
  const { data: html } = await axios
    .get(productURL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36",
      },
    })
    .catch(function (error) {
      console.log(error);
    });
  return html;
};

const getAmazonTitle = async (html) => {
  const $ = cheerio.load(html);

  const title = $("#productTitle");

  return title.text().trim();
};

const getAmazonPrice = async (html) => {
  const $ = cheerio.load(html);

  let price = $("#priceblock_ourprice");
  if (price.length === 0) {
    price = $(".priceBlockStrikePriceString").text();
  }

  return price.text().trim();
};

const getAmazonDealPrice = async (html) => {
  const $ = cheerio.load(html);

  const dealPrice = $("#priceblock_dealprice");

  return dealPrice.text().trim();
};

app.get("/api", (req, res) => {
  res.json({ message: "Welcome to Amazon Price Dropped 🏷" });
});

app.post("/api/uri", async (req, res) => {
  const URI = req.body.uri;
  const html = await getHTML(URI);
  const title = await getAmazonTitle(html);
  const price = await getAmazonPrice(html);
  const dealPrice = await getAmazonDealPrice(html);
  res.json({ title, price, dealPrice });
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/api`);
});
