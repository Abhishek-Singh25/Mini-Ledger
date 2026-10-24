import express from "express";
const router=express.Router();
import {addLoan,getLoans,markRepaid,getSummary} from "../controllers/loanController.js";
import authMiddleware from "../middleware/authMiddleware.js";

router.use(authMiddleware);

router.post("/", addLoan);
router.get("/", getLoans);
router.patch("/:id/repay", markRepaid);
router.get("/summary", getSummary);

export default router;