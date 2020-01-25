import React from 'react'
import { withRouter } from 'react-router-dom';
import '../additional.css';
import teleport1 from '../Images/chateau_.png';
import teleport2 from '../Images/serenity_.png';
import { Button } from 'decentraland-ui'
import { Image} from 'semantic-ui-react'
import Global from '../constant';
import LogoSpinner from '../../LogoSpinner'
import WalletInfo from './walletInfo'

const INITIAL_STATE = {
  isRunningTransaction: false,
};

class Dashboard extends React.Component {
  showSpinner = () => this.setState({isRunningTransaction: true})
  hideSpinner = () => this.setState({isRunningTransaction: false})

  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  async componentDidMount() {
  }
  
  render() {
    return (
      <div id="playboard" class="contentContainer">
        <LogoSpinner show={this.state.isRunningTransaction}/>
        <div style={{marginLeft:'50px', marginRight:'20px'}}>
          <div class="description">
            <p>FEATURED CASINO</p>
            <h3>Serenity Island</h3>
            <p>Serenity Island is Decentral Games' first casino, located at -55,143 in the Decentraland Metaverse. The structure sports a Monty Carlo vibe, situated on a topical island surrounded by water.</p>
            <p><b>Games:</b> MANA Slots, MANA Roulette</p>
          </div>
          <Button id="playButton" color='blue'
          onClick={this.onPlay}
          >
            Play Now
          </Button>
          <div class="teleport" style={{marginTop: '50px'}}>
            <p>ALL CASINOS</p>
            <a href="/chateau/">
              <Image src={teleport1} inline style={{marginLeft:'-5px'}}/>
            </a>
            <a href="/serenity/">
              <Image src={teleport2} inline style={{marginLeft:'20px'}}/>
            </a>
          </div>
        </div>
        <WalletInfo showSpinner={this.showSpinner} hideSpinner={this.hideSpinner} />
      </div>
    )
  }
}

export default withRouter(Dashboard);
