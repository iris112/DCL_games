import React from 'react'
import { Redirect, withRouter } from 'react-router-dom';
import '../additional.css';
import mana from '../Images/mana.png';
import dai from '../Images/dai.png';
import eth from '../Images/eth.png';
import dg from '../Images/authorize_title.png';
import Spinner from '../../Spinner'
import { Button } from 'decentraland-ui'
import { Table, Dropdown } from 'semantic-ui-react'

import Global from '../constant';

var USER_ADDRESS;

const INITIAL_STATE = {
  manaSlotBalance: 0,
  manaSlotPayout: 0,
  manaSlotVolume: 0,
  manaRouletteBalance: 0,
  ethMaticGasBalance: 0,
  ethRopstenGasBalance: 0,
  username: '',
  period: 7,
  isRunningTransaction: false
};

class Dashboard extends React.Component {
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

    await this.getUserData(this.state.period);
  }

  async getUserData(period) {
    this.setState({isRunningTransaction: true});
    this.verifyNetwork();
    this.getEthBalance();   

    // Get Mana Slot Contract Data
    let page = 1;
    let volume = 0;
    let payout = 0;
    let response = await this.getData(page, period);
    let json = await response.json();
    while (json.result !== 'false') {
      json.result.map((row) => {
        volume = volume + Number(row.betAmount) / (10 ** Global.TOKEN_DECIMALS);
        payout = payout + Number(row.amountWin) / (10 ** Global.TOKEN_DECIMALS);
      });

      page = page + 1;
      response = await this.getData(page, period);
      json = await response.json();
    }

    this.setState({manaSlotVolume: volume, manaSlotPayout: payout, isRunningTransaction: false});
  }

  getData = (page, period) => {
    return fetch(`${Global.BASE_URL}/admin/getTotal`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page: page,
        period: period * 24 * 60 * 60 * 1000
      })
    })
  }

  getTokenBalance = async (isMatic) => {
    try {
      var amountSlot, amountRoulette;
      
      // if (isMatic)
      //   amount = await Global.balanceOfToken(Global.MATIC_TOKEN);
      // else
      //   amount = await Global.balanceOfToken(Global.ROPSTEN_TOKEN);
      amountSlot = await Global.balanceOfToken(Global.MATIC_TOKEN, this.maticWeb3, Global.SLOTS_CONTRACT_ADDRESS);
      amountRoulette = await Global.balanceOfToken(Global.MATIC_TOKEN, this.maticWeb3, Global.ROULETTE_CONTRACT_ADDRESS);
      this.setState({manaSlotBalance: window.web3.fromWei(amountSlot, 'ether').toFixed(0),
                    manaRouletteBalance: window.web3.fromWei(amountRoulette, 'ether').toFixed(0)});
    } catch (err) {
      console.log(err);
    }
  };

  getEthBalance = () => {
    try {
      var Obj = this;
      window.web3.eth.getBalance(Global.RELAY_ADDR, function(err, amount) {
        if (err)
          return;
        
        Obj.setState({ethRopstenGasBalance: window.web3.fromWei(amount, 'ether').toFixed(8)});
      });
      this.maticWeb3.eth.getBalance(Global.RELAY_ADDR, function(err, amount) {
        if (err) {
          console.log(err);
          return;
        }
        
        Obj.setState({ethMaticGasBalance: window.web3.fromWei(amount, 'ether').toFixed(8)});
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

  onDeposit = () => {
    this.props.history.push('/adeposit/');
  }

  onWithdraw = () => {
    this.props.history.push('/awithdraw/');
  }

  onChangePeriod = async (e, d) => {
    this.setState({period: d.value });

    await this.getUserData(d.value);
  };
  
  render() {
    const data = [
      {
        name: 'MANA Slots',
        image: mana,
        unit: 'MANA',
        balance: this.state.manaSlotBalance,
        volume: this.state.manaSlotVolume,
        payout: this.state.manaSlotPayout,
        enabled: 1
      },
      {
        name: 'MANA Roulette',
        image: mana,
        unit: 'MANA',
        balance: this.state.manaRouletteBalance,
        volume: 0,
        payout: 0,
        enabled: 1
      },
      {
        name: 'MANA Blackjack',
        image: mana,
        unit: 'MANA',
        balance: 0,
        volume: 0,
        payout: 0,
        enabled: 1
      },
      {
        name: 'MANA Dice',
        image: mana,
        unit: 'MANA',
        balance: 0,
        volume: 0,
        payout: 0,
        enabled: 0
      },
      {
        name: 'DG Slots',
        image: dg,
        unit: 'DG',
        balance: 0,
        volume: 0,
        payout: 0,
        enabled: 0
      },
      {
        name: 'DG Roulette',
        image: dg,
        unit: 'DG',
        balance: 0,
        volume: 0,
        payout: 0,
        enabled: 0
      },
      {
        name: 'DG Blackjack',
        image: dg,
        unit: 'DG',
        balance: 0,
        volume: 0,
        payout: 0,
        enabled: 0
      },
      {
        name: 'DG Dice',
        image: dg,
        unit: 'DG',
        balance: 0,
        volume: 0,
        payout: 0,
        enabled: 0
      },
      {
        name: 'DAI Slots',
        image: dai,
        unit: 'DAI',
        balance: 0,
        volume: 0,
        payout: 0,
        enabled: 0
      },
      {
        name: 'DAI Roulette',
        image: dai,
        unit: 'DAI',
        balance: 0,
        volume: 0,
        payout: 0,
        enabled: 0
      },
    ];

    const period = [
      { key: 1, text: '1 day', value: 1 },
      { key: 2, text: '7 days', value: 7 },
      { key: 3, text: '1 month', value: 30 },
      { key: 4, text: '6 months', value: 180 },
      { key: 5, text: '1 year', value: 365 },
    ];

    return (
      <div class="contentContainer">
        <Spinner show={this.state.isRunningTransaction}/>
        <div style={{width: 'calc(100% - 50px)', minWidth: '860px' }}>
          <p  class="titleName">
            Hi, Admin.
          </p>
          <p class="titleDescription" style={{display: 'inline-block'}}>
            This is the admin dashboard to manage house balances.
          </p>
          <Dropdown style={{float: 'right'}}
            inline compact direction='left'
            options={period} value={this.state.period} 
            onChange={this.onChangePeriod}
          />
          <div style={{marginTop: '30px'}}>
            <div class='balanceBox' style={{width: '100%', textAlign: 'left'}}>
              <div style={{display: 'inline-block'}}>
                <p class='houseBalanceTitle'>
                  Matic House Gas Balance
                </p>
                <div style={{display: 'inline-block'}}>
                  <img style={{verticalAlign:'middle'}} class="image inline" width="20px" height="20px" src={eth} />
                  <span class="balanceAmount" style={{textAlign: 'left'}}>
                    {this.state.ethMaticGasBalance} ETH
                  </span>
                </div>
              </div>
              <div style={{display: 'inline-block', marginLeft: '100px'}}>
                <p class='houseBalanceTitle'>
                  Ropsten House Gas Balance
                </p>
                <div style={{display: 'inline-block'}}>
                  <img style={{verticalAlign:'middle'}} class="image inline" width="20px" height="20px" src={eth} />
                  <span class="balanceAmount" style={{textAlign: 'left'}}>
                    {this.state.ethRopstenGasBalance} ETH
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div id='tx-box' style={{ marginTop: '20px'}}>
            <Table id='header' singleLine fixed style={{marginBottom: 0}}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Game</Table.HeaderCell>
                  <Table.HeaderCell className='adminTablePadding'>Volume</Table.HeaderCell>
                  <Table.HeaderCell className='adminTablePadding'>Payouts</Table.HeaderCell>
                  <Table.HeaderCell className='adminTablePadding'>Balance</Table.HeaderCell>
                  <Table.HeaderCell style={{width: '280px'}}>Manage</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
             </Table>
             <div class='dataTable' style={{height: 'calc(100vh - 400px)'}}>
              <Table singleLine fixed>
                <Table.Header></Table.Header>
                <Table.Body>
                  {data.map((row) => {
                    
                    return (
                      <Table.Row>
                        <Table.Cell style={{paddingLeft: '20px'}}>
                          <img style={{verticalAlign:'middle'}} class="image inline" width="20px" height="20px" src={row.image} />
                          <span style={{textAlign: 'left', marginLeft: '10px'}}>
                            {row.name}
                          </span>
                        </Table.Cell>
                        <Table.Cell className='adminTablePadding'>{row.volume} {row.unit}</Table.Cell>
                        <Table.Cell className='adminTablePadding'>{row.payout} {row.unit}</Table.Cell>
                        <Table.Cell className='adminTablePadding'>{row.balance} {row.unit}</Table.Cell>
                        <Table.Cell style={{width: '280px'}}>
                          {row.enabled == 1 ?
                            <div>
                              <Button id="depositButton" color='blue' style={{marginRight:'0', marginLeft:'20px'}}
                              onClick={this.onDeposit}
                              >
                                Deposit
                              </Button>
                              <Button id="depositButton" color='blue' style={{marginRight:'0', marginLeft:'20px'}}
                              onClick={this.onWithdraw}
                              >
                                Withdraw
                              </Button>
                            </div>
                          : <div>
                              <Button disabled id="depositButton" color='blue' style={{marginRight:'0', marginLeft:'20px'}}
                              >
                                Deposit
                              </Button>
                              <Button disabled id="depositButton" color='blue' style={{marginRight:'0', marginLeft:'20px'}}
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
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Dashboard);
