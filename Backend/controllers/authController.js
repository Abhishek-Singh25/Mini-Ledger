import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import pool from "../db.js";

const otpStore=new Map();

export const sendOtp=(req,res)=>{
    const {phone}=req.body;

    if(!phone || !/^\+?[1-9]\d{7,14}$/.test(phone)){
        return res.status(400).json({message:"Enter a valid phone number"});
    }

    const otp=String(Math.floor(100000 + Math.random() * 900000));

    otpStore.set(phone, {otp, expiresAt: Date.now()+5*60*1000});

    console.log(`OTP for ${phone}: ${otp}`);

    res.json({message:"OTP sent successfully"});
};

export const verifyOtp=async(req,res)=>{
    const {phone,otp}=req.body;

    const savedOtp=otpStore.get(phone);

    if(!savedOtp || savedOtp.expiresAt<Date.now() || savedOtp.otp !==String(otp)){
        return res.status(400).json({message:"Invalid or Expired OTP"});
    }

    otpStore.delete(phone);

    const result = await pool.query(
        `INSERT INTO users (phone)
        VALUES ($1)
        ON CONFLICT (phone)
        DO UPDATE SET phone = EXCLUDED.phone
        RETURNING id, phone`,
        [phone]
    );

    const user = result.rows[0];

    const token=jwt.sign(
        {userId: user.id, phone: user.phone}, process.env.JWT_SECRET, {expiresIn:"1d"}
    );

    res.json({message:"Login Successful", token});
};