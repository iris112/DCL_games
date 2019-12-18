import React, { Component } from 'react'
import { Link, Redirect, withRouter } from 'react-router-dom';
import { isMobile } from "react-device-detect";
import '../additional.css';
import box from './box.png';
import check from './check.png';
import verify from './verify.png';
import verify1 from './verify1.png';
import logo from '../Images/logo.png'
import { Header, Button } from 'decentraland-ui'
import { Container, Grid, Dropdown, Input} from 'semantic-ui-react'
import Spinner from '../../Spinner'
// ---------------------------------------------------------------------
import Global from '../constant';

var USER_ADDRESS = '';
var UNIT = 1;
// var UNIT = 1000;

const INITIAL_STATE = {
  isLoaded: 0,
  isCustomAmount: 0,
  amount: 1000,
  networkID: 0,
  isValidStep1: 0,
  isConfirmStep1: 0,
  isValidStep2: 0,
  isConfirmStep2: 0,
  isConfirmStep3: 0,
  isRunningTransaction: false,
};

class Withdraw extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    this.isBrowserMetamsk = 0;

    if (window.web3) {
      USER_ADDRESS = window.web3.currentProvider.selectedAddress;
      this.isBrowserMetamsk = 1;
    }
  }

  async componentDidMount() {
    try {
      if (window.web3.currentProvider.selectedAddress === '' || window.web3.currentProvider.selectedAddress === undefined) {
        window.web3 = new window.Web3(window.ethereum);
        await window.ethereum.enable();
        USER_ADDRESS = window.web3.currentProvider.selectedAddress;
      }

      for (var i = 0; i < 3; i++) {
        USER_ADDRESS = window.web3.currentProvider.selectedAddress;
        if (USER_ADDRESS === '' || USER_ADDRESS === undefined) {
          await Global.delay(2000);
          continue;
        }

        let ret = await this.checkUserVerifyStep();
        if (ret) {
          return;
        }

        await Global.delay(2000);
      }

    } catch(e) {
      console.log(e);
    }
    
    this.setState({isLoaded : 0});
  }

  checkUserVerifyStep = async () => {
    try {
      const response = await this.getUserVerify();
      const json = await response.json();
      if (json.status === 'ok') {
        if (json.result === 'false') {
          this.setState({isLoaded: 1});
          return true;
        }

        let stepValue = parseInt(json.result);
        if (stepValue == 6)
          this.setState({isLoaded: 2});
        else
          this.setState({isLoaded: 1});

        return true;
      }
    } catch (error) {
      console.log(error);
    }
    return false;
  }

  ifMobileRedirect = () => {
    if (isMobile) {
      return <Redirect to='/' />
    }
  }

  verifyNetwork = () => {
    window.web3.version.getNetwork((err, network) => {
      this.setState({networkID: parseInt(network)});
    });
  }

  getUserVerify = () => {
    return fetch(`${Global.BASE_URL}/order/verifyAddress`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: USER_ADDRESS,
      })
    })
  }

  onChangeAmount = (e, d) => {
    if (d.value == -2) {
      this.setState({amount: 0, isCustomAmount: 1 });
      return;
    }

    this.setState({amount: d.value });
  };

  onChangeCustomAmount = async(e) => {
    let value = parseInt(e.target.value);
    if (String(value) != 'NaN')
      this.setState({amount: parseInt(e.target.value)});
    else
      this.setState({amount: 0});
  }

  withdrawManaFromMatic = async (e, d) => {
    try {
      this.setState({isRunningTransaction: true});
      // let amount = this.state.amount;
      // if (amount == -1)
      //   amount = await this.getTokenBalance();

      // var amount_wei = (amount / UNIT * 10 ** Global.TOKEN_DECIMALS).toString();

      // // init withdrawing
      // let txHash = await Global.startWithdrawTokenFromMatic(Global.MATIC_TOKEN, amount_wei, USER_ADDRESS );
      // if (txHash == false) {
      //   this.setState({isValidStep1: 1, isRunningTransaction: false});
      //   return;
      // }
      // let ret = await this.updateHistory(amount / UNIT, 'Withdraw', 'Ready', txHash);
      // if (!ret) {
      //   console.log('network error');
      //   this.setState({isValidStep1: 1, isRunningTransaction: false});
      //   return;
      // }

      this.setState({isValidStep1: 2, isRunningTransaction: false});

    } catch (err) {
      console.log(err);
      this.setState({isValidStep1: 1, isRunningTransaction: false});
    }
  };

  confirmStep1 = async (e, d) => {
    try {
      this.setState({isRunningTransaction: true});
      this.setState({isConfirmStep1: 2, isRunningTransaction: false});
    } catch (err) {
      console.log(err);
      this.setState({isConfirmStep1: 1, isRunningTransaction: false});
    }
  }

  continueStep2 = async (e, d) => {
    try {
      this.setState({isRunningTransaction: true});
      this.setState({isValidStep2: 2, isRunningTransaction: false});
    } catch (err) {
      console.log(err);
      this.setState({isValidStep2: 1, isRunningTransaction: false});
    }
  }

  confirmStep2 = async (e, d) => {
    try {
      this.setState({isRunningTransaction: true});
      this.setState({isConfirmStep2: 2, isRunningTransaction: false});
    } catch (err) {
      console.log(err);
      this.setState({isConfirmStep2: 1, isRunningTransaction: false});
    }
  }

  confirmStep3 = async (e, d) => {
    try {
      this.setState({isRunningTransaction: true});
      this.setState({isConfirmStep3: 2, isRunningTransaction: false});
      this.props.history.push('/account/');
    } catch (err) {
      console.log(err);
      this.setState({isConfirmStep3: 1, isRunningTransaction: false});
    }
  }

  postHistory = async (amount, type, state, txHash) => {
    return fetch(`${Global.BASE_URL}/order/updateHistory`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: window.web3.currentProvider.selectedAddress,
        amount,
        type,
        state,
        txHash
      })
    })
  }

  updateHistory = async (amount, type, state, txHash = "") => {
    try {
      const response = await this.postHistory(amount, type, state, txHash);
      const json = await response.json();
      if (json.status === 'ok') {
        if (json.result === 'false') {
          return false;
        }

        return true;
      }
    } catch (error) {
      console.log(error);
    }
    return false;
  }

  getTokenBalance = async () => {
    try {
      var amount;
      amount = await Global.balanceOfToken(Global.MATIC_TOKEN);
      return parseInt(window.web3.fromWei(amount, 'ether').toFixed(0));
    } catch (err) {
      console.log(err);
    }

    return 0;
  };

  render() {
    const amount = [
      { key: 1, text: '1000 MANA', value: 1000 },
      { key: 2, text: '2000 MANA', value: 2000 },
      { key: 3, text: '3000 MANA', value: 3000 },
      { key: 4, text: '4000 MANA', value: 4000 },
      { key: 5, text: '5000 MANA', value: 5000 },
      { key: 6, text: 'All', value: -1 },
      { key: 7, text: 'Custom', value: -2 },
    ]

    if (this.state.isLoaded === 0) {
      return (
        <div id="withdraw">
          <Container style={{ marginTop: '25.5em', height: '35em' }}>
            <Spinner show={1}/>
          </Container>
        </div>
      )
    }

    if (this.state.isLoaded === 1) {
      return (
        <div id="withdraw">
          <Container style={{ marginTop: '25.5em', height: '35em' }}>
            <Grid verticalAlign='middle' textAlign='center'>
              <Header> Please finish <a href="/verify">verification</a> to Withdraw. </Header>
            </Grid>
          </Container>
        </div>
      )
    }

    if (!this.isBrowserMetamsk) {
      return (
        <div id="withdraw">
          <Container style={{ marginTop: '25.5em', height: '35em' }}>
            <Grid verticalAlign='middle' textAlign='center'>
              <Header> Please use Chrome Browser with Metamask enabled to proceed. </Header>
            </Grid>
          </Container>
        </div>
      )
    }

    if (this.state.networkID == 0)
      this.verifyNetwork()

    if (this.state.isConfirmStep2 == 2) {
      if (this.state.networkID == 3) {
        return (
          <div id="withdraw">
            {this.ifMobileRedirect()}
            <Spinner show={this.state.isRunningTransaction}/>
            <div class="ui withdrawContainer">
              <Grid verticalAlign='middle' textAlign='center'>
                <Grid.Column>
                  <div class="progressbar">
                    <a href="https://decentral.games">
                      <img class="image inline" src={logo} style={{width: '230px', paddingTop: '25px', paddingBottom: '25px'}}/>
                    </a>
                    <Grid.Row style={{paddingTop: '25px', borderTop: '1px solid lightgray'}}>
                      <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                      <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                      <p style={{opacity: '0.5'}} class="progressbar"> Switch to Matic RPC </p>
                    </Grid.Row>  
                    <Grid.Row style={{marginTop: '15px'}}>
                      <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                      <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                      <p style={{opacity: '0.5'}} class="progressbar"> Initiate Withdrawal </p>
                    </Grid.Row>
                    <Grid.Row style={{marginTop: '15px'}}>
                      <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                      <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                      <p style={{opacity: '0.5'}} class="progressbar"> Waiting Period </p>
                    </Grid.Row>
                    <Grid.Row style={{marginTop: '15px'}}>
                      <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                      <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                      <p style={{opacity: '0.5'}} style={{opacity: '0.5'}} class="progressbar"> Switch to Ropsten RPC </p>
                    </Grid.Row>
                    <Grid.Row style={{marginTop: '15px'}}>
                      <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                      <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                      <p style={{opacity: '0.5'}} class="progressbar"> Continue Withdrawal </p>
                    </Grid.Row>
                    <Grid.Row style={{marginTop: '15px'}}>
                      <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                      <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                      <p style={{opacity: '0.5'}} class="progressbar"> Waiting Period </p>
                    </Grid.Row>
                    <Grid.Row style={{marginTop: '15px'}}>
                      <img class="progressbar image inline" src={box} />
                      <p class="progressbar"> Confirm Withdrawal </p>
                    </Grid.Row>
                  </div>

                  <div class="contentContainer" style={{padding: '20px', marginTop: '10px', textAlign: 'left'}}>
                    <h3 style={{textAlign: 'left', marginLeft: '10px'}}> Withdraw MANA </h3>
                      <span style={{ display: 'block', float: 'left', textAlign: 'left', fontSize: '1.33em', marginTop : '30px', marginLeft: '50px'}}>7.</span>
                      <p style={{ textAlign: 'left', fontSize: '1.33em', paddingLeft: '80px', marginTop: '45px' }}>
                        Confirm withdrawal on Ropsten.
                      </p>
                      <Button id='button-6' color='blue' style={{marginLeft: '80px', display: 'block' }} 
                        onClick={this.confirmStep3}>
                        Confirm
                      </Button>

                      { this.state.isConfirmStep3 == 1 ?
                        <p style={{ textAlign: 'center', color: 'red', marginTop: '10px'}}>
                          Withdraw confirm failed.
                        </p> : <p/>
                      }
                      <p style={{ textAlign: 'left', fontSize: '1.33em', marginLeft: '80px', width: '800px', fontStyle:'italic', marginTop: '100px' }}>
                        **Matic Network is a second layer sidechain that allows our games to have much faster in-game transactions.**
                      </p>
                      <p style={{ textAlign: 'left', fontSize: '1.33em', marginLeft: '80px', width: '800px', fontStyle:'italic', marginTop: '20px' }}>
                        <span style={{fontWeight: 'bold'}}>NOTE: </span>
                        To ensure upmost security on the Matic sidechain, withdrawals currently take 1 week, and are broken down into 3 steps. You will need to sign 2 more thransactions to complete this withdrawal - one in 1-2 days, and one in 1 week.
                      </p>
                      <p style={{ textAlign: 'left', fontSize: '1.33em', marginLeft: '80px', width: '800px', fontStyle:'italic', marginTop: '20px' }}>
                        We will be offering instant mainchain liquidity services in the near future,
                      </p>
                  </div>
                </Grid.Column>
              </Grid>
            </div>
          </div>
        )
      }

      return (
        <div id="withdraw">
          {this.ifMobileRedirect()}
          <Spinner show={this.state.isRunningTransaction}/>
          <div class="ui withdrawContainer">
            <Grid verticalAlign='middle' textAlign='center'>
              <Grid.Column>
                <div class="progressbar">
                  <a href="https://decentral.games">
                    <img class="image inline" src={logo} style={{width: '230px', paddingTop: '25px', paddingBottom: '25px'}}/>
                  </a>
                  <Grid.Row style={{paddingTop: '25px', borderTop: '1px solid lightgray'}}>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                    <p style={{opacity: '0.5'}} class="progressbar"> Switch to Matic RPC </p>
                  </Grid.Row>  
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                    <p style={{opacity: '0.5'}} class="progressbar"> Initiate Withdrawal </p>
                  </Grid.Row>
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                    <p style={{opacity: '0.5'}} class="progressbar"> Waiting Period </p>
                  </Grid.Row>
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img class="progressbar image inline" src={box} />
                    <p class="progressbar"> Switch to Ropsten RPC </p>
                  </Grid.Row>
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <p style={{opacity: '0.5'}} class="progressbar"> Continue Withdrawal </p>
                  </Grid.Row>
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <p style={{opacity: '0.5'}} class="progressbar"> Waiting Period </p>
                  </Grid.Row>
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <p style={{opacity: '0.5'}} class="progressbar"> Confirm Withdrawal </p>
                  </Grid.Row>
                </div>

                <div class="contentContainer" style={{padding: '20px', marginTop: '10px', textAlign: 'left'}}>
                  <h3 style={{textAlign: 'left', marginLeft: '10px'}}> Withdraw MANA </h3>
                    <span style={{ display: 'block', float: 'left', textAlign: 'left', fontSize: '1.33em', marginTop : '30px', marginLeft: '50px'}}>4.</span>
                    <p style={{ textAlign: 'left', fontSize: '1.33em', paddingLeft: '80px', marginTop: '45px' }}>
                      On your Metamask extension, open the Network dropdown menu and select 'Ropsten'.
                    </p>
                    <img style={{width:'240px', marginLeft: '100px'}} src={verify1} class="image small inline" />

                    { this.state.networkID != 3 ?
                      <p style={{ textAlign: 'left', color: 'red', marginTop: '10px', marginLeft: '100px'}}>
                        This is not Ropsten Network.
                      </p> : <p/>
                    }
                </div>
              </Grid.Column>
            </Grid>
          </div>
        </div>
      )
    }

    if (this.state.isValidStep2 == 2) {
      return (
        <div id="withdraw">
          {this.ifMobileRedirect()}
          <Spinner show={this.state.isRunningTransaction}/>
          <div class="ui withdrawContainer">
            <Grid verticalAlign='middle' textAlign='center'>
              <Grid.Column>
                <div class="progressbar">
                  <a href="https://decentral.games">
                    <img class="image inline" src={logo} style={{width: '230px', paddingTop: '25px', paddingBottom: '25px'}}/>
                  </a>
                  <Grid.Row style={{paddingTop: '25px', borderTop: '1px solid lightgray'}}>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                    <p style={{opacity: '0.5'}} class="progressbar"> Switch to Matic RPC </p>
                  </Grid.Row>  
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                    <p style={{opacity: '0.5'}} class="progressbar"> Initiate Withdrawal </p>
                  </Grid.Row>
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                    <p style={{opacity: '0.5'}} class="progressbar"> Waiting Period </p>
                  </Grid.Row>
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                    <p style={{opacity: '0.5'}} style={{opacity: '0.5'}} class="progressbar"> Switch to Ropsten RPC </p>
                  </Grid.Row>
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                    <p style={{opacity: '0.5'}} class="progressbar"> Continue Withdrawal </p>
                  </Grid.Row>
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img class="progressbar image inline" src={box} />
                    <p class="progressbar"> Waiting Period </p>
                  </Grid.Row>
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <p style={{opacity: '0.5'}} class="progressbar"> Confirm Withdrawal </p>
                  </Grid.Row>
                </div>

                <div class="contentContainer" style={{padding: '20px', marginTop: '10px', textAlign: 'left'}}>
                  <h3 style={{textAlign: 'left', marginLeft: '10px'}}> Withdraw MANA </h3>
                    <span style={{ display: 'block', float: 'left', textAlign: 'left', fontSize: '1.33em', marginTop : '30px', marginLeft: '50px'}}>6.</span>
                    <p style={{ textAlign: 'left', fontSize: '1.33em', paddingLeft: '80px', marginTop: '45px' }}>
                      Please check back in 15 minutes to continue withdrawal process from Matic Network.
                    </p>
                    <Button id='button-6' color='blue' style={{marginLeft: '80px', display: 'block' }} 
                      onClick={this.confirmStep2}>
                      Confirm
                    </Button>

                    { this.state.isConfirmStep2 == 1 ?
                      <p style={{ textAlign: 'center', color: 'red', marginTop: '10px'}}>
                        Withdraw confirm failed.
                      </p> : <p/>
                    }
                    <p style={{ textAlign: 'left', fontSize: '1.33em', marginLeft: '80px', width: '800px', fontStyle:'italic', marginTop: '100px' }}>
                      **Matic Network is a second layer sidechain that allows our games to have much faster in-game transactions.**
                    </p>
                    <p style={{ textAlign: 'left', fontSize: '1.33em', marginLeft: '80px', width: '800px', fontStyle:'italic', marginTop: '20px' }}>
                      <span style={{fontWeight: 'bold'}}>NOTE: </span>
                      To ensure upmost security on the Matic sidechain, withdrawals currently take 1 week, and are broken down into 3 steps. You will need to sign 2 more thransactions to complete this withdrawal - one in 1-2 days, and one in 1 week.
                    </p>
                    <p style={{ textAlign: 'left', fontSize: '1.33em', marginLeft: '80px', width: '800px', fontStyle:'italic', marginTop: '20px' }}>
                      We will be offering instant mainchain liquidity services in the near future,
                    </p>
                </div>
              </Grid.Column>
            </Grid>
          </div>
        </div>
      )
    }

    if (this.state.isConfirmStep1 == 2) {
      if (this.state.networkID == 3) {
        return (
          <div id="withdraw">
            {this.ifMobileRedirect()}
            <Spinner show={this.state.isRunningTransaction}/>
            <div class="ui withdrawContainer">
              <Grid verticalAlign='middle' textAlign='center'>
                <Grid.Column>
                  <div class="progressbar">
                    <a href="https://decentral.games">
                      <img class="image inline" src={logo} style={{width: '230px', paddingTop: '25px', paddingBottom: '25px'}}/>
                    </a>
                    <Grid.Row style={{paddingTop: '25px', borderTop: '1px solid lightgray'}}>
                      <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                      <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                      <p style={{opacity: '0.5'}} class="progressbar"> Switch to Matic RPC </p>
                    </Grid.Row>  
                    <Grid.Row style={{marginTop: '15px'}}>
                      <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                      <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                      <p style={{opacity: '0.5'}} class="progressbar"> Initiate Withdrawal </p>
                    </Grid.Row>
                    <Grid.Row style={{marginTop: '15px'}}>
                      <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                      <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                      <p style={{opacity: '0.5'}} class="progressbar"> Waiting Period </p>
                    </Grid.Row>
                    <Grid.Row style={{marginTop: '15px'}}>
                      <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                      <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                      <p style={{opacity: '0.5'}} style={{opacity: '0.5'}} class="progressbar"> Switch to Ropsten RPC </p>
                    </Grid.Row>
                    <Grid.Row style={{marginTop: '15px'}}>
                      <img class="progressbar image inline" src={box} />
                      <p class="progressbar"> Continue Withdrawal </p>
                    </Grid.Row>
                    <Grid.Row style={{marginTop: '15px'}}>
                      <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                      <p style={{opacity: '0.5'}} class="progressbar"> Waiting Period </p>
                    </Grid.Row>
                    <Grid.Row style={{marginTop: '15px'}}>
                      <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                      <p style={{opacity: '0.5'}} class="progressbar"> Confirm Withdrawal </p>
                    </Grid.Row>
                  </div>

                  <div class="contentContainer" style={{padding: '20px', marginTop: '10px', textAlign: 'left'}}>
                    <h3 style={{textAlign: 'left', marginLeft: '10px'}}> Withdraw MANA </h3>
                      <span style={{ display: 'block', float: 'left', textAlign: 'left', fontSize: '1.33em', marginTop : '30px', marginLeft: '50px'}}>5.</span>
                      <p style={{ textAlign: 'left', fontSize: '1.33em', paddingLeft: '80px', marginTop: '45px' }}>
                        Continue withdrawal to Ropsten.
                      </p>
                      <Button id='button-6' color='blue' style={{marginLeft: '80px', display: 'block' }} 
                        onClick={this.continueStep2}>
                        Continue
                      </Button>

                      { this.state.isValidStep2 == 1 ?
                        <p style={{ textAlign: 'center', color: 'red', marginTop: '10px'}}>
                          Withdraw continue failed.
                        </p> : <p/>
                      }
                      <p style={{ textAlign: 'left', fontSize: '1.33em', marginLeft: '80px', width: '800px', fontStyle:'italic', marginTop: '100px' }}>
                        **Matic Network is a second layer sidechain that allows our games to have much faster in-game transactions.**
                      </p>
                      <p style={{ textAlign: 'left', fontSize: '1.33em', marginLeft: '80px', width: '800px', fontStyle:'italic', marginTop: '20px' }}>
                        <span style={{fontWeight: 'bold'}}>NOTE: </span>
                        To ensure upmost security on the Matic sidechain, withdrawals currently take 1 week, and are broken down into 3 steps. You will need to sign 2 more thransactions to complete this withdrawal - one in 1-2 days, and one in 1 week.
                      </p>
                      <p style={{ textAlign: 'left', fontSize: '1.33em', marginLeft: '80px', width: '800px', fontStyle:'italic', marginTop: '20px' }}>
                        We will be offering instant mainchain liquidity services in the near future,
                      </p>
                  </div>
                </Grid.Column>
              </Grid>
            </div>
          </div>
        )
      }
      
      return (
        <div id="withdraw">
          {this.ifMobileRedirect()}
          <Spinner show={this.state.isRunningTransaction}/>
          <div class="ui withdrawContainer">
            <Grid verticalAlign='middle' textAlign='center'>
              <Grid.Column>
                <div class="progressbar">
                  <a href="https://decentral.games">
                    <img class="image inline" src={logo} style={{width: '230px', paddingTop: '25px', paddingBottom: '25px'}}/>
                  </a>
                  <Grid.Row style={{paddingTop: '25px', borderTop: '1px solid lightgray'}}>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                    <p style={{opacity: '0.5'}} class="progressbar"> Switch to Matic RPC </p>
                  </Grid.Row>  
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                    <p style={{opacity: '0.5'}} class="progressbar"> Initiate Withdrawal </p>
                  </Grid.Row>
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                    <p style={{opacity: '0.5'}} class="progressbar"> Waiting Period </p>
                  </Grid.Row>
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img class="progressbar image inline" src={box} />
                    <p class="progressbar"> Switch to Ropsten RPC </p>
                  </Grid.Row>
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <p style={{opacity: '0.5'}} class="progressbar"> Continue Withdrawal </p>
                  </Grid.Row>
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <p style={{opacity: '0.5'}} class="progressbar"> Waiting Period </p>
                  </Grid.Row>
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <p style={{opacity: '0.5'}} class="progressbar"> Confirm Withdrawal </p>
                  </Grid.Row>
                </div>

                <div class="contentContainer" style={{padding: '20px', marginTop: '10px', textAlign: 'left'}}>
                  <h3 style={{textAlign: 'left', marginLeft: '10px'}}> Withdraw MANA </h3>
                    <span style={{ display: 'block', float: 'left', textAlign: 'left', fontSize: '1.33em', marginTop : '30px', marginLeft: '50px'}}>4.</span>
                    <p style={{ textAlign: 'left', fontSize: '1.33em', paddingLeft: '80px', marginTop: '45px' }}>
                      On your Metamask extension, open the Network dropdown menu and select 'Ropsten'.
                    </p>
                    <img style={{width:'240px', marginLeft: '100px'}} src={verify1} class="image small inline" />

                    { this.state.networkID != 3 ?
                      <p style={{ textAlign: 'left', color: 'red', marginTop: '10px', marginLeft: '100px'}}>
                        This is not Ropsten Network.
                      </p> : <p/>
                    }
                </div>
              </Grid.Column>
            </Grid>
          </div>
        </div>
      )
    }

    if (this.state.isValidStep1 == 2) {
      return (
        <div id="withdraw">
          {this.ifMobileRedirect()}
          <Spinner show={this.state.isRunningTransaction}/>
          <div class="ui withdrawContainer">
            <Grid verticalAlign='middle' textAlign='center'>
              <Grid.Column>
                <div class="progressbar">
                  <a href="https://decentral.games">
                    <img class="image inline" src={logo} style={{width: '230px', paddingTop: '25px', paddingBottom: '25px'}}/>
                  </a>
                  <Grid.Row style={{paddingTop: '25px', borderTop: '1px solid lightgray'}}>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                    <p style={{opacity: '0.5'}} class="progressbar"> Switch to Matic RPC </p>
                  </Grid.Row>  
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                    <p style={{opacity: '0.5'}} class="progressbar"> Initiate Withdrawal </p>
                  </Grid.Row>
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img class="progressbar image inline" src={box} />
                    <p class="progressbar"> Waiting Period </p>
                  </Grid.Row>
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <p style={{opacity: '0.5'}} class="progressbar"> Switch to Ropsten RPC </p>
                  </Grid.Row>
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <p style={{opacity: '0.5'}} class="progressbar"> Continue Withdrawal </p>
                  </Grid.Row>
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <p style={{opacity: '0.5'}} class="progressbar"> Waiting Period </p>
                  </Grid.Row>
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <p style={{opacity: '0.5'}} class="progressbar"> Confirm Withdrawal </p>
                  </Grid.Row>
                </div>

                <div class="contentContainer" style={{padding: '20px', marginTop: '10px', textAlign: 'left'}}>
                  <h3 style={{textAlign: 'left', marginLeft: '10px'}}> Withdraw MANA </h3>
                    <span style={{ display: 'block', float: 'left', textAlign: 'left', fontSize: '1.33em', marginTop : '30px', marginLeft: '50px'}}>3.</span>
                    <p style={{ textAlign: 'left', fontSize: '1.33em', paddingLeft: '80px', marginTop: '45px' }}>
                      Please check back in 1-2 days to continue withdrawal process from Matic Network.
                    </p>
                    <Button id='button-6' color='blue' style={{marginLeft: '80px', display: 'block' }} 
                      onClick={this.confirmStep1}>
                      Confirm
                    </Button>

                    { this.state.isConfirmStep1 == 1 ?
                      <p style={{ textAlign: 'center', color: 'red', marginTop: '10px'}}>
                        Withdraw confirm failed.
                      </p> : <p/>
                    }
                    <p style={{ textAlign: 'left', fontSize: '1.33em', marginLeft: '80px', width: '800px', fontStyle:'italic', marginTop: '100px' }}>
                      **Matic Network is a second layer sidechain that allows our games to have much faster in-game transactions.**
                    </p>
                    <p style={{ textAlign: 'left', fontSize: '1.33em', marginLeft: '80px', width: '800px', fontStyle:'italic', marginTop: '20px' }}>
                      <span style={{fontWeight: 'bold'}}>NOTE: </span>
                      To ensure upmost security on the Matic sidechain, withdrawals currently take 1 week, and are broken down into 3 steps. You will need to sign 2 more thransactions to complete this withdrawal - one in 1-2 days, and one in 1 week.
                    </p>
                    <p style={{ textAlign: 'left', fontSize: '1.33em', marginLeft: '80px', width: '800px', fontStyle:'italic', marginTop: '20px' }}>
                      We will be offering instant mainchain liquidity services in the near future,
                    </p>
                </div>
              </Grid.Column>
            </Grid>
          </div>
        </div>
      )
    }

    if (this.state.networkID == 8995) {
      return (
        <div id="withdraw">
          {this.ifMobileRedirect()}
          <Spinner show={this.state.isRunningTransaction}/>
          <div class="ui withdrawContainer">
            <Grid verticalAlign='middle' textAlign='center'>
              <Grid.Column>
                <div class="progressbar">
                  <a href="https://decentral.games">
                    <img class="image inline" src={logo} style={{width: '230px', paddingTop: '25px', paddingBottom: '25px'}}/>
                  </a>
                  <Grid.Row style={{paddingTop: '25px', borderTop: '1px solid lightgray'}}>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                    <p style={{opacity: '0.5'}} class="progressbar"> Switch to Matic RPC </p>
                  </Grid.Row>  
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img class="progressbar image inline" src={box} />
                    <p class="progressbar"> Initiate Withdrawal </p>
                  </Grid.Row>
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <p style={{opacity: '0.5'}} class="progressbar"> Waiting Period </p>
                  </Grid.Row>
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <p style={{opacity: '0.5'}} class="progressbar"> Switch to Ropsten RPC </p>
                  </Grid.Row>
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <p style={{opacity: '0.5'}} class="progressbar"> Continue Withdrawal </p>
                  </Grid.Row>
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <p style={{opacity: '0.5'}} class="progressbar"> Waiting Period </p>
                  </Grid.Row>
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <p style={{opacity: '0.5'}} class="progressbar"> Confirm Withdrawal </p>
                  </Grid.Row>
                </div>

                <div class="contentContainer" style={{padding: '20px', marginTop: '10px', textAlign: 'left'}}>
                  <h3 style={{textAlign: 'left', marginLeft: '10px'}}> Withdraw MANA </h3>
                    <span style={{ display: 'block', float: 'left', textAlign: 'left', fontSize: '1.33em', marginTop : '30px', marginLeft: '50px'}}>2.</span>
                    <p style={{ textAlign: 'left', fontSize: '1.33em', paddingLeft: '80px', marginTop: '45px' }}>
                      Select amount to initiate withdrawal of MANA from Matic.
                    </p>
                    { this.state.isCustomAmount == 0 ?
                      <Dropdown selection options={amount} value={this.state.amount} 
                        style={{ width: '300px', marginLeft: '80px', marginTop: '10px'}} 
                        onChange={this.onChangeAmount} />
                    : <Input style={{ width: '300px', marginLeft: '80px', marginTop: '10px'}} value={this.state.amount} onChange={this.onChangeCustomAmount} /> }
                    <Button id='button-6' color='blue' style={{marginLeft: '80px', display: 'block' }} 
                      onClick={this.withdrawManaFromMatic}>
                      Withdraw
                    </Button>

                    { this.state.isValidStep1 == 1 ?
                      <p style={{ textAlign: 'center', color: 'red', marginTop: '10px'}}>
                        Withdraw failed.
                      </p> : <p/>
                    }
                    <p style={{ textAlign: 'left', fontSize: '1.33em', marginLeft: '80px', width: '800px', fontStyle:'italic', marginTop: '100px' }}>
                      **Matic Network is a second layer sidechain that allows our games to have much faster in-game transactions.**
                    </p>
                    <p style={{ textAlign: 'left', fontSize: '1.33em', marginLeft: '80px', width: '800px', fontStyle:'italic', marginTop: '20px' }}>
                      <span style={{fontWeight: 'bold'}}>NOTE: </span>
                      To ensure upmost security on the Matic sidechain, withdrawals currently take 1 week, and are broken down into 3 steps. You will need to sign 2 more thransactions to complete this withdrawal - one in 1-2 days, and one in 1 week.
                    </p>
                    <p style={{ textAlign: 'left', fontSize: '1.33em', marginLeft: '80px', width: '800px', fontStyle:'italic', marginTop: '20px' }}>
                      We will be offering instant mainchain liquidity services in the near future,
                    </p>
                </div>
              </Grid.Column>
            </Grid>
          </div>
        </div>
      )
    }

    return (
      <div id="withdraw">
        {this.ifMobileRedirect()}
        <Spinner show={this.state.isRunningTransaction}/>
        <div class="ui withdrawContainer">
          <Grid verticalAlign='middle' textAlign='center'>
            <Grid.Column>
              <div class="progressbar">
                <a href="https://decentral.games">
                  <img class="image inline" src={logo} style={{width: '230px', paddingTop: '25px', paddingBottom: '25px'}}/>
                </a>
                <Grid.Row style={{paddingTop: '25px', borderTop: '1px solid lightgray'}}>
                  <img class="progressbar image inline" src={box} />
                  <p class="progressbar"> Switch to Matic RPC </p>
                </Grid.Row>  
                <Grid.Row style={{marginTop: '15px'}}>
                  <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                  <p style={{opacity: '0.5'}} class="progressbar"> Initiate Withdrawal </p>
                </Grid.Row>
                <Grid.Row style={{marginTop: '15px'}}>
                  <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                  <p style={{opacity: '0.5'}} class="progressbar"> Waiting Period </p>
                </Grid.Row>
                <Grid.Row style={{marginTop: '15px'}}>
                  <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                  <p style={{opacity: '0.5'}} class="progressbar"> Switch to Ropsten RPC </p>
                </Grid.Row>
                <Grid.Row style={{marginTop: '15px'}}>
                  <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                  <p style={{opacity: '0.5'}} class="progressbar"> Continue Withdrawal </p>
                </Grid.Row>
                <Grid.Row style={{marginTop: '15px'}}>
                  <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                  <p style={{opacity: '0.5'}} class="progressbar"> Waiting Period </p>
                </Grid.Row>
                <Grid.Row style={{marginTop: '15px'}}>
                  <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                  <p style={{opacity: '0.5'}} class="progressbar"> Confirm Withdrawal </p>
                </Grid.Row>
              </div>

              <div class="contentContainer" style={{padding: '20px', marginTop: '10px', textAlign: 'left'}}>
                <h3 style={{textAlign: 'left', marginLeft: '10px'}}> Withdraw MANA </h3>
                <span style={{ display: 'block', float: 'left', textAlign: 'left', fontSize: '1.33em', marginTop : '30px', marginLeft: '50px'}}>1.</span>
                <p style={{ textAlign: 'left', fontSize: '1.33em', paddingLeft: '80px', marginTop: '45px' }}>
                  On your Metamask extension, open the Network dropdown menu and select 'Matic' Testnet.
                </p>
                <img style={{width:'240px', marginLeft: '100px'}} src={verify} class="image small inline" />

                { this.state.isMaticNetwork != 8995 ?
                  <p style={{ textAlign: 'left', color: 'red', marginTop: '10px', marginLeft: '100px'}}>
                    This is not Matic Network.
                  </p> : <p/>
                }
              </div>
            </Grid.Column>
          </Grid>
        </div>
      </div>
    )
  }
}

export default withRouter(Withdraw);
