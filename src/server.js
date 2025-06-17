require("dotenv").config();

const express = require("express");
const connectDatabase = require("./config/db");
const cors = require("cors");

const app = express();
const port = process.env.PORT;

connectDatabase();

const transactionRoutes = require("./routes/transactions.routes");
const authRoutes = require("./routes/auth.routes");

app.use(cors());
app.use(express.json());
app.use("/api/transactions", transactionRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Api financeira funcionando!");
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`);
});
