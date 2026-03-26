import React from 'react';
import logoImage from '../assets/logo.png';

const Logo = () => {
  return (
    <>
      <div className="logo-text">
        <img src={logoImage} alt="Logo" className="host-logo" />
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
        .logo-text {
          line-height: 1;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .host-logo {
          height: 3.5rem;
          width: auto;
          object-fit: contain;
          display: block;
          margin: 0 auto;
        }
      `}} />
    </>
  );
};

export default Logo;
