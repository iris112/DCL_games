import React from 'react';
import Aux from './hoc/_Aux';
import spin from './components/Images/spin.gif';

const Spinner = props =>
  // props.show == 1 ? (
  //   <Aux>
  //     <div className="spinner" style={props.style}>
  //       <div class="sk-fading-circle">
  //         <div class="sk-circle1 sk-circle"></div>
  //         <div class="sk-circle2 sk-circle"></div>
  //         <div class="sk-circle3 sk-circle"></div>
  //         <div class="sk-circle4 sk-circle"></div>
  //         <div class="sk-circle5 sk-circle"></div>
  //         <div class="sk-circle6 sk-circle"></div>
  //         <div class="sk-circle7 sk-circle"></div>
  //         <div class="sk-circle8 sk-circle"></div>
  //         <div class="sk-circle9 sk-circle"></div>
  //         <div class="sk-circle10 sk-circle"></div>
  //         <div class="sk-circle11 sk-circle"></div>
  //         <div class="sk-circle12 sk-circle"></div>
  //       </div>
  //     </div>
  //   </Aux>
  // ) : null;
  props.show == 1 ? (
    <Aux>
      <div className="spinner" style={props.style}>
        <img src={spin} class="image small inline logospin" />
      </div>
    </Aux>
  ) : null;

export default Spinner;
