/** @format */

const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerOptions = require('./src/lib/swagger');
const users = require('./src/routes/users');

dotenv.config();
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectDB = require('./src/config/db');

// connect to db
connectDB();

app.get('/', (req, res) => {
  res.status(200).json({ Home: 'Welcome to St. John College membership API' });
});

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/v1', users);
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`API server is running on http://127.0.0.1:${port}`);
  console.log(`API Docs http://127.0.0.1:${port}/api-docs`);
});
