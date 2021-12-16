const healthcheck = (req, res) => {
  res.status(200).send('ok');
};

module.exports = {
  healthcheck,
};
