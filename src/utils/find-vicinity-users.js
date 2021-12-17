const { getDistance } = require('geolib');
const { getAllUsers } = require('./get-source-data');

const METERS_TO_MILES = 0.000621371;

const inVicinity = (cityCoords, user, maxDistance) => {
  const userCoords = { latitude: user.latitude, longitude: user.longitude };
  const distanceBetweenPoints = getDistance(cityCoords, userCoords, 0.01) * METERS_TO_MILES;
  return distanceBetweenPoints <= maxDistance;
};

const getVicinityUsers = async (coordinates, distance) => {
  const users = await getAllUsers();
  return users.filter((user) => inVicinity(coordinates, user, distance))
    .map((item) => ({ ...item, ...{ type: ['VICINITY'] } }));
};

module.exports = {
  inVicinity,
  getVicinityUsers,
};
