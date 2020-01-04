import React, { Component } from 'react';
import { Input, Checkbox } from 'semantic-ui-react';
import { instance2 } from '../ethereum/instance';
import MetaMask from '../ethereum/MetaMask';
import Reel from '../components/Reel';
import Aux from '../hoc/_Aux';

const promisify = (inner) =>
  new Promise((resolve, reject) =>
      inner((err, res) => {
          if (err) {
              reject(err);
          } else {
              resolve(res);
          }
      })
  );

class Slots extends Component {
  constructor(props) {
    super(props);

    this.state = {
      account: '1',
      credits: 0,
      amountAdd: 10,
      amountBet: 0,
      amountWin: 0,
      jackpot1: 0,
      jackpot2: 0,
      jackpot3: 0,
      jackpot4: 0,
      funds: 0,
      number1: 0,
      number2: 0,
      number3: 0,
      ceoAddress: '',
      devAddress: '',
      loaded: true,
      errorMessage: '',
      errorMetaMask: '',
      timeout: null,
      light: false,
      network: '4'
    };
  }

  async componentDidMount() {
    await this.getNetwork();

    const accounts = await promisify(cb => window.web3.eth.getAccounts(cb));
    const credits = await promisify(cb => window.web3.eth.getBalance(accounts[0], cb));
    const amountBet = await instance2.methods.amountBet().call();
    const amountWin = await instance2.methods.amountWin().call();
    const jackpot1 = await instance2.methods.jackpot1().call();
    const jackpot2 = await instance2.methods.jackpot2().call();
    const jackpot3 = await instance2.methods.jackpot3().call();
    const jackpot4 = await instance2.methods.jackpot4().call();
    const funds = await instance2.methods.funds().call();
    const ceoAddress = await instance2.methods.ceoAddress().call();
    const devAddress = await instance2.methods.devAddress().call();

    this.setState({
      account: accounts[0],
      credits: credits,
      amountBet: amountBet,
      amountWin: amountWin,
      jackpot1: jackpot1,
      jackpot2: jackpot2,
      jackpot3: jackpot3,
      jackpot4: jackpot4,
      funds: funds,
      ceoAddress: ceoAddress,
      devAddress: devAddress
    });

    if (typeof accounts[0] !== 'undefined') {
      // handle SpinResult() event from smart contract
      instance2.events.SpinResult(
        {
          fromBlock: 'latest'
        },
        (error, event) => {
          if (error) {
            console.log('Error while subscribing to event');
          } else {
            const number = event.returnValues._number;
            const formattedNumber = ('00' + number).slice(-3);
            const amountWin = event.returnValues._amountWin;

            this.setState({
              number1: formattedNumber.toString().slice(0, 1),
              number2: formattedNumber.toString().slice(1, 2),
              number3: formattedNumber.toString().slice(2, 3),
              amountWin: amountWin
            });

            if (amountWin > 0) {
              this.setState({
                light: true,

                timeout: setTimeout(() => {
                  this.lightOff();
                }, 3000)
              });
            }
          }
        }
      );

      // handle NewBalance() event from smart contract
      instance2.events.NewBalance(
        {
          fromBlock: 'latest'
        },
        (error, event) => {
          if (error) {
            console.log('Error while subscribing to event');
          } else {
            this.setState({
              funds: event.returnValues._balance
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
  onPlay = async event => {
    event.preventDefault();

    const metaMaskLogin = await MetaMask();
    this.setState({
      errorMetaMask: metaMaskLogin,
      errorMessage: ''
    });

    try {
      this.setState({
        loaded: false
      });

      const randomNumber = Math.floor(Math.random() * 1000);
      const hash = ('00' + randomNumber).slice(-3);

      const accounts = await promisify(cb => window.web3.eth.getAccounts(cb));
      await instance2.methods.play(hash).send({
        from: accounts[0],
        value: this.state.amountBet
      });

      this.setState({ loaded: true });
    } catch (err) {
      const randomNumber = Math.floor(Math.random() * 1000);
      const formattedNumber = ('00' + randomNumber).slice(-3);

      this.setState({
        number1: formattedNumber.toString().slice(0, 1),
        number2: formattedNumber.toString().slice(1, 2),
        number3: formattedNumber.toString().slice(2, 3)
      });

      this.setState({ loaded: true, errorMessage: err.message });
    }
  };

  addFunds = async event => {
    event.preventDefault();

    const metaMaskLogin = await MetaMask();
    this.setState({
      errorMetaMask: metaMaskLogin,
      errorMessage: ''
    });

    try {
      const amountAdd =
        this.inputAdd.inputRef.value !== ''
          ? this.inputAdd.inputRef.value
          : window.web3.fromWei(this.state.amountAdd, 'ether');
      if (isNaN(amountAdd)) {
        this.setState({
          loaded: true,
          errorMessage: 'Please enter a valid amount in ETH'
        });

        return false; // if not return false web3 will also check for valid input
      }
      const priceWei = window.web3.toWei(amountAdd, 'ether');

      const accounts = await promisify(cb => window.web3.eth.getAccounts(cb));
      await instance2.methods.addFunds().send({
        from: accounts[0],
        gas: '300000',
        value: priceWei
      });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
  };

  updateBet = async event => {
    event.preventDefault();

    const metaMaskLogin = await MetaMask();
    this.setState({
      errorMetaMask: metaMaskLogin,
      errorMessage: ''
    });

    try {
      const amountBet =
        this.inputBet.inputRef.value !== ''
          ? this.inputBet.inputRef.value
          : window.web3.fromWei(this.state.amountBet, 'ether');
      if (isNaN(amountBet)) {
        this.setState({
          loaded: true,
          errorMessage: 'Please enter a valid amount in ETH'
        });

        return false; // if not return false web3 will also check for valid input
      }
      const priceWei = window.web3.toWei(amountBet, 'ether');

      const accounts = await promisify(cb => window.web3.eth.getAccounts(cb));
      await instance2.methods.setAmounts(priceWei).send({
        from: accounts[0],
        gas: '300000'
      });

      this.setState({
        amountBet: priceWei
      });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
  };

  withdraw = async event => {
    event.preventDefault();

    const metaMaskLogin = await MetaMask();
    this.setState({
      errorMetaMask: metaMaskLogin,
      errorMessage: ''
    });

    try {
      const amountWithdraw =
        this.inputAmount.inputRef.value !== ''
          ? this.inputAmount.inputRef.value
          : window.web3.fromWei(this.state.funds, 'ether');
      if (isNaN(amountWithdraw)) {
        this.setState({
          loaded: true,
          errorMessage: 'Please enter a valid amount in ETH'
        });

        return false; // if not return false web3 will also check for valid input
      }
      const priceWei = window.web3.toWei(amountWithdraw, 'ether');

      const accounts = await promisify(cb => window.web3.eth.getAccounts(cb));
      await instance2.methods.withdrawFunds(priceWei).send({
        from: accounts[0]
      });
    } catch (err) {
      this.setState({ errorMessage: err.message });
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
        <div className="title">DECENTRAL GAMES SLOTS</div>

        {this.state.network !== '4' ? (
          <div className="messageError marginTop40">
            Please change MetaMask to Rinkeby Test Network to continue
          </div>
        ) : null}
      </div>
    );
  };

  machine = () => {
    const jackpot1 = window.web3.fromWei(
      this.state.jackpot1.toString(),
      'ether'
    );
    const jackpot2 = window.web3.fromWei(
      this.state.jackpot2.toString(),
      'ether'
    );
    const jackpot3 = window.web3.fromWei(
      this.state.jackpot3.toString(),
      'ether'
    );
    const jackpot4 = window.web3.fromWei(
      this.state.jackpot4.toString(),
      'ether'
    );
    const credits = window.web3.fromWei(this.state.credits.toString(), 'ether');
    const amountBet = window.web3.fromWei(
      this.state.amountBet.toString(),
      'ether'
    );
    const amountWin = window.web3.fromWei(
      this.state.amountWin.toString(),
      'ether'
    );
    const funds = window.web3.fromWei(this.state.funds.toString(), 'ether');

    return (
      <div
        className={`${this.state.light ? 'contentViolet' : 'contentBlue'} copy`}
      >
        <div className="messageBlack bold">
          <div className="row">
            <div className="chartLeft">
              <i className="money bill alternate outline icon" />
              <i className="money bill alternate outline icon" />
              <i className="money bill alternate outline icon" />
            </div>
            <div className="chartRight">{jackpot1} ETH</div>
          </div>
        </div>

        <div className="messageBlack bold marginTop10">
          <div className="row">
            <div className="chartLeft">
              <i className="chess rook icon" />
              <i className="chess rook icon" />
              <i className="chess rook icon" />
            </div>
            <div className="chartRight">{jackpot2} ETH</div>
          </div>
        </div>

        <div className="messageBlack bold marginTop10">
          <div className="row">
            <div className="chartLeft">
              <i className="gem outline icon" />
              <i className="gem outline icon" />
              <i className="gem outline icon" />
            </div>
            <div className="chartRight">{jackpot3} ETH</div>
          </div>
        </div>

        <div className="messageBlack bold marginTop10">
          <div className="row">
            <div className="chartLeft">
              <i className="space shuttle icon" />
              <i className="space shuttle icon" />
              <i className="space shuttle icon" />
            </div>
            <div className="chartRight">{jackpot4} ETH</div>
          </div>
        </div>

        <div className="wheelContainer marginTop20">
          <div className="wheel marginRight40">
            {!this.state.loaded ? (
              <div className="mycolumn">
                <Reel number={10} />
              </div>
            ) : (
              <div className="mycolumn">
                <Reel number={this.state.number1} />
              </div>
            )}
          </div>
          <div className="wheel marginRight40">
            {!this.state.loaded ? (
              <div className="mycolumn">
                <Reel number={10} />
              </div>
            ) : (
              <div className="mycolumn">
                <Reel number={this.state.number2} />
              </div>
            )}
          </div>
          <div className="wheel">
            {!this.state.loaded ? (
              <div className="mycolumn">
                <Reel number={10} />
              </div>
            ) : (
              <div className="mycolumn">
                <Reel number={this.state.number3} />
              </div>
            )}
          </div>
        </div>

        <div className="messageBlack marginTop20">
          <div className="row">
            <div className="statusLeft bold">
              CREDITS {Math.round(credits * 10000) / 10000}
            </div>
            <div className="statusCenter bold">BET {amountBet}</div>
            <div className="statusRight bold">WIN {amountWin}</div>
          </div>
        </div>

        <Checkbox className="buttonCheckbox2" onChange={this.onPlay} />

        <div className="buttonContainer marginTop40">
          {this.state.loaded ? (
            <div className="buttonSpin bold buttonGreen" onClick={this.onPlay}>
              SPIN
            </div>
          ) : (
            <div className="buttonSpin bold buttonGrey">SPIN</div>
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

        {this.state.account === this.state.ceoAddress ? (
          <div className="messageBlack marginTop40">
            <div className="marginTop20">
              <Input
                action={{
                  className: 'buttonInput buttonBlue',
                  content: 'ADD FUNDS',
                  onClick: this.addFunds
                }}
                ref={inputAdd => (this.inputAdd = inputAdd)}
                defaultValue={this.state.amountAdd}
              />
            </div>

            <div className="marginTop20">
              <Input
                action={{
                  className: 'buttonInput buttonBlue',
                  content: 'BET AMOUNT',
                  onClick: this.updateBet
                }}
                ref={inputBet => (this.inputBet = inputBet)}
                defaultValue={amountBet}
              />
            </div>

            <div className="marginTop20">
              <Input
                action={{
                  className: 'buttonInput buttonBlue',
                  content: 'WITHDRAW',
                  onClick: this.withdraw
                }}
                ref={inputAmount => (this.inputAmount = inputAmount)}
                defaultValue={Math.round(funds * 10000) / 10000}
              />
            </div>

            <div className="default marginTop20 marginBottom20">
              CEO/Manager Address: {this.state.ceoAddress}
            </div>
            <div className="default marginBottom20">
              Developer Address: {this.state.devAddress}
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  render() {
    return (
      <Aux>
        <div className="ui container">{this.header()}</div>

        <div className="ui container">{this.machine()}</div>
      </Aux>
    );
  }
}

export default Slots;
