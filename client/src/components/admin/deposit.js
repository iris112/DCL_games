import React from 'react'
import '../additional.css';
import { Table } from 'semantic-ui-react'
import Spinner from '../../Spinner'

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
    return fetch(`${Global.BASE_URL}/admin/getDeposit`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
  }

  render() {
    const data = this.state.data;

    return (
      <div class="contentContainer">
        <div style={{width: 'calc(100% - 50px)', minWidth: '860px', marginTop: '20px'}}>
          <h3 style={{paddingTop: '20px'}}> Deposits/Withdrawals </h3>
          <div id='tx-box' style={{ marginTop: '20px'}}>
            <Table id='header' singleLine fixed style={{marginBottom: 0}}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell style={{paddingLeft:'20px'}}>Type</Table.HeaderCell>
                  <Table.HeaderCell>Player</Table.HeaderCell>
                  <Table.HeaderCell>Amount</Table.HeaderCell>
                  <Table.HeaderCell>Progress</Table.HeaderCell>
                  <Table.HeaderCell>Timestamp</Table.HeaderCell>
                  <Table.HeaderCell>ID</Table.HeaderCell>
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
                      timestamp = timestamp.replace(timestamp.substr(-2), '').trim();

                      return (
                        <Table.Row>
                          <Table.Cell style={{paddingLeft:'20px'}}>{row.type}</Table.Cell>
                          <Table.Cell>{row.address.substr(0, 6) + '...' + row.address.substr(-4)}</Table.Cell>
                          <Table.Cell>{row.amount} MANA</Table.Cell>
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