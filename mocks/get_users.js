/* eslint-disable no-param-reassign */
const fs = require('fs');
const path = require('path');

module.exports = () => {
  const filePath = path.join(__dirname, './data.json');
  const jsonData = JSON.parse(fs.readFileSync(filePath));
  return jsonData.map((item) => {
    delete item.city;
    return item;
  });
};
