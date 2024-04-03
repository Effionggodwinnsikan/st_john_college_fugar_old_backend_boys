/** @format */
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 3000;
dotenv.config();
const swaggerOptions = {
  Definition: {
    info: {
      title: 'St. John College Membership API',
      version: '1.0.0',
      description: 'Documentation for St. John College Membership API',
    },
  },
  // (swagger-jsdoc configuration) https://github.com/Surnet/swagger-jsdoc
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'St. John College Membership API',
      version: '1.0.0',
      description: 'Documentation for St. John College Membership API',
    },
    servers: [{ url: `http://127.0.0.1:${port}` }],
  },
  // (the options object) see https://github.com/kogosoftware/openapi-generator/blob/master/docs/usage-example-js.md
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerOptions;
