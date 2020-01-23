import React from 'react'
import { Redirect, withRouter } from 'react-router-dom';
import { isMobile } from "react-device-detect";
import './additional.css';
import box from './Images/box.png';
import check from './Images/check.png';
import verify1 from './Images/switch_ropsten.png';
import { Header, Button } from 'decentraland-ui'
import { Container, Grid, Dropdown, Input, Modal, Divider } from 'semantic-ui-react'
import logo from './Images/logo.png'
import verify5_1 from './Images/switch_matic_1.png';
import verify5_2 from './Images/switch_matic_2.png';
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
};

class Deposit extends React.Component {

  state = { modalOpen: false }
  handleOpen = () => {
    localStorage.setItem('modalDeposit', (parseInt(localStorage.getItem('selectedMenu')) || 0) + 1);
    this.setState({ modalOpen: true }); 
    if (this.state.isLoaded === 0)
      this.props.showSpinner();
  }

  handleClose = () => {
    this.setState({ modalOpen: false })
    localStorage.setItem('modalDeposit', 0);
    localStorage.setItem('authvalue', 0);
  }

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
      if (!window.web3.currentProvider.selectedAddress) {
        window.web3 = new window.Web3(window.ethereum);
        await window.ethereum.enable();
        USER_ADDRESS = window.web3.currentProvider.selectedAddress;
      }

