import React from 'react'
import '../additional.css';
import { Table } from 'semantic-ui-react'
import ModalWithdraw from '../ModalWithdraw'
import LogoSpinner from '../../LogoSpinner'
import Global from '../constant';

const INITIAL_STATE = {
  data: [],
  isRunningTransaction: false,
};

class History extends React.Component {
  showSpinner = () => this.setState({isRunningTransaction: true})
  hideSpinner = () => this.setState({isRunningTransaction: false})

  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    
    
  }

  async componentDidMount() {
    let object = this;
    window.ethereum.on('accountsChanged', async function (accounts) {
      await object.getUserData();
    })
    
    await this.getUserData();
  }

  async getUserData() {
    this.props.showSpinner();
    var response = await this.getPlayData();
    var json = await response.json();
    var allData = [];
    var isScroll = false;
    if (json.result !== 'false') {
      allData = allData.concat(json.result);

      for (var i = 0; i < 3; i++) {
        if (json.result.length > 0) {
          var el = document.querySelector('.dataTable');
          if (!el) {
            await Global.delay(1000);
            continue;
          }
          isScroll = true;
          
          el.addEventListener('scroll', function(e) {
          (function(el){
            el.classList.add('scrollTable');
            setTimeout(function() {
              el.classList.remove('scrollTable');
            }, 1000);    
          })(el);
          })
        }
      }
    }

    response = await this.getHistoryData();
    json = await response.json();
    if (json.result !== 'false') {
      allData = allData.concat(json.result);

      if (!isScroll) {
        for (var i = 0; i < 3; i++) {
          if (json.result.length > 0) {
            var el = document.querySelector('.dataTable');
            if (!el) {
              await Global.delay(1000);
              continue;
            }
            
            el.addEventListener('scroll', function(e) {
            (function(el){
              el.classList.add('scrollTable');
              setTimeout(function() {
                el.classList.remove('scrollTable');
              }, 1000);    
            })(el);
            })
          }
        }
      }
    }
    allData.sort(function(a, b){
      var dateA = new Date(a.createdAt);
      var dateB = new Date(b.createdAt);
      var diff = dateB.getTime() - dateA.getTime();
      return diff;
    });

    this.props.hideSpinner();
    this.setState({data: allData});
  }

  getPlayData = () => {
    return fetch(`${Global.BASE_URL}/order/getPlayInfo`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // address: '0x5aae39aed818b07235dc8bedbf5698bb4f299ef3',
        address: window.web3.currentProvider.selectedAddress,
        limit: 100000,
      })
    })
  }

  getHistoryData = () => {
    return fetch(`${Global.BASE_URL}/order/getHistory`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // address: '0x5aae39aed818b07235dc8bedbf5698bb4f299ef3',
        address: window.web3.currentProvider.selectedAddress,
        limit: 100000,
      })
    })
  }

  render() {
    const data = this.state.data; 

    return (
      <div class="contentContainer">
      <LogoSpinner show={this.state.isRunningTransaction}/>
        <div style={{width: 'calc(100% - 50px)', minWidth: '860px', marginTop: '20px', marginLeft: '30px'}}>
          <h3 style={{paddingTop: '20px'}}> Transaction History </h3>
          <div id='tx-box' style={{ marginTop: '20px'}}>
            <Table id='header' singleLine fixed style={{marginBottom: 0}}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell style={{paddingLeft: '20px'}}>ACTION</Table.HeaderCell>
                  <Table.HeaderCell>AMOUNT</Table.HeaderCell>
                  <Table.HeaderCell>RESULT</Table.HeaderCell>
                  <Table.HeaderCell>DATE</Table.HeaderCell>
                  <Table.HeaderCell>TX HASH</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
             </Table>
             { data.length != 0 ?
               <div class='dataTable' style={{height: 'calc(100vh - 200px)'}}>
                <Table singleLine fixed>
                  <Table.Header></Table.Header>
                  <Table.Body>
                    {data.map((row) => {
                      var action, amount, result;
                      var date = new Date(row.createdAt);
                      var timestamp = date.toLocaleString();
                      
                      timestamp = timestamp.replace(timestamp.substr(-2), '').trim();
                      if (row.betAmount) {
                        amount = Number(row.betAmount) / (10 ** Global.TOKEN_DECIMALS);
                        result = Number(row.amountWin) / (10 ** Global.TOKEN_DECIMALS);
                        if (row.type === 'Roulette')
                          action = "MANA Roulette";
                        else
                          action = "MANA Slots";

                        return (
                          <Table.Row>
                            <Table.Cell style={{paddingLeft: '20px'}}>{action}</Table.Cell>
                            <Table.Cell>-{amount} MANA</Table.Cell>
                            <Table.Cell>+{result} MANA</Table.Cell>
                            <Table.Cell>{timestamp}</Table.Cell>
                            <Table.Cell>
                              <a style={{color: 'gray', 
                                        maxWidth: '120px', 
                                        display: 'inline-block',
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                        verticalAlign: 'middle'}} 
                                 target="_blank" href={`https://explorer.testnet2.matic.network/tx/${row.txid}`}>
                                {row.txid}
                              </a>
                              <i style={{marginLeft:'5px'}}>&#x25B8;</i>
                            </Table.Cell>
                          </Table.Row>
                        );
                      } else {
                        if (row.type === 'Deposit')
                          amount = `+${row.amount}`;
                        else
                          amount = `-${row.amount}`;

                        if (row.status === 'Failed')
                          return (
                            <Table.Row style={{background: '#fb9ca7'}}>
                              <Table.Cell style={{color:'white', paddingLeft:'20px'}}>{row.type}</Table.Cell>
                              <Table.Cell style={{color:'white'}}>{amount} MANA</Table.Cell>
                              <Table.Cell style={{color:'white'}}>{row.status}</Table.Cell>
                              <Table.Cell style={{color:'white'}}>{timestamp}</Table.Cell>
                              <Table.Cell>
                                <ModalWithdraw isLink={1} tx={row.txid} showSpinner={this.showSpinner} hideSpinner={this.hideSpinner}/>
                              </Table.Cell>
                            </Table.Row>
                          );

                        if (row.status === 'Ready')
                          return (
                            <Table.Row style={{background: '#8fe08f'}}>
                              <Table.Cell style={{color:'white', paddingLeft:'20px'}}>{row.type}</Table.Cell>
                              <Table.Cell style={{color:'white'}}>{amount} MANA</Table.Cell>
                              <Table.Cell style={{color:'white'}}>{row.status}</Table.Cell>
                              <Table.Cell style={{color:'white'}}>{timestamp}</Table.Cell>
                              <Table.Cell>
                                <ModalWithdraw isLink={1} tx={row.txid} showSpinner={this.showSpinner} hideSpinner={this.hideSpinner}/>
                              </Table.Cell>
                            </Table.Row>
                          );

                        return (
                          <Table.Row>
                            <Table.Cell style={{paddingLeft:'20px'}}>{row.type}</Table.Cell>
                            <Table.Cell>{amount} MANA</Table.Cell>
                            <Table.Cell>{row.status}</Table.Cell>
                            <Table.Cell>{timestamp}</Table.Cell>
                            <Table.Cell>
                              <a style={{color: 'gray', 
                                        maxWidth: '120px', 
                                        display: 'inline-block',
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                        verticalAlign: 'middle'}} 
                                 target="_blank" href={`https://explorer.testnet2.matic.network/tx/${row.txid}`}>
                                {row.txid}
                              </a>
                              <i style={{marginLeft:'5px'}}>&#x25B8;</i>
                            </Table.Cell>
                          </Table.Row>
                        );
                      }
                    })}
                  </Table.Body>
                </Table>
              </div>
            : <p style={{lineHeight:'calc(100vh - 200px)', textAlign:'center', color: 'gray', fontStyle: 'italic'}}> There is no transaction history for this account </p> }
          </div>
        </div>
      </div>
    )
  }
}

export default History;