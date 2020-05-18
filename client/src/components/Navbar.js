import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navbar, Nav } from 'react-bootstrap';
import { useHistory } from "react-router-dom";

export const MyNavbar = () => {
    const history = useHistory()
    const auth = useContext(AuthContext);
    const handleLogout = event => {
        event.preventDefault();
        auth.logout()
        history.push("/")
    };
    return (
        <div>
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="#home">Historical Odds</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="/" onClick={handleLogout}>Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

        </div>
    );
}
