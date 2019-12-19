import React from 'react'
import '../additional.css';
import { Table } from 'semantic-ui-react'
import Spinner from '../../Spinner'
import mana from '../Images/mana.png';

import Global from '../constant';

const INITIAL_STATE = {
  data: [],
  isRunningTransaction: false,
};

class Deposit extends React.Component {
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
    const response = await this.getData();
    const json = await response.json();
    if (json.result !== 'false') {
      this.setState({data: json.result});

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
    } else {
      this.setState({data: []});
    }
  }

  getData = () => {
    return fetch(`${Global.BASE_URL}/admin/getMachine`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
  }

  render() {
    const data = this.state.data;

    // return (
    //   <div class="contentContainer">
    //     <div style={{width: 'calc(100% - 50px)', minWidth: '860px', marginTop: '20px'}}>
    //       <h3 style={{paddingTop: '20px'}}> Machines </h3>
    //       <div id='tx-box' style={{ marginTop: '20px'}}>
    //         <Table singleLine fixed style={{marginBottom: 0}}>
    //           <Table.Header>
    //             <Table.Row>
    //               <Table.HeaderCell style={{textAlign: 'right', paddingLeft:'20px', minWidth: '100px'}}>Game</Table.HeaderCell>
    //               <Table.HeaderCell style={{textAlign: 'right', minWidth: '120px'}}>Machine ID</Table.HeaderCell>
    //               <Table.HeaderCell style={{textAlign: 'right', minWidth: '180px'}}>Bets</Table.HeaderCell>
    //               <Table.HeaderCell style={{textAlign: 'right', minWidth: '180px'}}>Payout</Table.HeaderCell>
    //               <Table.HeaderCell style={{textAlign: 'right', paddingRight: '60px'}}>Timestamp</Table.HeaderCell>
    //             </Table.Row>
    //           </Table.Header>
    //         </Table>
    //         { data.length != 0 ?
    //           <div class='dataTable' style={{height: 'calc(100vh - 200px)'}}>
    //             <Table singleLine fixed>
    //               <Table.Header></Table.Header>
    //               <Table.Body>
    //                 {data.map((row) => {
    //                   var bets = (Number(row.totalBetAmount) / (10 ** Global.TOKEN_DECIMALS)).toFixed(0);
    //                   var payouts = (Number(row.totalAmountWin) / (10 ** Global.TOKEN_DECIMALS)).toFixed(0);
    //                   var date = new Date(row.latestSessionDate);
    //                   var timestamp = date.toLocaleString();
    //                   timestamp = timestamp.replace(timestamp.substr(-2), '').trim();

    //                   return (
    //                     <Table.Row>
    //                       <Table.Cell style={{textAlign: 'right', paddingLeft:'20px', minWidth: '100px'}}>Slots</Table.Cell>
    //                       <Table.Cell style={{textAlign: 'right', minWidth: '120px'}}>{row.machineID}</Table.Cell>
    //                       <Table.Cell style={{textAlign: 'right', minWidth: '180px'}}>{bets} MANA</Table.Cell>
    //                       <Table.Cell style={{textAlign: 'right', minWidth: '180px'}}>{payouts} MANA</Table.Cell>
    //                       <Table.Cell>{timestamp}<i style={{marginLeft:'5px'}}>&#x25B8;</i></Table.Cell>
    //                     </Table.Row>
    //                   );
    //                 })}
    //               </Table.Body>
    //             </Table>
    //           </div>
    //         : <p style={{lineHeight:'calc(100vh - 200px)', textAlign:'center', color: 'gray', fontStyle: 'italic'}}> There are no deposits/withdrawals for this account </p> }
    //       </div>
    //     </div>
    //   </div>
    // )
    return (
      <div class="contentContainer">
        <div style={{width: 'calc(100% - 50px)', minWidth: '860px', marginTop: '20px'}}>
          <h3 style={{paddingTop: '20px'}}> Machines </h3>
          <div id='tx-box' style={{ marginTop: '20px'}}>
            <Table id='header' singleLine fixed style={{marginBottom: 0}}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell style={{paddingLeft:'20px'}}>Game</Table.HeaderCell>
                  <Table.HeaderCell>Machine ID</Table.HeaderCell>
                  <Table.HeaderCell>Bets</Table.HeaderCell>
                  <Table.HeaderCell>Payout</Table.HeaderCell>
                  <Table.HeaderCell>Timestamp</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
            </Table>
            { data.length != 0 ?
              <div class='dataTable' style={{height: 'calc(100vh - 200px)'}}>
                <Table singleLine fixed>
                  <Table.Header></Table.Header>
                  <Table.Body>
                    {data.map((row) => {
                      var bets = (Number(row.totalBetAmount) / (10 ** Global.TOKEN_DECIMALS)).toFixed(0);
                      var payouts = (Number(row.totalAmountWin) / (10 ** Global.TOKEN_DECIMALS)).toFixed(0);
                      var date = new Date(row.latestSessionDate);
                      var timestamp = date.toLocaleString();
                      timestamp = timestamp.replace(timestamp.substr(-2), '').trim();

                      return (
                        <Table.Row>
                          <Table.Cell style={{paddingLeft:'20px'}}>
                            <img style={{verticalAlign:'middle'}} class="image inline" width="20px" height="20px" src={mana} />
                            <span style={{textAlign: 'left', marginLeft: '10px'}}>
                              MANA Slots
                            </span>
                          </Table.Cell>
                          <Table.Cell>{row.machineID}</Table.Cell>
                          <Table.Cell>{bets} MANA</Table.Cell>
                          <Table.Cell>{payouts} MANA</Table.Cell>
                          <Table.Cell>{timestamp}<i style={{marginLeft:'5px'}}>&#x25B8;</i></Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                </Table>
              </div>
            : <p style={{lineHeight:'calc(100vh - 200px)', textAlign:'center', color: 'gray', fontStyle: 'italic'}}> There are no deposits/withdrawals for this account </p> }
          </div>
        </div>
      </div>
    )
  }
}

export default Deposit;