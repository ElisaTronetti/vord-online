import io from "socket.io";
import { teaserSocketLockHandler } from "./middleware/teaserLock";
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
const sharedDocumentRoutes =  require('./src/routes/shaDocRoutes');

app.use(authRoutes);
app.use(fileSystemRoutes);
app.use(documentRoutes);
app.use(sharedDocumentRoutes);

app.use(bodyParser.json());

const port = process.env.PORT;
const server = app.listen(port, ()=>{
    console.log('Listening on port ' + port)
})

// Create a socket and apply teaser locking listener on it
const socket = io(server);
teaserSocketLockHandler(socket);