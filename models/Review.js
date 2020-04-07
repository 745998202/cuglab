const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 审核表
const ReviewSchema = new Schema({
    review_user:{//审核人
        type: String,
        required: true
    },
    review_date:{//审核时间
        type: Date,
        default:Date.now
    },
    lab_id:{// 实验室id
        type: String,
        required: true
    },
    book_date:{// 预定日期
        type: Date,
        required: true
    },
    book_part:{//预约时间段
        type: Array,
        required: true
    },
    book_user:{ //预约人
        type: String,
        required:true
    }
})

module.exports = Review = mongoose.model("reviews",ReviewSchema);//打包成一个mongoose的model模块