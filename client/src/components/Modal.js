import React, { Component, useContext, useState, useEffect } from "react";
import { NavLink, Link, Redirect, withRouter } from "react-router-dom"
import { Icon, Image, Menu, Search, Container, Segment, Modal, Header, Grid, Input, Dropdown, Breadcrumb, Divider, Message, Popup, Button } from "semantic-ui-react";
import { isMobile } from "react-device-detect";
import Global from './constant';
import logo2 from './Images/logo.png'
import Spinner from '../Spinner'
import box from './Images/box.png'
import check from './Images/check.png'
import metamask from './Images/metamask.png'
import ledger from './Images/ledger.png'

var USER_ADDRESS;

const INITIAL_STATE = {
  month: 1,
  day: 1,
  year: 1990,
  amount: 1000,
  email: '',
  name: '',
  emailErrMsg: '',
  isEmailNameDone: 0,
  userStepValue: 0,
  isLoaded: 0,
  isValidBirth: 0,
  isValidLocation: 0,
  isValidMetamask: 0,
  isRunningTransaction: false,
  existAccount: 0,
};

class ModalVerify extends Component {

  state = { modalOpen: false}
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
          if (this.state.userStepValue < 2 ) {
            try {
              // Request account access if needed
              fetch(`${Global.BASE_URL}/order/addAddress`, {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  address: USER_ADDRESS,
                  manaLock: 0,
                  ethLock: 0,
                })
              })
              .catch(e => {
                console.log(e);
                this.setState({isValidMetamask: 1});
              })
              .then(res => {
                if (res)
                  return res.json();
                this.setState({isValidMetamask: 1});
              })
              .then(async data => {
                if (!data)
                  this.setState({isValidMetamask: 1});
                else {
                  if (data.status === 'ok' && data.result === 'true') {
                    // window.location.href = 'http://localhost:8000';
                    await this.postUserVerify(2);
                    this.setState({isValidMetamask: 2});
                  } else {
                    this.setState({isValidMetamask: 1});
                  }
                }
              });
            } catch (error) {
                // User denied account access...
                console.log(error);
            }
          }

          return;
        }

        await Global.delay(2000);
      }
    } catch (err) {
      console.log(err)
    }

    this.setState({isLoaded : 0});
  }

  checkUserVerifyStep = async () => {
    try {
      const response = await this.getUserVerify();
      const json = await response.json();
      if (json.status === 'ok') {
        if (json.result === 'false') {
          this.setState({isLoaded: 2});
          this.setState({ existAccount: 0 });
          return true;
        }

        let stepValue = parseInt(json.result);
        if (stepValue > 3)
          this.setState({isValidLocation: 2, isLoaded: 2, userStepValue: 4, existAccount: 1});
        else if (stepValue == 3)
          this.setState({isValidBirth: 2, isLoaded: 2, userStepValue: 3, existAccount: 0});
        else if (stepValue == 2)
          this.setState({isValidMetamask: 2, isLoaded: 2, userStepValue: 2, existAccount: 0});
        else
          this.setState({isLoaded: 2, userStepValue: stepValue, existAccount: 0});

        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  ifMobileRedirect = () => {
    if (isMobile) {
      return <Redirect to='/' />
    }
  }
  onChangeMonth = (e, d) => {
    this.setState({month: d.value });
  };

  onChangeDay = (e, d) => {
    this.setState({day: d.value });
  };

  onChangeYear = (e, d) => {
    this.setState({year: d.value });
  };

  onChangeAmount = (e, d) => {
    this.setState({amount: d.value });
  };

  onEmail = async(e) => {
    this.setState({email: e.target.value});
  }

  onName = async(e) => {
    this.setState({name: e.target.value});
  }

  verifyBirth = async (e, d) => {
    this.setState({isValidBirth: 0, isEmailNameDone: 0});
    const curYear = new Date().getFullYear();
    let validBirth = 0;
    if (curYear - this.state.year >= 18)
      validBirth = 2;
    else {
      validBirth = 1;
      this.setState({isValidBirth: 1});
      return;
    }

    var ret = await this.postAndCheckUserEmail();
    if (ret) {
      await this.postUserVerify(3);
      this.setState({isValidBirth: 2, isEmailNameDone: 2});
    } else {
      this.setState({isEmailNameDone: 1});
    }
  };

  postUserEmail = (step) => {
    return fetch(`${Global.BASE_URL}/order/addEmailName`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // address: window.web3.currentProvider.selectedAddress,
        email: this.state.email,
        name: this.state.name,
      })
    })
  }

  postAndCheckUserEmail = async () => {
    try {
      const response = await this.postUserEmail();
      const json = await response.json();
      if (json.status === 'ok') {
        if (json.result !== 'true') {
          this.setState({emailErrMsg: json.result});
          return false;
        }

        return true;
      }
    } catch (error) {
      console.log(error);
    }

    this.setState({emailErrMsg: 'Registering email and name is failed'});
    return false;
  }

  verifyLocation = async (e, d) => {
    this.setState({isValidLocation: 0});
    fetch("https://extreme-ip-lookup.com/json")
      .then(res => res.json())
      .then(async ip => {
        if (ip.country != 'poop') {
          await this.postUserVerify(4);
          this.setState({isValidLocation: 2 });
          this.props.history.push('/account/');
        }
        else
          this.setState({isValidLocation: 1 });
          console.log(ip.country);
      });
  };

  onMetamask = async (e, d) => {
    this.setState({isValidMetamask: 0});
    if (window.ethereum) {
      if (window.web3.currentProvider.selectedAddress === '' || window.web3.currentProvider.selectedAddress === undefined) {
        window.web3 = new window.Web3(window.ethereum);
        try {
            // Request account access if needed
            await window.ethereum.enable();
            USER_ADDRESS = window.web3.currentProvider.selectedAddress;
            
            fetch(`${Global.BASE_URL}/order/addAddress`, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                address: USER_ADDRESS,
                manaLock: 0,
                ethLock: 0,
              })
            })
            .catch(e => {
              console.log(e);
              this.setState({isValidMetamask: 1});
            })
            .then(res => {
              if (res)
                return res.json();
              this.setState({isValidMetamask: 1});
            })
            .then(async data => {
              if (!data)
                this.setState({isValidMetamask: 1});
              else {
                if (data.status === 'ok' && data.result === 'true') {
                  // window.location.href = 'http://localhost:8000';
                  await this.postUserVerify(2);
                  this.setState({isValidMetamask: 2});
                } else {
                  this.setState({isValidMetamask: 1});
                }
              }
            });
        } catch (error) {
            // User denied account access...
            console.log(error);
        }
      }
    }
  };

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

  postUserVerify = (step) => {
    return fetch(`${Global.BASE_URL}/order/updateUserVerify`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: USER_ADDRESS,
        verifyStep: step,
      })
    })
  }

  render() {
    const month = [
      { key: 1, text: 'Jan', value: 1 },
      { key: 2, text: 'Feb', value: 2 },
      { key: 3, text: 'Mar', value: 3 },
      { key: 4, text: 'Apr', value: 4 },
      { key: 5, text: 'May', value: 5 },
      { key: 6, text: 'Jun', value: 6 },
      { key: 7, text: 'Jul', value: 7 },
      { key: 8, text: 'Aug', value: 8 },
      { key: 9, text: 'Sep', value: 9 },
      { key: 10, text: 'Oct', value: 10 },
      { key: 11, text: 'Nov', value: 11 },
      { key: 12, text: 'Dec', value: 12 },
    ]

    const amount = [
      { key: 1, text: '1000 MANA', value: 1000 },
      { key: 2, text: '2000 MANA', value: 2000 },
      { key: 3, text: '3000 MANA', value: 3000 },
      { key: 4, text: '4000 MANA', value: 4000 },
      { key: 5, text: '5000 MANA', value: 5000 },
    ]

    var dayLimit;
    if ((this.state.month == 1) || (this.state.month == 3) || (this.state.month == 5) || (this.state.month == 7) ||
      (this.state.month == 8) || (this.state.month == 10) || (this.state.month == 12))
      dayLimit = 31;
    else if (this.state.month == 2)
      dayLimit = 29;
    else
      dayLimit = 30

    var day = [];
    for (var i = 1; i <= dayLimit; i++) {
      if ((i == 1) || (i == 21) || (i == 31))
        day[day.length] = { key: i, text: i + 'st', value: i};
      else if ((i == 2) || (i == 22))
        day[day.length] = { key: i, text: i + 'nd', value: i};
      else if ((i == 3) || (i == 23))
        day[day.length] = { key: i, text: i + 'rd', value: i};
      else
        day[day.length] = { key: i, text: i + 'th', value: i};
    }

    var year = [];
    for (var i = 1900; i <= 2019; i++) {
      year[year.length] = { key: i, text: i, value: i};
    }

    if (this.state.existAccount == 1) {
      return (
        <Button content='Play Now' className='hvr-pop' as={NavLink} to='/account/' id='button-account' />
      )
    }

    if (this.state.isValidBirth == 2) {
      return (
        <Modal
          trigger={<Button content='Play Now' className='hvr-pop' onClick={this.handleOpen} />}
          open={this.state.modalOpen}
          onClose={this.handleClose}
          closeIcon
        >
         <div id="verify">
          {this.ifMobileRedirect()}
          
          <Spinner show={this.state.isRunningTransaction}/>
          <div class="ui verifyContainer">
            <Grid verticalAlign='middle' textAlign='center'>
              <Grid.Column>

                <div class="progressbar">
                  <img class="image inline" src={logo2} style={{width: '230px', marginLeft: '-38px', paddingTop: '25px', paddingBottom: '9px' }}/>
                    <Grid.Row >
                      <Divider style={{ marginRight: '38px', paddingTop: '9px' }}/>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                    <p style={{opacity: '0.5'}} class="progressbar"> Connect Wallet </p>
                  </Grid.Row>  
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                    <p style={{opacity: '0.5'}} class="progressbar"> User Info, Verify Age </p>
                  </Grid.Row>
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img class="progressbar image inline" src={box} />
                    <p class="progressbar"> Verify Location </p>
                  </Grid.Row>
                </div>

                <div class="contentContainer">
                  <Grid>
                    <Grid.Row>
                      <h3 style={{textAlign: 'left', marginTop: '25px' }}> Create Account </h3>
                    </Grid.Row>
                    <Grid.Row>
                      <p style={{ textAlign: 'left', float: 'left', fontSize: '20px', marginRight: '30px' }}>3. Verify your location. Due to international online gaming legislation, we unfortunately do not allow accounts from US IP addresses.
                      </p>
                    </Grid.Row>

                    <Grid.Row>
                      <Button id='button-6' color='blue' style={{marginTop: '20px'}} 
                        onClick={this.verifyLocation} >
                        Verify
                      </Button>
                    </Grid.Row>
                  </Grid>

                  { this.state.isValidLocation == 1 ?
                  <p style={{ textAlign: 'left', color: 'red', marginTop: '21px', marginLeft: '-13px'}}>
                    You are within the United States.
                  </p> : <p/> }

                </div>
              </Grid.Column>
            </Grid>
          </div>
        </div>
      </Modal>
      )
    }

    if (this.state.isValidMetamask == 2) {
      return (
        <Modal
          trigger={<Button content='Play Now' className='hvr-pop' onClick={this.handleOpen} />}
          open={this.state.modalOpen}
          onClose={this.handleClose}
          closeIcon
        >
          <div id="verify">
            {this.ifMobileRedirect()}

            <Spinner show={this.state.isRunningTransaction}/>
            <div class="ui verifyContainer">
              <Grid verticalAlign='middle' textAlign='center'>
                <Grid.Column>
                  <div class="progressbar">
                    <img class="image inline" src={logo2} style={{width: '230px', marginLeft: '-38px', paddingTop: '25px', paddingBottom: '9px' }}/>
                    <Grid.Row >
                      <Divider style={{ marginRight: '38px', paddingTop: '9px' }}/>
                      <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                      <img style={{opacity: '0.5'}} style={{marginLeft:'-15px', opacity: '0.5', marginBottom:'3px'}} class="progressbar image inline" src={check} />
                      <p style={{opacity: '0.5'}} class="progressbar"> Connect Wallet </p>
                    </Grid.Row>  
                    <Grid.Row style={{marginTop: '15px'}}>
                      <img class="progressbar image inline" src={box} />
                      <p class="progressbar"> User Info, Verify Age </p>
                    </Grid.Row>
                    <Grid.Row style={{marginTop: '15px'}}>
                      <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                      <p style={{opacity: '0.5'}} class="progressbar"> Verify Location </p>
                    </Grid.Row>
                  </div>
                  <div class="contentContainer">
                    <Grid>
                      <Grid.Row>
                        <h3 style={{textAlign: 'left', marginTop: '25px' }}> Create Account </h3>
                      </Grid.Row>
                      <Grid.Row>
                        <p style={{ textAlign: 'left', float: 'left', fontSize: '20px', marginRight: '30px' }}>2. Enter your name, email, and verify your date of birth. You must be over 18 to play our games.
                        </p>
                      </Grid.Row>
                      <Grid.Row style={{paddingTop: '5px', paddingBottom: '5px', marginTop: '20px'}}>
                        <Input style={{ width: '450px', height: '40px', marginRight: 'auto', verticalAlign: 'middle'}} value={this.state.email} onChange={this.onEmail} placeholder='Name' type="email" />
                      </Grid.Row>
                      <Grid.Row style={{paddingTop: '5px', paddingBottom: '5px'}}>
                        <Input style={{ width: '450px', height: '40px', marginRight: 'auto', verticalAlign: 'middle'}} value={this.state.name} onChange={this.onName} placeholder='Email' />
                      </Grid.Row>
                      <Grid.Row>
                        <div style={{display: 'inline-flex', marginRight: 'auto', width: '450px'}}>
                          <Grid.Column style={{marginLeft: '0', marginRight: 'auto'}} computer={4} tablet={16} mobile={16}>
                            <Dropdown fluid selection options={month} value={this.state.month} onChange={this.onChangeMonth} />
                          </Grid.Column>
                          <Grid.Column style={{marginLeft: 'auto', marginRight: 'auto'}} computer={4} tablet={16} mobile={16}>
                            <Dropdown fluid selection options={day} value={this.state.day} onChange={this.onChangeDay} />
                          </Grid.Column>
                          <Grid.Column style={{marginLeft: 'auto', marginRight: '0'}} computer={4} tablet={16} mobile={16}>
                            <Dropdown fluid selection options={year} value={this.state.year} onChange={this.onChangeYear} />
                          </Grid.Column>
                        </div>
                      </Grid.Row>
                      <Grid.Row>
                        <Button color='blue' id="button-6" style={{marginRight: 'auto' }}
                          onClick={this.verifyBirth} >
                          Verify
                        </Button>
                      </Grid.Row>           
                    </Grid>
                    
                    { this.state.isValidBirth == 1 ?
                      <p style={{ textAlign: 'left', color: 'red', marginTop: '21px', marginLeft: '-13px'}}>
                        You must be over 18 to play
                      </p> 
                    : this.state.isEmailNameDone == 1 ?
                      <p style={{ textAlign: 'left', color: 'red', marginTop: '21px', marginLeft: '-13px'}}>
                        You must enter an email and name.
                      </p> 
                    : <p/>
                    }
                </div>
              </Grid.Column>
            </Grid>
          </div>
        </div>
      </Modal>
      )
    }

    return  (
      <Modal
        trigger={<Button content='Play Now' className='hvr-pop' onClick={this.handleOpen} />}
        open={this.state.modalOpen}
        onClose={this.handleClose}
        closeIcon
      >
        <div id="verify">
          {this.ifMobileRedirect()}
          
          <Spinner show={this.state.isRunningTransaction}/>
          <div class="ui verifyContainer">
            <Grid verticalAlign='middle' textAlign='center'>
              <Grid.Column>
                <div class="progressbar">
                  <img class="image inline" src={logo2} style={{width: '230px', marginLeft: '-38px', paddingTop: '25px', paddingBottom: '9px' }}/>
                  <Grid.Row >
                    <Divider style={{ marginRight: '38px', paddingTop: '9px' }}/>
                    <img class="progressbar image inline" src={box} />
                    <p class="progressbar"> Connect Wallet </p>
                  </Grid.Row>  
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <p style={{opacity: '0.5'}} class="progressbar"> User Info, Verify Age </p>
                  </Grid.Row>
                  <Grid.Row style={{marginTop: '15px'}}>
                    <img style={{opacity: '0.5'}} class="progressbar image inline" src={box} />
                    <p style={{opacity: '0.5'}} class="progressbar"> Verify Location </p>
                  </Grid.Row>
                </div>
                <div class="contentContainer">
                  <Grid>
                    <Grid.Row>
                      <h3 style={{textAlign: 'left', marginTop: '25px' }}> Create Account </h3>
                    </Grid.Row>
                    <Grid.Row>
                      <p style={{ textAlign: 'left', float: 'left', fontSize: '20px'}}>1. Connect your Metamask or Ledger wallet.
                      </p>
                    </Grid.Row>
                    <Grid.Row>
                      <Container style={{textAlign: 'left', marginLeft: '50px', marginTop: '10px', width: '800px'}}>
                        <Link to='#' onClick={this.onMetamask}>
                          <Image src={metamask} inline rounded bordered style={{width: '110px'}}/>
                        </Link>
                        <Link to='#' >
                          <Image src={ledger} inline rounded bordered style={{marginLeft: '10px', width: '110px'}} />
                        </Link>

                        { this.state.isValidMetamask == 1 ?
                          <p style={{ textAlign: 'center', color: 'red', marginTop: '10px'}}>
                            Add address failed.
                          </p> : <p/>
                        }
                      </Container>
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
}

export default ModalVerify