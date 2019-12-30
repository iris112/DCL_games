import React from 'react'
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Menu, Icon} from 'semantic-ui-react';
import '../additional.css';
import logo from '../Images/logo.png'

const INITIAL_STATE = {
  selectedMenu: 0,
};

class SideMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  async componentDidMount() {
    var index = parseInt(localStorage.getItem('selectedMenu') || 0)
    this.setState({ selectedMenu: index });
    this.props.onMenuSelected(index);
  }

  onMenuClick = (index) => {
    if (index >= 5 && index <= 9)
      return;
    localStorage.setItem('selectedMenu', index);
    this.setState({selectedMenu: index});
    this.props.onMenuSelected(index);
  }

  getContent = (title, index, icon) => {
    if (this.state.selectedMenu == index) {
      return (
        <Menu.Item onClick={() => this.onMenuClick(index)} exact href='#' style={{color:'black'}}>
          <Icon.Group
            size='medium'
            style={{ marginRight: '0.5em', width: '20px', textAlign: 'center' }}
          >
            <Icon name={icon}  />
          </Icon.Group>
          {title}
        </Menu.Item>
      )
    }

    let url = '#';
    if (index == 5)
      url = '/blog/';
    else if (index == 6)
      url = 'https://decentral.games/discord/';
    else if (index == 7)
      url = 'mailto:hello@decentral.games';
    else if (index == 8)
      url = 'https://twitter.com/decentralgames';
    else if (index == 9)
      url = '/disclaimer/';

    return (
      <Menu.Item onClick={() => this.onMenuClick(index)} exact href={url}>
        <Icon.Group
          size='medium'
          style={{ marginRight: '0.5em', width: '20px', textAlign: 'center' }}
        >
          <Icon name={icon} />
        </Icon.Group>
        {title}
      </Menu.Item>
    )
  }

  render() {
    return (
      <div class="menuContainer">
        <a href="https://decentral.games">
          <img class="image inline" src={logo} style={{width: '230px', paddingTop: '42px', paddingBottom: '35px'}}/>
        </a>
        <div style={{borderBottom: '1px solid lightgray', paddingBottom: '25px', paddingTop: '25px', borderTop: '1px solid lightgray'}}>
          <p className='account-p'>
            {this.getContent('Play Now', 0, 'play')}
          </p>
          <p className='account-p'>
            {this.getContent('NFTs', 4, 'gamepad')}
          </p>
          <p className='account-p'>
            {this.getContent('Transaction History', 1, 'history')}
          </p>
          <p className='account-p'>
            {this.getContent('Deposits/Withdrawals', 2, 'dollar')}
          </p>
          <p className='account-p' >
            {this.getContent('Authorizations', 3, 'check')}
          </p>
        </div>
        <div style={{paddingTop: '25px', paddingBottom: '25px', borderBottom: '1px solid lightgray'}}>
          <p className='account-p' > 
            {this.getContent('Blog', 5, 'book')}
          </p>
          <p className='account-p' >
            {this.getContent('Discord', 6, 'discord')}
          </p>
          <p className='account-p' >
            {this.getContent('Twitter', 8, 'twitter')}
          </p>
          <p className='account-p' >
            {this.getContent('Contact', 7, 'mail')}
          </p>
          <p className='account-p' >
            {this.getContent('Disclaimer', 9, 'exclamation circle')}
          </p>
        </div>

        <p style={{paddingTop: '25px', paddingBottom: '25px'}}>
          {this.getContent('Sign out', 10, 'sign out')}
        </p>
      </div>
    )
  }
}

export default withRouter(SideMenu);