import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export function SignUp() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const backend = process.env.BACKEND_URL + "/api";

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!email || !username || !password) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${backend}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setTimeout(() => {
                    setLoading(false);
                    navigate("/login");
                }, 1000);
            } else {
                setError(data.message || "Error en el registro");
                setLoading(false);
            }
        } catch (err) {
            setError("Error al conectar con el servidor.");
            setLoading(false);
        }
    };

    return (
        <main className="d-flex vh-100 justify-content-center align-items-center bg-light">
            <form onSubmit={handleSubmit} className="w-50 p-4 border rounded bg-white shadow">
                <div className="mb-4 text-center">
                    <h2 className="fw-bold">Crear Cuenta</h2>
                    <p className="text-secondary">Ingrese sus datos para registrarse.</p>
                </div>
                {error && <div className="alert alert-danger text-center">{error}</div>}
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
                    <label htmlFor="username" className="form-label">Username *</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password *</label>
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
                    {loading ? "Creando cuenta..." : "Registrarse"}
                </button>
                <div className="text-center">
                    <p>
                        ¿Ya tienes cuenta?{" "}
                        <Link to="/login" className="text-primary fw-bold">Iniciar Sesión</Link>
                    </p>
                </div>
            </form>
        </main>
    );
}
