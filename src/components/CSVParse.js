import React from "react";
import { CSVReader } from "react-papaparse";

const _void = (data) => {
  /* */
};

const CsvParser = ({ handleData = _void }) => {
  const handleOnDrop = (data) => {
    console.log(data);
    handleData(data.map((d) => d.data));
  };
  const handleOnError = (err, file, inputElem, reason) => {
    console.log("handleOnError:", err);
  };
  const handleOnRemoveFile = (data) => {
    console.log("handleOnRemoveFile:", data);
  };

  return (
    <CSVReader
      onDrop={handleOnDrop}
      onError={handleOnError}
      onRemoveFile={handleOnRemoveFile}
      addRemoveButton
      config={{ header: true, dynamicTyping: true }}
    >
      <span>Drop CSV file here or click to import.</span>
    </CSVReader>
  );
};

export default CsvParser;
