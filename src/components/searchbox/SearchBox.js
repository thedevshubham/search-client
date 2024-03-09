import React, { useState, useEffect } from "react";
import { useLazyQuery, useMutation, useSubscription } from "@apollo/client";
import { gql } from "graphql-tag";
import EditableText from "../editableText/EditableText";
import "./searchBox.css";

const SEARCH_QUERY = gql`
  query Search($query: String!) {
    searchResults(query: $query) {
      text
      id
    }
  }
`;

const TEXT_UPDATED = gql`
  subscription TextUpdated {
    textUpdated {
      text
      id
    }
  }
`;

export const UPDATE_TEXT = gql`
  mutation updateText($text: String!, $id: ID!) {
    updateText(id: $id, text: $text) {
      status
      id
    }
  }
`;

const SearchBox = () => {
  const [query, setQuery] = useState("");
  const [searchData, setSearchdata] = useState([]);
  const [searchFunc, { loading, data }] = useLazyQuery(SEARCH_QUERY);
  const [updateText] = useMutation(UPDATE_TEXT);
  let timerId = null;

  useEffect(() => {
    if (query.trim() === "") {
      return;
    }

    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      searchFunc({ variables: { query } });
    }, 300);

    return () => {
      clearTimeout(timerId);
    };
  }, [query]);

  useEffect(() => {
    if (data?.searchResults?.length) {
      setSearchdata(data?.searchResults);
    }
  }, [data]);

  // useSubscription(TEXT_UPDATED, {
  //   onSubscriptionData: ({ subscriptionData }) => {
  //     console.log("Sub called in frontend");
  //     setSearchdata(subscriptionData?.data?.searchResults);
  //   },
  // });
  const subs = useSubscription(TEXT_UPDATED);
  console.log(subs, "CHECK");

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleChangeSearchResult = (newText, id) => {
    updateText({
      variables: { id, text: newText },
    });
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search..."
        className="search-input"
      />

      {loading && <p>Loading...</p>}

      {searchData && (
        <div className="search-results">
          {searchData?.map((item) => (
            <EditableText
              key={item?.id}
              searchResult={item?.text}
              id={item?.id}
              handleChangeSearchResult={handleChangeSearchResult}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
