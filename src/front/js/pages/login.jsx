import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const backend = process.env.BACKEND_URL + "/api";

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const response = await fetch(`${backend}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email_or_username: email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            sessionStorage.setItem("token", data.token);
            navigate("/private");
        } else {
            console.error("Error en el inicio de sesión");
        }
        setLoading(false);
    };

    return (
        <main className="d-flex vh-100 justify-content-center align-items-center bg-light">
            <div className="card shadow-lg p-4 border rounded" style={{ width: "400px", backgroundColor: "#ffffff" }}>
                <div className="card-body">
                    <h2 className="text-center text-primary fw-bold mb-4">Ingresa a tu cuenta</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email *</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Contraseña *</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary fw-bold w-100 mb-3" disabled={loading}>
                            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
