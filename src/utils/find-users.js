const { getDistance, getPreciseDistance } = require('geolib');
const joi = require('joi');
const { getAllUsers, getUsersByCity } = require('./get-source-data');

const METERS_TO_MILES = 0.000621371;

const mapUsers = (user, type) => {
  const schema = joi.object({
    id: joi.number().integer(),
    first_name: joi.string(),
    last_name: joi.string(),
    email: joi.string(),
    ip_address: joi.string(),
    latitude: joi.number(),
    longitude: joi.number(),
  });
  const result = schema.validate(user, { stripUnknown: true, abortEarly: false, convert: true });
  result.value.type = [type];
  return result.value;
};

const inVicinity = (cityCoords, user, maxDistance) => {
  const userCoords = { latitude: user.latitude, longitude: user.longitude };
  let distanceBetweenPoints;
  if (maxDistance > 300) {
    distanceBetweenPoints = getPreciseDistance(cityCoords, userCoords, 0.01) * METERS_TO_MILES;
  } else {
    distanceBetweenPoints = getDistance(cityCoords, userCoords, 0.01) * METERS_TO_MILES;
  }
  return distanceBetweenPoints <= maxDistance;
};

const getVicinityUsers = async (coordinates, distance) => {
  const users = await getAllUsers();
  return users.filter((user) => inVicinity(coordinates, user, distance))
    .map((item) => mapUsers(item, 'VICINITY'));
};

const getCityUsers = async (city) => {
  const users = await getUsersByCity(city);
  return users.map((item) => mapUsers(item, 'CITY'));
};

const getUniqueUsers = async (cityUsers, vicinityUsers) => {
  const users = [...cityUsers];
  vicinityUsers.forEach((item) => {
    const index = users.findIndex((elm) => elm.id === item.id);
    if (index < 0) {
      users.push(item);
    } else {
      users[index].type.push(item.type[0]);
    }
  });
  users.sort((a, b) => (a.id - b.id));
  return users;
};

module.exports = {
  mapUsers,
  inVicinity,
  getVicinityUsers,
  getCityUsers,
  getUniqueUsers,
};
