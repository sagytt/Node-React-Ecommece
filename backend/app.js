const express = require('express');
const mongoose = require('mongoose');
//HTTP request logger middleware
const morgan = require('morgan');
//Parse incoming request bodies in a middleware before your handlers
const bodyParser = require('body-parser');
//middleware which parses cookies attached to the client request
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
require('dotenv').config();

//import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');

//app
//loading express into app
const app = express();

//db connection
mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('DB Connected'));

//middlewares
// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());


//routes middleware
//passing the userRoutes into app
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);

//Fetching the port number from .env
const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
