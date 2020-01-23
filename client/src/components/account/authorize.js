import React from 'react'
import { withRouter } from 'react-router-dom';
import '../additional.css';
import { Button } from 'decentraland-ui'
import mana from '../Images/mana.png';
import Global from '../constant';
import LogoSpinner from '../../LogoSpinner'
import ModalDeposit from '../ModalDeposit';

var USER_ADDRESS;

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
        <div style={{width: 'calc(100% - 50px)', minWidth: '860px', marginTop: '20px', marginLeft: '30px'}}>
          <h3 style={{paddingTop: '20px'}}> Authorizations </h3>
          <div style={{ marginTop: '20px', height: '675px'}}>
            <div class='balanceBox' id='balance-pad'>
              <div style={{marginBottom: '20px'}}>
                <img style={{verticalAlign:'middle'}} class="image inline" width="20px" height="20px" src={mana} />
                <span class="balanceAmount" style={{textAlign: 'left'}}>
                  MANA Slots
                </span>
              </div>
              <ModalDeposit showSpinner={this.showSpinner} hideSpinner={this.hideSpinner} update={this.props.update}
              type={1} authorized={this.props.authorized & 4} authvalue={4} />
            </div>
            <div id='balance-pad' class='balanceBox' style={{marginLeft: '20px'}}>
              <div style={{marginBottom: '20px'}}>
                <img style={{verticalAlign:'middle'}} class="image inline" width="20px" height="20px" src={mana} />
                <span class="balanceAmount" style={{textAlign: 'left'}}>
                  MANA Roulette
                </span>
              </div>
              <ModalDeposit showSpinner={this.showSpinner} hideSpinner={this.hideSpinner} update={this.props.update}
              type={1} authorized={this.props.authorized & 2} authvalue={2} />
            </div>
            <div id='balance-pad' class='balanceBox' style={{marginLeft: '20px'}}>
              <div style={{marginBottom: '20px'}}>
                <img style={{verticalAlign:'middle'}} class="image inline" width="20px" height="20px" src={mana} />
                <span class="balanceAmount" style={{textAlign: 'left'}}>
                  MANA Blackjack
                </span>
              </div>
              <ModalDeposit showSpinner={this.showSpinner} hideSpinner={this.hideSpinner} update={this.props.update}
              type={1} authorized={this.props.authorized & 1} commingsoon={1} authvalue={1} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Authorize);
