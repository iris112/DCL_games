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
import slots2 from './Images/slots.gif'
import overlaySlots from './Images/slots_overlay.png'
import roulette from './Images/roulette-1.png'
import roulette2 from './Images/roulette.gif'
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

        { /* ----------------------------------------------------------- */ }
        { /*                       HERO SECTION                          */ }
        { /* ----------------------------------------------------------- */ }

        <Segment className='hero'>
          <Container className='hero-container'>

            <Message className='modal-msg' onDismiss={this.handleDismiss}>
              <Header className='msg-text'>Please use a desktop Chrome browser to play our free games. To play games with cryptocurrency, you must enable Metamask. You can download Chrome <a className='blue-link' href="https://www.google.com/chrome/">here</a> and Metamask <a className='blue-link' href="https://metamask.io/">here</a>.</Header>
            </Message>
            
            {isMobile ? <video className="hero-image" ref={ref => this.refVideo(ref)} preload="auto" playsInline autoPlay muted loop/>
            : <a href='/account'>
                <video className="hero-image" ref={ref => this.refVideo(ref)} preload="auto" playsInline autoPlay muted loop/>
              </a> }
            

					</Container>
            <Container className="stats-container" style={{paddingTop: '60px', paddingBottom: '60px' }}>
            <Header className='games-h' style={{ color: 'white', textAlign: 'center', fontWeight: '300', lineHeight: '54px' }}>
              By the Numbers
            </Header>

              <Grid>
                <Grid.Row>
                  
                  <Grid.Column computer={4} tablet={8} mobile={16}>
                    <Statistic style={{ paddingLeft: 'calc(50% - 97px)'}} id="stat1">
                      <Statistic.Value style={{ color: 'white' }}>
                        <Grid>
                          <Grid.Row>
                            <Grid.Column computer={8} style={{ marginRight: '-45px' }}>
                              <Image src={dcl} style= {{ marginTop: '7px' }}/>
                            </Grid.Column>
                            <Grid.Column computer={8}>
                              <CountUp
                                end={250}
                                duration={3}
                              />K
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                      </Statistic.Value>
                      <Statistic.Label id="gold-grad" style={{ color: 'white', paddingTop: '6px', paddingLeft: '17px' }}>Mana Slots Jackpot </Statistic.Label>
                    </Statistic>
                  </Grid.Column>

                  <Grid.Column computer={4} tablet={8} mobile={16}>
                    <Statistic style={{ paddingLeft: 'calc(50% - 97px)'}} id="stat1">
                      <Statistic.Value style={{ color: 'white' }}>
                        <Grid>
                          <Grid.Row>
                            <Grid.Column computer={8} style={{ marginRight: '-51px' }}>
                              <Image src={dcl} style= {{ marginTop: '7px' }}/>
                            </Grid.Column>
                            <Grid.Column computer={8}>
                              <CountUp
                                end={360}
                                duration={3}
                              />K
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                      </Statistic.Value>
                      <Statistic.Label id="gold-grad" style={{ color: 'white', paddingTop: '6px', paddingLeft: '4px' }}>Mana Roulette Jackpot </Statistic.Label>
                    </Statistic>
                  </Grid.Column>
                    
                  <Grid.Column computer={4} tablet={8} mobile={16}>
                    <Statistic style={{ paddingLeft: 'calc(50% - 56px)'}} id="stat2">
                      <Statistic.Value style={{ color: 'white' }}>
                        <Svgeth className='svg-eth2' />
                        <CountUp
                          end={4}
                          duration={6}
                        />
                      </Statistic.Value>
                      <Statistic.Label id="gold-grad" style={{ color: 'white', paddingTop: '6px' }}>Coins Offered</Statistic.Label>
                    </Statistic>
                  </Grid.Column>

                  <Grid.Column computer={4} tablet={8} mobile={16}>
                    <Statistic style={{ paddingLeft: 'calc(50% - 73px)'}} id="stat3">
                      <Statistic.Value style={{ color: 'white' }}>
                        <Grid>
                          <Grid.Row>
                            <Grid.Column computer={8} style={{ marginRight: '-31px' }}>
                              <Image src={dcl} style= {{ marginTop: '7px' }}/>
                            </Grid.Column>
                            <Grid.Column computer={8}>
                              <CountUp
                                end={199}
                                duration={3}
                              />
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                      </Statistic.Value>
                      <Statistic.Label id="gold-grad" style={{ color: 'white', paddingTop: '6px', paddingLeft: '10px' }}>DCL Parcels</Statistic.Label>
                    </Statistic>
                  </Grid.Column>

                </Grid.Row>
              </Grid>
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
            <p className="playboard-p" style={{ color: 'white', paddingBottom: '9px', marginTop: '-6px' }}> Playable with MANA. ETH, DAI and DG coming soon </p>

            <Grid>

              <Grid.Row>
                <Grid.Column computer={4} tablet={4} mobile={8}>
                  <Card fluid href='/account' className='games-card'>
                    <Reveal animated='fade'>
                      <Reveal.Content visible>
                        <Image className='card-image' src={slots} />
                      </Reveal.Content>
                      <Reveal.Content hidden>
                        <Image className='card-image' src={slots2} />
                        <Image className='card-image overlay-image' src={overlaySlots} />
                      </Reveal.Content>
                    </Reveal>
                    <Card.Content>
                      <Card.Header className='card-header'>SLOTS</Card.Header>
                    </Card.Content>
                  </Card>
                </Grid.Column>

                <Grid.Column computer={4} tablet={4} mobile={8}>
                  <Card fluid href='/account' className='games-card'>
                    <Reveal animated='fade'>
                      <Reveal.Content visible>
                        <Image className='card-image' src={roulette} />
                      </Reveal.Content>
                      <Reveal.Content hidden>
                        <Image className='card-image' src={roulette2} />
                        <Image className='card-image overlay-image' src={overlayRoulette} />
                      </Reveal.Content>
                    </Reveal>
                    <Card.Content className='card-border'>
                      <Card.Header className='card-header'>ROULETTE</Card.Header>
                    </Card.Content>
                  </Card>
                </Grid.Column>

                <Grid.Column computer={4} tablet={4} mobile={8}>
                  <Card fluid href='/account' className='games-card2'>
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
                  <Card fluid href='/account' className='games-card2'>
                    <Reveal animated='fade'>
                      <Reveal.Content visible>
                        <Image className='card-image' src={dice} />
                      </Reveal.Content>
                      <Reveal.Content hidden>
                        <Image className='card-image' src={soon} />
                      </Reveal.Content>
                    </Reveal>
                    <Card.Content className='card-border'>
                      <Card.Header className='card-header'>DICE</Card.Header>
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
              VIRTUAL CASINOS
            </Header>
            <p className="playboard-p" style={{ color: 'white', paddingBottom: '9px', marginTop: '-6px' }}> Now Playable in the Decentraland metaverse </p>

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
      <Segment className='main-segment'>
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
             	By the Numbers
            </Header>

	            <Grid>
	            	<Grid.Row>
	            		
							   	<Grid.Column computer={4} tablet={8} mobile={16}>
							      <Statistic style={{ paddingLeft: 'calc(50% - 97px)'}} id="stat1">
							        <Statistic.Value style={{ color: 'white' }}>
							        	<Grid>
								        	<Grid.Row>
									        	<Grid.Column computer={8} style={{ marginRight: '-45px' }}>
									        		<Image src={dcl} style= {{ marginTop: '7px' }}/>
									        	</Grid.Column>
									        	<Grid.Column computer={8}>
										      		<CountUp
										      			end={250}
										      			duration={3}
										      		/>K
										      	</Grid.Column>
										      </Grid.Row>
									     	</Grid>
							      	</Statistic.Value>
							        <Statistic.Label id="gold-grad" style={{ color: 'white', paddingTop: '6px', paddingLeft: '17px' }}>Mana Slots Jackpot </Statistic.Label>
							      </Statistic>
							  	</Grid.Column>

							   	<Grid.Column computer={4} tablet={8} mobile={16}>
							      <Statistic style={{ paddingLeft: 'calc(50% - 97px)'}} id="stat1">
							        <Statistic.Value style={{ color: 'white' }}>
							        	<Grid>
								        	<Grid.Row>
									        	<Grid.Column computer={8} style={{ marginRight: '-51px' }}>
									        		<Image src={dcl} style= {{ marginTop: '7px' }}/>
									        	</Grid.Column>
									        	<Grid.Column computer={8}>
										      		<CountUp
										      			end={360}
										      			duration={3}
										      		/>K
										      	</Grid.Column>
										      </Grid.Row>
									     	</Grid>
							      	</Statistic.Value>
							        <Statistic.Label id="gold-grad" style={{ color: 'white', paddingTop: '6px', paddingLeft: '4px' }}>Mana Roulette Jackpot </Statistic.Label>
							      </Statistic>
							  	</Grid.Column>
							      
	            		<Grid.Column computer={4} tablet={8} mobile={16}>
							      <Statistic style={{ paddingLeft: 'calc(50% - 56px)'}} id="stat2">
							        <Statistic.Value style={{ color: 'white' }}>
							        	<Svgeth className='svg-eth2' />
							      		<CountUp
							      			end={4}
							      			duration={6}
							      		/>
							      	</Statistic.Value>
							        <Statistic.Label id="gold-grad" style={{ color: 'white', paddingTop: '6px' }}>Coins Offered</Statistic.Label>
							      </Statistic>
							    </Grid.Column>

							   	<Grid.Column computer={4} tablet={8} mobile={16}>
							      <Statistic style={{ paddingLeft: 'calc(50% - 73px)'}} id="stat3">
							        <Statistic.Value style={{ color: 'white' }}>
							        	<Grid>
								        	<Grid.Row>
									        	<Grid.Column computer={8} style={{ marginRight: '-31px' }}>
									        		<Image src={dcl} style= {{ marginTop: '7px' }}/>
									        	</Grid.Column>
									        	<Grid.Column computer={8}>
										      		<CountUp
										      			end={199}
										      			duration={3}
										      		/>
										      	</Grid.Column>
										      </Grid.Row>
									     	</Grid>
							      	</Statistic.Value>
							        <Statistic.Label id="gold-grad" style={{ color: 'white', paddingTop: '6px', paddingLeft: '10px' }}>DCL Parcels</Statistic.Label>
							      </Statistic>
							  	</Grid.Column>

								</Grid.Row>
							</Grid>
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
            <p className="playboard-p" style={{ color: 'white', paddingBottom: '9px', marginTop: '-6px' }}> Playable with MANA. ETH, DAI and DG coming soon  </p>

            <Grid>

              <Grid.Row>
                <Grid.Column computer={4} tablet={4} mobile={8}>
                  <Card fluid href='/account' className='games-card'>
                    <Reveal animated='fade'>
                      <Reveal.Content visible>
                        <Image className='card-image' src={slots} />
                      </Reveal.Content>
                      <Reveal.Content hidden>
                        <Image className='card-image' src={slots2} />
                        <Image className='card-image overlay-image' src={overlaySlots} />
                      </Reveal.Content>
                    </Reveal>
                    <Card.Content>
                      <Card.Header className='card-header'>SLOTS</Card.Header>
                    </Card.Content>
                  </Card>
                </Grid.Column>

                <Grid.Column computer={4} tablet={4} mobile={8}>
                  <Card fluid href='/account' className='games-card'>
                    <Reveal animated='fade'>
                      <Reveal.Content visible>
                        <Image className='card-image' src={roulette} />
                      </Reveal.Content>
                      <Reveal.Content hidden>
                        <Image className='card-image' src={roulette2} />
                        <Image className='card-image overlay-image' src={overlayRoulette} />
                      </Reveal.Content>
                    </Reveal>
                    <Card.Content className='card-border'>
                      <Card.Header className='card-header'>ROULETTE</Card.Header>
                    </Card.Content>
                  </Card>
                </Grid.Column>

                <Grid.Column computer={4} tablet={4} mobile={8}>
                  <Card fluid href='/account' className='games-card2'>
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
                  <Card fluid href='/account' className='games-card2'>
                    <Reveal animated='fade'>
                      <Reveal.Content visible>
                        <Image className='card-image' src={dice} />
                      </Reveal.Content>
                      <Reveal.Content hidden>
                        <Image className='card-image' src={soon} />
                      </Reveal.Content>
                    </Reveal>
                    <Card.Content className='card-border'>
                      <Card.Header className='card-header'>DICE</Card.Header>
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
              VIRTUAL CASINOS
            </Header>
            <p className="playboard-p" style={{ color: 'white', paddingBottom: '9px', marginTop: '-6px' }}> Now Playable in the Decentraland metaverse</p>

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
