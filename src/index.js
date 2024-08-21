// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Uploader from './interfaces/Uploader';
import Modifier from './interfaces/Modifier';
import SignUp from './interfaces/SignUp';
import Login from './interfaces/Login';
import ForgetPassword from './interfaces/ForgetPassword';
import ResetPassword from './interfaces/ResetPassword';
import OTP from './interfaces/Otp';
import HandleSignIn from './interfaces/HandleSignIn';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/uploader" element={<Uploader />} />
        <Route path="/remover" element={<Modifier />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/handle-signin" element={<HandleSignIn />} />
        <Route path="/otp" element={<OTP/>} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:oobCode" element={<ResetPassword />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
);
