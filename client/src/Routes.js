import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Demo from "./components/Demo";
import Demo2 from "./components/Demo2";
import Account from "./components/account/account";
import Deposit from "./components/deposit/deposit";
import Withdraw from "./components/withdraw/withdraw";
import Layout from "./hoc/Layout";


const Routes = () => {
  

  return (
    <BrowserRouter>
      <Switch>
    	<Route path='/discord/' component={() => { 
	     window.location.href = 'https://discord.gg/cvbSNzY'; 
	     return null;
	    }}/>
        <Route path="/chateau/" exact component={Demo} />
        <Route path="/serenity/" exact component={Demo2} />
        <Route path="/account" exact component={Account} />
        <Route path="/deposit" exact component={Deposit} />
        <Route path="/withdraw" exact component={Withdraw} />
        <Route component={Layout} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
