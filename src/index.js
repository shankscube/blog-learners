require('dotenv').config();
const express = require('express');
const apis = require('./routes/api');
const db = require('./configs/database');

const app = express();

const PORT = 3000;

app.use(express.json());
app.use('/v1', apis);

db.authenticate()
  .then(() => {
    console.log('Database connected...'); 
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })  
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });



