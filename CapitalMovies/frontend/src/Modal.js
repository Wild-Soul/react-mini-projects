import React from "react";
import "./Modal.css";
import { useGlobalContext } from './context';

function Modal({ setOpenModal }) {
const { handleLoginFormInput, userEmail, userPassword, handleLoginSignUp } = useGlobalContext();

  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            &times;
          </button>
        </div>
        <div className="title">
          <h1>Sign up</h1>
        </div>
        <div className="body">
          <section className="inputField">
              <label htmlFor="emailId">
                  Enter your emmail address.
              </label>
            <input name="emailId" type="email" value={userEmail} onChange={(e)=>handleLoginFormInput("email", e.target.value)}/>
          </section>
          <section className="inputField">
              <label htmlFor="password">
                  Enter password.
              </label>
            <input name="password" type="password" value={userPassword} onChange={(e) => handleLoginFormInput("password", e.target.value)} />
          </section>
        </div>
        <div className="footer">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
            id="cancelBtn"
          >
            Cancel
          </button>
          <button onClick={(e) => {
              e.preventDefault();
              handleLoginSignUp();
          }}>Continue</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;