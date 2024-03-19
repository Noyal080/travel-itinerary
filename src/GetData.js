import React, { useState } from "react";

const GetData = ({ data }) => {
  const [showData, setShowData] = useState(false);
  const stringifyData = () => {
    return JSON.stringify(data, null, 2); // Pretty print JSON with 2 spaces indentation
  };

  return (
    <div>
      <button onClick={() => setShowData(!showData)}> Get Data </button>
      {showData && (
        <textarea
          readOnly
          value={stringifyData()}
          style={{ width: "100%", height: "200px" }}
        />
      )}
    </div>
  );
};

export default GetData;
