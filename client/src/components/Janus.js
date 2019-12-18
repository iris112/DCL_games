import React, { Component } from 'react';

class Janus extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <iframe
        title="Decentral Games"
        src={
          'https://vesta.janusvr.com/widget?url=https%3A%2F%2Fvesta.janusvr.com%2Fmockworld%2Fslot-machine-decentralotto-machine&image=https%3A%2F%2Fthumbnails.janusvr.com%2F3f4e7ae2303e1488e0ace9752cda1eab%2Fthumb.jpg%3Fv%3D1553608235&description=By+mockworld+%28last+update+03%2F26%2F2019%29&title=Slot+Machine+%26+Decentralotto+Machine&autoplay=true'
        }
        style={{
          margin: 'auto',
          padding: '0px',
          border: '0px',
          width: '1200px',
          height: '800px',
          display: 'block'
        }}
      />
    );
  }
}

export default Janus;
