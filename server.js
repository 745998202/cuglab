const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
//引入部分路由
const admin = require('./routes/api/admin');
const users = require('./routes/api/users');
const labs = require('./routes/api/labs');
const books = require('./routes/api/books');
const reviews = require('./routes/api/reviews');
const db = require('./config/keys').mongoURI;

const app = express();
const port = process.env.PORT || 5001;


// 数据库连接
mongoose.connect(db,{useNewUrlParser: true,useUnifiedTopology: true})
.then(()=>{
    console.log('mongodb has be connected！')   
}).catch(err=>console.log(err));

// 中间件配置
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//passport初始化
app.use(passport.initialize());
require('./config/passport')(passport);
//路由配置
app.use('/api/admin',admin);
app.use('/api/users',users);
app.use('/api/labs',labs);
app.use('/api/books',books);
app.use('/api/reviews',reviews);

app.get('/',(req,res)=>{
    res.send('express is running!');
})





app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
})