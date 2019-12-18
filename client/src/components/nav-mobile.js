import React, { useContext, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { withRouter } from "react-router";
import { GlobalContext } from "../store";
import _ from "lodash";
import logo from "./Images/footer-logo.png";
import "./additional.css";
import { Icon, Image, Menu, Search, Container, Segment, Grid, Popup } from "semantic-ui-react";
import { Navbar, Center, Button } from "decentraland-ui";
import banner from "./assets/images/banner.png";


const ButtonAppBar = ({ handleClickButton, match, history }) => {
  
  return (
    <Segment className='nav-mobile' style={{ marginTop: '0em', paddingTop: '0em', marginBottom: '0em', paddingBottom: '0em' }}>

      <div className='navbar2'>
        <Menu
          className='black-menu'
          borderless
          style={{ boxShadow: 'none' }}
        >
          <Container style={{ paddingLeft: '14px', paddingRight: '6px' }}>
            <Menu.Item header id='nav3-logo' as={NavLink} to="/" style={{ marginTop: '11px', marginBottom: '6px' }}>
              <Image src={logo} id='nav3-logo' style={{ width: '36px' }} />
            </Menu.Item>

            <Menu.Menu className='nav-buttons' position='right' style={{ paddingRight: '6px' }}>
              <Menu.Item className='nav-text2' as='a' href='/blog/'>BLOG</Menu.Item>
              <Menu.Item className='nav-text' as='a' href='/disclaimer/'>DISCLAIMER</Menu.Item>
              <Popup
                trigger={<Menu.Item className='nav-text'>DOCS</Menu.Item>}
                className='modal-pop'
                content='Coming Soon'
                position='bottom center'
              />
              <Popup
                trigger={<Menu.Item className='nav-text'>VR</Menu.Item>}
                className='modal-pop2'
                content='Coming Soon'
                position='bottom center'
              />
            </Menu.Menu>
          </Container>
        </Menu>

      </div>
    </Segment>
  );
};

export default withRouter(ButtonAppBar);