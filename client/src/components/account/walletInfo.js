import React from 'react'
import { withRouter } from 'react-router-dom';
import '../additional.css';
import mana from '../Images/mana.png';
import dai from '../Images/dai.png';
import eth from '../Images/eth.png';
import dg from '../Images/authorize_title.png';
import { Button } from 'decentraland-ui'
import { Table, Modal } from 'semantic-ui-react'
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
      this.setState({tokenBalance: window.web3.fromWei(amount, 'ether').toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")});
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
      coin1: 'MANA',
      image1: mana,
      balance1: this.state.tokenBalance,
      enabled: 1
    },
    {
      coin2: 'ETH',
      image2: eth,
      balance2: this.state.ethBalance,
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
          <span className="green-dot" style={{color:'rgb(25,172,155)', marginRight: '5px', fontSize: '15px' }}>&#8226;</span>
          <span id="wallet-top-text">Metamask</span>
          <span id="wallet-top-text2">{USER_ADDRESS.substr(0, 9) + '...' + USER_ADDRESS.substr(-4)}</span>
        </div>
        <div style={{padding: '20px 0'}}>
          <div style={{padding: '0 20px'}}>
            <h3 className="account-h3-2">Matic Balances
              <Modal size='small' className="info-modal" trigger={<i class="info circle icon" style={{ cursor: 'pointer', verticalAlign: 'top', fontSize: '10px' }}/>} closeIcon>
                <h3 className="account-h3" style={{ paddingLeft: '33px' }}>What is Matic Network?</h3>
                <Modal.Content id="modal-font">
                  <p id="modal-font">Matic Network is a Plasma sidechain that allows for instant transactions for Ethereum tokens while maintaining the security of the Ethereum mainchain. To use Matic, deposit your Ethereum tokens with a deposit transaction. The tokens will then be instantly usable in all our games. 
                  </p>
                  <p id="modal-font">When you wish to withdraw from Matic and retrieve your tokens on the mainchain, initiate another withdrawal transaction. Withdrawals may take up to 1 week, but will be much quicker soon. 
                  </p>
                </Modal.Content>
              </Modal>
            </h3>
            <p id="featured-casino-text2">Default games are free, deposit to play with crypto. Decentral Games is in beta, crypto gameplay is on Matic testnet using Ropsten MANA.</p>
          </div>
          <div id='balance-box' style={{ marginTop: '24px'}}>
            <Table id='header' className="info-table" singleLine fixed style={{marginBottom: 0}}>
              <Table.Body>

                <Table.Row>
                  <span id="wallet-row">
                    <img style={{ verticalAlign: 'middle', marginRight: '6px' }} class="image inline" width="20px" height="20px" src={mana} />
                    {this.state.tokenBalance} MANA
                    <span style={{ float: 'right' }} id="wallet-row3">
                      <ModalDeposit showSpinner={this.props.showSpinner} hideSpinner={this.props.hideSpinner} update={this.update} authvalue={4}/>
                      <ModalWithdraw isLink={0} showSpinner={this.props.showSpinner} hideSpinner={this.props.hideSpinner}/>
                    </span>
                  </span>
                </Table.Row>

                <Table.Row>
                  <span id="wallet-row">
                    <img id="grey-img" style={{ verticalAlign: 'middle', marginRight: '6px' }} class="image inline" width="20px" height="20px" src={eth} />
                    <span>
                      {this.state.ethBalance} ETH
                    </span>
                    <span style={{ float: 'right' }} id="wallet-row4">
                      <Button id="depositButton" color='blue' className="wallet-deposit" style={{ color: 'grey' }}>
                        Deposit
                      </Button>
                      <Button id="depositButton" color='blue' className="wallet-deposit2" style={{ color: 'grey' }}>
                        Withdraw
                      </Button>
                    </span>
                  </span>
                </Table.Row>

                <Table.Row>
                  <span id="wallet-row">
                    <img id="grey-img"  style={{ verticalAlign: 'middle', marginRight: '6px' }} class="image inline" width="20px" height="20px" src={dai} />
                    <span>
                      {this.state.ethBalance} DAI
                    </span>
                    <span style={{ float: 'right' }} id="wallet-row4">
                      <Button id="depositButton" color='blue' className="wallet-deposit" style={{ color: 'grey' }}>
                        Deposit
                      </Button>
                      <Button id="depositButton" color='blue' className="wallet-deposit2" style={{ color: 'grey' }}>
                        Withdraw
                      </Button>
                    </span>
                  </span>
                </Table.Row>

                <Table.Row>
                  <span id="wallet-row">
                    <img id="grey-img"  style={{ verticalAlign: 'middle', marginRight: '6px' }} class="image inline" width="20px" height="20px" src={dg} />
                    <span>
                      {this.state.ethBalance} DG
                    </span>
                    <span style={{ float: 'right' }} id="wallet-row4">
                      <Button id="depositButton" color='blue' className="wallet-deposit" style={{ color: 'grey' }}>
                        Deposit
                      </Button>
                      <Button id="depositButton" color='blue' className="wallet-deposit2" style={{ color: 'grey' }}>
                        Withdraw
                      </Button>
                    </span>
                  </span>
                </Table.Row>

              </Table.Body>
            </Table>
          </div>
          <p style={{textAlign: 'center', paddingTop: '9px'}} className="featured-casino-text3">
          	<Modal className="outter-modal" trigger={<a className="exchange-hover2"> Exchange </a>} closeIcon>
          		<iframe
							  src="https://uniswap.exchange/swap?outputCurrency=0x0f5d2fb29fb7d3cfee444a200298f468908cc942"
							  id="uniswap-modal"
							/>
						</Modal>
						mainchain assets on Uniswap
					</p>
        </div>
      </div>
    )
  }
}

export default withRouter(WalletInfo);
