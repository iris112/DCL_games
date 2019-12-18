import React from 'react';

const Demo = () => {
  return (
    <div className="demo">
      <div className="demoStrip">
        <iframe
          title="Decentral Games"
          src={'https://export.decentralgames.now.sh/?ENABLE_WEB3&SCENE_DEBUG_PANEL&position=-1%2C3'}
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
