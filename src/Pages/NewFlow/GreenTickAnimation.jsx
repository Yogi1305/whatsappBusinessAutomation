import React from 'react';

const GreenTickAnimation = () => {
  return (
    <div className="green-tick-container">
      <svg className="green-tick" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
        <circle className="green-tick-circle" cx="26" cy="26" r="25" fill="none"/>
        <path className="green-tick-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
      </svg>
      <style jsx>{`
        .green-tick-container {
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction:column;
          margin-bottom: 2rem;
        }
        .green-tick {
          width: 100%;
          height: 100%;
        }
        .green-tick-circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          stroke-width: 2;
          stroke-miterlimit: 10;
          stroke: #7ac142;
          fill: none;
          animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }
        .green-tick-check {
          transform-origin: 50% 50%;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          stroke-width: 3;
          stroke: #7ac142;
          fill: none;
          animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
        }
        @keyframes stroke {
          100% {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default GreenTickAnimation;