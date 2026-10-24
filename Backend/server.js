import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app=express();
const PORT=process.env.PORT || 5000;
import pool from "./db.js";
import authRoutes from "./routes/authRoutes.js";
import loanRoutes from "./routes/loanRoutes.js";

app.use(cors());
app.use(express.json());

pool.connect().then((c)=>{
    console.log("Database Connected Successfully");
    c.release();
}).catch((error)=>{
    console.log("database connection failed: ", error.message);
});

app.use("/api/auth", authRoutes);
app.use("/api/loans", loanRoutes);

app.get("/",(req,res)=>{
    res.send("Mini Ledger is running");
});

app.listen(PORT,()=>{
    console.log(`Server Running on ${PORT}`);
});