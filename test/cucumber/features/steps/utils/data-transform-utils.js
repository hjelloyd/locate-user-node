/* eslint-disable no-plusplus */
const createJsonFromTable = (inputTable) => {
  const outputArray = [];
  for (let row = 1; row < inputTable.length; row++) {
    const obj = {};
    for (let col = 0; col < inputTable[row].length; col++) {
      const value = inputTable[row][col];
      if (value.length !== 0) {
        obj[inputTable[0][col]] = JSON.parse(value);
      }
    }
    outputArray.push(obj);
  }
  return outputArray;
};

const mapDataToMatchTableHeaders = (tableHeaders, actualData) => actualData.map((item) => {
  const obj = {};
  tableHeaders.forEach((header) => {
    if (item[header] !== undefined && item[header].toString().length) {
      obj[header] = item[header];
    }
  });
  return obj;
});

module.exports = {
  createJsonFromTable,
  mapDataToMatchTableHeaders,
};
