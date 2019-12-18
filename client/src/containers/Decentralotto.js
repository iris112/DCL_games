import React, { Component } from 'react';
import { Input, Checkbox } from 'semantic-ui-react';
import { instance } from '../ethereum/instance';
import web3 from '../ethereum/web3';
import MetaMask from '../ethereum/MetaMask';
import Aux from '../hoc/_Aux';
import Spinner from '../Spinner';

class Decentralotto extends Component {
  constructor(props) {
    super(props);

    this.state = {
      account: '1',
      thisNumber: null,
      manager: '',
      developer: '',
      players: [],
      balance: '',
      jackpot: '',
      ticketPrice: 0,
      onSale: false,
      newPlayer: null,
      loaded: true,
      errorMessage: '',
      errorMetaMask: '',
      winner: null,
      timeout: null,
      light: false,
      network: '4'
    };
  }

  async componentDidMount() {
    await this.getNetwork();

    const account = await web3.eth.getAccounts();
    const manager = await instance.methods.ceoAddress().call();
    const developer = await instance.methods.devAddress().call();
    const players = await instance.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(instance.options.address);
    const jackpot = await instance.methods.getJackpot().call();
    const ticketPrice = await instance.methods.getTicketPrice().call();
    const onSale = await instance.methods.ticketSale().call();

    this.setState({
      account: account,
      manager: manager,
      developer: developer,
      players: players,
      balance: balance,
      jackpot: jackpot,
      ticketPrice: ticketPrice,
      onSale: onSale
    });

    const accounts = await web3.eth.getAccounts();
    if (typeof accounts[0] !== 'undefined') {
      // handle PlayerAdded() event from smart contract
      instance.events.PlayerAdded(
        {
          fromBlock: 'latest'
        },
        (error, event) => {
          if (error) {
            console.log('Error while subscribing to event');
          } else {
            this.setState({
              newPlayer: event.returnValues._newNumber,
              players: event.returnValues._players,
              jackpot: event.returnValues._jackpot
            });

            const numberOfPlayers = event.returnValues._players.length;
            const lastPlayer = event.returnValues._players[numberOfPlayers - 1];
            if (lastPlayer === accounts[0]) {
              this.setState({ thisNumber: event.returnValues._newNumber });
            }

            this.setState({
              light: true,

              timeout: setTimeout(() => {
                this.lightOff();
              }, 3000)
            });
          }
        }
      );

      // handle WinnerSelected() event from smart contract
      instance.events.WinnerSelected(
        {
          fromBlock: 'latest'
        },
        (error, event) => {
          if (error) {
            console.log('Error while subscribing to event');
          } else {
            this.setState({
              winner: event.returnValues._number,
              players: event.returnValues._players,
              jackpot: event.returnValues._jackpot
            });

            this.setState({
              light: true,

              timeout: setTimeout(() => {
                this.lightOff();
              }, 3000)
            });
          }
        }
      );
    }
  }

  componentWillUnmount() {
    clearTimeout(this.state.timeout);
  }

  getNetwork = () => {
    if (typeof window.ethereum !== 'undefined') {
      window.web3.version.getNetwork((err, netId) => {
        this.setState({ network: netId });
      });
    }
  };

  lightOff = () => {
    this.setState({
      light: false
    });

    clearTimeout(this.state.timeout);
  };

  //////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////
  onClick = async event => {
    event.preventDefault();

    const metaMaskLogin = await MetaMask();
    this.setState({
      errorMetaMask: metaMaskLogin,
      errorMessage: ''
    });

    try {
      this.setState({
        loaded: false,
        thisNumber: null,
        newPlayer: null,
        winner: null
      });

      const accounts = await web3.eth.getAccounts();
      await instance.methods.play().send({
        from: accounts[0],
        value: this.state.ticketPrice
      });

      this.setState({ loaded: true });
    } catch (err) {
      this.setState({ loaded: true, errorMessage: err.message });
    }
  };

  onSale = async event => {
    event.preventDefault();

    const metaMaskLogin = await MetaMask();
    this.setState({
      errorMetaMask: metaMaskLogin,
      errorMessage: ''
    });

    try {
      this.setState({ loaded: false });

      const accounts = await web3.eth.getAccounts();
      await instance.methods.ticketsOnSale(!this.state.onSale).send({
        from: accounts[0],
        gas: '300000'
      });

      this.setState({
        loaded: true,
        onSale: !this.state.onSale
        // ticketPrice: this.state.ticketPrice
      });
    } catch (err) {
      this.setState({ loaded: true, errorMessage: err.message });
    }
  };

  updatePrice = async event => {
    event.preventDefault();

    const metaMaskLogin = await MetaMask();
    this.setState({
      errorMetaMask: metaMaskLogin,
      errorMessage: ''
    });

    try {
      this.setState({ loaded: false });

      const newPrice =
        this.inputtext.inputRef.value !== ''
          ? this.inputtext.inputRef.value
          : web3.utils.fromWei(this.state.ticketPrice, 'ether');
      if (isNaN(newPrice)) {
        this.setState({
          loaded: true,
          errorMessage: 'Please enter a valid amount in ETH'
        });

        return false; // if not return false web3 will also check for valid input
      }
      const priceWei = web3.utils.toWei(newPrice, 'ether');

      const accounts = await web3.eth.getAccounts();
      await instance.methods.setTicketPrice(priceWei).send({
        from: accounts[0],
        gas: '300000'
      });

      this.setState({
        loaded: true,
        // onSale: this.state.onSale,
        ticketPrice: priceWei
      });
    } catch (err) {
      this.setState({ loaded: true, errorMessage: err.message });
    }
  };

