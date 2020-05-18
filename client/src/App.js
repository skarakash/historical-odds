import React from "react";
import { userRoutes } from "./routes";
import { BrowserRouter } from "react-router-dom";
import { useAuth } from "./hooks/auth.hook";
import { AuthContext } from "./context/AuthContext";
import { MyNavbar } from "./components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
    const { token, login, logout, userId } = useAuth();
    const isAuthenticated = !!token;
    const routes = userRoutes(isAuthenticated);


    return (
        <AuthContext.Provider
            value={{ token, login, logout, userId, isAuthenticated }}
        >
            <BrowserRouter>
                {isAuthenticated && <MyNavbar />}
                <div className="container">
                    {routes}
                </div>
            </BrowserRouter>
        </AuthContext.Provider>
    );
}

export default App;
