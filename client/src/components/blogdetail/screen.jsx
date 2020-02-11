/* eslint-disable max-len,camelcase,react/no-danger */
import React from "react";
import PostPreview from "../blog/PostPreview";
import banner from "../assets/images/banner.png";
import defaultProfile from "../assets/images/icon.png";
import { Divider, Grid, List, Image, Sticky, Button, Icon, Breadcrumb } from "semantic-ui-react";
import { Container, Segment, Menu, Navbar } from "decentraland-ui";
import "../agate.css";
import HtmlParser from "./HtmlParser";
import { create } from "domain";
import { NavLink } from "react-router-dom";
import logo from '../Images/authorize_title.png'


const Screen = ({ slug, featured_image, image, created, categories, title, summary, author: { first_name = "", last_name = "", profile_image = "" }, body }) => {

  window.scrollTo(0, 0);

  return (
    <div className="blogdetail-page">

      <div className="coverimg">

        <Container>
          <a href="/blog/">
            <Icon name="arrow left" style={{ color: 'white', paddingTop: '30px', fontSize: '18px' }} className="blogpost-arrow"/>
          </a>
        </Container>

        <div className="image" style={{ marginTop: '-60px' }}>
          <img src={image || banner} alt="" />
        </div>
      </div>

      <div className="mobile-neg-margin">

        <Segment style={{ paddingBottom: '0em' }}>
          <Container className="container" id='blog-margins' style={{ marginTop: '30px' }}>
            <div className="blogdetails">
              <div className="bloginfo">
                <div className="title">
                  <h1>{title}</h1>
                </div>
                <div className="discription">
                  <p className="summary_content">{summary}</p>
                </div>
              </div>
            </div>
          </Container>
        </Segment>

        <Segment style={{ paddingBottom: '6em' }}>
          <Container>
        
            <div className="post__content" style={{ marginTop: '-60px' }}>{HtmlParser(body)}</div>

              <Divider style={{ opacity: '0.5', paddingBottom: '15px' }} className="date-divider" />
              <div className="date1" style={{ marginTop: '-15px' }}>
                <span>
                  {new Date(created).toLocaleDateString("en-DE", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                  <p className="date2"> TWEET </p>
                  <Icon className="date3" name="twitter" />
                  <p className="date2"> SHARE </p>
                  <Icon className="date3" name="facebook" />
                </span>
              </div>
          </Container>

        </Segment>
      </div>
    </div>
  );
};

export default Screen;
