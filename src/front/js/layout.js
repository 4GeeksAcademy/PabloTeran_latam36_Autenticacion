import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SignUp } from "./pages/signup.jsx";
import { Login } from "./pages/login.jsx";
import { Private } from "./pages/private.jsx";

const Layout = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<SignUp />} path="/" />
                <Route element={<Login />} path="/login" />
                <Route element={<Private />} path="/private" />
                <Route element={<h1>Not found!</h1>} />
            </Routes>
        </BrowserRouter>
    );
};

export default Layout;
