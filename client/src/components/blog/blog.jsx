import React, { useContext, useEffect } from "react";
import { Segment } from "decentraland-ui";
import '../blog.css'
import Screen from "./screen";
import Navbar from "../Navbar";
import { GlobalContext } from "../../store";
import { butter } from "../../store/api";
import Footer2 from '../Footer2.js'

const Blog = ({ match }) => {
  const [state, dispatch] = useContext(GlobalContext);
  const paths = match.path.split(/[/]/);
  const category = paths.length === 3 ? (paths[2] === "" ? "All" : paths[2]) : "";

  useEffect(() => {
    const getPages = async () => {
      const { data } = await butter.post.list();

      dispatch({
        type: "update_pages",
        data
      });
    };

    getPages();
  }, []);

  return (
    <Segment vertical style={{ backgroundColor: "white" }}>
      <Navbar />
      <Screen pages={state.pages.data} category={category} />
      <Footer2 />
    </Segment>
  );
};

export default Blog;
