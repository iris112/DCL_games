import React from 'react'
import { Redirect, withRouter } from 'react-router-dom';
import { isMobile } from "react-device-detect";
import '../additional.css';
import { Header } from 'decentraland-ui'
import { Container, Grid } from 'semantic-ui-react'
import Menu from './menu'
import Dashboard from './dashboard'
import History from './history'
import Authorize from './authorize'
import Deposit from './deposit'
import Coin from './coin'
import Spinner from '../../Spinner'

import Global from '../constant';

const INITIAL_STATE = {
  isValid: 0,
  isAuthorized: 0,
  selectedMenu: 0,
  isRunningTransaction: false,
};

class Account extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    this.isBrowserMetamsk = 0;

    if (window.web3) {
      this.isBrowserMetamsk = 1;
    }
  }

  async componentDidMount() {
    let object = this;
    window.ethereum.on('accountsChanged', async function (accounts) {
      await object.getUserState();
    })

    try {
      if (!window.web3.currentProvider.selectedAddress) {
        window.web3 = new window.Web3(window.ethereum);
        await window.ethereum.enable();
      }

      let ret = await this.getUserState();
      if (ret)
        return;

    } catch(e) {
      console.log(e);
    }
    
    this.setState({isValid : 0});
  }

  async getUserState() {
    for (var i = 0; i < 3; i++) {
      if (!window.web3.currentProvider.selectedAddress) {
        await Global.delay(2000);
        continue;
      }

      let ret = await this.checkUserVerifyStep();
      if (ret) {
        return true;
      }

      await Global.delay(2000);
    }

    return false;
  }

  update = () => {
    this.checkUserVerifyStep();
  }

  getUserVerify = () => {
    return fetch(`${Global.BASE_URL}/order/verifyAddress`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: window.web3.currentProvider.selectedAddress,
      })
    })
  }

  getUserAuthState = () => {
    return fetch(`${Global.BASE_URL}/order/authState`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: window.web3.currentProvider.selectedAddress,
      })
    })
  }

  checkUserVerifyStep = async () => {
    try {
      let response = await this.getUserVerify();
      let json = await response.json();
      if (json.status === 'ok') {
        if (json.result === 'false') {
          this.setState({isValid: 1});
          return true;
        }

        let stepValue = parseInt(json.result);
        if (stepValue > 3) {
          response = await  this.getUserAuthState();
          json = await response.json();
          let authorized = 0;
          if (json.status === 'ok' && json.result !== 'false')
            authorized = parseInt(json.result);

          this.setState({isValid: 2, isAuthorized: authorized});
        }
        else
          this.setState({isValid: 1});

        return true;
      }
    } catch (error) {
      console.log(error);
    }
    return false;
  }

  selectedMenu = async (index) => {
    this.setState({selectedMenu: index});
  }

  getContent = () => {
    if (this.state.selectedMenu == 1)
      return (<History />);
    if (this.state.selectedMenu == 2)
      return (<Deposit />);
    if (this.state.selectedMenu == 3)
      return (<Authorize authorized={this.state.isAuthorized} update={this.update} />);
    if (this.state.selectedMenu == 4)
      return (<Coin />);        

    return (<Dashboard />);
  }

  ifMobileRedirect = () => {
    if (isMobile) {
      return <Redirect to='/' />
    }
  }

  render() {
    if (this.state.isValid == 0) {
      return (
        <div id="account" class="ui accountContainer">
          <Container style={{ marginTop: '25.5em', height: '35em' }}>
            <Spinner show={1}/>
          </Container>
        </div>
      )
    }

    if (this.state.isValid == 1) {
      return (
        <div id="account" class="ui accountContainer">
          <Container style={{ marginTop: '25.5em', height: '35em' }}>
            <Grid verticalAlign='middle' textAlign='center'>
              <Header> Please finish verification to view My Account. </Header>
            </Grid>
          </Container>
        </div>
      )
    }

    if (!this.isBrowserMetamsk) {
      return (
        <div id="account">
          <Container style={{ marginTop: '5.5em' }}>
            <Grid verticalAlign='middle' textAlign='center'>
              <Header> This page is only available when you have installed metamask on browser. </Header>
            </Grid>
          </Container>
        </div>
      )
    }

    return (
      <div id="account">
        {this.ifMobileRedirect()}
        <Spinner show={this.state.isRunningTransaction}/>
        <div class="ui accountContainer" style={{}}>
          <Grid verticalAlign='middle'>
            <Grid.Column>
              <Menu onMenuSelected={this.selectedMenu}/>
              {this.getContent()}
            </Grid.Column>
          </Grid>
        </div>
      </div>
    )
  }
}

export default withRouter(Account);