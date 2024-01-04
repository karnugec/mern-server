const dotenv = require("dotenv");
const mongoose = require('mongoose');
const express = require('express');
// const cookieParser = require('cookie-parser');


const app = express();
// app.use(cookieParser ());

dotenv.config({path: './config.env'});

require('./db/conn');
// const User = require('./model/userSchema');

app.use(express.json());

app.use(require('./router/auth'));

const PORT = process.env.PORT;



//middleware
// const middleware = (req, res, next) => {
//     console.log(`hello middleware`);
//     next(); // agar hm ise nahi likhenge to ye continuously load hota rahega
// }

// app.get('/', (req, res) => {
//     res.send(`hello karn`);
// });

// app.get('/about', (req, res) => {
//     res.send(`hello about`);
// });

// app.get('/contact', (req, res) => {
//     res.send(`hello contact`);
// });

// app.get('/signin', (req, res) => {
//     res.send(`hello Login`);
// });

app.get('/signup', (req, res) => {
    res.send(`hello Register`);
});

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
})