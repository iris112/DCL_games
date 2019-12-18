import React from 'react'
import { Link } from 'react-router-dom';
import '../additional.css';

const INITIAL_STATE = {
  selectedMenu: 0,
};

class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onMenuClick = (index) => {
    this.setState({selectedMenu: index});
    this.props.onMenuSelected(index);
  }

  getContent = (title, index) => {
    if (index == 3) {
      return (
        <Link to='#'>
          {title}
        </Link>
      )      
    }

    if (this.state.selectedMenu == index && index < 3) {
      return (
        <Link to='#' onClick={() => this.onMenuClick(index)} style={{color:'black'}}>
          {title}
        </Link>
      )
    }

    return (
      <Link to='#' onClick={() => this.onMenuClick(index)}>
        {title}
      </Link>
    )
  }

  render() {
    return (
      <div class="menuContainer">
        <p>
          {this.getContent('Machines', 0)}
        </p>
        <p>
          {this.getContent('Transaction History', 1)}
        </p>
        <p>
          {this.getContent('Deposits/Withdrawals', 2)}
        </p>
        <p>
          {this.getContent('Sign out', 3)}
        </p>
      </div>
    )
  }
}

export default Menu;