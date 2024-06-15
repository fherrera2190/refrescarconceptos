import express from "express";
import { PORT } from "./config.js";
import { UserRepository } from "./user-repository.js";

const app = express();
app.set("view engine", "ejs");

app.use(express.json());
app.get("/", (req, res) => {
  res.render("example", { name: "Fernando" });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserRepository.login({ username, password });
    res.json({ user });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const id = await UserRepository.create({ username, password });
    res.json({ id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/logout", (req, res) => {
  res.send("Hello World!");
});

app.get("/protected", (req, res) => {
  res.send("Hello World!");
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
