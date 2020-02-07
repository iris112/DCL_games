import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Grid, Header, Icon, Menu, Divider, Input, Breadcrumb, Message, Reveal, Statistic } from "semantic-ui-react";
import { Segment, Container, Center, Button, Image, Card } from "decentraland-ui";
import Global from './constant';
import Navbar2 from "./Navbar2";
import Navbar3 from "./nav-mobile";
import { isMobile } from "react-device-detect";
import Footer from "./Footer";
import ReactGA from "react-ga";
import slots from './Images/slots-1.png'
import slots2 from './Images/slots-2.png'
import overlaySlots from './Images/slots_overlay.png'
import roulette from './Images/roulette-1.png'
import roulette2 from './Images/roulette-2.png'
import overlayRoulette from './Images/roulette_overlay.png'
import blackjack from './Images/blackjack.png'
import dice from './Images/dice.png'
import soon from './Images/soon_hover.png'
import chateau from './Images/chateau-home.jpeg'
import chateau3 from './Images/chateau-home2.png'
import serenity from './Images/serenity-home.jpeg'
import chateau2 from './Images/chateau.gif'
import serenity2 from './Images/serenity.gif'
import preview from './Images/preview.png'
import Hls from "hls.js";
import CountUp from 'react-countup';
import Svgeth from './Images/svg7.js'
import Svgdcl from './Images/svg8.js'
import dcl from './Images/dcl.png'


ReactGA.initialize("UA-146057069-1");
ReactGA.pageview(window.location.pathname);

const INITIAL_STATE = {
  vid_pc: Global.BASE_URL + "/streams/home_pc.m3u8",
  vid_mob: Global.BASE_URL + "/streams/home_mob.m3u8",
  visible: true,
};

class Home extends Component {

  handleDismiss = () => {
    this.setState({ visible: false })
  }

  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    this.isBrowserMetamsk = 0;
    this.hls = null;

