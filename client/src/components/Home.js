import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Grid, Header, Icon, Menu, Divider, Input, Breadcrumb, Message, Reveal } from "semantic-ui-react";
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
import chateau from './Images/chateau.png'
import serenity from './Images/serenity.png'
import chateau2 from './Images/chateau.gif'
import serenity2 from './Images/serenity.gif'
import preview from './Images/preview.png'
import Hls from "hls.js";

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
    this.player.classList.add('hero-image-spin');
  }

  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    this.isBrowserMetamsk = 0;

    if (window.web3) {
      this.isBrowserMetamsk = 1;
    }
  }

  async componentDidMount() {
    let player = this.player;
    let videoUrl = '';
    
    if (window.innerWidth >= 720)
      videoUrl = this.state.vid_pc;
    else
      videoUrl = this.state.vid_mob;

    player.classList.add('hero-image-spin');

    if(Hls.isSupported()) {
      var hls = new Hls({
        // This configuration is required to insure that only the
        // viewer can access the content by sending a session cookie
        // to api.video service
        xhrSetup: function(xhr, url) {
          xhr.withCredentials = true;
        }
      });
      hls.loadSource(videoUrl);
      hls.attachMedia(player);
      // hls.on(Hls.Events.FRAG_LOADED, function() {
      //   player.classList.remove('hero-image-spin');
      // });
    } else if (player.canPlayType('application/vnd.apple.mpegurl')) {
      player.src = videoUrl;
      player.addEventListener('loadedmetadata',function() {
        player.play();
      });
    }
  }

  componentWillUnmount() {
  }

  tryPlayVideo() {
    setTimeout(() => {
      if (this.player) {
        // fetch(window.innerWidth >= 720 ? vid_pc : vid_mob).then(res => res.blob()).then(data => {
        //   this.setState({vid_blob: URL.createObjectURL(data)});
        //   this.player.classList.remove('hero-image-spin');
        //   this.player.play()
        // });
        this.player.play();
        this.player.classList.remove('hero-image-spin');
      }
      else
        this.tryPlayVideo();
    }, 5000);
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
            {isMobile ? <video className="hero-image" ref={ref => this.player = ref} preload="auto" playsInline autoPlay muted loop/>
            : <a href='/account'>
                <video className="hero-image" ref={ref => this.player = ref} preload="auto" playsInline autoPlay muted loop/>
              </a> }
            

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
                    <Card.Content className='card-border'>
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

            <Grid>

              <Grid.Row>
                <Grid.Column computer={8} tablet={8} mobile={16}>
                  <Card fluid href='/chateau/' className='games-card'>
                    <Reveal animated='fade'>
                      <Reveal.Content visible>
                        <Image className='card-image' src={chateau} />
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
                        <Image className='card-image' src={serenity} />
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

        <Segment className='hero'>
          <Container className='hero-container'>
  
          {isMobile ? <video className="hero-image" ref={ref => this.player = ref} preload="auto" playsInline autoPlay muted loop/>
            : <a href='/account'>
                <video className="hero-image" ref={ref => this.player = ref} preload="auto" playsInline autoPlay muted loop/>
              </a> }

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
                    <Card.Content className='card-border'>
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

            <Grid>

              <Grid.Row>
                <Grid.Column computer={8} tablet={8} mobile={16}>
                  <Card fluid href='/chateau/' className='games-card'>
                    <Reveal animated='fade'>
                      <Reveal.Content visible>
                        <Image className='card-image' src={chateau} />
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
