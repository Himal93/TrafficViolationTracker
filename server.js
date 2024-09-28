const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();
const PORT = process.env.PORT || 3000;

const bodyParser = require('body-parser'); 
app.use(bodyParser.json());

// import the router files
const userRoutes = require('./routes/userRoutes');
const pedrecordRoutes = require('./routes/pedrecordsRoutes');

// use the routers
app.use('/user', userRoutes);
app.use('/pedrecord', pedrecordRoutes);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});