import express from "express";
import { PORT } from "./config.js";
import { UserRepository } from "./user-repository.js";

const app = express();
app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});
app.use(express.json());

app.post("/login", (req, res) => {
  res.json({ user: "nemesis" });
});
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  try {
    const id = UserRepository.create({ username, password });
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