      for (var i = 0; i < 3; i++) {
        USER_ADDRESS = window.web3.currentProvider.selectedAddress;
        if (!USER_ADDRESS) {
          await Global.delay(2000);
          continue;
        }

        let ret = await this.checkUserVerifyStep();
        if (ret) {
          if (parseInt(localStorage.getItem('modalDeposit')) == (parseInt(localStorage.getItem('selectedMenu')) || 0) + 1) {
            if (parseInt(localStorage.getItem('modalDeposit')) == 1)
              this.setState({ modalOpen: true }); 
            else if (parseInt(localStorage.getItem('authvalue')) == this.props.authvalue)
              this.setState({ modalOpen: true, isValidDeposit: 2, userStepValue: 5 }); 
          }
          return;
        }

        await Global.delay(2000);
      }

    } catch(e) {
      console.log(e);
    }
    
    this.setState({isLoaded : 0});
    this.props.hideSpinner();
  }

  checkUserVerifyStep = async () => {
    try {
      const response = await this.getUserVerify();
      const json = await response.json();
      if (json.status === 'ok') {
        if (json.result === 'false') {
          this.setState({isLoaded: 1});
          this.props.hideSpinner();
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

        this.props.hideSpinner();
        return true;
      }
    } catch (error) {
      console.log(error);
    }
    this.props.hideSpinner();
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
      this.props.showSpinner();
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
          this.setState({isValidDeposit: 1});
          this.props.hideSpinner();
          return;
        }
        
        ret = await Global.getConfirmedTx(txHash);
        if (ret.status == '0x0')
          ret = await this.updateHistory(this.state.amount / UNIT, 'Deposit', 'Failed', txHash);
        else
          ret = await this.updateHistory(this.state.amount / UNIT, 'Deposit', 'Confirmed', txHash);

        if (!ret) {
          console.log('network error');
          this.setState({isValidDeposit: 1});
          this.props.hideSpinner();
          return;
        }

        if (this.state.userStepValue < 6)
          await this.postUserVerify(5);

        this.setState({isValidDeposit: 2});
        this.props.hideSpinner();
        if (this.state.userStepValue == 6) {
          this.handleClose();
          setTimeout(this.props.update, 5000); 
        }
        return;
      }
    } catch (err) {
      console.log(err);
    }
    this.setState({isValidDeposit: 1});
    this.props.hideSpinner();
  };

  authorizeMana = async (e, d) => {
    try {
      this.props.showSpinner();
      var amount_wei = (this.state.amount / UNIT * 10 ** Global.TOKEN_DECIMALS).toString();
      var contract_address = Global.SLOTS_CONTRACT_ADDRESS;
      if (this.props.authvalue === 2)
        contract_address = Global.ROULETTE_CONTRACT_ADDRESS;

      var allowed_amount = await Global.getAllowedToken(Global.MATIC_TOKEN, contract_address, USER_ADDRESS);
      allowed_amount = allowed_amount / (10 ** Global.TOKEN_DECIMALS);
      if (allowed_amount == 0)
        await Global.approveToken(Global.MATIC_TOKEN, Global.MAX_AMOUNT, contract_address, USER_ADDRESS);
      else if (allowed_amount < this.state.amount / UNIT || this.state.amount == 0) {
        await Global.approveToken(Global.MATIC_TOKEN, 0, contract_address, USER_ADDRESS);
        await Global.approveToken(Global.MATIC_TOKEN, Global.MAX_AMOUNT, contract_address, USER_ADDRESS);
      }
      await this.postUserVerify(6);
      await this.postUserAuthState(this.props.authvalue);
      this.setState({isValidAuthorize: 2});
      this.props.hideSpinner();
      this.handleClose()
      setTimeout(this.props.update, 5000); 
    } catch (err) {
      this.setState({isValidAuthorize: 1});
      this.props.hideSpinner();
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

  onAuthorize = async () => {
    localStorage.setItem('authvalue', this.props.authvalue || 0);
    this.setState({isValidDeposit: 2, userStepValue: 5});
    this.handleOpen();
  }

  getTrigger = () => {
    if (this.props.type != 1) {
      return <Button content='Deposit' id='depositButton' onClick={this.handleOpen} style={{marginRight: '0px'}}/>;
    }
    else if (this.props.commingsoon == 1) {
      return <Button content='Coming Soon' disabled id='depositButton' color='blue' style={{marginTop:'5px'}} />
    } else if (this.props.authorized == 0) {
      return <Button content='Authorize' id='depositButton' color='blue' style={{marginTop:'5px'}} onClick={this.onAuthorize}/>
    } else {
      return <Button disabled content='Authorized' id='depositButton' style={{marginTop:'5px', color: 'white'}}/>
    }
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

    if (this.state.isLoaded === 0) {
      return (
        <Modal
          trigger={this.getTrigger()}
          open={this.state.modalOpen}
          onClose={this.handleClose}
          closeIcon
        >
        <div id="deposit">
          <Container style={{ height: '35em' }}>
          </Container>
        </div>
        </Modal>
      )
    }

    if (this.state.isLoaded === 1) {
      return (
        <Modal
          trigger={<Button content='Deposit' id='depositButton' onClick={this.handleOpen} style={{marginRight: '0px'}}/>}
          open={this.state.modalOpen}
          onClose={this.handleClose}
          closeIcon
        >
        <div id="deposit">
          <Container style={{ height: '35em' }}>
            <Grid style={{marginTop: '17em'}} verticalAlign='middle' textAlign='center'>
              <Header> Please finish verification to Deposit. </Header>
            </Grid>
          </Container>
        </div>
        </Modal>
      )
    }

    if (!this.isBrowserMetamsk) {
      return (
        <Modal
          trigger={<Button content='Deposit' id='depositButton' onClick={this.handleOpen} style={{marginRight: '0px'}}/>}
          open={this.state.modalOpen}
          onClose={this.handleClose}
          closeIcon
        >
        <div id="deposit">
          <Container style={{ height: '35em' }}>
            <Grid style={{marginTop: '17em'}} verticalAlign='middle' textAlign='center'>
              <Header> Please use Chrome Browser with Metamask enabled to proceed. </Header>
            </Grid>
          </Container>
        </div>
        </Modal>
      )
    }

    { /* ----------------------------------------------------------- */ }
    { /*                 ON ROPSTEN, CONFIGURED MATIC                */ }
    { /* ----------------------------------------------------------- */ }

    if (this.state.userStepValue == 6) {
      if (this.state.networkID == 3) {
        return (
          <Modal
            trigger={this.getTrigger()}
            open={this.state.modalOpen}
            onClose={this.handleClose}
            closeIcon
          >
            <div id="deposit">
              {this.ifMobileRedirect()}
              <div class="ui depositContainer">
            <Grid verticalAlign='middle' textAlign='center'>
              <Grid.Column>
                <div class="progressbar2">
                  <img class="image inline" src={logo} style={{width: '230px', marginLeft: '-38px', paddingTop: '25px', paddingBottom: '9px' }}/>
                    <Grid.Row >
                      <Divider style={{ marginRight: '38px', paddingTop: '9px' }}/>
                        <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                        <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                        <p style={{opacity: '0.5', marginLeft: '2px'}} class="progressbar"> Switch to Ropsten RPC </p>
                      </Grid.Row>  
                      <Grid.Row style={{marginTop: '15px'}}>
                        <img class="progressbar image inline" src={box} />
                        <p class="progressbar"> Deposit to Matic </p>
                      </Grid.Row>
                    </div>

                    <div class="contentContainer2" >
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
          trigger={this.getTrigger()}
          open={this.state.modalOpen}
          onClose={this.handleClose}
          closeIcon
        >
        <div id="deposit">
          {this.ifMobileRedirect()}
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

                <div class="contentContainer2" >
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
        if (this.state.networkID == parseInt(Global.MATIC_NETWORK_ID)) {
          return (
          <Modal
            trigger={this.getTrigger()}
            open={this.state.modalOpen}
            onClose={this.handleClose}
            closeIcon
          >
          <div id="deposit">
            {this.ifMobileRedirect()}
            <div class="ui depositContainer">
              <Grid verticalAlign='middle' textAlign='center'>
                <Grid.Column>
                  <div class="progressbar2">
                    <img class="image inline" src={logo} style={{width: '230px', marginLeft: '-38px', paddingTop: '25px', paddingBottom: '9px' }}/>
                    <Grid.Row >
                      <Divider style={{ marginRight: '38px', paddingTop: '9px' }}/>
                        <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                        <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                        <p style={{opacity: '0.5', marginLeft: '2px'}} class="progressbar"> Switch to Ropsten RPC </p>
                      </Grid.Row>  
                      <Grid.Row style={{marginTop: '15px'}}>
                        <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                        <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                        <p style={{opacity: '0.5', marginLeft: '2px'}} class="progressbar"> Deposit to Matic </p>
                      </Grid.Row>
                      <Grid.Row style={{marginTop: '15px'}}>
                        <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                        <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                        <p style={{opacity: '0.5', marginLeft: '2px'}} class="progressbar"> Configure Matic RPC </p>
                      </Grid.Row>
                      <Grid.Row style={{marginTop: '15px'}}>
                        <img class="progressbar image inline" src={box} />
                        <p class="progressbar"> MANA Authorization </p>
                      </Grid.Row>
                    </div>

                    <div class="contentContainer2">
                      <Grid>
                        <Grid.Row>
                          <h3 style={{textAlign: 'left', marginTop: '25px' }}> Deposit MANA </h3>
                        </Grid.Row>
                        <Grid.Row>
                          <p style={{ textAlign: 'left', float: 'left', fontSize: '20px', marginRight: '30px' }}>
                            4. Authorize MANA transfers on Matic.
                          </p>
                        </Grid.Row>
                        <Grid.Row>
                          <Button id='button-6' color='blue' style={{marginLeft: '5px', marginBottom: '3em' }} 
                            onClick={this.authorizeMana}>
                            Authorize
                          </Button>

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
            trigger={this.getTrigger()}
            open={this.state.modalOpen}
            onClose={this.handleClose}
            closeIcon
          >
          <div id="deposit">
          {this.ifMobileRedirect()}
          <div class="ui depositContainer">
            <Grid verticalAlign='middle' textAlign='center'>
              <Grid.Column>
                <div class="progressbar2">
                  <img class="image inline" src={logo} style={{width: '230px', marginLeft: '-38px', paddingTop: '25px', paddingBottom: '9px' }}/>
                    <Grid.Row >
                      <Divider style={{ marginRight: '38px', paddingTop: '9px' }}/>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                    <p style={{opacity: '0.5', marginLeft: '2px'}} class="progressbar"> Switch to Ropsten RPC </p>
                  </Grid.Row>   
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                    <p style={{opacity: '0.5', marginLeft: '2px'}} class="progressbar"> Deposit to Matic </p>
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

                  <div class="contentContainer2">
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

                        { this.state.networkID != parseInt(Global.MATIC_NETWORK_ID) ?
                          <p style={{ textAlign: 'left', color: 'red', marginTop: '30px', width: '400px'}}>
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
            trigger={this.getTrigger()}
            open={this.state.modalOpen}
            onClose={this.handleClose}
            closeIcon
          >
          <div id="deposit">
            {this.ifMobileRedirect()}
            <div class="ui depositContainer">
              <Grid verticalAlign='middle' textAlign='center'>
                <Grid.Column>
                  <div class="progressbar2">
                    <img class="image inline" src={logo} style={{width: '230px', marginLeft: '-38px', paddingTop: '25px', paddingBottom: '9px' }}/>
                    <Grid.Row >
                      <Divider style={{ marginRight: '38px', paddingTop: '9px' }}/>
                      <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                      <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                      <p style={{opacity: '0.5', marginLeft: '2px'}} class="progressbar"> Switch to Ropsten RPC </p>
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

                    <div class="contentContainer2" >
                      <Grid>
                        <Grid.Row>
                          <h3 style={{textAlign: 'left', marginTop: '25px' }}> Deposit MANA </h3>
                        </Grid.Row>
                        <Grid.Row>
                          <p style={{ textAlign: 'left', float: 'left', fontSize: '20px', marginRight: '30px' }}>2. Authorize MANA transfers and deposit to Matic.
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
            trigger={this.getTrigger()}
            open={this.state.modalOpen}
            onClose={this.handleClose}
            closeIcon
          >
        <div id="deposit">
          {this.ifMobileRedirect()}
          <div class="ui depositContainer">
            <Grid verticalAlign='middle' textAlign='center'>
              <Grid.Column>
                <div class="progressbar2">
                  <img class="image inline" src={logo} style={{width: '230px', marginLeft: '-38px', paddingTop: '25px', paddingBottom: '9px' }}/>
                  <Grid.Row >
                    <Divider style={{ marginRight: '38px', paddingTop: '9px' }}/>
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

                <div class="contentContainer2" >
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
  }
}

export default withRouter(Deposit);