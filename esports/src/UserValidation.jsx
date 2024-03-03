import React from 'react'
import { Outlet, Navigate } from "react-router-dom";

const UserValidation = () => {
    // localStorage.setItem("LoginData","Hello")
    const authority = localStorage.getItem("LoginData");
    console.log(authority);
    return authority ? <Outlet /> : <Navigate to='/login' />
}

export default UserValidation