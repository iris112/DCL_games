import React from 'react'
import '../additional.css';
import { Table } from 'semantic-ui-react'
import mana from '../Images/mana.png';

import Global from '../constant';

const INITIAL_STATE = {
  data: [],
};

class History extends React.Component {
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
    return fetch(`${Global.BASE_URL}/admin/getHistory`, {
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
    //         <Table id='header' singleLine fixed style={{marginBottom: 0}}>
    //           <Table.Header>
    //             <Table.Row>
    //               <Table.HeaderCell style={{paddingLeft: '20px', minWidth: '260px'}}>Player</Table.HeaderCell>
    //               <Table.HeaderCell style={{minWidth: '65px'}}>Game</Table.HeaderCell>
    //               <Table.HeaderCell style={{minWidth: '100px'}}>MachineID</Table.HeaderCell>
    //               <Table.HeaderCell style={{minWidth: '95px'}}>Bet</Table.HeaderCell>
    //               <Table.HeaderCell style={{minWidth: '95px'}}>Payout</Table.HeaderCell>
    //               <Table.HeaderCell style={{textAlign: 'right', paddingRight: '40px'}}>Timestamp</Table.HeaderCell>
    //             </Table.Row>
    //           </Table.Header>
    //          </Table>
    //          { data.length != 0 ?
    //            <div class='dataTable' style={{height: 'calc(100vh - 200px)'}}>
    //             <Table singleLine fixed>
    //               <Table.Header></Table.Header>
    //               <Table.Body>
    //                 {data.map((row) => {
    //                   var date = new Date(row.createdAt);
    //                   var timestamp = date.toLocaleString();
    //                   var amount = Number(row.betAmount) / (10 ** Global.TOKEN_DECIMALS);
    //                   var payout = Number(row.amountWin) / (10 ** Global.TOKEN_DECIMALS);
    //                   timestamp = timestamp.replace(timestamp.substr(-2), '').trim();

    //                   return (
    //                     <Table.Row>
    //                       <Table.Cell style={{paddingLeft: '20px', minWidth: '260px', fontSize: '0.6em'}}>
    //                         <a style={{color: 'gray'}} 
    //                            target="_blank" href={`https://explorer.testnet2.matic.network/address/${row.address}`}>
    //                           {row.address}
    //                         </a>
    //                       </Table.Cell>
    //                       <Table.Cell style={{minWidth: '65px'}}>Slots</Table.Cell>
    //                       <Table.Cell style={{minWidth: '100px'}}>{row.machineID}</Table.Cell>
    //                       <Table.Cell style={{minWidth: '95px'}}>{amount} MANA</Table.Cell>
    //                       <Table.Cell style={{minWidth: '95px'}}>{payout} MANA</Table.Cell>
    //                       <Table.Cell>{timestamp} <i style={{marginLeft:'5px'}}>&#x25B8;</i></Table.Cell>
    //                     </Table.Row>
    //                   );
    //                 })}
    //               </Table.Body>
    //             </Table>
    //           </div>
    //         : <p style={{lineHeight:'calc(100vh - 200px)', textAlign:'center', color: 'gray', fontStyle: 'italic'}}> There is no transaction history for this account </p> }
    //       </div>
    //     </div>
    //   </div>
    // )

    return (
      <div class="contentContainer">
        <div style={{width: 'calc(100% - 50px)', minWidth: '860px', marginTop: '20px'}}>
          <h3 style={{paddingTop: '20px'}}> Transaction History </h3>
          <div id='tx-box' style={{ marginTop: '20px'}}>
            <Table id='header' singleLine fixed style={{marginBottom: 0}}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell style={{paddingLeft: '20px'}}>Game</Table.HeaderCell>
                  <Table.HeaderCell>MachineID</Table.HeaderCell>
                  <Table.HeaderCell>Player</Table.HeaderCell>
                  <Table.HeaderCell>Bet</Table.HeaderCell>
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
                      var date = new Date(row.createdAt);
                      var timestamp = date.toLocaleString();
                      var amount = Number(row.betAmount) / (10 ** Global.TOKEN_DECIMALS);
                      var payout = Number(row.amountWin) / (10 ** Global.TOKEN_DECIMALS);
                      timestamp = timestamp.replace(timestamp.substr(-2), '').trim();
                      var game;

                      if (row.gameType) {
                      if (row.gameType == 1)
                         game = "MANA Slots";
                       else
                         game = "MANA Roulette";
                      } else {
                       if (row.type === 'Roulette')
                         game = "MANA Roulette";
                       else
                         game = "MANA Slots";
                      }

                      return (
                        <Table.Row>
                          <Table.Cell style={{paddingLeft: '20px'}}>
                            <img style={{verticalAlign:'middle'}} class="image inline" width="20px" height="20px" src={mana} />
                            <span style={{textAlign: 'left', marginLeft: '10px'}}>
                              {game}
                            </span>
                          </Table.Cell>
                          <Table.Cell>{row.machineID}</Table.Cell>
                          <Table.Cell>
                            <a style={{color: 'gray'}} 
                               target="_blank" href={`https://explorer.testnet2.matic.network/address/${row.address}`}>
                              {row.address.substr(0, 6) + '...' + row.address.substr(-4)}
                            </a>
                          </Table.Cell>
                          <Table.Cell>{amount} MANA</Table.Cell>
                          <Table.Cell>{payout} MANA</Table.Cell>
                          <Table.Cell>{timestamp} <i style={{marginLeft:'5px'}}>&#x25B8;</i></Table.Cell>
                        </Table.Row>
                      );
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
