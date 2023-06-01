require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");

const PORT = process.env.PORT || 4500;

//serve static files
app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));

// error page routes
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ err: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
