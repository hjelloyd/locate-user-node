/* eslint-disable no-param-reassign */
const fs = require('fs');
const path = require('path');

module.exports = (data) => {
  const filePath = path.join(__dirname, './data.json');
  const jsonData = JSON.parse(fs.readFileSync(filePath));
  return jsonData.filter((item) => item.city === data.params.city)
    .map((item) => {
      delete item.city;
      return item;
    });
};
