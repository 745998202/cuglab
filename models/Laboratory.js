const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 创建表
const LabSchema = new Schema({
    lab_name:{//实验室名
        type: String,
        required: true
    },
    owner_1:{//负责人1
        type: String,
        required: true
    },
    owner_2:{//负责人2
        type: String,
        required: true
    },
    picture:{//实验室内景
        type: String
    },
    info:{//实验室设备情况
        type: String,
        required: true
    },
    capacity:{// 容量
        type: Number,
        required: true
    }
})

module.exports = Lab = mongoose.model("labs",LabSchema);//打包成一个mongoose的model模块