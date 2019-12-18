import React from "react";
import { NavLink } from "react-router-dom";
import { Button, Footer } from "decentraland-ui";
import logo from './Images/footer-logo.png'
import { Divider, Grid, List, Menu, Icon, Segment, Container, Header, Image, Input, Visible } from "semantic-ui-react";

const Footer2 = () => (
    <Segment className='footer-margin' vertical style={{ paddingBottom: '0em' }}>

    <Divider />

      <Container>
        <Grid className='grid-margin'>
	       <Grid.Column id='footer-mobile' floated='left' computer={8} tablet={8} mobile={16} style={{ paddingLeft: '6px' }}>
	       		<p className='footer-font2' id='footer-float1'> © 2019 <a id='a-footer' href='/'> Decentral Games </a></p>
	        </Grid.Column>
	        <Grid.Column id='footer-mobile2' floated='right' computer={6} tablet={8} mobile={16}>
	        	<p className='footer-font2' id='footer-float2'> Follow <a id='a-footer' href='https://twitter.com/decentralgames'> Twitter </a> & Join <a id='a-footer' href='https://decentral.games/discord/'> Discord </a> | <a id='a-footer' href='/disclaimer/'> Disclaimer </a></p>
	        </Grid.Column>
	      </Grid>
	    </Container>
    </Segment>
);

export default Footer2;