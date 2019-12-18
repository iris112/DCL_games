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
        <Spinner show={this.state.isRunningTransaction}/>
        <Table singleLine fixed style={{marginBottom: 0}}>
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
          <div style={{overflowY: 'auto', height: '480px'}}>
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
                      <Table.Cell>{row.address} MANA</Table.Cell>
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
        : <p style={{width: '820px', lineHeight:'450px', textAlign:'center', color: 'gray', fontStyle: 'italic'}}> There is no deposit/withdraw for this account </p> }
      </div>
    )
  }
}

export default Deposit;