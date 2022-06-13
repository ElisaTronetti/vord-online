const express = require('express');
const app = express();
app.use(express.json());

mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test');
//mongoose.set('useFindAndModify', false);
const routes = require('./src/routes/movieRoutes');

routes(app);

app.listen(3000,  ()=>{
    console.log('Listening on port 3000')
})