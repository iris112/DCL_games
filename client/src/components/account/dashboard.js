import React from 'react'
import { Redirect, withRouter } from 'react-router-dom';
import '../additional.css';
import mana from '../Images/mana.png';
import dai from '../Images/dai.png';
import eth from '../Images/eth.png';
import dg from '../Images/authorize_title.png';
import teleport1 from '../Images/chateau.png';
import teleport2 from '../Images/serenity.png';
import { Button } from 'decentraland-ui'
import { Input, Image, Divider } from 'semantic-ui-react'
import Global from '../constant';
import ModalDeposit from '../ModalDeposit'
import Spinner from '../../Spinner'

var USER_ADDRESS;

const INITIAL_STATE = {
  tokenBalance: 0,
  ethBalance: 0,
  username: '',
  isRunningTransaction: false,
};

class Dashboard extends React.Component {
  showSpinner = () => this.setState({isRunningTransaction: true})
  hideSpinner = () => this.setState({isRunningTransaction: false})

  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };

    if (window.web3) {
      USER_ADDRESS = window.web3.currentProvider.selectedAddress;
    }

    this.maticWeb3 = new window.Web3(new window.Web3.providers.HttpProvider("https://testnet2.matic.network"));
  }

  async componentDidMount() {
    let object = this;
    window.ethereum.on('accountsChanged', async function (accounts) {
      await object.getUserData();
    })

    await this.getUserData();

  }

  async getUserData() {
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

  onWithdraw = () => {
    localStorage.setItem('withdrawTxID', '');
    this.props.history.push('/withdraw/');
  }
  
  render() {
    return (
      <div class="contentContainer">
        <Spinner show={this.state.isRunningTransaction}/>
        <div style={{width: 'calc(100% - 50px)', minWidth: '860px' }}>
          <p  class="titleName">
            Play Now
          </p>
          <p class="titleDescription">
            Default gameplay is Free-to-Play. Deposit to play with cryptocurrency. 
            <i style={{marginLeft: '5px'}} class='lato'>Decentral Games is currently in beta, so all our crypto gameplay is with Ropsten coins on Matic Beta.</i>
          </p>
          <div style={{marginTop: '30px'}}>
            <div class='balanceBox'>
              <div style={{marginBottom: '20px'}}>
                <img style={{verticalAlign:'middle'}} class="image inline" width="20px" height="20px" src={mana} />
                <span class="balanceAmount" style={{textAlign: 'left'}}>
                  {this.state.tokenBalance} MANA
                </span>
              </div>
              <ModalDeposit showSpinner={this.showSpinner} hideSpinner={this.hideSpinner}/>
              <Button id="depositButton" color='blue' style={{marginRight:'0', marginLeft:'10px'}}
              onClick={this.onWithdraw}
              >
                Withdraw
              </Button>
            </div>
            <div class='balanceBox' style={{marginLeft: '20px'}}>
              <div style={{marginBottom: '20px', opacity: '0.5'}}>
                <img style={{verticalAlign:'middle'}} class="image inline" width="20px" height="20px" src={dg} />
                <span class="balanceAmount" style={{textAlign: 'left'}}>
                  0 DG
                </span>
              </div>
              <Button id="depositButton" disabled color='blue' style={{marginRight:'0', marginLeft:'0px'}}
              onClick={this.onDeposit}
              >
                Deposit
              </Button>
              <Button id="depositButton" disabled color='blue' style={{marginRight:'0', marginLeft:'10px'}}
              onClick={this.onWithdraw}
              >
                Withdraw
              </Button>
            </div>
            <div class='balanceBox' style={{marginLeft: '20px'}}>
              <div style={{marginBottom: '20px', opacity: '0.5'}}>
                <img style={{verticalAlign:'middle'}} class="image inline" width="20px" height="20px" src={dai} />
                <span class="balanceAmount" style={{textAlign: 'left'}}>
                  0 DAI
                </span>
              </div>
              <Button id="depositButton" disabled color='blue' style={{marginRight:'0', marginLeft:'0px'}}
              onClick={this.onDeposit}
              >
                Deposit
              </Button>
              <Button id="depositButton" disabled color='blue' style={{marginRight:'0', marginLeft:'10px'}}
              onClick={this.onWithdraw}
              >
                Withdraw
              </Button>
            </div>
          </div>
          <div id='teleport-box'>
            <div class="teleport">
              <p style={{fontSize:'15px', textAlign: 'center'}}>
                Decentral Games Zeit
              </p>
              <a href="/chateau/">
                <Image src={teleport1} inline style={{marginLeft:'20px', width: 'calc((100% - 60px) / 3'}}/>
              </a>
              <a href="/serenity/">
                <Image src={teleport2} inline style={{marginLeft:'20px', width: 'calc((100% - 60px) / 3'}}/>
              </a>
            </div>

            <div style={{marginTop: '30px'}} class="teleport">
              <p style={{fontSize:'15px', textAlign: 'center'}}>
                Decentraland
              </p>
              <a href="https://explorer.decentraland.org/?ENABLE_WEB3&position=-57%2C139">
                <Image src={teleport2} inline style={{marginLeft:'20px', width: 'calc((100% - 60px) / 3'}}/>
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Dashboard);
