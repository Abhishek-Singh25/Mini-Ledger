import { useState } from "react";
import Login from "./login";
import Dashboard from "./dashboard";

function App() {
    const [token, setToken] = useState(
        localStorage.getItem("miniledger_token")
    );

    const handleLogin = (newToken) => {
        setToken(newToken);
    };

    const handleLogout = () => {
        localStorage.removeItem("miniledger_token");
        setToken(null);
    };

    if (!token) {
        return <Login onLogin={handleLogin} />;
    }

    return <Dashboard onLogout={handleLogout} />;

}

export default App;