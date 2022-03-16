const express = require('express');
const userRoute = require('./user.route');
const portfolioRoute = require('./portfolio.route');
const rankingRoute = require('./ranking.route');
const docsRoute = require('./docs.route');
const testRoute = require('./test.route');
const registerRoute = require('./register.route');

const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/rankings',
    route: rankingRoute,
  },
  {
    path: '/portfolios',
    route: portfolioRoute,
  },
  {
    path: '/register',
    route: registerRoute,
  },
  {
    path: '/docs',
    route: docsRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/test',
    route: testRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
