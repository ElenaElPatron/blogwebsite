import express from "express";
import { engine } from "express-handlebars";
import pg from "pg";
const { Pool } = pg;
import cookieParser from "cookie-parser";
import multer from "multer";
const upload = multer({ dest: "public/uploads/" });
import sessions from "express-session";
import bbz307 from "bbz307";

export function createApp(dbconfig) {
  const app = express();

  const pool = new Pool(dbconfig);
  const login = new bbz307.Login(
    "users",
    ["email", "passwort", "vorname", "telefonnummer"],
    pool
  );
  app.engine("handlebars", engine());
  app.set("view engine", "handlebars");
  app.set("views", "./views"); // Sicherstellen, dass der 'views' Ordner korrekt ist

  app.use(express.static("public"));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(
    sessions({
      secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
      saveUninitialized: true,
      cookie: { maxAge: 86400000, secure: false },
      resave: false,
    })
  );
  app.get("/login", (req, res) => {
    res.render("login");
  });

  app.post("/login", upload.none(), async (req, res) => {
    const user = await login.loginUser(req);
    if (!user) {
      res.redirect("/login");
      return;
    } else {
      res.redirect("/home");
      return;
    }
  });

  app.get("/home", function (req, res) {
    res.render("home");
  });

  app.post("/register", upload.none(), async (req, res) => {
    const user = await login.registerUser(req);
    if (user) {
      res.redirect("/login");
      return;
    } else {
      res.redirect("/register");
      return;
    }
  });

  app.get("/login", (req, res) => {
    res.render("login");
  });

  app.get("/post_formular", function (req, res) {
    res.render("post_formular");
  });

  app.get("/portfolio", function (req, res) {
    res.render("portfolio");
  });

  app.get("/portfolio", function (req, res) {
    res.render("portfolio");
  });

  app.post("/post", upload.single("image"), async function (req, res) {
    await pool.query(
      "INSERT INTO posts (title, description, image) VALUES ($1, $2, $3)",
      [req.body.title, req.body.description, req.file.filename]
    );
    res.redirect("/");
  });

  app.post("/post", upload.single("headerfoto"), async function (req, res) {
    const user = await login.loggedInUser(req);
    await pool.query(
      "INSERT INTO posts (title, description, image, user_id) VALUES ($1, $2, $3, $4)",
      [req.body.title, req.body.description, req.file.filename, user.id]
    );
    res.redirect("/");
  });

  app.locals.pool = pool;

  return app;
}

export { upload };
