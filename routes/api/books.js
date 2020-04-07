/*
预约部分

预约实验室
查找某个实验室的预约信息


*/

const express = require('express');
// 实例化router
const router = express.Router();
const passport = require('passport');
const Book = require('../../models/Book');
const Status = require('../../models/Status');


// 测试路由
router.get('/test',(req,res)=>{
    res.json("books api is working!");
})

// $route : POST /api/books/add
// @desc :  预约实验室
// @access : private
router.post('/add',passport.authenticate("jwt",{session:false}),(req,res)=>{

    console.log("req.body",req.body);
    const StatusFields = {};
    const BookFields = {};
 
    BookFields.lab_id = req.body.lab_id;
    StatusFields.lab_id = req.body.lab_id;

    BookFields.lab_name = req.body.lab_name;
        

    BookFields.book_date = req.body.book_date;
    StatusFields.book_date = req.body.book_date;

    BookFields.part = req.body.part;
    StatusFields.part = req.body.part;
    if(req.body.book_user) BookFields.book_user = req.body.book_user;
    if(req.body.status) BookFields.status = req.body.status;
    // 在Status中找
    // 如果当前已选定日期part已经在状态表中，则返回失败
    // 如果当前已选定日期不在状态表中
    // 1. 写状态表 2. 写book表
    // 审批不通过要做的两件事
    // 1. 删除状态表 2. 写book表
    Status.findOne({lab_id:StatusFields.lab_id,book_date:StatusFields.book_date})
    .then(status => {
        if(!status){
            // 如果状态表中没有这一条数据 创建这一条数据锁住状态表
            new Status(StatusFields).save().catch(err=>{
                console.log(err);
            });
            // 创建一条预定信息
            new Book(BookFields).save().catch(err=>{
                console.log(err);}
                );
            res.json({message:"预定成功"});
        }else{
            // 如果状态表中有这一条数据
            if(status.part.filter(num=>{
                return StatusFields.part.indexOf(num)!=-1
            }).length > 0){
                // 如果有交集
                res.status(500).json({ message: '包含已预定日期' })
            }else{
                // 没有交集
                // 创建新的预定单
                new Book(BookFields).save().catch(err=>res.status(500).err({message:err}));
                // 更新实验室状态表
                let allPart = Array.from(new Set(StatusFields.part.concat(status.part)));
                Status.update({lab_id:StatusFields.lab_id,book_date:StatusFields.book_date},{part:allPart})
                .then(b=>res.json(b)).catch(err=>{
                    res.status(500).json({ error: err })
                })
            }
        }
    })
})

// $route : GET /api/books
// @desc :  获取所有预约信息
// @access : private
router.get('/',passport.authenticate("jwt",{session:false}),(req,res)=>{

    Book.find().then(book=>{
        if(!book){
            return res.status(404).json("没有任何内容");
        }
        
        res.json(book);
    }).catch(err=>res.json(err));
})


// $route : GET /api/books/:id
// @desc :  获取某个实验室的预约信息
// @access : private
router.get('/:id',passport.authenticate("jwt",{session:false}),(req,res)=>{
    Book.find({lab_id:req.params.id}).then(book=>{
        if(!book){
            return res.status(404).json("没有任何内容")
        }
        return res.json(book);
    }).catch(err=>res.json(err));

})
// 将这个路由exports出去
module.exports = router;