const express = require('express');
const { nanoid } = require("nanoid");
const mongoose = require('mongoose');

const app = express();
const PORT = 8000;

mongoose.connect("mongodb://127.0.0.1:27017/shortdb").then(() => console.log("Db-Connected")).catch(err => console.log(err));

app.use(express.json());

const userSchema = new mongoose.Schema({
    shortUrl: {
        type: String,
        required: true,
        unique: true
    },
    reqUrl: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Short = mongoose.model("urls", userSchema);

app.get('/:id', async (req, res) => {
    const { id } = req.params;
    const url = await Short.findOne({ shortUrl: id });
    if (!url) {
        return res.status(404).json({ error: "Erripuka Give Url" });
    }
    res.redirect(url.reqUrl);
})

app.post("/short", async (req, res) => {
    const { reqUrl } = req.body;

    if (!reqUrl) {
        return res.status(400).json({ error: "URL is required" });
    }
    const short = nanoid(6);
    const data = await Short.create({
        shortUrl: short,
        reqUrl
    });
    res.json({
        shortUrl: `http://localhost:${PORT}/${short}`,
        createdAt: data.createdAt
    });
});

app.get("/urls/all", async (req, res) => {
  const urls = await Short.find();

  const html = `
    <html>
      <head>
        <title>All URLs</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          li { margin: 10px 0; }
        </style>
      </head>
      <body>
        <h2>All Short URLs</h2>
        <ul>
          ${urls
            .map(
              (url) => `
                <li>
                  <a href="http://localhost:8000/${url.shortUrl}" target="_blank">
                    http://localhost:8000/${url.shortUrl}
                  </a>
                  <br/>
                  Original: ${url.reqUrl}
                </li>
              `
            )
            .join("")}
        </ul>
      </body>
    </html>
  `;

  res.send(html);
});


app.listen(8000, () => {
    console.log("Server started");
});