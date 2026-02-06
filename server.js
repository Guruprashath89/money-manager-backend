import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import transactionRoutes from "./routes/transactions.js";
import authRoutes from "./routes/auth.js";


dotenv.config();

const app = express();


//  CORS MUST BE FIRST
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);//auth

// JSON middleware


// routes
app.use("/transactions", transactionRoutes);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("Backend + DB running 🚀");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
