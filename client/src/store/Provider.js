import React, { useReducer } from "react";
import { GlobalContext } from "./Context";

const initialState = {
  categories: ["All", "Announcements", "Tutorials", "Technology"],
  pages: {
    data: [],
    meta: {}
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case "update_pages":
      return {
        ...state,
        pages: action.data
      };

    default:
      throw new Error("Wrong action type got dispatched");
  }
};

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <GlobalContext.Provider value={[state, dispatch]}>{children}</GlobalContext.Provider>;
};

export { Provider };
