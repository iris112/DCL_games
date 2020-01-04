import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Grid, Header, Icon, Menu, Divider, Input, Breadcrumb, Message, Reveal } from "semantic-ui-react";
import { Segment, Container, Center, Button, Image, Card } from "decentraland-ui";
import Global from './constant';
import Navbar2 from "./Navbar2";
import Navbar3 from "./nav-mobile";
import Footer from "./Footer";
import ReactGA from "react-ga";
import logo from './Images/logo.png'
import slots from './Images/slots-1.png'
import slots2 from './Images/slots.gif'
import roulette from './Images/roulette-1.png'
import roulette2 from './Images/roulette.gif'
import blackjack from './Images/blackjack.png'
import soon from './Images/soon_hover.png'
import image from './Images/image.png'
import chateau from './Images/chateau.png'
import serenity from './Images/serenity.png'
import chateau2 from './Images/chateau.gif'
import serenity2 from './Images/serenity.gif'
import vid_pc from './Images/home_pc.mp4'
import vid_mob from './Images/home_mob.mp4'

ReactGA.initialize("UA-146057069-1");
ReactGA.pageview(window.location.pathname);

const INITIAL_STATE = {
  player: null,
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

    if (window.web3) {
      this.isBrowserMetamsk = 1;
    }
  }

  async componentDidMount() {
    this.tryPlayVideo();
  }

  tryPlayVideo() {
    setTimeout(() => {
      if (this.player)
        this.player.play()
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

            <a href='/account'>
              <video className='hero-image' width="100%" ref={ref => this.player = ref} preload={'auto'} src={window.innerWidth >= 720 ? vid_pc : vid_mob} type="video/mp4" playsinline muted loop/>
            </a>

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
                        <Image className='card-image' src={roulette} />
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
  
            <a href='/account'>
              <video className='hero-image' width="100%" ref={ref => this.player = ref} preload={'auto'} src={window.innerWidth >= 720 ? vid_pc : vid_mob} type="video/mp4" playsinline muted loop/>
            </a>

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
                        <Image className='card-image' src={roulette} />
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
