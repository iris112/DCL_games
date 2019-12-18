import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { BrowserView } from "react-device-detect"
import { Divider, Icon, Menu, Segment, Sidebar, Image } from 'semantic-ui-react'
import Navbar from './Navbar'
import Global from './constant';
import './additional.css'

const INITIAL_STATE = {
  visible: false,
  existAccount: 0,
};

class SidebarExampleDimmed extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  async componentDidMount() {
    try {
      // if (window.web3.currentProvider.selectedAddress === '') {
      //   window.web3 = new window.Web3(window.ethereum);
      //   await window.ethereum.enable();
      // }

      for (var i = 0; i < 3; i++) {
        if (window.web3.currentProvider.selectedAddress === '' || window.web3.currentProvider.selectedAddress === undefined) {
          await Global.delay(2000);
          continue;
        }

        let ret = await this.checkUserVerifyStep();
        if (ret) {
          return;
        }

        await Global.delay(2000);
      }

    } catch (e) {
      console.log(e);
    }

    this.setState({ existAccount: 0 });
  }

  checkUserVerifyStep = async () => {
    try {
      const response = await this.getUserVerify();
      const json = await response.json();
      if (json.status === 'ok') {
        if (json.result === 'false') {
          this.setState({ existAccount: 0 });
          return true;
        }

        let stepValue = parseInt(json.result);
        if (stepValue > 3)
          this.setState({ existAccount: 1 });
        else
          this.setState({ existAccount: 0 });

        return true;
      }
    } catch (error) {
      console.log(error);
    }

    return false;
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

  render() {
    return (
      <Sidebar.Pushable as={Segment}>
        <Navbar
          visible={this.state.visible}
          handleClickButton={() => this.setState({ visible: !this.state.visible })}
        />
        <Sidebar
          direction='right'
          as={Menu}
          animation='overlay'
          onHidden={() => this.setState({ visible: false })}
          onHide={() => this.setState({ visible: false })}
          vertical
          visible={this.state.visible}
          width='wide'
        >

          <div className="close-area">
            <div onClick={() => this.setState({ visible: !this.state.visible })}>
            </div>
          </div>

          <Menu.Item
            onClick={() => this.setState({ visible: false })}
            as={NavLink}
            exact
            to='/'
            style={{ fontSize: '1.3em' }}
          >
            <Icon.Group
              size='medium'
              style={{ marginRight: '0.5em' }}
            >
              <Icon name='home' />
            </Icon.Group>
            Home
          </Menu.Item>

          <Menu.Item
            onClick={() => this.setState({ visible: false })}
            as={NavLink}
            exact
            to='/about/'
            style={{ fontSize: '1.3em' }}
          >
            <Icon.Group
              size='medium'
              style={{ marginRight: '0.79em' }}
            >
              <Icon name='book' />
              <Icon
                corner
                name='info circle'
              />
            </Icon.Group>
            About Us
          </Menu.Item>

          {this.state.existAccount == 1 ?
            <BrowserView>
              <Menu.Item
                onClick={() => this.setState({ visible: false })}
                as={NavLink}
                exact
                to='/account/'
                style={{ fontSize: '1.3em' }}
              >
                <Icon.Group
                  size='medium'
                  style={{ marginRight: '0.69em' }}
                >
                  <Icon name='id card outline' />
                </Icon.Group>
                My Account
              </Menu.Item>
            </BrowserView>
            :
            <BrowserView>
              <Menu.Item
                onClick={() => this.setState({ visible: false })}
                as={NavLink}
                exact
                to='/verify/'
                style={{ fontSize: '1.3em' }}
              >
                <Icon.Group
                  size='medium'
                  style={{ marginRight: '0.7em' }}
                >
                  <Icon name='id card outline' />
                </Icon.Group>
                Create Account
              </Menu.Item>
            </BrowserView>}

          {this.state.existAccount == 0 ?
            <BrowserView>
              <Menu.Item
                onClick={() => this.setState({ visible: false })}
                as={NavLink}
                exact
                to='/login/'
                style={{ fontSize: '1.3em' }}
              >
                <Icon.Group
                  size='medium'
                  style={{ marginRight: '0.69em' }}
                >
                  <Icon name='check' />
                </Icon.Group>
                Login
              </Menu.Item>
            </BrowserView>
            : <div></div>}

          <Menu.Item
            onClick={() => this.setState({ visible: false })}
            as={NavLink}
            exact
            to='/blog/'
            style={{ fontSize: '1.3em' }}
          >
            <Icon.Group
              size='medium'
              style={{ marginRight: '0.53em' }}
            >
              <Icon name='comments outline' />
            </Icon.Group>
            Blog
          </Menu.Item>

          <Menu.Item
            onClick={() => this.setState({ visible: false })}
            as={NavLink}
            exact
            to='/chateau/'
            style={{ fontSize: '1.3em' }}
          >
            <Icon.Group
              size='medium'
              style={{ marginRight: '0.43em' }}
            >
              <Icon name='gamepad' />
            </Icon.Group>
            Chateau Satoshi
          </Menu.Item>

          <Menu.Item
            onClick={() => this.setState({ visible: false })}
            as={NavLink}
            exact
            to='/serenity/'
            style={{ fontSize: '1.3em' }}
          >
            <Icon.Group
              size='medium'
              style={{ marginRight: '0.43em' }}
            >
              <Icon name='gamepad' />
            </Icon.Group>
            Serenity Island
          </Menu.Item>

          <Menu.Item
            onClick={() => this.setState({ visible: false })}
            as={NavLink}
            exact
            to='/disclaimer/'
            style={{ fontSize: '1.3em' }}
          >
            <Icon.Group
              size='medium'
              style={{ marginRight: '0.69em' }}
            >
              <Icon name='info circle' />
            </Icon.Group>
            Disclaimer
          </Menu.Item>

          <Divider />

          <Menu.Item
            onClick={() => this.setState({ visible: false })}
            href="https://github.com/decentralgames"
            style={{ fontSize: '1.3em', color: 'rgba(0, 0, 0, 0.4)' }}
            id="sidebar-menu"
          >
            <Icon.Group
              size='medium'
              style={{ marginRight: '0.7em', color: 'rgba(0, 0, 0, 0.4)' }}
            >
              <Icon name='github' />
            </Icon.Group>
            Github
          </Menu.Item>

          <Menu.Item
            onClick={() => this.setState({ visible: false })}
            href="https://facebook.com/decentralgames"
            style={{ fontSize: '1.3em', color: 'rgba(0, 0, 0, 0.4)' }}
          >
            <Icon.Group
              size='medium'
              style={{ marginRight: '0.8em' }}
            >
              <Icon name='facebook' />
            </Icon.Group>
            Facebook
          </Menu.Item>

          <Menu.Item
            onClick={() => this.setState({ visible: false })}
            href="https://twitter.com/decentralgames"
            style={{ fontSize: '1.3em', color: 'rgba(0, 0, 0, 0.4)' }}
          >
            <Icon.Group
              size='medium'
              style={{ marginRight: '0.7em', color: 'rgba(0, 0, 0, 0.4)' }}
            >
              <Icon name='twitter' />
            </Icon.Group>
            Twitter
          </Menu.Item>

          <Menu.Item
            onClick={() => this.setState({ visible: false })}
            href="https://discord.gg/Bu5HGhh"
            style={{ fontSize: '1.3em', color: 'rgba(0, 0, 0, 0.4)' }}
          >
            <Icon.Group
              size='medium'
              style={{ marginRight: '0.75em' }}
            >
              <Icon name='discord' />
            </Icon.Group>
            Discord
          </Menu.Item>

          <Menu.Item
            onClick={() => this.setState({ visible: false })}
            href="https://t.me/decentralgames"
            style={{ fontSize: '1.3em', color: 'rgba(0, 0, 0, 0.4)' }}
          >
            <Icon.Group
              size='medium'
              style={{ marginRight: '0.74em' }}
            >
              <Icon name='send' />
            </Icon.Group>
            Telegram
          </Menu.Item>

          <Menu.Item
            onClick={() => this.setState({ visible: false })}
            href="mailto:hello@decentral.games"
            style={{ fontSize: '1.3em', color: 'rgba(0, 0, 0, 0.4)' }}
          >
            <Icon.Group
              size='medium'
              style={{ marginRight: '0.65em', color: 'rgba(0, 0, 0, 0.4)' }}
            >
              <Icon name='mail' />
            </Icon.Group>
            Contact
          </Menu.Item>

        </Sidebar>

      </Sidebar.Pushable>
    )
  }
}

export default SidebarExampleDimmed



