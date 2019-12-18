import React from 'react';

const Reel = props => {
  let divValue = '';
  let styleValue = 0;

  if (props.number === 10) {
    divValue = 'animate';
    styleValue = 0;
  } else {
    divValue = '';

    switch (props.number) {
      case '9':
        styleValue = -150;
        break;
      case '8':
        styleValue = 0;
        break;
      case '7':
        styleValue = -450;
        break;
      case '6':
        styleValue = -75;
        break;
      case '5':
        styleValue = -300;
        break;
      case '4':
        styleValue = -525;
        break;
      case '3':
        styleValue = -225;
        break;
      case '2':
        styleValue = -375;
        break;
      case '1':
        styleValue = -225;
        break;
      case '0':
        styleValue = -375;
        break;
      default:
        styleValue = 0;
    }
  }

  return (
    <div className={divValue} style={{ marginTop: parseInt(styleValue, 10) }}>
      <i className="space shuttle myicon icon number" />
      <i className="chess rook myicon icon number" />
      <i className="gem outline myicon icon number" />
      <i className="money bill alternate outline myicon icon number" />
      <i className="space shuttle myicon icon number" />
      <i className="gem outline myicon icon number" />
      <i className="space shuttle myicon icon number" />
      <i className="chess rook myicon icon number" />
      <i className="gem outline myicon icon number" />
      <i className="space shuttle myicon icon number" />
    </div>
  );
};

export default Reel;
