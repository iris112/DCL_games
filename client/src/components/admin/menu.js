import React from 'react'
import { Link } from 'react-router-dom';
import logo from '../Images/logo.png'
import { Menu, Icon} from 'semantic-ui-react';
import '../additional.css';

const INITIAL_STATE = {
  selectedMenu: 0,
};

class SideMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onMenuClick = (index) => {
    if (index >= 4)
      return;

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

    return (
      <Menu.Item onClick={() => this.onMenuClick(index)} exact href='#'>
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
            {this.getContent('Admin Portal', 0, 'user secret')}
          </p>
          <p className='account-p'>
            {this.getContent('Machines', 1, 'hdd')}
          </p>
          <p className='account-p'>
            {this.getContent('Transaction History', 2, 'history')}
          </p>
          <p className='account-p'>
            {this.getContent('Deposits/Withdrawals', 3, 'dollar')}
          </p>
        </div>
        <p className='account-p' style={{paddingTop: '25px', paddingBottom: '25px'}}>
          {this.getContent('Sign out', 4, 'sign out')}
        </p>
      </div>
    )
  }
}

export default SideMenu;