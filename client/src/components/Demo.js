import React from 'react';

const Demo = () => {
  return (
    <div className="demo">
      <div className="demoStrip">
        <iframe
          title="Decentral Games"
          src={'https://play.decentraland.org/?position=-75%2C77&realm=fenrir-gold'}
          style={{
            margin: 'auto',
            padding: '0px',
            border: '0px',
            width: '100%',
            height: '100vh',
            display: 'block',
            overflow: 'hidden',
            scrolling: 'no'
          }}
        />
      </div>
    </div>
  );
};

export default Demo;
