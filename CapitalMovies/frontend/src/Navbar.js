import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

export const Navbar = () => {
    const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

    const isUser = isAuthenticated && user;

    return (
        <nav className="navbar">
            <div className="user-details">
                {/* display the user picture if it's there */}
                {isUser && user.picture && <img  className="user-img" src={user.picture} alt={user.name} />}
                {/* display user name */}
                {isUser && user.name && <h4 className="welcome-msg">Welcome, <strong>{user.name.toUpperCase()}</strong></h4>}
            </div>
            {isUser ?
                <button className="login-logout-btn" onClick={() => { logout({ returnTo: window.location.origin }) }}>logout</button>
                :
                <button className="login-logout-btn" onClick={loginWithRedirect}>login</button>
            }
        </nav>
    )
}
