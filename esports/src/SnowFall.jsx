import React from 'react';
import '../src/css/SnowFall.css';

const SnowFall = ({ snowposition }) => {
    return (
        <>
            {
                snowposition.map((snowpo, index) => (
                    <div key={index} className='snow' style={{ left: `${snowpo}vw`, animationDelay: `${index * 1000}ms` }}></div>
                ))
            }
        </>
    );
}

export default SnowFall;
