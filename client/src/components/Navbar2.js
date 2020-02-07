import React, { Component, useContext, useState, useEffect } from "react";
import { NavLink, Link, Redirect, withRouter } from "react-router-dom";
import { isMobile } from "react-device-detect";
import { GlobalContext } from "../store";
import ModalVerify from './Modal.js'
import _ from "lodash";
import logo from "./Images/footer-logo.png";
import logo2 from './Images/logo.png'
import "./additional.css";
import { Icon, Image, Menu, Search, Container, Segment, Modal, Header, Grid, Input, Dropdown, Breadcrumb, Divider, Message, Popup } from "semantic-ui-react";
import { Navbar, Center, Button } from "decentraland-ui";
import metamask from './Images/metamask.png'
import ledger from './Images/ledger.png'
import Global from './constant';
import Spinner from '../Spinner'
import LogoSpinner from '../LogoSpinner'
import box from './Images/box.png'
import check from './Images/check.png'


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
  isFistLoading: false,
  existAccount: 0,
  visible: true,
};

class Navbar2 extends Component {

  state = { modalOpen: false}
  handleDismiss = () => this.setState({ visible: false })
  handleOpen = () => this.setState({ modalOpen: true })
  handleClose = () => this.setState({ modalOpen: false })
  showSpinner = () => this.setState({isRunningTransaction: true})
  hideSpinner = () => this.setState({isRunningTransaction: false})
  showLoading = () => this.setState({isFistLoading: true})
  hideLoading = () => this.setState({isFistLoading: false})

  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    this.isBrowserMetamsk = 0;

    if (window.web3) {
      USER_ADDRESS = window.web3.currentProvider.selectedAddress;
      this.isBrowserMetamsk = 1;
    }
  }

  render() {


    { /* ----------------------------------------------------------- */ }
    { /*                         NOT METAMASK                        */ }
    { /* ----------------------------------------------------------- */ }

    if (!this.isBrowserMetamsk && this.state.visible) {
      return (
        <Segment className='nav-desktop' style={{ marginTop: '0em', paddingTop: '0em', marginBottom: '0em', paddingBottom: '0em' }}>

          <div className='navbar2'>

            <Menu
              className='black-menu'
              borderless
              style={{ boxShadow: 'none', marginBottom: '-1px', marginTop: '0px', borderWidth: '0px' }}
            >
              <Container>
                <Menu.Item header id='nav2-logo' as={NavLink} to="/" style={{ marginTop: '9px', marginBottom: '0px' }} >
                  <Image src={logo} id='nav2-logo' style={{ width: '36px' }} />
                </Menu.Item>
                  <Menu.Item className='nav-text2' href="/blog/">BLOG</Menu.Item>
                  <Menu.Item className='nav-text' as={NavLink} to='/disclaimer/'>DISCLAIMER</Menu.Item>
                  <Popup
                    trigger={<Menu.Item className='nav-text'>DOCS</Menu.Item>}
                    className='modal-pop'
                    content='Coming Soon'
                    position='bottom center'
                  />
                  <Popup
                    trigger={<Menu.Item className='nav-text'>VR</Menu.Item>}
                    className='modal-pop'
                    content='Coming Soon'
                    position='bottom center'
                  />

                  { /* ----------------------------------------------------------- */ }
                  { /*                     MODAL NOT METAMASK                      */ }
                  { /* ----------------------------------------------------------- */ }

                <Menu.Menu className='nav-buttons' position='right' style={{ paddingRight: '6px', paddingTop: '6px' }}>
                  <Menu.Item className='nav-text3' as={NavLink} to='/discord'>JOIN OUR DISCORD</Menu.Item> 
                  <Modal
                    trigger={<Button content='Play Now' className='home-play animate2' onClick={this.handleOpen} />}
                    open={this.state.modalOpen}
                    onClose={this.handleClose}
                    closeIcon
                  >
                  <h3 className="account-h3" style={{textAlign: 'left', marginTop: '25px', paddingLeft: '30px' }}> Create Account </h3>
                    <Modal.Content>
                      <Header>Please use a desktop Chrome browser to play our free games. To play games with cryptocurrency, you must enable Metamask. You can download Chrome <a className='blue-link2' href="https://www.google.com/chrome/">here</a> and Metamask <a className='blue-link2' href="https://metamask.io/">here</a>.</Header>
                    </Modal.Content>
                    <Modal.Actions style={{ marginTop: '30px' }}>
                      <Button id='depositButton' onClick={this.handleClose}>
                        OK
                      </Button>
                    </Modal.Actions>
                  </Modal>

                </Menu.Menu>
              </Container>
            </Menu>

          </div>
        </Segment>
      )
    }

    return (
      <Segment className='nav-desktop' style={{ marginTop: '0em', paddingTop: '0em', marginBottom: '0em', paddingBottom: '0px' }}>

        <div className='navbar2'>
          <Spinner show={this.state.isFistLoading}/>
          <LogoSpinner show={this.state.isRunningTransaction}/>
          <Menu
            className='black-menu'
            borderless
            style={{ boxShadow: 'none', marginBottom: '-1px', paddingBottom: '6px' }}
          >
            <Container>
              <Menu.Item header id='nav2-logo' as={NavLink} to="/" style={{ marginTop: '9px', marginBottom: '0px' }} >
                <Image src={logo} id='nav2-logo' style={{ width: '36px' }} />
              </Menu.Item>
                <Menu.Item className='nav-text2' href="/blog/">BLOG</Menu.Item>
                <Menu.Item className='nav-text' as={NavLink} to='/disclaimer/'>DISCLAIMER</Menu.Item>
                <Popup
                  trigger={<Menu.Item className='nav-text'>DOCS</Menu.Item>}
                  className='modal-pop'
                  content='Coming Soon'
                  position='bottom center'
                />
                <Popup
                  trigger={<Menu.Item className='nav-text'>VR</Menu.Item>}
                  className='modal-pop'
                  content='Coming Soon'
                  position='bottom center'
                />

              <Menu.Menu className='nav-buttons' position='right' style={{ paddingRight: '6px', paddingTop: '6px' }}>
                <Menu.Item className='nav-text3' as={NavLink} to='/discord'>JOIN OUR DISCORD</Menu.Item> 
                <ModalVerify showSpinner={this.showSpinner} hideSpinner={this.hideSpinner}
                  showLoading={this.showLoading} hideLoading={this.hideLoading}/>

              </Menu.Menu>
            </Container>
          </Menu>

        </div>
      </Segment>

    )
  }
}

export default withRouter(Navbar2);