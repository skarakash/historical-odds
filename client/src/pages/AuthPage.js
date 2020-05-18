import React, { useState, useContext } from "react";
import { AuthContext } from '../context/AuthContext';
import { Form, Button } from "react-bootstrap";
import { useHttp } from "../hooks/http.hook";
import "../css/AuthPage.css";

export const AuthPage = () => {
    const auth = useContext(AuthContext);
    const { request, error } = useHttp();
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [message, setMessage] = useState(null)

    const handleFormChange = (event) => {
        event.preventDefault();
        setForm({ ...form, [event.target.name]: event.target.value });
    };

    const handleRegistration = async () => {

        try {
            const data = await request("api/auth/register", "POST", {
                ...form,
            });
            setMessage(data.message)
        } catch (error) { }
    };

    const handleLogin = async () => {

        try {
            const data = await request("api/auth/login", "POST", {
                ...form,
            });
            auth.login(data.token, data.userId)
            setMessage(data.message)
        } catch (error) { }
    };

    return (
        <div className="container">
            <Form>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        name="email"
                        onChange={handleFormChange}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={handleFormChange}
                    />
                </Form.Group>

                <Form.Group
                    controlId="formBasicPassword"
                    className="buttons__wrapper"
                >
                    <Button
                        variant="primary"
                        onClick={handleRegistration}>
                        Sign Up
                    </Button>

                    <Button
                        variant="success"
                        onClick={handleLogin}>
                        Sign In
                    </Button>
                </Form.Group>
                <Form.Group className="error">{error}</Form.Group>
                <Form.Group className="message">{message}</Form.Group>
            </Form>
        </div>
    );
};
