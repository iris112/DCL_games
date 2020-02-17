import React, { useContext, useEffect } from "react";
import "../additional.css";
import Screen from "./screen";
import { GlobalContext } from "../../store";
import { butter } from "../../store/api";
import { Segment } from "semantic-ui-react";
import ScrollToTop from '../scroll.js';


const BlogDetail = ({ match }) => {
  const [state, dispatch] = useContext(GlobalContext);
  const slug = match.path.split(/[/]/);
  const currentPage = state.pages.data.find(page => page.slug === slug[slug.length - 1]);

  const index = state.pages.data.indexOf(currentPage)
  const nextPage = state.pages.data[index + 1] ? state.pages.data[index + 1] : null;
  const prevPage = state.pages.data[index - 1] ? state.pages.data[index - 1] : null;

  const category = currentPage.categories[0].name;
  const filteredPages = state.pages.data.filter(page => ((page.categories[0].name === category) && (page.slug !== currentPage.slug)));
  const unfilteredPages = state.pages.data.filter(page => ((page.categories[0].name !== category)));

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
    <ScrollToTop>
      <Segment vertical>
        {currentPage && (
          <Screen
            image={currentPage.featured_image}
            created={currentPage.created}
            category={currentPage.categories[0]}
            title={currentPage.title}
            summary={currentPage.summary}
            author={currentPage.author}
            body={currentPage.body}
            next={nextPage}
            prev={prevPage}
            filteredPages={filteredPages}
            unfilteredPages={unfilteredPages}
          />
        )}
      </Segment>
    </ScrollToTop>
  );
};
export default BlogDetail;

/*
 author
 body
 categories
 created
 featured_image
 meta_description
 published
 seo_title
 slug
 status
 summary
 tags
 title
 url
 */
