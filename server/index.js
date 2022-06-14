const express = require('express');
const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test');

const routes = require('./src/routes/authRoutes');
app.use(routes);

app.listen(3000, ()=>{
    console.log('Listening on port 3000')
})