  onPick = async event => {
    event.preventDefault();

    const metaMaskLogin = await MetaMask();
    this.setState({
      errorMetaMask: metaMaskLogin,
      errorMessage: ''
    });

    try {
      this.setState({
        loaded: false,
        thisNumber: null,
        newPlayer: null,
        winner: null
      });

      const timeStamp = Date.now();

      const accounts = await web3.eth.getAccounts();
      await instance.methods.pickWinner(timeStamp).send({
        from: accounts[0]
      });

      this.setState({ loaded: true, thisNumber: null });
    } catch (err) {
      this.setState({ loaded: true, errorMessage: err.message });
    }
  };
  //////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////

  header = () => {
    return (
      <div className="header copy">
        <div className="title">DECENTRALOTTO</div>

        {this.state.network !== '4' ? (
          <div className="messageError">
            Please change MetaMask to Rinkeby Test Network to continue
          </div>
        ) : null}
      </div>
    );
  };

  machine = () => {
    const ticketPrice = web3.utils.fromWei(
      this.state.ticketPrice.toString(),
      'ether'
    );

    return (
      <div className="contentViolet copy">
        {this.playerMessage()}

        <div className="messageBlack status">
          CURRENT JACKPOT: {web3.utils.fromWei(this.state.jackpot, 'ether')} ETH
        </div>
        <div className="messageBlack status marginTop10">
          NUMBER OF PLAYERS: {this.state.players.length}
        </div>

        <div className="messageBlack status marginTop10">
          TICKET PRICE: {ticketPrice} ETH
        </div>

        <Checkbox className="buttonCheckbox1" onChange={this.onClick} />

        <div className="marginTop80">
          {this.state.loaded && this.state.onSale ? (
            <div
              className="buttonLotto bold buttonViolet"
              onClick={this.onClick}
            >
              PLAY NOW!
            </div>
          ) : (
            <div className="buttonLotto bold buttonGrey">PLAY NOW!</div>
          )}
        </div>

        {this.state.errorMetaMask ? (
          <div
            className="messageError default marginTop20 marginBottom20"
            style={{
              overflow: 'hidden'
            }}
          >
            {this.state.errorMetaMask}
          </div>
        ) : null}

        {this.state.errorMessage ? (
          <div
            className="messageError default marginTop20 marginBottom20"
            style={{
              overflow: 'hidden'
            }}
          >
            {this.state.errorMessage}
          </div>
        ) : null}

        <div className="default marginTop80">
          *Winner selected daily at 5:00 pm PST
        </div>

        {this.state.account[0] === this.state.manager ? (
          <div className="messageBlack marginTop20">
            <div className="default marginTop20">
              <Checkbox
                style={{ top: 6 }}
                toggle
                // we must access the forSale value from redux in order to dynamically update
                checked={this.state.onSale}
                disabled={!this.state.loaded ? true : false}
                onChange={this.onSale}
              />
              &nbsp;&nbsp;
              {this.state.onSale
                ? 'Tickets are currently on sale'
                : 'Tickets are currently NOT on sale'}
            </div>
            <div className="marginTop20">
              {this.state.loaded && !this.state.onSale ? (
                <Input
                  action={{
                    className: 'buttonInput buttonBlue',
                    content: 'TICKETPRICE',
                    onClick: this.updatePrice
                  }}
                  ref={input => (this.inputtext = input)}
                  placeholder={ticketPrice}
                  onFocus={e => (e.target.placeholder = '')}
                  onBlur={e => (e.target.placeholder = ticketPrice)}
                />
              ) : (
                <Input
                  action={{
                    className: 'buttonInput buttonGrey',
                    content: 'TICKETPRICE'
                  }}
                  ref={input => (this.inputtext = input)}
                  placeholder={ticketPrice}
                  onFocus={e => (e.target.placeholder = '')}
                  onBlur={e => (e.target.placeholder = ticketPrice)}
                />
              )}
            </div>

            <div className="marginTop20">
              {this.state.loaded &&
              !this.state.onSale &&
              this.state.jackpot !== '0' ? (
                <div
                  className="buttonPickWinner bold buttonBlue"
                  onClick={this.onPick}
                >
                  PICK A WINNER
                </div>
              ) : (
                <div className="buttonPickWinner bold buttonGrey">
                  PICK A WINNER
                </div>
              )}
            </div>

            <div className="default marginTop20 marginBottom20">
              CEO/Manager Address: {this.state.manager}
            </div>
            <div className="default marginBottom20">
              Developer Address: {this.state.developer}
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  playerMessage = () => {
    return (
      <Aux>
        {this.state.thisNumber !== null ? (
          <div className="messageOrange marginBottom20">
            YOU ARE PLAYING LOTTO NUMBER {this.state.thisNumber}
          </div>
        ) : null}

        {this.state.newPlayer !== null ? (
          <div className="messageGreen marginBottom20">
            PLAYER {this.state.newPlayer} HAS ENTERED THE GAME
          </div>
        ) : null}

        {this.state.winner !== null ? (
          <div className="messageGreen marginBottom20">
            PLAYER {this.state.winner} HAS WON!
          </div>
        ) : null}
      </Aux>
    );
  };

  render() {
    return (
      <Aux>
        <Spinner show={!this.state.loaded} />

        <div className="ui container">{this.header()}</div>

        <div className="ui container">{this.machine()}</div>
      </Aux>
    );
  }
}

export default Decentralotto;
