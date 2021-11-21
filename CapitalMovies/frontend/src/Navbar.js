import React, { useState } from 'react';
import Modal from "./Modal";
import { useGlobalContext } from './context';

export const Navbar = () => {
    const { loggedInUser, modalOpen, setModalOpen } = useGlobalContext();
    const isUser = loggedInUser.isLoggedIn;


    return (
        <nav className="navbar">
            <div className="user-details">
                {isUser ? "You're now logged in" : "You're not logged in"}
            </div>
            {isUser ?
                <button className="login-logout-btn" onClick={() => console.log("LOGGING OUT")}>logout</button>
                :
                <button className="login-logout-btn" onClick={() => { setModalOpen(true) }}>login</button>
            }
            {modalOpen && <Modal setOpenModal={setModalOpen} />}
        </nav>
    )
}
