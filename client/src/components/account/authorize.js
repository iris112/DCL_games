import React from 'react'
import { withRouter } from 'react-router-dom';
import '../additional.css';
import { Button } from 'decentraland-ui'
import mana from './mana.png';
import Global from '../constant';

var USER_ADDRESS;

const INITIAL_STATE = {
};

class Authorize extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    if (window.web3) {
      USER_ADDRESS = window.web3.currentProvider.selectedAddress;
    }
  }

  async componentDidMount() {
  }

  onAuthorize = async () => {
    await this.postUserVerify(6);
    await this.postUserAuthState(1);
    this.props.history.push('/verify/');
  }

  postUserVerify = (step) => {
    return fetch(`${Global.BASE_URL}/order/updateUserVerify`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: window.web3.currentProvider.selectedAddress,
        verifyStep: step,
      })
    })
  }

  postUserAuthState = (value) => {
    return fetch(`${Global.BASE_URL}/order/updateUserAuthState`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: window.web3.currentProvider.selectedAddress,
        authorized: value,
      })
    })
  }
  
  render() {
    return (
      <div class="contentContainer">
        <div style={{width: 'calc(100% - 80px)', minWidth: '860px', marginTop: '20px'}}>
          <h3 style={{paddingTop: '20px'}}> Authorizations </h3>
          <div style={{ marginTop: '20px', height: '675px'}}>
            <div class='balanceBox' id='balance-pad'>
              <div style={{marginBottom: '20px'}}>
                <img style={{verticalAlign:'middle'}} class="image inline" width="20px" height="20px" src={mana} />
                <span class="balanceAmount" style={{textAlign: 'left'}}>
                  MANA Slots
                </span>
              </div>
              { this.props.authorized == 0 ?
                <Button id="depositButton" color='blue' style={{marginTop:'5px'}}
                onClick={this.onAuthorize}
                >
                  Authorize
                </Button>
              : <Button disabled id="depositButton" style={{marginTop:'5px', color: 'white'}}
                >
                  Authorized
                </Button> }
            </div>
            <div id='balance-pad' class='balanceBox' style={{marginLeft: '20px'}}>
              <div style={{marginBottom: '20px'}}>
                <img style={{verticalAlign:'middle'}} class="image inline" width="20px" height="20px" src={mana} />
                <span class="balanceAmount" style={{textAlign: 'left'}}>
                  MANA Roulette
                </span>
              </div>
              { this.props.authorized == 0 ?
                <Button id="depositButton" color='blue' style={{marginTop:'5px'}}
                onClick={this.onAuthorize}
                >
                  Coming Soon
                </Button>
              : <Button disabled id="depositButton" style={{marginTop:'5px', color: 'white'}}
                >
                  Coming Soon
                </Button> }
            </div>
            <div id='balance-pad' class='balanceBox' style={{marginLeft: '20px'}}>
              <div style={{marginBottom: '20px'}}>
                <img style={{verticalAlign:'middle'}} class="image inline" width="20px" height="20px" src={mana} />
                <span class="balanceAmount" style={{textAlign: 'left'}}>
                  MANA Blackjack
                </span>
              </div>
              { this.props.authorized == 0 ?
                <Button id="depositButton" color='blue' style={{marginTop:'5px'}}
                onClick={this.onAuthorize}
                >
                  Coming Soon
                </Button>
              : <Button disabled id="depositButton" style={{marginTop:'5px', color: 'white'}}
                >
                  Coming Soon
                </Button> }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Authorize);
