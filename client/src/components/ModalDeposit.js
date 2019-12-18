import React from 'react'
import { Redirect, withRouter } from 'react-router-dom';
import { isMobile } from "react-device-detect";
import './additional.css';
import box from './Images/box.png';
import check from './Images/check.png';
import verify1 from './deposit/verify1.png';
import { Header, Button } from 'decentraland-ui'
import { Container, Grid, Dropdown, Input, Modal, Divider } from 'semantic-ui-react'
import Spinner from '../Spinner'
import logo from './Images/logo.png'
import verify5_1 from './deposit/verify5_1.png';
import verify5_2 from './deposit/verify5_2.png';
import verify6 from './deposit/verify6.png';
import Global from './constant';

var UNIT = 1;
// var UNIT = 1000;
var USER_ADDRESS;

const INITIAL_STATE = {
  isLoaded: 0,
  isCustomAmount: 0,
  amount: 1000,
  userStepValue: 0,
  networkID: 0,
  isValidDeposit: 0,
  isValidAuthorize: 0,
  isRunningTransaction: false,
};

class Deposit extends React.Component {

  state = { modalOpen: false }
  handleOpen = () => this.setState({ modalOpen: true })
  handleClose = () => this.setState({ modalOpen: false })

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
        if (stepValue > 3)
          if (stepValue == 5)
            this.setState({isLoaded: 2, isValidDeposit: 2, userStepValue: stepValue});
          else if (stepValue == 6)
            this.setState({isLoaded: 2, isValidAuthorize: 2, userStepValue: stepValue});
          else
            this.setState({isLoaded: 2, userStepValue: stepValue});
        else
          this.setState({isLoaded: 1, userStepValue: stepValue});

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
    if (d.value == -1) {
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

  depositManaToMatic = async (e, d) => {
    try {
      this.setState({isRunningTransaction: true});
      var amount_wei = (this.state.amount / UNIT * 10 ** Global.TOKEN_DECIMALS).toString();
      var allowed_amount = await Global.getAllowedToken(Global.ROPSTEN_TOKEN, Global.ROOTCHAIN_ADDRESS, USER_ADDRESS);
      allowed_amount = allowed_amount / (10 ** Global.TOKEN_DECIMALS);
      if (allowed_amount == 0)
        await Global.approveToken(Global.ROPSTEN_TOKEN, Global.MAX_AMOUNT, Global.ROOTCHAIN_ADDRESS, USER_ADDRESS);
      else if (allowed_amount < this.state.amount / UNIT) {
        await Global.approveToken(Global.ROPSTEN_TOKEN, 0, Global.ROOTCHAIN_ADDRESS, USER_ADDRESS);
        await Global.approveToken(Global.ROPSTEN_TOKEN, Global.MAX_AMOUNT, Global.ROOTCHAIN_ADDRESS, USER_ADDRESS);
      }

      var txHash = await Global.depositTokenToMatic(Global.ROPSTEN_TOKEN, amount_wei, USER_ADDRESS);
      if (txHash != false) {
        var ret = await this.updateHistory(this.state.amount / UNIT, 'Deposit', 'In Progress', txHash);
        if (!ret) {
          console.log('network error');
          this.setState({isValidDeposit: 1, isRunningTransaction: false});
          return;
        }
        
        ret = await Global.getConfirmedTx(txHash);
        if (ret.status == '0x0')
          ret = await this.updateHistory(this.state.amount / UNIT, 'Deposit', 'Failed', txHash);
        else
          ret = await this.updateHistory(this.state.amount / UNIT, 'Deposit', 'Confirmed', txHash);

        if (!ret) {
          console.log('network error');
          this.setState({isValidDeposit: 1, isRunningTransaction: false});
          return;
        }

        if (this.state.userStepValue < 6)
          await this.postUserVerify(5);

        this.setState({isValidDeposit: 2, isRunningTransaction: false});
        if (this.state.userStepValue == 6)
          this.props.history.push('/account/');
        return;
      }
    } catch (err) {
      console.log(err);
    }
    this.setState({isValidDeposit: 1, isRunningTransaction: false});
  };

  authorizeMana = async (e, d) => {
    try {
      this.setState({isRunningTransaction: true});
      var amount_wei = (this.state.amount / UNIT * 10 ** Global.TOKEN_DECIMALS).toString();
      var allowed_amount = await Global.getAllowedToken(Global.MATIC_TOKEN, Global.SLOTS_CONTRACT_ADDRESS, USER_ADDRESS);
      allowed_amount = allowed_amount / (10 ** Global.TOKEN_DECIMALS);
      if (allowed_amount == 0)
        await Global.approveToken(Global.MATIC_TOKEN, Global.MAX_AMOUNT, Global.SLOTS_CONTRACT_ADDRESS, USER_ADDRESS);
      else if (allowed_amount < this.state.amount / UNIT || this.state.amount == 0) {
        await Global.approveToken(Global.MATIC_TOKEN, 0, Global.SLOTS_CONTRACT_ADDRESS, USER_ADDRESS);
        await Global.approveToken(Global.MATIC_TOKEN, Global.MAX_AMOUNT, Global.SLOTS_CONTRACT_ADDRESS, USER_ADDRESS);
      }
      await this.postUserVerify(6);
      this.setState({isValidAuthorize: 2, isRunningTransaction: false});
      this.props.history.push('/account/');
    } catch (err) {
      this.setState({isValidAuthorize: 1, isRunningTransaction: false});
    }
  };

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

  render() {
    const amount = [
      { key: 1, text: '1000 MANA', value: 1000 },
      { key: 2, text: '2000 MANA', value: 2000 },
      { key: 3, text: '3000 MANA', value: 3000 },
      { key: 4, text: '4000 MANA', value: 4000 },
      { key: 5, text: '5000 MANA', value: 5000 },
      { key: 6, text: 'Custom', value: -1 },
    ]

    if (this.state.networkID == 0)
      this.verifyNetwork()

    if (this.state.isLoaded == 0) {
      return (
        <div id="deposit">
          <Container style={{ marginTop: '25.5em', height: '35em' }}>
            <Spinner show={1}/>
          </Container>
        </div>
      )
    }

    if (this.state.isLoaded === 1) {
      return (
        <div id="deposit">
          <Container style={{ marginTop: '25.5em', height: '35em' }}>
            <Grid verticalAlign='middle' textAlign='center'>
              <Header> Please finish <a href="/verify">verification</a> to Deposit. </Header>
            </Grid>
          </Container>
        </div>
      )
    }

    if (!this.isBrowserMetamsk) {
      return (
        <div id="deposit">
          <Container style={{ marginTop: '25.5em', height: '35em' }}>
            <Grid verticalAlign='middle' textAlign='center'>
              <Header> Please use Chrome Browser with Metamask enabled to proceed. </Header>
            </Grid>
          </Container>
        </div>
      )
    }

    { /* ----------------------------------------------------------- */ }
    { /*                 ON ROPSTEN, CONFIGURED MATIC                */ }
    { /* ----------------------------------------------------------- */ }

    if (this.state.userStepValue == 6) {
      if (this.state.networkID == 3) {
        return (
          <Modal
            trigger={<Button content='Deposit' id='depositButton' onClick={this.handleOpen} />}
            open={this.state.modalOpen}
            onClose={this.handleClose}
            closeIcon
          >
            <div id="deposit">
              {this.ifMobileRedirect()}
              <Spinner show={this.state.isRunningTransaction}/>
              <div class="ui depositContainer">
            <Grid verticalAlign='middle' textAlign='center'>
              <Grid.Column>
                <div class="progressbar2">
                  <img class="image inline" src={logo} style={{width: '230px', marginLeft: '-38px', paddingTop: '25px', paddingBottom: '9px' }}/>
                    <Grid.Row >
                      <Divider style={{ marginRight: '38px', paddingTop: '9px' }}/>
                        <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                        <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                        <p style={{opacity: '0.5'}} class="progressbar"> Switch to Ropsten RPC </p>
                      </Grid.Row>  
                      <Grid.Row style={{marginTop: '15px'}}>
                        <img class="progressbar image inline" src={box} />
                        <p class="progressbar"> Deposit to Matic </p>
                      </Grid.Row>
                    </div>

                    <div class="contentContainer" >
                      <Grid>
                        <Grid.Row>
                          <h3 style={{textAlign: 'left', marginTop: '25px' }}> Deposit MANA </h3>
                        </Grid.Row>
                        <Grid.Row>
                          <p style={{ textAlign: 'left', float: 'left', fontSize: '20px', marginRight: '30px' }}>2. Select amount to deposit MANA to Matic.
                          </p>
                        </Grid.Row>
                        <Grid.Row>
                          { this.state.isCustomAmount == 0 ?
                        <Dropdown selection options={amount} value={this.state.amount} 
                          style={{ width: '300px', marginTop: '0px'}} 
                          onChange={this.onChangeAmount} />
                          : <Input style={{ width: '300px', marginTop: '0px'}} value={this.state.amount} onChange={this.onChangeCustomAmount} /> }
                        </Grid.Row>
                        <Grid.Row>
                          <Button id='button-6' color='blue' style={{ marginTop: '-10px', display: 'block' }} 
                            onClick={this.depositManaToMatic}>
                            Deposit
                          </Button>
                        </Grid.Row>
                      </Grid>

                      { this.state.isValidDeposit == 1 ?
                        <p style={{ textAlign: 'center', color: 'red', marginTop: '10px'}}>
                          Deposit failed.
                        </p> : <p/>
                      }
                      <p style={{ textAlign: 'left', marginLeft: '-13px', marginRight: '30px', fontSize: '1.33em', fontStyle:'italic', marginTop: '100px' }}>
                        **Matic Network is a second layer sidechain that allows our games to have much faster in-game transactions.**
                      </p>
                      <p style={{ textAlign: 'left', marginLeft: '-13px', fontSize: '1.33em', fontStyle:'italic', marginTop: '20px' }}>
                        <span style={{fontWeight: 'bold'}}>NOTE: </span>
                        Matic deposits are instantly usable in all our games.
                      </p>
                    </div>
                  </Grid.Column>
                </Grid>
              </div>
            </div>
          </Modal>
        )
      }

      { /* ----------------------------------------------------------- */ }
      { /*               NOT ON ROPSTEN, CONFIGURED MATIC              */ }
      { /* ----------------------------------------------------------- */ }

      return (
        <Modal
          trigger={<Button content='Deposit' id='depositButton' onClick={this.handleOpen} />}
          open={this.state.modalOpen}
          onClose={this.handleClose}
          closeIcon
        >
        <div id="deposit">
          {this.ifMobileRedirect()}
          <Spinner show={this.state.isRunningTransaction}/>
          <div class="ui depositContainer">
            <Grid verticalAlign='middle' textAlign='center'>
              <Grid.Column>
                <div class="progressbar2">
                  <img class="image inline" src={logo} style={{width: '230px', marginLeft: '-38px', paddingTop: '25px', paddingBottom: '9px' }}/>
                    <Grid.Row >
                      <Divider style={{ marginRight: '38px', paddingTop: '9px' }}/>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <p style={{opacity: '0.5'}} class="progressbar"> Switch to Ropsten RPC </p>
                  </Grid.Row>   
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <p style={{opacity: '0.5'}} class="progressbar"> Deposit to Matic </p>
                  </Grid.Row>
                </div>

                <div class="contentContainer" >
                  <Grid>
                    <Grid.Row>
                      <h3 style={{textAlign: 'left', marginTop: '25px' }}> Deposit MANA </h3>
                    </Grid.Row>
                    <Grid.Row>
                      <p style={{ textAlign: 'left', float: 'left', fontSize: '20px', marginRight: '30px' }}>1. On your Metamask extension, open the Network dropdown menu and select 'Ropsten'.
                      </p>
                    </Grid.Row>
                    <Grid.Row>
                      <img style={{width:'240px' }} src={verify1} class="image small inline" />
                    </Grid.Row>
                  </Grid>

                  { this.state.networkID != 3 ?
                    <p style={{ textAlign: 'left', color: 'red', marginTop: '21px', marginLeft: '-13px'}}>
                      This is not Ropsten Network.
                    </p> : <p/>
                  }
                  </div>
                </Grid.Column>
              </Grid>
            </div>
          </div>
        </Modal>
      )
    }


    else {
      if (this.state.isValidDeposit == 2) {
        if (this.state.networkID == 8995) {
          return (
          <Modal
            trigger={<Button content='Deposit' id='depositButton' onClick={this.handleOpen} />}
            open={this.state.modalOpen}
            onClose={this.handleClose}
            closeIcon
          >
          <div id="deposit">
            {this.ifMobileRedirect()}
            <Spinner show={this.state.isRunningTransaction}/>
            <div class="ui depositContainer">
              <Grid verticalAlign='middle' textAlign='center'>
                <Grid.Column>
                  <div class="progressbar2">
                    <img class="image inline" src={logo} style={{width: '230px', marginLeft: '-38px', paddingTop: '25px', paddingBottom: '9px' }}/>
                    <Grid.Row >
                      <Divider style={{ marginRight: '38px', paddingTop: '9px' }}/>
                        <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                        <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                        <p style={{opacity: '0.5'}} class="progressbar"> Switch to Ropsten RPC </p>
                      </Grid.Row>  
                      <Grid.Row style={{marginTop: '15px'}}>
                        <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                        <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                        <p style={{opacity: '0.5'}} class="progressbar"> Deposit to Matic </p>
                      </Grid.Row>
                      <Grid.Row style={{marginTop: '15px'}}>
                        <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                        <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                        <p style={{opacity: '0.5'}} class="progressbar"> Configure Matic RPC </p>
                      </Grid.Row>
                      <Grid.Row style={{marginTop: '15px'}}>
                        <img class="progressbar image inline" src={box} />
                        <p class="progressbar"> MANA Authorization </p>
                      </Grid.Row>
                    </div>

                    <div class="contentContainer">
                      <Grid>
                        <Grid.Row>
                          <h3 style={{textAlign: 'left', marginTop: '25px' }}> Deposit MANA </h3>
                        </Grid.Row>
                        <Grid.Row>
                          <p style={{ textAlign: 'left', float: 'left', fontSize: '20px', marginRight: '30px' }}>
                            4. Authorize MANA transfers on Matic. When the Metamask popup appears, select ‘edit’, select ‘advanced’, set the gas price to 0, and click ‘save’ before confirming the transaction.
                          </p>
                        </Grid.Row>
                        <Grid.Row>
                          <Button id='button-6' color='blue' style={{marginLeft: '5px', marginBottom: '3em' }} 
                            onClick={this.authorizeMana}>
                            Authorize
                          </Button>
                          <img style={{width:'800px', marginTop: '20px', display: 'block'}} src={verify6} class="image small inline" />

                          { this.state.isValidAuthorize == 1 ?
                            <p style={{ textAlign: 'center', color: 'red', marginTop: '10px'}}>
                              Authorization failed.
                            </p> : <p/>
                          }
                        </Grid.Row>
                      </Grid>
                    </div>
                  </Grid.Column>
                </Grid>
              </div>
            </div>
          </Modal>
          )
        }

        return (
          <Modal
            trigger={<Button content='Deposit' id='depositButton' onClick={this.handleOpen} />}
            open={this.state.modalOpen}
            onClose={this.handleClose}
            closeIcon
          >
          <div id="deposit">
          {this.ifMobileRedirect()}
          <Spinner show={this.state.isRunningTransaction}/>
          <div class="ui depositContainer">
            <Grid verticalAlign='middle' textAlign='center'>
              <Grid.Column>
                <div class="progressbar2">
                  <img class="image inline" src={logo} style={{width: '230px', marginLeft: '-38px', paddingTop: '25px', paddingBottom: '9px' }}/>
                    <Grid.Row >
                      <Divider style={{ marginRight: '38px', paddingTop: '9px' }}/>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                    <p style={{opacity: '0.5'}} class="progressbar"> Switch to Ropsten RPC </p>
                  </Grid.Row>   
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                    <p style={{opacity: '0.5'}} class="progressbar"> Deposit to Matic </p>
                  </Grid.Row>
                    <Grid.Row style={{marginTop: '15px'}}>
                      <img class="progressbar image inline" src={box} />
                      <p class="progressbar"> Configure Matic RPC </p>
                    </Grid.Row>
                    <Grid.Row style={{marginTop: '15px'}}>
                      <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                      <p style={{opacity: '0.5'}} class="progressbar"> MANA Authorization </p>
                    </Grid.Row>
                  </div>

                  <div class="contentContainer">
                    <Grid>
                      <Grid.Row>
                        <h3 style={{textAlign: 'left', marginTop: '25px' }}> Deposit MANA </h3>
                      </Grid.Row>
                      <Grid.Row>
                        <p style={{ textAlign: 'left', float: 'left', fontSize: '20px', marginRight: '30px' }}>
                          3. On your Metamask extension, open the 'Main Ethereum Network' dropdown menu and select 'Custom RPC'. Fill in 'Matic Testnet' as Network name and <span style={{fontStyle:'italic'}}>https://testnet2.matic.network</span> as New RPC URL and select 'Save'.
                        </p>
                      </Grid.Row>

                      <Grid.Row>
                        <p style={{ verticalAlign: 'top', textAlign: 'left', fontSize: '20px'}}>1.</p>
                        <img style={{width:'210px'}} src={verify5_1} class="image small inline" />
                        <p style={{ verticalAlign: 'top', textAlign: 'left', fontSize: '20px', marginLeft: '20px'}}>2.</p>
                        <img style={{width:'210px', verticalAlign:'top'}} src={verify5_2} class="image small inline" />

                        { this.state.networkID != 8995 ?
                          <p style={{ textAlign: 'left', color: 'red', marginTop: '30px'}}>
                            This is not Matic Network.
                          </p> : <p/>
                        }
                      </Grid.Row>
                    </Grid>
                  </div>
                </Grid.Column>
              </Grid>
            </div>
          </div>
        </Modal>
        )
      }

      if (this.state.networkID == 3) {
        return (
          <Modal
            trigger={<Button content='Deposit' id='depositButton' onClick={this.handleOpen} />}
            open={this.state.modalOpen}
            onClose={this.handleClose}
            closeIcon
          >
          <div id="deposit">
            {this.ifMobileRedirect()}
            <Spinner show={this.state.isRunningTransaction}/>
            <div class="ui depositContainer">
              <Grid verticalAlign='middle' textAlign='center'>
                <Grid.Column>
                  <div class="progressbar2">
                    <img class="image inline" src={logo} style={{width: '230px', marginLeft: '-38px', paddingTop: '25px', paddingBottom: '9px' }}/>
                    <Grid.Row >
                      <Divider style={{ marginRight: '38px', paddingTop: '9px' }}/>
                      <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                      <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                      <p style={{opacity: '0.5'}} class="progressbar"> Switch to Ropsten RPC </p>
                    </Grid.Row>  
                    <Grid.Row style={{marginTop: '15px'}}>
                      <img class="progressbar image inline" src={box} />
                      <p class="progressbar"> Deposit to Matic </p>
                    </Grid.Row>
                    <Grid.Row style={{marginTop: '15px'}}>
                      <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                      <p style={{opacity: '0.5'}} class="progressbar"> Configure Matic RPC </p>
                    </Grid.Row>
                    <Grid.Row style={{marginTop: '15px'}}>
                      <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                      <p style={{opacity: '0.5'}} class="progressbar"> MANA Authorization </p>
                    </Grid.Row>
                  </div>

                    <div class="contentContainer" >
                      <Grid>
                        <Grid.Row>
                          <h3 style={{textAlign: 'left', marginTop: '25px' }}> Deposit MANA </h3>
                        </Grid.Row>
                        <Grid.Row>
                          <p style={{ textAlign: 'left', float: 'left', fontSize: '20px', marginRight: '30px' }}>2. Select amount to deposit MANA to Matic.
                          </p>
                        </Grid.Row>
                        <Grid.Row>
                          { this.state.isCustomAmount == 0 ?
                        <Dropdown selection options={amount} value={this.state.amount} 
                          style={{ width: '300px', marginTop: '0px'}} 
                          onChange={this.onChangeAmount} />
                          : <Input style={{ width: '300px', marginTop: '0px'}} value={this.state.amount} onChange={this.onChangeCustomAmount} /> }
                        </Grid.Row>
                        <Grid.Row>
                          <Button id='button-6' color='blue' style={{ marginTop: '-10px', display: 'block' }} 
                            onClick={this.depositManaToMatic}>
                            Deposit
                          </Button>
                        </Grid.Row>
                      </Grid>

                      { this.state.isValidDeposit == 1 ?
                        <p style={{ textAlign: 'left', marginLeft: '-13px', color: 'red', marginTop: '30px'}}>
                          Deposit failed.
                        </p> : <p/>
                      }
                      <p style={{ textAlign: 'left', marginLeft: '-13px', marginRight: '30px', fontSize: '1.33em', fontStyle:'italic', marginTop: '100px' }}>
                        **Matic Network is a second layer sidechain that allows our games to have much faster in-game transactions.**
                      </p>
                      <p style={{ textAlign: 'left', marginLeft: '-13px', fontSize: '1.33em', fontStyle:'italic', marginTop: '20px' }}>
                        <span style={{fontWeight: 'bold'}}>NOTE: </span>
                        Matic deposits are instantly usable in all our games.
                      </p>
                    </div>
                  </Grid.Column>
                </Grid>
              </div>
            </div>
          </Modal>
        )
      }

      return (
                <Modal
            trigger={<Button content='Deposit' id='depositButton' onClick={this.handleOpen} />}
            open={this.state.modalOpen}
            onClose={this.handleClose}
            closeIcon
          >
        <div id="deposit">
          {this.ifMobileRedirect()}
          <Spinner show={this.state.isRunningTransaction}/>
          <div class="ui depositContainer">
            <Grid verticalAlign='middle' textAlign='center'>
              <Grid.Column>
                <div class="progressbar">
                  <a href="https://decentral.games">
                    <img class="image inline" src={logo} style={{width: '230px', paddingTop: '25px', paddingBottom: '25px'}}/>
                  </a>
                  <Grid.Row style={{paddingTop: '25px', borderTop: '1px solid lightgray'}}>
                    <img class="progressbar image inline" src={box} />
                    <p class="progressbar"> Switch to Ropsten RPC </p>
                  </Grid.Row>  
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <p style={{opacity: '0.5'}} class="progressbar"> Deposit to Matic </p>
                  </Grid.Row>
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <p style={{opacity: '0.5'}} class="progressbar"> Configure Matic RPC </p>
                  </Grid.Row>
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <p style={{opacity: '0.5'}} class="progressbar"> MANA Authorization </p>
                  </Grid.Row>
                </div>

                <div class="contentContainer" style={{padding: '20px', marginTop: '10px', textAlign: 'left'}}>
                  <h3 style={{textAlign: 'left', marginLeft: '10px'}}> Deposit MANA </h3>
                  <span style={{ display: 'block', float: 'left', textAlign: 'left', fontSize: '1.33em', marginTop : '30px', marginLeft: '50px'}}>1.</span>
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
      </Modal>
      )
    }
  }
}

export default withRouter(Deposit);