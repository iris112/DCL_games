import React, { useContext, useState, useEffect } from "react";
import PostPreview from "./PostPreview";
import { Segment, Container, Menu, Navbar } from "decentraland-ui";
import logo from '../Images/authorize_title.png'
import ethereum from "../Images/ethereum3.png";
import { NavLink } from "react-router-dom";
import { Image, Divider, Grid, Icon, Breadcrumb, Search } from 'semantic-ui-react';
import '../blog.css'
import _ from "lodash";
import flamingos from '../Images/flamingos.png';
import Fade from 'react-reveal/Fade';
import { GlobalContext } from "../../store";


const Screen = ({ pages, category, handleClickButton, match, history }) => {

  const filteredPages = category === "All" ? pages : pages.filter(page => (page.categories.length > 0 ? page.categories[0].name === category : false));
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [value, setValue] = useState("");
  const [state, dispatch] = useContext(GlobalContext);
  const blogs = state.pages.data.map(blog => {
    return {
      title: blog.title,
      image: blog.featured_image,
      slug: blog.slug
    };
  });
  const handleResultSelect = (e, { result }) => {
    setValue("");
    history.push(`/blog/${result.slug}`);
  };

  const handleSearchChange = (e, { value }) => {
    setLoading(true);
    setValue(value);

    setTimeout(() => {
      if (value.length < 1) {
        setLoading(false);
        setResults([]);
        setValue("");
      }

      const re = new RegExp(_.escapeRegExp(value), "i");
      const isMatch = result => re.test(result.title);

      setLoading(false);
      setResults(_.filter(blogs, isMatch));
    }, 300);
  };

  return (
    <div className="blog-page">
      <Container className="outter-blog-container" id="mobile-outter-container">
        <Container style={{ marginBottom: '60px' }}>
        <Menu
          borderless
          style={{ border: 'none', boxShadow: 'none' }}
          className="blog-nav-menu"
          >
            <Menu.Item header as={NavLink} to="/" style={{ marginLeft: '-15px' }}>
              <Image src={logo} style={{ width: '42px', marginTop: '1.5em' }} />
            </Menu.Item>

            <Menu.Item position='right' header as={NavLink} to="/" style={{ marginRight: '-15px' }}>
              <Breadcrumb style={{ borderRadius: '4px', color: 'rgb(97, 97, 97)', paddingTop: '20px' }}> Go to Decentral Games <Icon style={{ fontSize: '10px', color: 'rgb(97, 97, 97)' }} name="arrow right" /> </Breadcrumb>
            </Menu.Item>

          </Menu>
        </Container>

        <Container style={{ marginTop: "-27px" }}>
          <Fade bottom distance="20px" duration="600">
            <h3> Decentral Games</h3>
          </Fade>
          <Fade bottom distance="10px" duration="600" delay="200">
            <h5 className="blog-hero"> Check back here regularly for updates on our technology, tutorials, and Decentral Games news. </h5>
          </Fade>

          <Fade bottom distance="20px" duration="600" delay="400">
            <p style={{ color: 'rgb(97, 97, 97)' }}> Featured Post</p>
            <Divider style={{ opacity: '0.5', paddingBottom: '15px' }} />

            <Grid href="/blog/the-flamingos-a-mega-casino-by-vegas-city-decentral-games/" style={{ paddingBottom: '120px' }} className="featured-post-padding">
              <Grid.Row>
                <Grid.Column computer={11} tablet={16} mobile={16}>
                  <Image src={flamingos} className="featured-image"/>
                </Grid.Column>
                <Grid.Column computer={5} tablet={16} mobile={16}>
                  <div className="post-info">
                    <div className="top">
                      <div>
                        <span className="preview-date">OCT 18, 2019</span>
                        <span className="preview-category">Announcements</span>
                      </div>
                    </div>
                    <div className="bottom">
                      <div className="blog-title">
                        <h4 style={{ paddingBottom: '9px', paddingTop: '8px' }}>The Flamingos - A Mega Casino by Vegas City & Decentral Games</h4>
                        <p style={{ color: 'rgb(97, 97, 97)' }}>Following many requests from the community, we are excited to announce our official partnership and joint venture with the Vegas City district within Decentraland.</p>
                      </div>
                    </div>
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Fade>
        </Container>


        <div>
          <Navbar
            leftMenu={
              <>
                <Menu.Item as={NavLink} exact to="/blog/">
                  All Articles
                </Menu.Item>
                <Menu.Item as={NavLink} to="/blog/announcements/">
                  Announcements
                </Menu.Item>
                <Menu.Item as={NavLink} to="/blog/tutorials/">
                  Tutorials
                </Menu.Item>
                <Menu.Item as={NavLink} to="/blog/technology/">
                  Technology
                </Menu.Item>
              </>
            }
            rightMenu={
              <div style={{ marginTop: '15px' }}>
                <Menu.Item style={{ float: 'right', marginRight: '-3px' }} as={NavLink} to="/blog/technology/" className="category-link2">
                  <Icon name='mail' />
                </Menu.Item>
                <Menu.Item style={{ float: 'right' }} as={NavLink} to="/blog/technology/" className="category-link2">
                  <Icon name='twitter' />
                </Menu.Item>
                <Menu.Item style={{ float: 'right' }} as={NavLink} to="/blog/technology/" className="category-link2">
                  <Icon name='discord' />
                </Menu.Item>
              </div>
            }
          />
        </div>
      </Container>

      <div style={{ marginBottom: '30px' }}>
        <Divider />
      </div>
        <Container className="outter-blog-container" style={{ paddingBottom: '60px' }}>
          <div className="posts">
            {filteredPages.map(page => (
              <PostPreview
                key={`blogpost-${page.title}-${page.created}`}
                title={page.title}
                summary={page.summary}
                categories={page.categories}
                created={page.created}
                featured_image={page.featured_image}
                url={page.url}
                slug={page.slug}
                page_size={5}
              />
            ))}
          </div>
        </Container>

      <Divider />

      <Container className="outter-blog-container" style={{ marginBottom: '-18px', paddingTop: '5px' }}>
        <Grid className='grid-margin'>
         <Grid.Column floated='left' computer={8} tablet={8} mobile={16} style={{ paddingLeft: '6px' }} id="footer-top-mobile">
            <p className='footer-font2' id='footer-float1'> © 2019 <a id='a-footer' href='/'> Decentral Games </a></p>
          </Grid.Column>
          <Grid.Column id='footer-mobile2' floated='right' computer={8} tablet={8} mobile={16} style={{ paddingRight: '20px' }}>
            <p className='footer-font2' id='footer-float2'> Follow <a id='a-footer' href='https://twitter.com/decentralgames'> Twitter </a> & Join <a id='a-footer' href='https://decentral.games/discord/'> Discord </a> | <a id='a-footer' href='/disclaimer/'> Disclaimer </a></p>
          </Grid.Column>
        </Grid>
      </Container>

    </div>
  );
};

export default Screen;
