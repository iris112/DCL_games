import React, { useContext, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { withRouter } from "react-router";
import { GlobalContext } from "../store";
import _ from "lodash";
import logo from "./Images/logo.png";
import { Icon, Image, Menu, Search, Container, Segment, Breadcrumb } from "semantic-ui-react";
import { Navbar, Center } from "decentraland-ui";
import banner from "./assets/images/banner.png";

const ButtonAppBar = ({ handleClickButton, match, history }) => {

  return (
      <Container style={{ marginTop: '-2em', paddingBottom: '0px' }} className="outter-blog-container">
        <Container style={{ marginBottom: '60px' }}>
        <Menu
          borderless
          style={{ border: 'none', boxShadow: 'none' }}
          >
            <Menu.Item header as={NavLink} to="/" style={{ marginLeft: '-15px' }}>
              <Image src={logo} style={{ width: '260px', marginTop: '1em' }} />
            </Menu.Item>

            <Menu.Item position='right' header as={NavLink} to="/" style={{ marginRight: '-15px' }}>
              <Breadcrumb style={{ borderRadius: '4px', color: 'rgb(97, 97, 97)' }}> Go to Decentral Games <Icon style={{ fontSize: '10px', color: 'rgb(97, 97, 97)' }} name="arrow right" /> </Breadcrumb>
            </Menu.Item>

          </Menu>
        </Container>
      </Container>
  );
};

export default withRouter(ButtonAppBar);