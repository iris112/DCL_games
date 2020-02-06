import React from 'react';
import '../additional.css';
import { Table, Pagination, Menu} from 'semantic-ui-react';
import ModalWithdraw from '../ModalWithdraw';
import LogoSpinner from '../../LogoSpinner';
import Global from '../constant';
import mana from '../Images/mana.png';
import { Icon } from 'semantic-ui-react';
import Fade from 'react-reveal/Fade';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";


const INITIAL_STATE = {
  data: [],
  currentPage: 1,
  isRunningTransaction: false,
};

class History extends React.Component {
  data_json_result = [];
  rawCount = 14;
  all_json_result = [];
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
      this.data_json_result = json.result;
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
      this.data_json_result = this.data_json_result.concat(json.result);  
      this.all_json_result = this.data_json_result;
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
    var displayData = [];
    displayData = this.setInitPage(this.data_json_result);
    allData = allData.concat(displayData);

    allData.sort(function(a, b){
      var dateA = new Date(a.createdAt);
      var dateB = new Date(b.createdAt);
      var diff = dateB.getTime() - dateA.getTime();
      return diff;
    });

    this.props.hideSpinner();
    this.setState({data: allData});
  }

  setInitPage(json_result) {
    var displayData = [];
    for(var i = 0 ; i < this.rawCount ; i ++) {
      var index = this.rawCount * (this.state.currentPage - 1) + i;
      if(index >= json_result) break;
      displayData[i] = json_result[index];
    }
    return displayData
  }

  handleHistory = (param1, param2) => {
    var historyData = [];
    if(param2 == null)
      this.all_json_result.map(function(history) {
        if(history.type == param1) {
          historyData = historyData.concat(history);
        }
      });
    else
      this.all_json_result.map(function(history) {
        if(history.type == param1 || history.type == param2) {
          historyData = historyData.concat(history);
        }
      });
    console.log(historyData);
    var displayData = [];
    this.data_json_result = historyData;
    this.setState({currentPage: 1});
    displayData = this.setInitPage(this.data_json_result);
  
    this.props.hideSpinner();
    this.setState({data: displayData});
  }

  nextPage = () => {
    if(this.data_json_result.length > (this.state.currentPage * this.rawCount)) {
      var displayData = [];
      for(var i = 0 ; i < this.rawCount ; i ++) {
        var index = this.rawCount * (this.state.currentPage) + i;
        if(index >= this.data_json_result.length) break;
        displayData[i] = this.data_json_result[index];
      }
      this.setState({data: ""});
      var nextData = [];
      nextData = nextData.concat(displayData);
      this.setState({data: nextData});
      this.setState((state) => ({currentPage: state.currentPage + 1}));
    }
  }

  previewPage = () => {
    console.log(this.data_json_result.length);
    console.log(this.state.currentPage);
    console.log(this.rawCount);
    if(this.state.currentPage != 1 ) {
      var displayData = [];
      for(var i = 0 ; i < this.rawCount ; i ++) {
        var index = this.rawCount * (this.state.currentPage - 2) + i;
        if(index >= this.data_json_result.length) break;
        displayData[i] = this.data_json_result[index];
        console.log(index);
      }
      var previewData = [];
      previewData = previewData.concat(displayData);
      this.setState({data: previewData});
      this.setState((state) => ({currentPage: state.currentPage - 1}));
    }
  }

  getPlayData = () => {
    return fetch(`${Global.BASE_URL}/order/getPlayInfo`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // address: '0x0fe1829403d422470cd4cf0abad4bcec9aa2ebf6',
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
        // address: '0x0fe1829403d422470cd4cf0abad4bcec9aa2ebf6',
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
        <div style={{width: 'calc(100% - 90px)', minWidth: '800px', marginTop: '20px', marginLeft: '45px', marginRight: '45px'}}>
          <h3 className="account-h3" style={{paddingTop: '20px'}}> Transaction History </h3>
          <div style={{marginLeft:'3px', paddingTop:'10px'}}><span class="mouseCursor" onClick= {() => this.handleHistory("Withdraw","Deposit")}>Deposits/Withdrawals</span><span> | </span><span class="mouseCursor" onClick={() => this.handleHistory("MANA")}>GamePlay</span></div>
          <div id='tx-box-history'>
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
              <div>
                <div class='dataTable' style={{height: 'calc(100vh - 280px)'}}>
                  <Table singleLine fixed>
                    <Table.Header></Table.Header>
                    <Table.Body>
                      {data.map((row) => {if(row != undefined)  {
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
                              <Table.Cell style={{paddingLeft:'20px'}}><img src={mana} style={{ width: '18px', paddingRight: '3px', verticalAlign: 'middle', marginTop: '-3px' }}/>{action}</Table.Cell>
                              <Table.Cell>-{amount} MANA</Table.Cell>
                              <Table.Cell>+{result} MANA</Table.Cell>
                              <Table.Cell>{timestamp}</Table.Cell>
                              <Table.Cell>
                                <a style={{color: '#2085F4', 
                                          maxWidth: '120px', 
                                          display: 'inline-block',
                                          textOverflow: 'ellipsis',
                                          overflow: 'hidden',
                                          verticalAlign: 'middle'}} 
                                  target="_blank" href={`https://explorer.testnet2.matic.network/tx/${row.txid}`}>
                                  {row.txid}
                                </a>
                                <Icon name="caret right" style={{ color: '#2085F4' }}/>
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
                                <Table.Cell style={{paddingLeft:'20px'}}><img src={mana} style={{ width: '18px', paddingRight: '3px', verticalAlign: 'middle', marginTop: '-3px' }}/>{row.type}</Table.Cell>
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
                                <Table.Cell style={{paddingLeft:'20px'}}><img src={mana} style={{ width: '18px', paddingRight: '3px', verticalAlign: 'middle', marginTop: '-3px' }}/>{row.type}</Table.Cell>
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
                              <Table.Cell style={{paddingLeft:'20px'}}><img src={mana} style={{ width: '18px', paddingRight: '3px', verticalAlign: 'middle', marginTop: '-3px' }}/>{row.type}</Table.Cell>
                              <Table.Cell>{amount} MANA</Table.Cell>
                              <Table.Cell>{row.status}</Table.Cell>
                              <Table.Cell>{timestamp}</Table.Cell>
                              <Table.Cell>
                                <a style={{color: '#2085F4', 
                                          maxWidth: '120px', 
                                          display: 'inline-block',
                                          textOverflow: 'ellipsis',
                                          overflow: 'hidden',
                                          verticalAlign: 'middle'}} 
                                  target="_blank" href={`https://explorer.testnet2.matic.network/tx/${row.txid}`}>
                                  {row.txid}
                                </a>
                                <Icon name="caret right" style={{ color: '#2085F4' }}/>
                              </Table.Cell>
                            </Table.Row>
                          );
                        }
                      }})}
                    </Table.Body>
                  </Table>
                </div>
                <div class="pagination">
                  <MdKeyboardArrowLeft size='2.2em' className='spanbox' onClick={this.previewPage}/>
                  <span class="spanbox" style={{padding: '10px 15px'}}>Page {this.state.currentPage}</span>
                  <MdKeyboardArrowRight size='2.2em' className='spanbox' onClick={this.nextPage} />
                </div>
              </div>
            : <p className="playboard-p" style={{lineHeight:'calc(100vh - 200px)', textAlign:'center', color: 'gray', fontStyle: 'italic'}}> There is no transaction history for this account </p> }
          </div>
        </div>
      </div>
    )
  }
}

export default History;