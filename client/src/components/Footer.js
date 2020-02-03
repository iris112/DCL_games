import React from 'react'
import { NavLink } from "react-router-dom";
import { Button, Navbar } from "decentraland-ui";
import logo from './Images/footer-logo.png'
import { Divider, Grid, List, Menu, Icon, Segment, Container, Header, Image, Input, Visible } from "semantic-ui-react";
import Svg1 from './Images/svg1.js'
import Svg2 from './Images/svg2.js'
import Svg3 from './Images/svg3.js'
import Svg4 from './Images/svg4.js'
import { FaDiscord } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaTelegramPlane } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { MdEmail } from "react-icons/md";


const Footer = () => (
    <Segment vertical style={{ backgroundColor: '#060a0d' }}>
      <Container>
        <Grid>
          <Grid.Row className='comp-footer' style={{ paddingBottom: '30px', paddingTop: '33px' }}>
            <Grid.Column className='col-hidden' verticalAlign='middle' computer={2} mobile={0}/>
            <Grid.Column verticalAlign='middle' computer={3} mobile={4}>
              <Svg1 />
            </Grid.Column>
            <Grid.Column  verticalAlign='middle' computer={3} mobile={4}>
              <Svg2 />
            </Grid.Column>
            <Grid.Column verticalAlign='middle' computer={3} mobile={4}>
              <Svg3 />
            </Grid.Column>
            <Grid.Column verticalAlign='middle' computer={3} mobile={4}>
              <Svg4 />
            </Grid.Column>
            <Grid.Column verticalAlign='middle' computer={2} mobile={0}/>
          </Grid.Row>

          <Grid.Row className='mob-footer' style={{ paddingBottom: '30px', paddingTop: '33px' }}>
            <Grid.Column verticalAlign='middle' width={8}>
              <Svg1 />
            </Grid.Column>
            <Grid.Column  verticalAlign='middle' width={8}>
              <Svg2 />
            </Grid.Column>
            <Grid.Column verticalAlign='middle' width={8}>
              <Svg3 />
            </Grid.Column>
            <Grid.Column verticalAlign='middle' width={8}>
              <Svg4 />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row className='comp-footer'>
            <Grid.Column computer={7}>
              <Divider />
            </Grid.Column>
            <Grid.Column computer={2}>
              <Image id='footer-logo' centered src={logo} style={{ minWidth: '30px', width: '60px', marginTop: '-18px' }}/>
            </Grid.Column>
            <Grid.Column computer={7}>
              <Divider />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row className='mob-footer'>
            <Grid.Column width={6}>
              <Divider />
            </Grid.Column>
            <Grid.Column width={4}>
              <Image id='footer-logo' centered src={logo} style={{ minWidth: '30px', width: '60px', marginTop: '-18px' }}/>
            </Grid.Column>
            <Grid.Column width={6}>
              <Divider />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row style={{ paddingTop: '2em' }}>
            <Grid.Column centered computer={16}>
              <p className='footer-font'>Copyright © 2020 Decentral Games </p>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className="main-footer-icon-row">
            <a href="/discord/">
              <FaDiscord className="main-footer-icon" />
            </a>
            <a href="https://twitter.com/decentralgames/">
              <FaTwitter className="main-footer-icon" />
            </a>
            <a href="https://github.com/decentral.games">
              <FaGithub className="main-footer-icon"/>
            </a>
            <a href="https://telegram.org/decentralgames/">
              <FaTelegramPlane className="main-footer-icon"/>
            </a>
            <a href="mailto:hello@decentral.games">
              <MdEmail className="main-footer-icon"/>
            </a>
          </Grid.Row>
        </Grid>

      </Container>
    </Segment>
);

export default Footer;
