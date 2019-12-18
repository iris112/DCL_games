/* eslint-disable camelcase */
import React from "react";
import { Link } from "react-router-dom";
import banner from "../assets/images/banner.png";

const PostPreview = ({
  title,
  summary,
  categories,
  created,
  featured_image,
  // url, todo: use it when it will ready for production
  slug
}) => {
  return (
    <Link to={`/blog/${slug}`} className="post">
      <div className="post-image">
        <img src={featured_image || banner} alt="" />
      </div>
      <div className="post-info">
        <div className="top">
          <div className="date">
            <span>{new Date(created).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
          </div>
          <div className="category">
            <span>{categories && categories[0] && categories[0].name}</span>
          </div>
        </div>
        <div className="bottom">
          <div className="blog-title">
            <p>{title}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostPreview;
