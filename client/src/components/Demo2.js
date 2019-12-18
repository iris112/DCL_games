import React from 'react';

const Demo2 = () => {
  return (
    <div className="demo">
      <div className="demoStrip">
        <iframe
          title="Decentral Games"
          src={'https://export-mobiman.decentralgames.now.sh/?ENABLE_WEB3&SCENE_DEBUG_PANEL&position=-27%2C109'}
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

export default Demo2;
