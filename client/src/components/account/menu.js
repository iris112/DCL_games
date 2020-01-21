import React from 'react'
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Menu, Icon} from 'semantic-ui-react';
import '../additional.css';
import logo from '../Images/authorize_title.png'

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
        <Menu.Item onClick={() => this.onMenuClick(index)} exact href='#' className='account-p' style={{color:'white'}}>
          <Icon name={icon} />
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
      <Menu.Item onClick={() => this.onMenuClick(index)} exact href='#' className='account-p' style={{color:'gray'}}>
        <Icon name={icon} />
        {title}
      </Menu.Item>
    )
  }

  render() {
    return (
      <Menu className="menuContainer" icon='labeled' vertical>
        <a href="https://decentral.games">
          <img class="image inline" src={logo} style={{width: '50px', paddingTop: '30px', paddingBottom: '35px'}}/>
        </a>
       {this.getContent('Play Now', 0, 'play')}
       {this.getContent('NFTs', 4, 'gamepad')}
       {this.getContent('Tx History', 1, 'dollar')}
       {this.getContent('Authorizations', 3, 'check')}
      </Menu>
    )
  }
}

export default withRouter(SideMenu);