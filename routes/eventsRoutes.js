const Events = require('../client/src/containers/Events');

module.exports = app => {
  app.get('/events', (req, res) => {
    res.send(renderToString(Events));
  });
};