    if (window.web3) {
      this.isBrowserMetamsk = 1;
    }
  }

  async componentDidMount() {
  }

  componentWillUnmount() {
  }

  refVideo(ref) {
    if (!ref || !ref.classList)
      return;

    let videoUrl = '';
    if (window.innerWidth >= 720)
      videoUrl = this.state.vid_pc;
    else
      videoUrl = this.state.vid_mob;

    ref.classList.add('hero-image-spin');

    if(Hls.isSupported()) {
      this.hls = new Hls({
        // This configuration is required to insure that only the
        // viewer can access the content by sending a session cookie
        // to api.video service
        xhrSetup: function(xhr, url) {
          xhr.withCredentials = true;
        }
      });

      this.hls.loadSource(videoUrl);
      this.hls.attachMedia(ref);
      // hls.on(Hls.Events.FRAG_LOADED, function() {
      //   player.classList.remove('hero-image-spin');
      // });
    } else if (ref.canPlayType('application/vnd.apple.mpegurl')) {
      ref.src = videoUrl;
      ref.addEventListener('loadedmetadata',function() {
        ref.play();
      });
    }
  }

  render() {

  { /* ----------------------------------------------------------- */ }
  { /*                         NO METAMASK                         */ }
  { /* ----------------------------------------------------------- */ }

  if (!this.isBrowserMetamsk && this.state.visible) {
    return (
      <Segment className='main-segment'>
        <Navbar2 />
        <Navbar3 />

          <div style={{ backgroundColor: 'rgba(1, 133, 244, 1)', paddingTop: '60px', marginBottom: '-60px' }}>
            <Container>
              <Message className='modal-msg' onDismiss={this.handleDismiss}>
                <Header className='msg-text'>Please use a desktop Chrome browser to play our free games. To play games with cryptocurrency, you must enable Metamask. You can download Chrome <a className='blue-link' href="https://www.google.com/chrome/">here</a> and Metamask <a className='blue-link' href="https://metamask.io/">here</a>.</Header>
              </Message>
            </Container>
          </div>

        { /* ----------------------------------------------------------- */ }
        { /*                       HERO SECTION                          */ }
        { /* ----------------------------------------------------------- */ }

        <Segment className='hero'>


          <Container className='hero-container'>
            
            {isMobile ? <video className="hero-image" ref={ref => this.refVideo(ref)} preload="auto" playsInline autoPlay muted loop/>
            : <a href='/account'>
                <video className="hero-image" ref={ref => this.refVideo(ref)} preload="auto" playsInline autoPlay muted loop/>
              </a> }
            

					</Container>

          <Container className="stats-container" style={{paddingTop: '60px', paddingBottom: '60px' }}>
            <Header className='games-h' style={{ color: 'white', textAlign: 'center', fontWeight: '300', lineHeight: '54px' }}>
              BY THE NUMBERS
            </Header>

            <Statistic.Group widths='four'>
              <Statistic>
                <Statistic.Value style={{ color: 'white' }}>
                  <Svgdcl className="svg-dcl"/>
                  <CountUp
                    end={250}
                    duration={3}
                  />K
                </Statistic.Value>
                <Statistic.Label className="gold-grad1">Mana Slots Jackpot</Statistic.Label>
              </Statistic>

              <Statistic>
                <Statistic.Value style={{ color: 'white' }}>
                  <Svgdcl className="svg-dcl"/>
                  <CountUp
                    end={360}
                    duration={3}
                  />K
                </Statistic.Value>
                <Statistic.Label className="gold-grad2">Mana Roulette Jackpot</Statistic.Label>
              </Statistic>

              <Statistic>
                <Statistic.Value style={{ color: 'white' }}>
                  <Svgeth className="svg-eth2" />
                  <CountUp
                    end={4}
                    duration={3}
                  />
                </Statistic.Value>
                <Statistic.Label className="gold-grad3">Coins Offered</Statistic.Label>
              </Statistic>

              <Statistic>
                <Statistic.Value style={{ color: 'white' }}>
                  <Svgdcl className="svg-dcl"/>
                  <CountUp
                    end={199}
                    duration={3}
                  />
                </Statistic.Value>
                <Statistic.Label className="gold-grad4">dcl parcels</Statistic.Label>
              </Statistic>
            </Statistic.Group>

          </Container>

          <Container className="stats-container2" style={{paddingTop: '60px', paddingBottom: '60px' }}>
            <Header className='games-h' style={{ color: 'white', textAlign: 'center', fontWeight: '300', lineHeight: '54px' }}>
              BY THE NUMBERS
            </Header>

            <Statistic.Group widths='two'>
              <Statistic style={{ paddingBottom: '30px' }}>
                <Statistic.Value style={{ color: 'white' }}>
                  <Svgdcl className="svg-dcl"/>
                  <CountUp
                    className="statistic-value"
                    end={250}
                    duration={3}
                  /><span className="statistic-value">K</span>
                </Statistic.Value>
                <Statistic.Label className="gold-grad1">Mana Slots <br /> Jackpot</Statistic.Label>
              </Statistic>

              <Statistic>
                <Statistic.Value style={{ color: 'white' }}>
                  <Svgdcl className="svg-dcl"/>
                  <CountUp
                    className="statistic-value"
                    end={360}
                    duration={3}
                  /><span className="statistic-value">K</span>
                </Statistic.Value>
                <Statistic.Label className="gold-grad2">Mana Roulette  <br /> Jackpot</Statistic.Label>
              </Statistic>

              <Statistic>
                <Statistic.Value style={{ color: 'white' }}>
                  <Svgeth className="svg-eth2" />
                  <CountUp
                    className="statistic-value"
                    end={4}
                    duration={3}
                  />
                </Statistic.Value>
                <Statistic.Label className="gold-grad3">Coins Offered</Statistic.Label>
              </Statistic>

              <Statistic>
                <Statistic.Value style={{ color: 'white' }}>
                  <Svgdcl className="svg-dcl"/>
                  <CountUp
                    className="statistic-value"
                    end={199}
                    duration={3}
                  />
                </Statistic.Value>
                <Statistic.Label className="gold-grad4">dcl parcels</Statistic.Label>
              </Statistic>
            </Statistic.Group>

          </Container>
        </Segment>


        { /* ----------------------------------------------------------- */ }
        { /*                     GAMES SECTION                         */ }
        { /* ----------------------------------------------------------- */ }

        <Segment className='games'>
   

          <Container>
            <Header className='games-h1'>
              GAMES
            </Header>
            <p className="playboard-p" style={{ color: 'white', paddingBottom: '9px', marginTop: '-6px' }}> Playable for free and with MANA. ETH, DAI and DG coming soon </p>

            <Grid>

              <Grid.Row>
                <Grid.Column computer={4} tablet={4} mobile={8}>
                  <Card fluid className='games-card'>
                    <Reveal animated='fade'>
                      <Reveal.Content visible>
                        <Image className='card-image' src={slots} />
                      </Reveal.Content>
                      <Reveal.Content hidden>
                        <Image className='card-image' src={slots2} />
                      </Reveal.Content>
                    </Reveal>
                    <Card.Content>
                      <Card.Header className='card-header'>SLOTS</Card.Header>
                    </Card.Content>
                  </Card>
                </Grid.Column>

                <Grid.Column computer={4} tablet={4} mobile={8}>
                  <Card fluid className='games-card'>
                    <Reveal animated='fade'>
                      <Reveal.Content visible>
                        <Image className='card-image' src={roulette} />
                      </Reveal.Content>
                      <Reveal.Content hidden>
                        <Image className='card-image' src={roulette2} />
                      </Reveal.Content>
                    </Reveal>
                    <Card.Content className='card-border'>
                      <Card.Header className='card-header'>ROULETTE</Card.Header>
                    </Card.Content>
                  </Card>
                </Grid.Column>

                <Grid.Column computer={4} tablet={4} mobile={8}>
                  <Card fluid className='games-card2'>
                    <Reveal animated='fade'>
                      <Reveal.Content visible>
                        <Image className='card-image' src={blackjack} />
                      </Reveal.Content>
                      <Reveal.Content hidden>
                        <Image className='card-image' src={soon} />
                      </Reveal.Content>
                    </Reveal>
                    <Card.Content className='card-border'>
                      <Card.Header className='card-header'>BLACKJACK</Card.Header>
                    </Card.Content>
                  </Card>
                </Grid.Column>

                <Grid.Column computer={4} tablet={4} mobile={8}>
                  <Card fluid className='games-card2'>
                    <Reveal animated='fade'>
                      <Reveal.Content visible>
                        <Image className='card-image' src={dice} />
                      </Reveal.Content>
                      <Reveal.Content hidden>
                        <Image className='card-image' src={soon} />
                      </Reveal.Content>
                    </Reveal>
                    <Card.Content className='card-border'>
                      <Card.Header className='card-header'>BACKGAMMON</Card.Header>
                    </Card.Content>
                  </Card>
                </Grid.Column>
              </Grid.Row>

            </Grid>

          </Container>
        </Segment>

        { /* ----------------------------------------------------------- */ }
        { /*                      CASINO SECTION                         */ }
        { /* ----------------------------------------------------------- */ }

        <Segment className='casino'>
          <Container>

            <Header className='casino-h1'>
              CASINOS
            </Header>
            <p className="playboard-p" style={{ color: 'white', paddingBottom: '9px', marginTop: '-6px' }}> Playable in Decentraland </p>

            <Grid>

              <Grid.Row>
                <Grid.Column computer={8} tablet={8} mobile={16}>
                  <Card fluid href='/chateau/' className='games-card'>
                    <Reveal animated='fade'>
                      <Reveal.Content visible>
                        <Image className='card-image' src={chateau3} />
                      </Reveal.Content>
                      <Reveal.Content hidden>
                        <Image className='card-image' src={chateau2} />
                      </Reveal.Content>
                    </Reveal>
                    <Card.Content className='card-border'>
                      <Card.Header className='card-header'>CHATEAU SATOSHI</Card.Header>
                    </Card.Content>
                  </Card>
                </Grid.Column>

                <Grid.Column computer={8} tablet={8} mobile={16}>
                  <Card fluid href='/serenity/' className='games-card2'>
                    <Reveal animated='fade'>
                      <Reveal.Content visible>
                        <Image fluid className='card-image' src={serenity} />
                      </Reveal.Content>
                      <Reveal.Content hidden>
                        <Image className='card-image' src={serenity2} />
                      </Reveal.Content>
                    </Reveal>
                    <Card.Content className='card-border'>
                      <Card.Header className='card-header'>SERENITY ISLAND</Card.Header>
                    </Card.Content>
                  </Card>
                </Grid.Column>
              </Grid.Row>

            </Grid>

          </Container>
        </Segment>

        <Footer />
      </Segment>
    );
  }

  { /* ----------------------------------------------------------- */ }
  { /*                       WITH METAMASK                         */ }
  { /* ----------------------------------------------------------- */ }

    return (
      <Segment className='main-segment' style={{ marginTop: '6px' }}>
        <Navbar2 />
        <Navbar3 />

        { /* ----------------------------------------------------------- */ }
        { /*                       HERO SECTION                          */ }
        { /* ----------------------------------------------------------- */ }

        <Segment className='hero' style={{ backgroundColor: 'rgb(6, 10, 13)' }}>
          <Container className='hero-container'>
  
          {isMobile ? <video className="hero-image" ref={ref => this.refVideo(ref)} preload="auto" playsInline autoPlay muted loop/>
            : <a href='/account'>
                <video className="hero-image" ref={ref => this.refVideo(ref)} preload="auto" playsInline autoPlay muted loop/>
              </a> }

          </Container>

          <Container className="stats-container" style={{paddingTop: '60px', paddingBottom: '60px' }}>
            <Header className='games-h' style={{ color: 'white', textAlign: 'center', fontWeight: '300', lineHeight: '54px' }}>
              BY THE NUMBERS
            </Header>

            <Statistic.Group widths='four'>
              <Statistic>
                <Statistic.Value style={{ color: 'white' }}>
                  <Svgdcl className="svg-dcl"/>
                  <CountUp
                    end={250}
                    duration={3}
                  />K
                </Statistic.Value>
                <Statistic.Label className="gold-grad1">Mana Slots Jackpot</Statistic.Label>
              </Statistic>

              <Statistic>
                <Statistic.Value style={{ color: 'white' }}>
                  <Svgdcl className="svg-dcl"/>
                  <CountUp
                    end={360}
                    duration={3}
                  />K
                </Statistic.Value>
                <Statistic.Label className="gold-grad2">Mana Roulette Jackpot</Statistic.Label>
              </Statistic>

              <Statistic>
                <Statistic.Value style={{ color: 'white' }}>
                  <Svgeth className="svg-eth2" />
                  <CountUp
                    end={4}
                    duration={3}
                  />
                </Statistic.Value>
                <Statistic.Label className="gold-grad3">Coins Offered</Statistic.Label>
              </Statistic>

              <Statistic>
                <Statistic.Value style={{ color: 'white' }}>
                  <Svgdcl className="svg-dcl"/>
                  <CountUp
                    end={199}
                    duration={3}
                  />
                </Statistic.Value>
                <Statistic.Label className="gold-grad4">dcl parcels</Statistic.Label>
              </Statistic>
            </Statistic.Group>

          </Container>

          <Container className="stats-container2" style={{paddingTop: '60px', paddingBottom: '60px' }}>
            <Header className='games-h' style={{ color: 'white', textAlign: 'center', fontWeight: '300', lineHeight: '54px' }}>
              BY THE NUMBERS
            </Header>

            <Statistic.Group widths='two'>
              <Statistic style={{ paddingBottom: '30px' }}>
                <Statistic.Value style={{ color: 'white' }}>
                  <Svgdcl className="svg-dcl"/>
                  <CountUp
                    className="statistic-value"
                    end={250}
                    duration={3}
                  /><span className="statistic-value">K</span>
                </Statistic.Value>
                <Statistic.Label className="gold-grad1">Mana Slots <br /> Jackpot</Statistic.Label>
              </Statistic>

              <Statistic>
                <Statistic.Value style={{ color: 'white' }}>
                  <Svgdcl className="svg-dcl"/>
                  <CountUp
                    className="statistic-value"
                    end={360}
                    duration={3}
                  /><span className="statistic-value">K</span>
                </Statistic.Value>
                <Statistic.Label className="gold-grad2">Mana Roulette  <br /> Jackpot</Statistic.Label>
              </Statistic>

              <Statistic>
                <Statistic.Value style={{ color: 'white' }}>
                  <Svgeth className="svg-eth2" />
                  <CountUp
                    className="statistic-value"
                    end={4}
                    duration={3}
                  />
                </Statistic.Value>
                <Statistic.Label className="gold-grad3">Coins Offered</Statistic.Label>
              </Statistic>

              <Statistic>
                <Statistic.Value style={{ color: 'white' }}>
                  <Svgdcl className="svg-dcl"/>
                  <CountUp
                    className="statistic-value"
                    end={199}
                    duration={3}
                  />
                </Statistic.Value>
                <Statistic.Label className="gold-grad4">dcl parcels</Statistic.Label>
              </Statistic>
            </Statistic.Group>

          </Container>
        </Segment>


        { /* ----------------------------------------------------------- */ }
        { /*                      GAMES SECTION                          */ }
        { /* ----------------------------------------------------------- */ }

        <Segment className='games'>

          <Container>
            <Header className='games-h1'>
              GAMES
            </Header>
            <p className="playboard-p" style={{ color: 'white', paddingBottom: '9px', marginTop: '-6px' }}> Playable for free and with MANA. ETH, DAI and DG coming soon </p>

            <Grid>

              <Grid.Row>
                <Grid.Column computer={4} tablet={4} mobile={8}>
                  <Card fluid href='/account/' className='games-card'>
                    <Reveal animated='fade'>
                      <Reveal.Content visible>
                        <Image className='card-image' src={slots} />
                      </Reveal.Content>
                      <Reveal.Content hidden>
                        <Image className='card-image' src={slots2} />
                      </Reveal.Content>
                    </Reveal>
                    <Card.Content>
                      <Card.Header className='card-header'>SLOTS</Card.Header>
                    </Card.Content>
                  </Card>
                </Grid.Column>

                <Grid.Column computer={4} tablet={4} mobile={8}>
                  <Card fluid href='/account/' className='games-card'>
                    <Reveal animated='fade'>
                      <Reveal.Content visible>
                        <Image className='card-image' src={roulette} />
                      </Reveal.Content>
                      <Reveal.Content hidden>
                        <Image className='card-image' src={roulette2} />
                      </Reveal.Content>
                    </Reveal>
                    <Card.Content className='card-border'>
                      <Card.Header className='card-header'>ROULETTE</Card.Header>
                    </Card.Content>
                  </Card>
                </Grid.Column>

                <Grid.Column computer={4} tablet={4} mobile={8}>
                  <Card fluid href='/account/' className='games-card2'>
                    <Reveal animated='fade'>
                      <Reveal.Content visible>
                        <Image className='card-image' src={blackjack} />
                      </Reveal.Content>
                      <Reveal.Content hidden>
                        <Image className='card-image' src={soon} />
                      </Reveal.Content>
                    </Reveal>
                    <Card.Content className='card-border'>
                      <Card.Header className='card-header'>BLACKJACK</Card.Header>
                    </Card.Content>
                  </Card>
                </Grid.Column>

                <Grid.Column computer={4} tablet={4} mobile={8}>
                  <Card fluid href='/account/' className='games-card2'>
                    <Reveal animated='fade'>
                      <Reveal.Content visible>
                        <Image className='card-image' src={dice} />
                      </Reveal.Content>
                      <Reveal.Content hidden>
                        <Image className='card-image' src={soon} />
                      </Reveal.Content>
                    </Reveal>
                    <Card.Content className='card-border'>
                      <Card.Header className='card-header'>BACKGAMMON</Card.Header>
                    </Card.Content>
                  </Card>
                </Grid.Column>
              </Grid.Row>

            </Grid>

          </Container>
        </Segment>

        { /* ----------------------------------------------------------- */ }
        { /*                      CASINO SECTION                         */ }
        { /* ----------------------------------------------------------- */ }

        <Segment className='casino'>
          <Container>

            <Header className='casino-h1'>
              CASINOS
            </Header>
            <p className="playboard-p" style={{ color: 'white', paddingBottom: '9px', marginTop: '-6px' }}> Playable in Decentraland</p>

            <Grid>

              <Grid.Row>
                <Grid.Column computer={8} tablet={8} mobile={16}>
                  <Card fluid href='/chateau/' className='games-card'>
                    <Reveal animated='fade'>
                      <Reveal.Content visible>
                        <Image className='card-image' src={chateau3} />
                      </Reveal.Content>
                      <Reveal.Content hidden>
                        <Image className='card-image' src={chateau2} />
                      </Reveal.Content>
                    </Reveal>
                    <Card.Content className='card-border'>
                      <Card.Header className='card-header'>CHATEAU SATOSHI</Card.Header>
                    </Card.Content>
                  </Card>
                </Grid.Column>

                <Grid.Column computer={8} tablet={8} mobile={16}>
                  <Card fluid href='/serenity/' className='games-card2'>
                    <Reveal animated='fade'>
                      <Reveal.Content visible>
                        <Image fluid className='card-image' src={serenity} />
                      </Reveal.Content>
                      <Reveal.Content hidden>
                        <Image className='card-image' src={serenity2} />
                      </Reveal.Content>
                    </Reveal>
                    <Card.Content className='card-border'>
                      <Card.Header className='card-header'>SERENITY ISLAND</Card.Header>
                    </Card.Content>
                  </Card>
                </Grid.Column>
              </Grid.Row>

            </Grid>

          </Container>
        </Segment>


        <Footer />
      </Segment>
    );
  }
}

export default Home;
