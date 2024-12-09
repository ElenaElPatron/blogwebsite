import { createApp } from "./config.js";

const app = createApp({
  user: "elejam",
  host: "bbz.cloud",
  database: "elejam",
  password: "Qs5^;njv@B3rqF}y",
  port: 30211,
});

/* Startseite */
app.get("/", async function (req, res) {
  res.render("start", {});
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/impressum", async function (req, res) {
  res.render("impressum", {});
});

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});
