import React from 'react';
import { Container, Grid, Image, Breadcrumb} from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import metamask from '../Images/metamask.png';
import ledger from '../Images/ledger.png';
import Spinner from '../../Spinner'
import { Header } from 'decentraland-ui'

import Global from '../constant';

const withAdmin = Component => {
  class WithAdmin extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        isAdmin: 0,
      };
    }

    componentDidMount() {
	 //  	this.setState({isAdmin : 2});
		// return;

		try {
		  if (!window.web3.currentProvider.selectedAddress) {
		    this.setState({isAdmin : 0});
		  } else if (Global.ADMIN_ADDR.includes(window.web3.currentProvider.selectedAddress.toLowerCase())) {
		    this.setState({isAdmin : 2});
		  } else {
		    this.setState({isAdmin : 1});
		  }
		} catch(e) {
		  console.log(e);
		  this.setState({isAdmin : 0});
		}
    }

    componentWillUnmount() {
      
    }

    onMetamask = async (e, d) => {
	    if (window.ethereum) {
	      window.web3 = new window.Web3(window.ethereum);
	      try {
	          // Request account access if needed
	          await window.ethereum.enable();
	          if (Global.ADMIN_ADDR.includes(window.web3.currentProvider.selectedAddress.toLowerCase())) {
	            this.setState({isAdmin : 2});
	          } else {
	            this.setState({isAdmin : 1});
	          }
	      } catch (error) {
	          // User denied account access...
	          console.log(error);
	      }
	    }
	};

    render() {
    	if (this.state.isAdmin == 0) {
	      return (
	        <div id="admin" class="ui accountContainer">
	          <Header as='h3' style={{ padding: '0em 0em 0em', marginTop: '5.5em', textAlign: 'center', lineHeight: '1.6em', fontSize: '2.7em', color: 'black' }}>
	            Login
	          </Header>
	          <Spinner show={this.state.isRunningTransaction}/>
	          <div class="ui verifyContainer">
	            <p style={{ textAlign: 'center', fontSize: '1.33em', marginLeft: '40px', marginRight: '50px' }}>
	              Login with your Metamask or Ledger wallet.
	            </p>
	            <Grid verticalAlign='middle' textAlign='center'>
	              <Grid.Column>
	                <Link to='#' onClick={this.onMetamask}>
	                  <Image src={metamask} size='small' inline rounded bordered />
	                </Link>
	                <Link to='#' >
	                  <Image src={ledger} size='small' inline rounded bordered style={{marginLeft: '10px'}} />
	                </Link>

	                { this.state.isValidMetamask == 1 ?
	                  <p style={{ textAlign: 'center', color: 'red', marginTop: '10px'}}>
	                    Add address failed.
	                  </p> : <p/>
	                }
	              </Grid.Column>
	            </Grid>
	          </div>
	        </div>
	      );
	    } else if (this.state.isAdmin == 1) {
	      return (
	        <div id="admin" class="ui accountContainer">
	          <Container>
	          	<a id='a-footer' style={{marginTop: '30px', display: 'inline-block'}} href='/'>
	              <Breadcrumb.Divider  style={{ fontSize: '18px' }} icon='left arrow' />
	            </a>
	            <Grid verticalAlign='middle' textAlign='center' style={{marginTop: '40vh'}}>
	              <Header> This page is only available to the administrator. </Header>
	            </Grid>
	          </Container>
	        </div>
	      );
	    }

		return (
			<Component {...this.props} />
		);
    }
  }

  return WithAdmin;
};

export default withAdmin;
