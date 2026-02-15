import React, { useState } from 'react';
// import millieImage from '../assets/millie.png';
import cookieImage from '../assets/cookie-basic.png';

export default function ClickArea({ onClick, cookies }) {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClick = () => {
    onClick();

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 100);
    };

    return (
    <div className="click-section">
        <div className="cookie-display">
            {Math.floor(cookies)} 🍪
        </div>
        <button className={`cookie-btn ${isAnimating ? 'click-anim' : ''}`} onClick={handleClick}>
            <img src={cookieImage} alt="Cookie" className="cookie-img" />
        </button>
        <p>Click to make cookies!</p>
    </div>
    );
}