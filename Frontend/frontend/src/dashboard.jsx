import { useEffect, useState } from "react";
import api from "./api";
import "./dashboard.css";

function Dashboard({ onLogout }) {
    const [loans, setLoans] = useState([]);
    const [summary, setSummary] = useState({
        total_lent: 0,
        total_repaid: 0,
        overdue_amount: 0
    });
    const [friendName, setFriendName] = useState("");
    const [amount, setAmount] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("miniledger_token");

    const loadData = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const [loansResponse, summaryResponse] = await Promise.all([
                api.get("/loans", config),
                api.get("/loans/summary", config)
            ]);

            setLoans(loansResponse.data);
            setSummary(summaryResponse.data);
        } catch (error) {
            setMessage("Failed to load loans. Please try again.");
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const addLoan = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            await api.post(
                "/loans",
                {
                    friend_name: friendName,
                    amount: Number(amount),
                    due_date: dueDate
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setFriendName("");
            setAmount("");
            setDueDate("");
            setMessage("Loan added successfully!");
            await loadData();
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Failed to add loan"
            );
        }
    };

    const markRepaid = async (id) => {
        try {
            await api.patch(
                `/loans/${id}/repay`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage("Loan marked as repaid!");
            await loadData();
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Failed to update loan"
            );
        }
    };

    const today = new Date().toISOString().slice(0, 10);

    const formatAmount = (value) =>
        `₹${Number(value || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;

    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <h1>MiniLedger</h1>
                <button className="logout-btn" onClick={onLogout}>Logout</button>
            </header>

            <h2 style={{marginTop:"12px"}}>Dashboard</h2>

            <div style={styles.summary}>
                <div style={styles.card}>
                    <p>Total Lent</p>
                    <h3>{formatAmount(summary.total_lent)}</h3>
                </div>

                <div style={styles.card}>
                    <p>Total Repaid</p>
                    <h3>{formatAmount(summary.total_repaid)}</h3>
                </div>

                <div style={styles.card}>
                    <p>Overdue Amount</p>
                    <h3 style={{ color: "#dc2626" }}>
                        {formatAmount(summary.overdue_amount)}
                    </h3>
                </div>
            </div>

            <form onSubmit={addLoan} style={styles.form}>
                <h3>Add a Loan</h3>

                <input
                    placeholder="Friend's name"
                    value={friendName}
                    onChange={(e) => setFriendName(e.target.value)}
                    maxLength={100}
                    required
                />

                <input
                    type="number"
                    placeholder="Amount (₹)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0.01"
                    step="0.01"
                    required
                />

                <label>Due Date</label>
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                />

                <button type="submit">Add Loan</button>
            </form>

            {message && <p>{message}</p>}

            <h3>Your Loans</h3>

            {loans.length === 0 ? (
                <p>No loans yet. Add your first loan above.</p>
            ) : (
                <div style={styles.loanList}>
                    {loans.map((loan) => {
                        const overdue =
                            !loan.is_repaid && loan.due_date < today;

                        return (
                            <div
                                key={loan.id}
                                style={{
                                    ...styles.loan,
                                    borderLeft: overdue
                                        ? "5px solid #dc2626"
                                        : "5px solid #2563eb"
                                }}
                            >
                                <h3>{loan.friend_name}</h3>
                                <p>Amount: {formatAmount(loan.amount)}</p>
                                <p>
                                    Due Date:{" "}
                                    {String(loan.due_date).slice(0, 10)}
                                </p>
                                <p>
                                    Status:{" "}
                                    {loan.is_repaid
                                        ? "Repaid"
                                        : overdue
                                        ? "Overdue"
                                        : "Pending"}
                                </p>

                                {!loan.is_repaid && (
                                    <button
                                        onClick={() => markRepaid(loan.id)}
                                    >
                                        Mark as Repaid
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

const styles = {
    page: {
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
        color: "#1f2937"
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "12px"
    },
    summary: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "16px",
        margin: "24px 0"
    },
    card: {
        padding: "18px",
        background: "#f3f6fb",
        borderRadius: "10px"
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        maxWidth: "400px",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        margin: "0 auto"
    },
    loanList: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
        gap: "16px"
    },
    loan: {
        padding: "16px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        overflowWrap: "anywhere"
    }
};

export default Dashboard;