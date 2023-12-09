const express = require("express");
const fs = require("fs");
const path = require("path");

const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/upload", (req, res) => {
  console.log("upload request received");
  //   const file = fs.createWriteStream("./uploaded_file");
  let uploadLength = 0;
  let totalLength = req.headers["content-length"];

  req.on("data", (chunk) => {
    uploadLength += chunk.length;
    let progress = (uploadLength / totalLength) * 100;
    console.log(`File upload progress: ${progress.toFixed(2)}%`);
  });

  //   req.pipe(file);

  req.on("end", () => {
    res.status(200).send("File uploaded successfully.");
  });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
