import React, { Component, useContext, useEffect } from 'react';
import { Route, Switch } from "react-router-dom";
import { GlobalContext } from "../store";
import { butter } from "../store/api";
import Aux from './_Aux';
import Footer from '../components/Footer.js';
import Home from "../components/Home";
import Decentralotto from "../containers/Decentralotto";
import BannerLotto from "../containers/BannerLotto";
import Slots from "../containers/Slots";
import BannerSlots from "../containers/BannerSlots";
import Janus from "../components/Janus";
import Admin from "../components/admin/admin";
import Blog from "../components/blog/blog";
import BlogDetail from "../components/blogdetail/blogdetail";
import Disclaimer from "../components/disclaimer/disclaimer";

class Layout extends Component {
  static contextType = GlobalContext

  constructor(props) {
    super(props);

    this.state = {};
  }

  async componentDidMount() {
    const [state, dispatch] = this.context;
    const { data } = await butter.post.list();

    dispatch({
      type: "update_pages",
      data
    });
  }

  render() {
    const [state, dispatch] = this.context;
    const blogCategoryPaths = state.categories.map((category, i) => `/blog${i === 0 ? "/" : "/" + category}`);
    // const blogCategoryPaths = state.categories.map((category, i) => `/blog${i === 0 ? "/All" : "/" + category}`);
    // const blogDetailPaths = state.pages.data.map(page => `/blog/${page.categories.length > 0 ? page.categories[0].name + "/" : ""}${page.slug}`);
    const blogDetailPaths = state.pages.data.map(page => `/blog/${page.slug}`);

    return (
        <Aux>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/decentralotto" exact component={Decentralotto} />
            <Route path="/bannerlotto" exact component={BannerLotto} />
            <Route path="/slots" exact component={Slots} />
            <Route path="/bannerslots" exact component={BannerSlots} />
            <Route path="/janus" exact component={Janus} />
            <Route path="/admin" exact component={Admin} />
            <Route path="/disclaimer" exact component={Disclaimer} />
            <Route path={blogCategoryPaths} exact component={Blog} />
            <Route path={blogDetailPaths} exact component={BlogDetail} />
          </Switch>
        </Aux>
    );
  }
}

export default Layout;
