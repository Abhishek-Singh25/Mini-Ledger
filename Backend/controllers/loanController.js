import pool from "../db.js";

export const addLoan = async (req, res) => {
    try {
        const { friend_name, amount, due_date } = req.body;

        if (
            typeof friend_name !== "string" ||
            !friend_name.trim() ||
            friend_name.trim().length > 100 ||
            amount === undefined ||
            amount === null ||
            amount === "" ||
            !Number.isFinite(Number(amount)) ||
            Number(amount) <= 0 ||
            !due_date ||
            !/^\d{4}-\d{2}-\d{2}$/.test(due_date) ||
            new Date(due_date).toISOString().slice(0, 10) !== due_date
        ) {
            return res.status(400).json({
                message: "Enter a valid friend name, amount and due date"
            });
        }

        const result = await pool.query(
            `INSERT INTO loans (user_id, friend_name, amount, due_date)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [req.user.userId, friend_name.trim(), amount, due_date]
        );

        res.status(201).json({
            message: "Loan added successfully",
            loan: result.rows[0]
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const getLoans = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM loans
             WHERE user_id = $1
             ORDER BY created_at DESC`,
            [req.user.userId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const markRepaid = async (req, res) => {
    try {
        const result = await pool.query(
            `UPDATE loans
             SET is_repaid = TRUE
             WHERE id = $1 AND user_id = $2
             RETURNING *`,
            [req.params.id, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Loan not found"
            });
        }

        res.json({
            message: "Loan marked as repaid",
            loan: result.rows[0]
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const getSummary = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                COALESCE(SUM(amount), 0) AS total_lent,
                COALESCE(SUM(amount) FILTER (
                    WHERE is_repaid = TRUE
                ), 0) AS total_repaid,
                COALESCE(SUM(amount) FILTER (
                    WHERE is_repaid = FALSE AND due_date < CURRENT_DATE
                ), 0) AS overdue_amount
             FROM loans
             WHERE user_id = $1`,
            [req.user.userId]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }
};
