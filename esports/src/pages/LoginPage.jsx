import axios from 'axios';
import React, { useEffect, useState } from 'react'
import '../css/LoginPage.css'
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const auth = localStorage.getItem("LoginData");
    if (auth) {
      navigate('/')
    }
  })
  async function handleSubmit() {
    if (!email || !password) {
      return toast.error('Enter all details please');
    }
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(email)) {
      return toast.error("Bad email id")
    }
    const response = await axios.post("https://dbms-miniproject.onrender.com//login", {
      email, password
    })
    if (!response.data.data) {
      return toast.error("Credentials dont match!")
    }
    localStorage.setItem("LoginData", response.data.data.email)
    toast.success("Login Success!", { autoClose: 2000 })
    setTimeout(() => {
      window.location.href = '/'
    }, 2200)
  }
  return (
    <div className='login-main-container'>
      <div className='login-form-container'>
        <h1>LOGIN</h1>
        <form className='login-form'>
          <input
            className='login-form-insides'
            name='email'
            placeholder='Admin ID'
            type='email'
            onChange={(e) => { setEmail(e.target.value) }}
          />
          <input
            className='login-form-insides'
            type='password'
            placeholder='Password'
            name='password'
            onChange={(e) => { setPassword(e.target.value) }}
          />
          <button type='button' className='login-form-button' onClick={handleSubmit}>SUBMIT</button>
        </form>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </div>
  )
}

export default LoginPage
