import React from 'react';
import Aux from './hoc/_Aux';
import spin from './components/Images/spin.gif';

const Spinner = props =>
  props.show == 1 ? (
    <Aux>
      <div className="spinner" style={props.style}>
        <img src={spin} class="image small inline modallogospin" />
        <p class="modallogospin" style={{lineHeight: '61px', marginRight: '60px', color: 'white' }}>Confirming...</p> 
      </div>
    </Aux>
  ) : null;

export default Spinner;
