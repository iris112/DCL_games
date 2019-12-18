import React from 'react'
import '../additional.css';
import { Table } from 'semantic-ui-react'

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

      if (json.result.length > 0) {
        var el = document.querySelector('.dataTable');
        el.addEventListener('scroll', function(e) {
        (function(el){
          el.classList.add('scrollTable');
          setTimeout(function() {
            el.classList.remove('scrollTable');
          }, 1000);    
        })(el);
        })
      }
    } else {
      this.setState({data: []});
    }
  }

  getData = () => {
    return fetch(`${Global.BASE_URL}/order/getPlayInfo`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // address: '0x5aae39aed818b07235dc8bedbf5698bb4f299ef3',
        address: window.web3.currentProvider.selectedAddress,
      })
    })
  }

  render() {
    const data = this.state.data; 

    return (
      <div class="contentContainer">
        <div style={{width: 'calc(100% - 80px)', minWidth: '860px', marginTop: '20px'}}>
          <h3 style={{paddingTop: '20px'}}> Transaction History </h3>
          <div id='tx-box' style={{ marginTop: '20px'}}>
            <Table id='header' singleLine fixed style={{marginBottom: 0}}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell style={{paddingLeft: '20px'}}>Game</Table.HeaderCell>
                  <Table.HeaderCell>Bet</Table.HeaderCell>
                  <Table.HeaderCell>Payout</Table.HeaderCell>
                  <Table.HeaderCell>Timestamp</Table.HeaderCell>
                  <Table.HeaderCell>Transaction ID</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
             </Table>
             { data.length != 0 ?
               <div class='dataTable' style={{height: '600px'}}>
                <Table singleLine fixed>
                  <Table.Header></Table.Header>
                  <Table.Body>
                    {data.map((row) => {
                      var date = new Date(row.createdAt);
                      var timestamp = date.toLocaleString();
                      var amount = Number(row.betAmount) / (10 ** Global.TOKEN_DECIMALS);
                      var payout = Number(row.amountWin) / (10 ** Global.TOKEN_DECIMALS);
                      timestamp = timestamp.replace(timestamp.substr(-2), '').trim();

                      return (
                        <Table.Row>
                          <Table.Cell style={{paddingLeft: '20px'}}>Slots</Table.Cell>
                          <Table.Cell>{amount} MANA</Table.Cell>
                          <Table.Cell>{payout} MANA</Table.Cell>
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
                    })}
                  </Table.Body>
                </Table>
              </div>
            : <p style={{lineHeight:'600px', textAlign:'center', color: 'gray', fontStyle: 'italic'}}> There is no transaction history for this account </p> }
          </div>
        </div>
      </div>
    )
  }
}

export default History;