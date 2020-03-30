const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 创建表
const UserSchema = new Schema({
    username:{
        type: String,
        required: true
    },
    avatar:{
        type:String
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    identity:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    }
})

module.exports = User = mongoose.model("users",UserSchema);//打包成一个mongoose的model模块