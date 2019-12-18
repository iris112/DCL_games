/* eslint-disable max-len,camelcase,react/no-danger */
import React from "react";
import banner from "../assets/images/banner.png";
import defaultProfile from "../assets/images/icon.png";
import { Divider, Grid, List, Image, Sticky, Button, Icon } from "semantic-ui-react";
import { Container, Segment, Menu, Navbar } from "decentraland-ui";
import "../agate.css";
import HtmlParser from "./HtmlParser";
import { create } from "domain";
import Footer2 from '../Footer2';

const Screen = ({ image, created, categories, title, summary, author: { first_name = "", last_name = "", profile_image = "" }, body, next, prev }) => {
  return (
    <div className="blogdetail-page">

      <Segment style={{ paddingBottom: '0em' }}>
        <Container className="container" id='blog-margins' style={{ marginTop: '30px' }}>
          <div className="blogdetails">
            <div className="bloginfo">
              <div className="info">

                <div className="date" style={{ marginTop: '-15px' }}>
                  <span>
                    {new Date(created).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric"
                    })}
                  </span>

                </div>
                <div className="category">
                  <span>
                    <a>{categories && categories[0] && categories[0].name}</a>
                  </span>
                </div>
              </div>
              <div className="title">
                <h1>{title}</h1>
              </div>
              <div className="discription">
                <h2>{summary}</h2>
              </div>
              <div className="post-author" style={{ marginBottom: '-15px' }}>
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
                <div className="social">
                  <span>Share</span>
                  <span>
                    <a>
                      <svg width="20px" height="16px" viewBox="0 0 20 16" xmlns="http://www.w3.org/2000/svg">
                        <g id="Mobile" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                          <g id="article" transform="translate(-301.000000, -664.000000)" fill="#0A0F1F" fillRule="nonzero">
                            <g transform="translate(16.000000, 656.000000)" id="share">
                              <g transform="translate(227.000000, 4.000000)">
                                <g id="tw" transform="translate(56.000000, 0.000000)">
                                  <path
                                    d="M21.3333333,5.90247802 C20.6706114,6.23820943 19.8974359,6.46203038 19.1242604,6.46203038 C19.8974359,6.01438849 20.5601578,5.23101519 20.7810651,4.33573141 C20.0078895,4.7833733 19.234714,5.11910472 18.3510848,5.23101519 C17.6883629,4.44764189 16.6942801,4 15.5897436,4 C13.4911243,4 11.7238659,5.79056755 11.7238659,7.91686651 C11.7238659,8.25259792 11.7238659,8.47641886 11.8343195,8.81215028 C8.63116371,8.70023981 5.75936884,7.13349321 3.8816568,4.7833733 C3.55029586,5.34292566 3.32938856,6.01438849 3.32938856,6.79776179 C3.32938856,8.14068745 3.99211045,9.37170264 5.09664694,10.0431655 C4.43392505,10.0431655 3.8816568,9.81934452 3.32938856,9.59552358 C3.32938856,11.4980016 4.65483235,13.0647482 6.42209073,13.4004796 C6.09072978,13.5123901 5.75936884,13.5123901 5.42800789,13.5123901 C5.20710059,13.5123901 4.98619329,13.5123901 4.65483235,13.4004796 C5.09664694,14.9672262 6.53254438,16.0863309 8.29980276,16.0863309 C6.97435897,17.0935252 5.31755424,17.764988 3.55029586,17.764988 C3.21893491,17.764988 2.88757396,17.764988 2.66666667,17.764988 C4.3234714,18.8840927 6.42209073,19.5555556 8.52071006,19.5555556 C15.5897436,19.5555556 19.4556213,13.6243006 19.4556213,8.47641886 C19.4556213,8.25259792 19.4556213,8.14068745 19.4556213,7.91686651 C20.1183432,7.46922462 20.7810651,6.68585132 21.3333333,5.90247802 Z"
                                    id="shape"
                                  />
                                </g>
                              </g>
                            </g>
                          </g>
                        </g>
                      </svg>
                    </a>
                  </span>
                  <span>
                    <a>
                      <svg width="16px" height="16px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                        <g id="Mobile" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                          <g id="article" transform="translate(-339.000000, -664.000000)" fill="#0A0F1F" fillRule="nonzero">
                            <g transform="translate(16.000000, 656.000000)" id="share">
                              <g transform="translate(227.000000, 4.000000)">
                                <g id="fb" transform="translate(92.000000, 0.000000)">
                                  <path
                                    d="M4,5.77777778 C4,4.8 4.8,4 5.77777778,4 L18.2222222,4 C19.2,4 20,4.8 20,5.77777778 L20,18.2222222 C20,19.2 19.2,20 18.2222222,20 L5.77777778,20 C4.8,20 4,19.2 4,18.2222222 L4,5.77777778 Z M15.2,10.8444444 L15.2,9.77777778 C15.2,9.24444444 15.5555556,9.15555556 15.7333333,9.15555556 L17.2444444,9.15555556 L17.2444444,6.84444444 L15.2,6.84444444 C12.8888889,6.84444444 12.3555556,8.53333333 12.3555556,9.6 L12.3555556,10.7555556 L11.1111111,10.7555556 L11.1111111,12.3555556 L11.1111111,13.4222222 L12.4444444,13.4222222 L12.4444444,20 L15.0222222,20 L15.0222222,13.4222222 L16.9777778,13.4222222 L17.0666667,12.3555556 L17.2444444,10.7555556 L15.2,10.7555556 L15.2,10.8444444 Z"
                                    id="Combined-Shape"
                                  />
                                </g>
                              </g>
                            </g>
                          </g>
                        </g>
                      </svg>
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Segment>

      <div className="coverimg">
        <div className="image">
          <img src={image || banner} alt="" />
        </div>
      </div>

      <Segment style={{ paddingBottom: '0em' }}>
        <Container>
      
          <div className="post__content" style={{ marginTop: '-60px' }}>{HtmlParser(body)}</div>
            <div className="goto" style={{ marginBottom: '5em' }}>
              {prev &&
                <Button icon labelPosition='left' href={"/blog/" + prev.slug} id="button-7" className="button-nav" color="blue">
                  Prev
                 <Icon name='left arrow' />
                </Button>
              }
              {next &&
                <Button icon labelPosition='right' floated='right' href={"/blog/" + next.slug} id="button-7" className="button-nav" color="blue">
                  Next
                  <Icon name='right arrow' />
                </Button>
              }
            </div>

        </Container>
      </Segment>
    </div>
  );
};

export default Screen;
