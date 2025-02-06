import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function Private() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        fetch(process.env.BACKEND_URL + "/api/users", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("No autorizado o token expirado");
            }
            return res.json();
        })
        .then(data => {
            if (!data || !data.email) {
                throw new Error("Usuario no encontrado");
            }
            setUser(data);
        })
        .catch(err => {
            console.error("Error:", err);
            setError(err.message);
            sessionStorage.removeItem("token");
            navigate("/login");
        });
    }, [navigate]);

    if (error) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <h3 className="text-danger">{error}</h3>
            </div>
        );
    }

    return (
        <main className="container d-flex flex-column justify-content-center align-items-center vh-100">
            <div className="card text-dark shadow-lg p-4 rounded-3 border border-primary text-center" style={{ maxWidth: "500px", backgroundColor: "#f8f9fa" }}>
                <h1 className="text-primary fw-bold mb-4">BIENVENIDO A TU INFORMACIÓN PERSONAL</h1>
                {user ? (
                    <>
                        <div className="mb-3">
                            <strong className="text-dark">Email:</strong> {user.email}
                        </div>
                        <div className="mb-3">
                            <strong className="text-dark">Estado de cuenta:</strong> <span className={user.is_active ? "text-success" : "text-danger"}>
                                {user.is_active ? "Activo" : "Inactivo"}
                            </span>
                        </div>
                        <button className="btn btn-primary fw-bold mt-3" onClick={() => {
                            const confirmLogout = window.confirm("¿Estás seguro de cerrar sesión?");
                            if (confirmLogout) {
                                sessionStorage.removeItem("token");
                                navigate("/login");
                            }
                        }}>
                            Cerrar Sesión
                        </button>
                    </>
                ) : (
                    <p>Cargando datos...</p>
                )}
            </div>
        </main>
    );
}
