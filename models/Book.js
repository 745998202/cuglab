const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 创建预定表
const BookSchema = new Schema({
    lab_id:{//实验室id
        type: String,
        required: true
    },
    lab_name:{
        type: String,
        required: true
    },
    book_date:{//预定日期
        type: Date,
        required: true
    },
    part:{//预定时间段
        type: Array,
        required: true
    },
    book_user:{//预约人
        type: String,
        required: true
    },
    status:{ //预约状态
        type: String,
        required:true
    }
})

module.exports = Book = mongoose.model("books",BookSchema);//打包成一个mongoose的model模块