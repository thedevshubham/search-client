import React, { useState, useEffect } from "react";

const EditableText = ({ searchResult, handleChangeSearchResult, id }) => {
  const handleTextChange = (event) => {
    const newText = event.target.value;
    handleChangeSearchResult(newText, id);
  };

  return (
    <div className="text-list">
      <textarea value={searchResult} onChange={handleTextChange}>
        {searchResult}
      </textarea>
    </div>
  );
};

export default EditableText;
