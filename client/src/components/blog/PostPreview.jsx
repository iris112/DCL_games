/* eslint-disable camelcase */
import React from "react";
import { Link } from "react-router-dom";
import banner from "../assets/images/banner.png";
import '../blog.css';
import { Container } from 'semantic-ui-react';


const PostPreview = ({
  title,
  summary,
  categories,
  created,
  featured_image,
  // url, todo: use it when it will ready for production
  slug,
}) => {
  return (
    <Link to={`/blog/${slug}`} className="post">
      <Container className="post-container" >
        <div className="post-image">
          <img src={featured_image || banner} alt="" />
        </div>
        <div className="post-info">
          <div className="top">
            <div className="date">
              <span>{new Date(created).toLocaleDateString("en-DE", { day: "numeric", month: "short", year: "numeric" })}</span>
            </div>
            <div className="category" style={{ color: 'rgb(97, 97, 97)' }}>
              <span>{categories && categories[0] && categories[0].name}</span>
            </div>
          </div>
          <div className="bottom">
            <div className="blog-title">
              <h4 style={{ paddingBottom: '9px' }}>{title}</h4>
              <p style={{ color: 'rgb(97, 97, 97)' }}>{summary.split('.', 1)[0]}.</p>
            </div>
          </div>
        </div>
      </Container>
    </Link>
  );
};

export default PostPreview;
