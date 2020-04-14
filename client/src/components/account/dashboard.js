import React from 'react'
import { withRouter } from 'react-router-dom';
import '../additional.css';
import teleport1 from '../Images/chateau.png';
import teleport2 from '../Images/serenity.png';
import { Button } from 'decentraland-ui'
import { Image } from 'semantic-ui-react'
import Global from '../constant';
import LogoSpinner from '../../LogoSpinner'
import WalletInfo from './walletInfo'
import Fade from 'react-reveal/Fade';


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
      <div id="playboard" class="contentContainer" style={{ minWidth: '1000px' }}>
        <LogoSpinner show={this.state.isRunningTransaction}/>
        <div class="bottom-connect" style={{ minWidth: '1000px' }}>
          <div style={{marginLeft:'50px', marginRight:'20px' }}>
            <div class="description" style={{ width: '510px' }}>
              <Fade bottom distance="20px" duration="600">
                <p id="featured-casino-text">FEATURED CASINO</p>
                <h3 className="playboard-h3">Chateau Satoshi</h3>
                <p className="playboard-p">Chateau Satoshi is Decentral Games' first casino, located at (-75, 77) in the Decentraland Metaverse. The structure sports an elegant Art Deco vibe, situated in an ideal location in Vegas City.</p>
                <p className="playboard-p">Games: MANA Slots, MANA Roulette</p>
              </Fade>
            </div>
            <Fade bottom distance="20px" duration="600">
              <Button color='blue' className="play-shimmer animate2"
              onClick={this.onPlay}
              href="https://play.decentraland.org/?position=-75%2C77&realm=fenrir-gold"
              >
                Play Now
              </Button>
            </Fade>
            <div class="teleport" style={{marginTop: '50px' }}>
              <Fade bottom distance="20px" duration="600" delay="200">
                <p id="featured-casino-text" style={{ paddingBottom: '10px' }}>ALL CASINOS</p>
              </Fade>
              <Fade bottom distance="20px" duration="600" delay="200">
                <div style={{ marginLeft: '-6px' }}>
                  <a href="https://play.decentraland.org/?position=-75%2C77&realm=fenrir-gold">
                    <Image src={teleport1} inline id="dashboard-casino-img"/>
                  </a>
                  <a href="https://play.decentraland.org/?position=-55%2C143&realm=fenrir-gold">
                    <Image src={teleport2} inline style={{marginLeft: '20px' }} id="dashboard-casino-img"/>
                  </a>
                </div>
              </Fade>
            </div>
          </div>
        </div>
        <Fade bottom distance="20px" duration="600" delay="200">
          <WalletInfo showSpinner={this.showSpinner} hideSpinner={this.hideSpinner} />
        </Fade>
      </div>
    )
  }
}

export default withRouter(Dashboard);
