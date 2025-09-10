const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Cadastro
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists)
      return res.status(400).json({ error: "Email já cadastrado." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).send({ message: "Usuário criado com sucesso!" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).send({ message: "Email não cadastrado." });

    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(400).send({ message: "Senha incorreta." });

    // Remove o campo password antes de retornar
  const { password: _, ...userWithoutPassword } = user.toObject();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

    res.status(200).json({
  token,
  user: userWithoutPassword,
  });
  } catch (error) {
    res.status(400).send(error.message);
  }
  });

module.exports = router;
