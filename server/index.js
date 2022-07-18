const bodyParser = require('body-parser')
const express = require('express');
const app = express();
app.use(express.json());

const dotenv = require("dotenv");
dotenv.config();

const cors = require('cors');
app.use(cors());

mongoose = require('mongoose');
mongoose.connect(process.env.DB_CONNECTION_STRING);

const authRoutes = require('./src/routes/authRoutes');
const fileSystemRoutes =  require('./src/routes/fileSystemRoutes');
const documentRoutes =  require('./src/routes/documentRoutes');

app.use(authRoutes);
app.use(fileSystemRoutes);
app.use(documentRoutes);

app.use(bodyParser.json());

const port = process.env.PORT;
app.listen(port, ()=>{
    console.log('Listening on port ' + port)
})