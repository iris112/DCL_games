import React from 'react'
import { Link, Redirect, withRouter } from 'react-router-dom';
import { isMobile } from "react-device-detect";
import '../additional.css';
import { Header } from 'decentraland-ui'
import { Container, Grid, Image } from 'semantic-ui-react'
import Menu from './menu'
import Machine from './machine'
import History from './history'
import Deposit from './deposit'
import Dashboard from './dashboard'
import Spinner from '../../Spinner'
import AdminCheck from './adminCheck'

import Global from '../constant';

const INITIAL_STATE = {
  selectedMenu: 0,
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
  }

  selectedMenu = async (index) => {
    this.setState({selectedMenu: index});
  }

  getContent = () => {
    if (this.state.selectedMenu == 1)
      return (<Machine />);
    if (this.state.selectedMenu == 2)
      return (<History />);
    if (this.state.selectedMenu == 3)
      return (<Deposit />);
    if (this.state.selectedMenu == 0)
      return (<Dashboard />);
  }

  ifMobileRedirect = () => {
    if (isMobile) {
      return <Redirect to='/' />
    }
  }

  render() {
    if (!this.isBrowserMetamsk) {
      return (
        <div id="admin" class="ui accountContainer">
          <Container style={{ marginTop: '25.5em', height: '35em' }}>
            <Grid verticalAlign='middle' textAlign='center'>
              <Header> This page is only available when you have installed metamask on browser. </Header>
            </Grid>
          </Container>
        </div>
      )
    }

    return (
      <div id="admin">
        {this.ifMobileRedirect()}
        <Spinner show={this.state.isRunningTransaction}/>
        <div class="ui accountContainer">
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

export default withRouter(AdminCheck(Admin));