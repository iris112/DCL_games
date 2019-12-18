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
    const response = await this.getData();
    const json = await response.json();
    if (json.result !== 'false') {
      this.setState({data: json.result});
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

    return (
      <div class="contentContainer">
        <Spinner show={this.state.isRunningTransaction}/>
        <Table singleLine fixed style={{marginBottom: 0}}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell style={{textAlign: 'right', paddingLeft:'20px', width: '100px'}}>Game</Table.HeaderCell>
              <Table.HeaderCell style={{textAlign: 'right', width: '120px'}}>Machine ID</Table.HeaderCell>
              <Table.HeaderCell style={{textAlign: 'right', width: '180px'}}>Bets</Table.HeaderCell>
              <Table.HeaderCell style={{textAlign: 'right', width: '180px'}}>Payout</Table.HeaderCell>
              <Table.HeaderCell style={{textAlign: 'right', paddingRight: '60px'}}>Timestamp</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
        </Table>
        { data.length != 0 ?
          <div style={{overflowY: 'auto', height: '480px'}}>
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
                      <Table.Cell style={{textAlign: 'right', paddingLeft:'20px', width: '100px'}}>Slots</Table.Cell>
                      <Table.Cell style={{textAlign: 'right', width: '120px'}}>{row.machineID}</Table.Cell>
                      <Table.Cell style={{textAlign: 'right', width: '180px'}}>{bets} MANA</Table.Cell>
                      <Table.Cell style={{textAlign: 'right', width: '180px'}}>{payouts} MANA</Table.Cell>
                      <Table.Cell>{timestamp}<i style={{marginLeft:'5px'}}>&#x25B8;</i></Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </div>
        : <p style={{width: '820px', lineHeight:'450px', textAlign:'center', color: 'gray', fontStyle: 'italic'}}> There is no deposit/withdraw for this account </p> }
      </div>
    )
  }
}

export default Deposit;