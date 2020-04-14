import React from 'react'
import { withRouter } from 'react-router-dom';
import '../additional.css';
import { Button } from 'decentraland-ui'
import { Grid, Icon } from 'semantic-ui-react'
import mana from '../Images/mana.png';
import Global from '../constant';
import LogoSpinner from '../../LogoSpinner'
import ModalDeposit from '../ModalDeposit';
import Fade from 'react-reveal/Fade'


var USER_ADDRESS;
var contract_address = Global.MASTER_CONTRACT_ADDRESS;
var matic_url = '/explorer.testnet2.matic.network/address/';
var contract_url = matic_url + contract_address;


const INITIAL_STATE = {
  isRunningTransaction: false,
};

class Authorize extends React.Component {
  showSpinner = () => this.setState({isRunningTransaction: true})
  hideSpinner = () => this.setState({isRunningTransaction: false})

  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    if (window.web3) {
      USER_ADDRESS = window.web3.currentProvider.selectedAddress;
    }
  }

  async componentDidMount() {
  }

  render() {
    return (
      <div class="contentContainer">
        <LogoSpinner show={this.state.isRunningTransaction}/>
        <div style={{width: 'calc(100% - 90px)', marginTop: '20px', marginLeft: '45px', marginRight: '45px'}}>
          <Fade bottom distance="20px" duration="600">
            <h3 className="account-h3" style={{paddingTop: '20px'}}> Authorizations </h3>
          </Fade>
          <Fade bottom distance="20px" duration="600" delay="200">
            <div style={{ marginTop: '20px', height: '675px'}}>
              <Grid style={{ justifyContent: "space-between" }}>
                <Grid.Row>
                  <Grid.Column computer={5} tablet={16} mobile={16}>
                    <div class='balanceBox' id='balance-pad'>
                      <div style={{marginBottom: '20px'}}>
                        <img style={{verticalAlign:'middle'}} class="image inline" width="20px" height="20px" src={mana} />
                        <a href={`https:/${contract_url}`} >
                          <span class="balanceAmount" style={{textAlign: 'left'}}>
                            MANA Slots/Roulette
                            <i className="info circle icon"
                              style={{
                                cursor: 'pointer', 
                                verticalAlign: 'top',
                                paddingLeft: '3px', 
                                marginTop: '-4px',
                                fontSize: '12px'
                              }}
                            />
                          </span>
                        </a>
                      </div>
                      <ModalDeposit showSpinner={this.showSpinner} hideSpinner={this.hideSpinner} update={this.props.update}
                      type={1} authorized={this.props.authorized & 4} authvalue={4} />
                    </div>
                  </Grid.Column>
                  <Grid.Column computer={5} tablet={16} mobile={16}>
                    <div id='balance-pad' class='balanceBox'>
                      <div style={{marginBottom: '20px'}}>
                        <img style={{verticalAlign:'middle'}} class="image inline" width="20px" height="20px" src={mana} />
                        <span class="balanceAmount" style={{textAlign: 'left'}}>
                          MANA Backgammon
                        </span>
                      </div>
                      <ModalDeposit showSpinner={this.showSpinner} hideSpinner={this.hideSpinner} update={this.props.update}
                      type={1} authorized={this.props.authorized & 1} commingsoon={1} authvalue={1} />
                    </div>
                  </Grid.Column>
                  <Grid.Column computer={5} tablet={16} mobile={16}>
                    <div id='balance-pad' class='balanceBox'>
                      <div style={{marginBottom: '20px'}}>
                        <img style={{verticalAlign:'middle'}} class="image inline" width="20px" height="20px" src={mana} />
                        <span class="balanceAmount" style={{textAlign: 'left'}}>
                          MANA Blackjack
                        </span>
                      </div>
                      <ModalDeposit showSpinner={this.showSpinner} hideSpinner={this.hideSpinner} update={this.props.update}
                      type={1} authorized={this.props.authorized & 1} commingsoon={1} authvalue={1} />
                    </div>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </div>
          </Fade>
        </div>
      </div>
    )
  }
}

export default withRouter(Authorize);
