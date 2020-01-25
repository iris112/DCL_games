import React from 'react'
import { withRouter } from 'react-router-dom';
import '../additional.css';
import mana from '../Images/mana.png';
import dai from '../Images/dai.png';
import eth from '../Images/eth.png';
import dg from '../Images/authorize_title.png';
import { Button } from 'decentraland-ui'
import { Table} from 'semantic-ui-react'
import Global from '../constant';
import ModalDeposit from '../ModalDeposit'
import ModalWithdraw from '../ModalWithdraw'


var USER_ADDRESS;

const INITIAL_STATE = {
  tokenBalance: 0,
  ethBalance: 0,
  username: '',
};

class WalletInfo extends React.Component {

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
    await this.getUserName();
  }

  update = () => {
    this.getTokenBalance();
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
    const data = [
    {
      coin: 'MANA',
      image: mana,
      balance: this.state.tokenBalance,
      enabled: 1
    },
    {
      coin: 'ETH',
      image: eth,
      balance: this.state.ethBalance,
      enabled: 0
    },
    {
      coin: 'DAI',
      image: dai,
      balance: 0,
      enabled: 0
    },
    {
      coin: 'DG',
      image: dg,
      balance: 0,
      enabled: 0
    }];

    return (
      <div class="wallet_board">
        <div class="account">
          <span style={{color:'rgb(25,172,155)', marginRight: '5px', fontSize: '22px', verticalAlign: 'middle'}}>&#8226;</span>
          <span>Metamask</span>
          <span class="address">{USER_ADDRESS.substr(0, 6) + '...' + USER_ADDRESS.substr(-4)}</span>
        </div>
        <div style={{padding: '20px 0'}}>
          <div style={{padding: '0 20px'}}>
            <h3>Matic Balances</h3>
            <p id="featured-casino-text2">Default games are free, deposit to play with crypto. Decentral Games is in beta, crypto gameplay is on Matic testnet using Ropsten MANA.</p>
          </div>
          <div id='balance-box' style={{ marginTop: '20px'}}>
            <Table id='header' singleLine fixed style={{marginBottom: 0}}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell style={{paddingLeft: '20px!important'}} id="featured-casino-text">BALANCE</Table.HeaderCell>
                  <Table.HeaderCell id="featured-casino-text">ACTIONS</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {data.map((row) => {
                  return (
                    <Table.Row>
                      <Table.Cell style={{paddingLeft: '0px'}}>
                        <img style={{verticalAlign:'middle'}} class="image inline" width="20px" height="20px" src={row.image} />
                        <span style={{textAlign: 'left', marginLeft: '10px', lineHeight: '25px', verticalAlign: 'middle'}}>
                          {row.balance} {row.coin}
                        </span>
                      </Table.Cell>
                      <Table.Cell style={{paddingRight: '0px'}}>
                        {row.enabled == 1 ?
                          <div className="wallet-deposit">
                            <ModalDeposit showSpinner={this.props.showSpinner} hideSpinner={this.props.hideSpinner} update={this.update} authvalue={4}/>
                            <ModalWithdraw isLink={0} showSpinner={this.props.showSpinner} hideSpinner={this.props.hideSpinner}/>
                          </div>
                        : <div>
                            <Button id="depositButton" color='blue' className="wallet-deposit"
                            >
                              Deposit
                            </Button>
                            <Button id="depositButton" color='blue'
                            >
                              Withdraw
                            </Button> 
                          </div> }
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </div>
          <p style={{textAlign: 'center', paddingTop: '9px'}} className="featured-casino-text3"><a href="#" style={{color: 'rgba(1, 133, 244, 1)' }} className="exchange-hover">Exchange</a> on Kyber</p>
        </div>
      </div>
    )
  }
}

export default withRouter(WalletInfo);
