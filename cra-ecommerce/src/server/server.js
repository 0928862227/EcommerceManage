const express = require('express');
const dbConnect = require("./config/dbconnect")
require('dotenv').config();
const initRoutes = require('./routes');//video2-38
const cookieParser = require('cookie-parser');//video4
//const cors = require('cors');


const app = express();
/* app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['POST', 'PUT', 'GET', 'DELETE'],
    credentials: true,
})) */
app.use(cookieParser());
const port = process.env.PORT || 8888
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dbConnect()
//từ đây đi tới routes/index đi tới cái vấn đề cùng cấp và đi tới controller
 initRoutes(app);
 
app.use('/',(req,res)=>{res.send('SEVER ONNN')})

app.listen(port, () => {
    console.log('Server is running on the port ' + port);
})