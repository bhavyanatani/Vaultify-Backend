const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

connectToMongo();

app.use(express.json());
app.use(
  cors({
    origin: "*", // change to your frontend URL after deployment for security
  })
);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/password', require('./routes/password'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
