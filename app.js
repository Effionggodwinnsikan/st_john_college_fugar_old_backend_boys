/** @format */

const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.status(200).json({ Home: 'Welcome membership API' });
});

app.listen(port, () => {
  console.log(`API server is running on http://localhost:${port}`);
});
