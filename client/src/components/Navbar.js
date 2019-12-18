import React, { useContext, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { withRouter } from "react-router";
import { GlobalContext } from "../store";
import _ from "lodash";
import logo from "./Images/logo.png";
import "./additional.css";
import { Icon, Image, Menu, Search, Container, Segment } from "semantic-ui-react";
import { Navbar, Center } from "decentraland-ui";
import banner from "./assets/images/banner.png";

const ButtonAppBar = ({ handleClickButton, match, history }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [value, setValue] = useState("");
  const [state, dispatch] = useContext(GlobalContext);
  const blogs = state.pages.data.map(blog => {
    return {
      title: blog.title,
      image: blog.featured_image || banner,
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

  let [pos, setPos] = useState(window.pageYOffset)
    let [visible, setVisible] = useState(true)
     
    useEffect(()=> {
      const handleScroll = () => {
        let temp = window.pageYOffset
           
        setVisible(pos > temp);
        setPos(temp)
      };

      window.addEventListener("scroll", handleScroll);
        return(() => {
          window.removeEventListener("scroll", handleScroll);
        })
     })

  return (
    <Segment className='nav-segment'>
      <div className={"navbar " + (!visible ? "navbarHidden" : " ")}>
        <Container>
          <Menu
          borderless
          style={{ border: 'none', boxShadow: 'none' }}
          >
            <Menu.Item header as={NavLink} to="/" style={{ marginLeft: '-2px' }}>
              <Image src={logo} id='blog-nav-logo' style={{ width: '260px', marginTop: '1em' }} />
            </Menu.Item>

            <Menu.Menu position='right'>
                <Menu.Item
                  className='blog-right'
                  href='https://decentral.games/discord'
                >
                  <Icon.Group
                    size='medium'
                  >
                    <Icon className='nav-icon2' id='nav-icon' style={{ fontSize: '17px' }} name='discord' />
                  </Icon.Group>
                </Menu.Item>
                <Menu.Item
                  className='blog-right2'
                  href='https://twitter.com/decentralgames'
                >
                  <Icon.Group
                    size='medium'
                  >
                    <Icon className='nav-icon2' id='nav-icon' style={{ fontSize: '17px' }} name='twitter' />
                  </Icon.Group>
                </Menu.Item>
                <Menu.Item
                  className='blog-right3'
                  href='mailto:hello@decentral.games'
                >
                  <Icon.Group
                    size='medium'
                  >
                    <Icon className='nav-icon-hidden' id='nav-icon' style={{ fontSize: '17px' }} name='mail' />
                  </Icon.Group>
                </Menu.Item>
            </Menu.Menu>
          </Menu>
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
              <Search
                className='searchbar'
                input={{ icon: 'search', iconPosition: 'left' }}
                placeholder='Search'
                loading={loading}
                onResultSelect={handleResultSelect}
                onSearchChange={_.debounce(handleSearchChange, 500, { leading: true })}
                results={results}
                value={value}
              />
            }
          />
        </div>
      </div>
    </Segment>
  );
};

export default withRouter(ButtonAppBar);