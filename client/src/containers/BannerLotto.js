import React, { Component } from 'react';
import { instance } from '../ethereum/instance';
import web3 from '../ethereum/web3';

class BannerLotto extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jackpot: ''
    };
  }

  async componentDidMount() {
    const jackpot = await instance.methods.getJackpot().call();

    this.setState({
      jackpot: jackpot
    });
  }

  render() {
    return (
      <div className="ui container bannerViolet copy jackpot">
        JACKPOT {web3.utils.fromWei(this.state.jackpot, 'ether')} ETH
      </div>
    );
  }
}

export default BannerLotto;
