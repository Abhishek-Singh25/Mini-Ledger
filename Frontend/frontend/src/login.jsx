
import { useState } from "react";
import api from "./api";

function Login({ onLogin }) {
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const sendOtp = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            const response = await api.post("/auth/send-otp", {
                phone
            });

            setOtpSent(true);
            setMessage(response.data.message);
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Failed to send OTP"
            );
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            const response = await api.post("/auth/verify-otp", {
                phone,
                otp
            });

            localStorage.setItem("miniledger_token", response.data.token);
            onLogin(response.data.token);
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Invalid OTP"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <form
                onSubmit={otpSent ? verifyOtp : sendOtp}
                style={styles.card}
            >
                <h1>MiniLedger</h1>
                <p>Track money you've lent to friends.</p>

                <label>Phone Number</label>
                <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    disabled={otpSent}
                />

                {otpSent && (
                    <>
                        <label>OTP</label>
                        <input
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            maxLength={6}
                        />
                    </>
                )}

                <button type="submit" disabled={loading}>
                    {loading
                        ? "Please wait..."
                        : otpSent
                        ? "Verify OTP & Login"
                        : "Send OTP"}
                </button>

                {message && <p>{message}</p>}
            </form>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f3f6fb",
        fontFamily: "Arial, sans-serif",
        paddingBottom: "100px"
    },
    card: {
        width: "320px",
        padding: "28px",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        gap: "12px"
    }
};

export default Login;