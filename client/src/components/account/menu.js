import React from 'react'
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Menu, Icon, Divider } from 'semantic-ui-react';
import '../additional.css';
import logo from '../Images/authorize_title.png'
import { MdPlayCircleOutline } from "react-icons/md";
import { FaEthereum } from "react-icons/fa";
import { MdHistory } from "react-icons/md";
import { MdPlaylistAddCheck } from "react-icons/md";
import { MdBookmarkBorder } from "react-icons/md";
import { MdInfoOutline } from "react-icons/md";
import Svgeth from '../Images/svg6.js'


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

  render() {
    return (
      <Menu className="menuContainer" icon='labeled' vertical>
        <a href="/">
          <img class="image inline" src={logo} style={{width: '42px', paddingTop: '30px', paddingBottom: '35px'}}/>
        </a>
        <Menu.Item onClick={() => this.onMenuClick(0)} exact href='#' className='account-p' style={{color:'grey'}}>
          <span> <MdPlayCircleOutline style={{ fontSize: '30px', paddingBottom: '6px' }}/></span><br />
          Play Now
        </Menu.Item>
        <Menu.Item onClick={() => this.onMenuClick(4)} exact href='#' className='account-p' style={{color:'grey'}}>
          <span> <Svgeth  style={{ paddingBottom: '9px' }}/></span><br />
          NFTs
        </Menu.Item>
        <Menu.Item onClick={() => this.onMenuClick(1)} exact href='#' className='account-p' style={{color:'grey'}}>
          <span> <MdHistory style={{ fontSize: '30px', paddingBottom: '6px' }}/></span><br />
          TX History
        </Menu.Item>
        <Menu.Item onClick={() => this.onMenuClick(3)} exact href='#' className='account-p' style={{color:'grey'}}>
          <span> <MdPlaylistAddCheck style={{ fontSize: '30px', paddingBottom: '6px' }}/></span><br />
          Authorize
        </Menu.Item>
        <Menu.Item className="account-p" href="/blog/" style={{ color: 'grey' }}>
          <span> <MdBookmarkBorder style={{ fontSize: '30px', paddingBottom: '6px' }}/></span><br />
          Blog
        </Menu.Item>
        <Menu.Item className="account-p" href="/disclaimer/" style={{ color: 'grey' }}>
          <span> <MdInfoOutline style={{ fontSize: '30px', paddingBottom: '6px' }}/></span><br />
          Disclaimer
        </Menu.Item>
      </Menu>
    )
  }
}

export default withRouter(SideMenu);