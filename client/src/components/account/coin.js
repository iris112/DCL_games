import React from 'react'
import { Redirect, withRouter } from 'react-router-dom';
import '../additional.css';
import mana from '../Images/mana.png';
import eth from '../Images/eth.png';
import dg from '../Images/authorize_title.png';
import teleport1 from '../Images/chateau.png';
import teleport2 from '../Images/serenity.png';
import { Button } from 'decentraland-ui'
import { Input, Image} from 'semantic-ui-react'
import Fade from 'react-reveal/Fade'

import Global from '../constant';

var USER_ADDRESS;

const INITIAL_STATE = {
  tokenBalance: 0,
  ethBalance: 0,
  username: '',
};

class Coin extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };

    if (window.web3) {
      USER_ADDRESS = window.web3.currentProvider.selectedAddress;
    }

    this.maticWeb3 = new window.Web3(new window.Web3.providers.HttpProvider("https://testnet2.matic.network"));
  }

  async componentDidMount() {
    this.verifyNetwork();
    this.getEthBalance();
    await this.getUserName();
  }

  getUserInfo = () => {
    return fetch(`${Global.BASE_URL}/order/getUser`, {
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

  getUserName = async () => {
    try {
      let response = await this.getUserInfo();
      let json = await response.json();
      if (json.status === 'ok') {
        if (json.result === 'false') {
          return;
        }

        this.setState({username: json.name});
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }

  getTokenBalance = async (isMatic) => {
    try {
      var amount;
      
      // if (isMatic)
      //   amount = await Global.balanceOfToken(Global.MATIC_TOKEN);
      // else
      //   amount = await Global.balanceOfToken(Global.ROPSTEN_TOKEN);
      amount = await Global.balanceOfToken(Global.MATIC_TOKEN, this.maticWeb3);
      this.setState({tokenBalance: window.web3.fromWei(amount, 'ether').toFixed(0)});
    } catch (err) {
      console.log(err);
    }
  };

  getEthBalance = () => {
    try {
      var Obj = this;
      // window.web3.eth.getBalance(USER_ADDRESS, function(err, amount) {
      //   if (err)
      //     return;
        
      //   Obj.setState({ethBalance: window.web3.fromWei(amount, 'ether').toFixed(8)});
      // });
      this.maticWeb3.eth.getBalance(USER_ADDRESS, function(err, amount) {
        if (err)
          return;
        
        Obj.setState({ethBalance: window.web3.fromWei(amount, 'ether').toFixed(8)});
      });
    } catch (err) {
      console.log(err);
    }
  };

  verifyNetwork = () => {
    window.web3.version.getNetwork(async (err, network) => {
      if (network === Global.MATIC_NETWORK_ID) {
        this.isMatic = true;
        await this.getTokenBalance(true);
      }
      else {
        this.isMatic = false;
        await this.getTokenBalance(false);
      }
    });
  }
  
  render() {
    return (
      <div class="contentContainer">
        <div style={{width: 'calc(100% - 90px)', minWidth: '800px', marginTop: '20px', marginLeft: '45px', marginRight: '45px'}}>
          <Fade bottom distance="20px" duration="600">
            <h3 className="account-h3" style={{paddingTop: '20px'}}> NFTs </h3>
            <p className="opensea-text">Own a piece of the first Decentraland Community Mega Casino! Check out the NFTs on <a className="exchange-hover2" href="https://opensea.io/assets/vegas-city-land-lease?query=flamingos">OpenSea</a> or read about the offering on our <a className="exchange-hover2" href="https://decentral.games/blog/the-flamingos-a-mega-casino-by-vegas-city-decentral-games">blog</a>.</p>
          </Fade>
          <Fade bottom distance="20px" duration="600" delay="200">
            <div id='nft-box' style={{ height: 'calc(100vh - 200px)', marginTop: '20px', padding: '10px'}}>
              <div style={{marginTop:'calc(50vh - 150px)', padding: '10px'}}>
                <p className="playboard-p" style={{textAlign: 'center', marginTop: '20px', color: 'gray'}}>
                  You don't have any Decentral Games NFTs.
                </p>
              </div>
            </div>
          </Fade>
        </div>
      </div>
    )
  }
}

export default withRouter(Coin);
