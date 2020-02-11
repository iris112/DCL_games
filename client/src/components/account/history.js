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

const PAGE_COUNT = 20
const INITIAL_STATE = {
  data: [],
  currentPage: 1,
  dataType: 'History',
  isRunningTransaction: false,
  nextAvail: true,
  prevAvail: false
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
    
    await this.getUserData(this.state.dataType, this.state.currentPage);
  }

  async getUserData(type, page) {
    this.props.showSpinner();
    var response
    if (type == 'Play')
      response = await this.getPlayData(page);
    else
      response = await this.getHistoryData(page);

    var json = await response.json();
    var allData = [];
    var nextAvail = this.state.nextAvail;
    var prevAvail = this.state.prevAvail;

    if (json.result !== 'false') {
      allData = json.result;

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

    if ((json.result === 'false') || (!json.result.length)) {
      if (page > 1)
        nextAvail = false;
    } else
      nextAvail = true;

    if (this.state.currentPage == 1)
      prevAvail = false;
    else
      prevAvail = true;

    this.props.hideSpinner();
    if (allData.length > 0)
      this.setState({data: allData, dataType: type, currentPage: page, nextAvail: nextAvail, prevAvail: prevAvail});
    else if (this.state.dataType !== type)
      this.setState({data: allData, dataType: type, currentPage: page, nextAvail: nextAvail, prevAvail: prevAvail});
    else
      this.setState({nextAvail: nextAvail, prevAvail: prevAvail});
  }

  handleHistory = () => {
    if (this.state.dataType !== 'History')
      this.getUserData('History', 1);
  }

  handlePlay = () => {
    if (this.state.dataType !== 'Play')
      this.getUserData('Play', 1);
  }

  nextPage = () => {
    if (this.state.nextAvail)
      this.getUserData(this.state.dataType, this.state.currentPage + 1);
  }

  previewPage = () => {
    if (this.state.beforeAvail)
      this.getUserData(this.state.dataType, this.state.currentPage - 1);
  }

  getPlayData = (page) => {
    return fetch(`${Global.BASE_URL}/order/getPlayInfo`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // address: '0x9eEb6d6b11146B1c089C2702B4A0061c06E2B10B'.toLowerCase(),
        address: window.web3.currentProvider.selectedAddress,
        limit: PAGE_COUNT,
        page: page
      })
    })
  }

  getHistoryData = (page) => {
    return fetch(`${Global.BASE_URL}/order/getHistory`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // address: '0x9eEb6d6b11146B1c089C2702B4A0061c06E2B10B'.toLowerCase(),
        address: window.web3.currentProvider.selectedAddress,
        limit: PAGE_COUNT,
        page: page
      })
    })
  }

  render() {
    const data = this.state.data; 

    return (
      <div class="contentContainer" style={{ marginBottom: '-60px' }}>
      <LogoSpinner show={this.state.isRunningTransaction} className="tx-history-spinner" />
        <div style={{width: 'calc(100% - 90px)', marginTop: '20px', marginLeft: '45px', marginRight: '45px'}}>
          <Fade bottom distance="20px" duration="600">
            <h3 className="account-h3" style={{paddingTop: '20px', paddingBottom: '18px' }}> Transaction History </h3>
            <div style={{marginLeft:'3px' }}>
              <span class="mouseCursor" onClick= {() => this.handleHistory()}>Deposits/Withdrawals</span>
              <span> | </span>
              <span class="mouseCursor" onClick={() => this.handlePlay()}>GamePlay</span>
            </div>
          </Fade>
          <Fade bottom distance="20px" duration="600" delay="200">
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
                <div class='dataTable' style={{height: 'calc(100vh - 310px)', padding: 0}}>
                  <Table singleLine fixed style={{margin: 0, padding: 0}}>
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
              </div>
            : <p className="playboard-p" style={{lineHeight:'calc(100vh - 280px)', margin: 0, textAlign:'center', color: 'gray', fontStyle: 'italic'}}> There is no transaction history for this account </p> }
            <div class="pagination">
              <MdKeyboardArrowLeft size='2em' className={`spanarrow ${this.state.beforeAvail ? 'mouseCursor' : 'disable'}`} onClick={this.previewPage}/>
              <span class="spanbox" style={{paddingLeft: '6px', paddingRight: '6px', display: 'inline-block'}}>
                <p className="page-p"> Page {this.state.currentPage} </p>
              </span>
              <MdKeyboardArrowRight className="page-arrow" size='1.5em' className={`spanarrow ${this.state.nextAvail ? 'mouseCursor' : 'disable'}`} onClick={this.nextPage} />
            </div>
          </div>
          </Fade>
        </div>
      </div>
    )
  }
}

export default History;