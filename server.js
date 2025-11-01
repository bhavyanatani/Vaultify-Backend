const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

connectToMongo();

app.use(express.json());
const allowedOrigins = [
  "http://localhost:3000", // for local dev
  "https://vaultify-frontend-mu.vercel.app" // your deployed frontend
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use('/api/auth', require('./routes/auth'));
app.use('/api/password', require('./routes/password'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
