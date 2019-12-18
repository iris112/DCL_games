import React from 'react'
import { Link, Redirect, withRouter } from 'react-router-dom';
import { isMobile } from "react-device-detect";
import '../additional.css';
import { Header } from 'decentraland-ui'
import { Container, Grid, Image } from 'semantic-ui-react'
import metamask from '../Images/metamask.png';
import ledger from '../Images/ledger.png';
import Menu from './menu'
import Machine from './machine'
import History from './history'
import Deposit from './deposit'
import Spinner from '../../Spinner'

import Global from '../constant';

const INITIAL_STATE = {
  selectedMenu: 0,
  isAdmin: 0,
  isRunningTransaction: false,
};

class Admin extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    this.isBrowserMetamsk = 0;

    if (window.web3) {
      this.isBrowserMetamsk = 1;
    }
  }

  async componentDidMount() {
    try {
      if (window.web3.currentProvider.selectedAddress === '' || window.web3.currentProvider.selectedAddress === undefined) {
        this.setState({isAdmin : 0});
      } else if (window.web3.currentProvider.selectedAddress.toLowerCase() === Global.ADMIN_ADDR1 || 
        window.web3.currentProvider.selectedAddress.toLowerCase() === Global.ADMIN_ADDR2) {
        this.setState({isAdmin : 2});
      } else {
        this.setState({isAdmin : 1});
      }
    } catch(e) {
      console.log(e);
      this.setState({isAdmin : 0});
    }
  }

  getAdminData = () => {
    return fetch(`${Global.BASE_URL}/order/authState`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: '',
      })
    })
  }

  selectedMenu = async (index) => {
    this.setState({selectedMenu: index});
  }

  getContent = () => {
    if (this.state.selectedMenu == 0)
      return (<Machine />);
    if (this.state.selectedMenu == 1)
      return (<History />);
    if (this.state.selectedMenu == 2)
      return (<Deposit />);
  }

  ifMobileRedirect = () => {
    if (isMobile) {
      return <Redirect to='/' />
    }
  }

  onMetamask = async (e, d) => {
    if (window.ethereum) {
      window.web3 = new window.Web3(window.ethereum);
      try {
          // Request account access if needed
          await window.ethereum.enable();
          if (window.web3.currentProvider.selectedAddress.toLowerCase() === Global.ADMIN_ADDR1 || 
            window.web3.currentProvider.selectedAddress.toLowerCase() === Global.ADMIN_ADDR2) {
            this.setState({isAdmin : 2});
          } else {
            this.setState({isAdmin : 1});
          }
      } catch (error) {
          // User denied account access...
          console.log(error);
      }
    }
  };

  render() {
    if (!this.isBrowserMetamsk) {
      return (
        <div id="admin">
          <Container style={{ marginTop: '25.5em', height: '35em' }}>
            <Grid verticalAlign='middle' textAlign='center'>
              <Header> This page is only available when you have installed metamask on browser. </Header>
            </Grid>
          </Container>
        </div>
      )
    }

    if (this.state.isAdmin == 0) {
      return (
        <div id="admin" class="ui accountContainer">
          <Header as='h3' style={{ padding: '0em 0em 0em', marginTop: '5.5em', textAlign: 'center', lineHeight: '1.6em', fontSize: '2.7em', color: 'black' }}>
            Login
          </Header>
          <Spinner show={this.state.isRunningTransaction}/>
          <div class="ui verifyContainer">
            <p style={{ textAlign: 'center', fontSize: '1.33em', marginLeft: '40px', marginRight: '50px' }}>
              Login with your Metamask or Ledger wallet.
            </p>
            <Grid verticalAlign='middle' textAlign='center'>
              <Grid.Column>
                <Link to='#' onClick={this.onMetamask}>
                  <Image src={metamask} size='small' inline rounded bordered />
                </Link>
                <Link to='#' >
                  <Image src={ledger} size='small' inline rounded bordered style={{marginLeft: '10px'}} />
                </Link>

                { this.state.isValidMetamask == 1 ?
                  <p style={{ textAlign: 'center', color: 'red', marginTop: '10px'}}>
                    Add address failed.
                  </p> : <p/>
                }
              </Grid.Column>
            </Grid>
          </div>
        </div>
      )
    } else if (this.state.isAdmin == 1) {
      return (
        <div id="admin">
          <Container style={{ marginTop: '25.5em', height: '35em' }}>
            <Grid verticalAlign='middle' textAlign='center'>
              <Header> This page is only available to the administrator. </Header>
            </Grid>
          </Container>
        </div>
      )
    }

    return (
      <div id="admin" style={{ marginBottom: '5em' }}>
        {this.ifMobileRedirect()}
        <Header as='h3' style={{ padding: '0em 0em 0em', marginTop: '14px', textAlign: 'center', lineHeight: '1.6em', color: 'black' }}>
          Admin Portal
        </Header>
        <Spinner show={this.state.isRunningTransaction}/>
        <div class="ui accountContainer" style={{ marginTop: '3em' }}>
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

export default withRouter(Admin);