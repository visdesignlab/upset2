import * as express from "express";
import * as path from "path";

let a = express();

a.use("/dist", express.static("dist"));
a.use("/data", express.static("data"));
a.use("/assets", express.static("assets"));

a.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../index.html"));
});

a.get("/embed.html", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../embed.html"));
});

a.listen(4040, function() {
  "server started";
});
