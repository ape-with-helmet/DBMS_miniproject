import React from 'react'
import '../css/BackGround.css'
import logo from '../pages/gosy.jpg'

const BackGroundImage = () => {
  return (
    <div className="background">
        <img src={logo} className="background-img"/>
    </div>
  )
}

export default BackGroundImage