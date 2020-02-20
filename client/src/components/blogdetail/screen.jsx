/* eslint-disable max-len,camelcase,react/no-danger */
import React, {useState, useEffect} from "react";
import PostPreview from "../blog/PostPreview";
import banner from "../assets/images/banner.png";
import defaultProfile from "../assets/images/icon.png";
import { Divider, Grid, List, Image, Sticky, Button, Icon, Breadcrumb } from "semantic-ui-react";
import { Container, Segment, Menu, Navbar } from "decentraland-ui";
import "../agate.css";
import HtmlParser from "./HtmlParser";
import { create } from "domain";
import { NavLink, Link } from "react-router-dom";
import logo from '../Images/authorize_title.png'


const Screen = ({ slug, featured_image, image, created, categories, title, summary, author: { first_name = "", last_name = "", profile_image = "" }, body, filteredPages, unfilteredPages }) => {
  const [randomfilteredPages, setFilteredPages] = useState(filteredPages);
  useEffect(() => {
    // Random Function
    var currentIndex = filteredPages.length; 
    var otherIndex = unfilteredPages.length;
    var temporaryValue = 0;
    var randomIndex = 0;
    function shuffle(array) {
      var count = 0;
      var addcount = 0;
      var array1 = unfilteredPages;
      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
        count += 1;
        if (count >= 3) {
          count = filteredPages.length - 3;
          array.splice(0,count);
          console.log(array);
          return array;
        }
      }
      currentIndex = filteredPages.length
      if (currentIndex < 3) {
        addcount = 3 - currentIndex;
      }
      while (0 !== addcount) {
        randomIndex = Math.floor(Math.random() * otherIndex);
        otherIndex -= 1;
        addcount -= 1;
        temporaryValue = array1[otherIndex];
        array[currentIndex + addcount] = temporaryValue;
        array1[otherIndex] = array1[otherIndex];
        array1[otherIndex] = temporaryValue;
      }
      return array;
    }
    setFilteredPages(shuffle(filteredPages));
    console.log(randomfilteredPages);
  });
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

                <Divider style={{ opacity: '0.5' }} />
                
                <div className="info">

                <div className="post-author" style={{ marginTop: '0px' }}>
                  <a>
                    <div className="author-info">
                      <div className="image">
                        <img src={profile_image || defaultProfile} alt="" />
                      </div>
                      <div className="name">
                        <span>{`${first_name || ""} ${last_name || ""}`}</span>
                      </div>
                    </div>
                  </a>
                </div>

              </div>                      

              <div className="date4">
                <span>
                  {new Date(created).toLocaleDateString("en-DE", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                </span>
              </div>
            </div>
          </div>
          </Container>
        </Segment>

        <Segment>
          <Container>
        
            <div className="post__content" style={{ marginTop: '-60px' }}>{HtmlParser(body)}</div>

              <Divider style={{ opacity: '0.5', paddingBottom: '15px' }} className="date-divider" />
              <div className="date1" style={{ marginTop: '-15px', marginBottom: '90px' }}>
                <span>
                  <p className="date2"> TWEET </p>
                  <Icon className="date3" name="twitter" />
                  <p className="date2"> SHARE </p>
                  <Icon className="date3" name="facebook" />
                </span>
              </div>
          </Container>

            <div className="blog-page" style={{ paddingTop: '90px', paddingBottom: '60px', marginBottom: '-60px', backgroundColor: '#F6F8F9' }}>
              <Container className="test-container">
                <h2 className="read-next-text"> Read Next </h2>
                <div className="posts-2">
                  {
                    randomfilteredPages.map(page => (
                      <PostPreview
                        key={`blogpost-${page.title}-${page.created}`}
                        title={page.title}
                        summary=""
                        categories={page.categories}
                        created={page.created}
                        featured_image={page.featured_image}
                        url={page.url}
                        slug={page.slug}
                      />
                  ))}
                </div>
              </Container>
            </div>

        </Segment>
      </div>
    </div>
  );
};

export default Screen;
