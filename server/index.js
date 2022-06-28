const bodyParser = require('body-parser')
const express = require('express');
const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test');

const authRoutes = require('./src/routes/authRoutes');
const fileSystemRoutes =  require('./src/routes/fileSystemRoutes');

app.use(authRoutes);
app.use(fileSystemRoutes);

app.use(bodyParser.json())

app.listen(3001, ()=>{
    console.log('Listening on port 3001')
})