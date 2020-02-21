import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Demo from "./components/Demo";
import Demo2 from "./components/Demo2";
import Account from "./components/account/account";
import Home from "./components/Home";
import Layout from "./hoc/Layout";


const Routes = () => {
  

  return (
    <BrowserRouter>
      <Switch>
    	<Route path='/discord/' component={() => { 
	     window.location.href = 'https://discord.gg/cvbSNzY'; 
	     return null;
	    }}/>
	<Route path='/verify/' exact component={Home} />
        <Route path="/chateau/" exact component={Demo} />
        <Route path="/serenity/" exact component={Demo2} />
        <Route path="/account" exact component={Account} />
        <Route component={Layout} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
