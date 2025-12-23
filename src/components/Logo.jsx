import React from 'react';

const Logo = () => {
    return (
        <>
            <div className="logo-text">
                <div className="host">28.Host</div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
        @import url('https://fonts.googleapis.com/css2?family=Kaushan+Script&display=swap');
        .logo-text {
          font-family: "Kaushan Script", cursive;
          line-height: 1;
          text-align: center;
        }
        .host {
          font-size: 2.2em;
          font-weight: 700;
          letter-spacing: 1px;
          color: #000000;
        }
      `}} />
        </>
    );
};

export default Logo;
