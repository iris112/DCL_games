import React from "react";
import PostPreview from "./PostPreview";
import { Segment, Container, Menu } from "decentraland-ui";
import ethereum from "../Images/ethereum3.png";


const Screen = ({ pages, category }) => {
  const filteredPages = category === "All" ? pages : pages.filter(page => (page.categories.length > 0 ? page.categories[0].name === category : false));
  return (
    <div className="blog-page">
      <Container>
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
            />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Screen;
