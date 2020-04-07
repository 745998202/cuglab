const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 创建表
const StatusSchema = new Schema({
    lab_id : {
        type:String,
        required:true
    },
    book_date :{
        type: Date,
        required:true
    },
    part:{
        type:Array,
        required:true
    }
})

module.exports = Status = mongoose.model("status",StatusSchema);//打包成一个mongoose的model模块