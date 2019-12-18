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
    const response = await this.getData();
    const json = await response.json();
    if (json.result !== 'false') {
      this.setState({data: json.result});
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

    return (
      <div class="contentContainer">
        <Table singleLine fixed style={{marginBottom: 0}}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell style={{paddingLeft: '20px', width: '260px'}}>Player</Table.HeaderCell>
              <Table.HeaderCell style={{width: '65px'}}>Game</Table.HeaderCell>
              <Table.HeaderCell style={{width: '100px'}}>MachineID</Table.HeaderCell>
              <Table.HeaderCell style={{width: '95px'}}>Bet</Table.HeaderCell>
              <Table.HeaderCell style={{width: '95px'}}>Payout</Table.HeaderCell>
              <Table.HeaderCell style={{textAlign: 'right', paddingRight: '40px'}}>Timestamp</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
         </Table>
         { data.length != 0 ?
           <div style={{overflowY: 'auto', height: '480px', overflowX: 'hidden'}}>
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
                      <Table.Cell style={{paddingLeft: '20px', width: '260px', fontSize: '0.6em'}}>
                        <a style={{color: 'gray'}} 
                           target="_blank" href={`https://explorer.testnet2.matic.network/address/${row.address}`}>
                          {row.address}
                        </a>
                      </Table.Cell>
                      <Table.Cell style={{width: '65px'}}>Slots</Table.Cell>
                      <Table.Cell style={{width: '100px'}}>{row.machineID}</Table.Cell>
                      <Table.Cell style={{width: '95px'}}>{amount} MANA</Table.Cell>
                      <Table.Cell style={{width: '95px'}}>{payout} MANA</Table.Cell>
                      <Table.Cell>{timestamp} <i style={{marginLeft:'5px'}}>&#x25B8;</i></Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </div>
        : <p style={{width: '820px', lineHeight:'450px', textAlign:'center', color: 'gray', fontStyle: 'italic'}}> There is no transaction history for this account </p> }
      </div>
    )
  }
}

export default History;