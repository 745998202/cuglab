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


// 测试路由
router.get('/test',(req,res)=>{
    res.json("books api is working!");
})

// $route : POST /api/books/add
// @desc :  预约实验室
// @access : private
router.post('/add',passport.authenticate("jwt",{session:false}),(req,res)=>{

    const BookFields = {};
    if(req.body.lab_id) BookFields.lab_id = req.body.lab_id;
    if(req.body.lab_name) BookFields.lab_name = req.body.lab_name;
    if(req.body.book_date) BookFields.book_date = req.body.book_date;
    if(req.body.part) BookFields.part = req.body.part;
    if(req.body.book_user) BookFields.book_user = req.body.book_user;
    if(req.body.status) BookFields.status = req.body.status;
    new Book(BookFields).save().then(book=>res.json(book)).catch(err=>res.json(err));
})

// $route : GET /api/labs/
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

    Book.find({_id:req.params.id}).then(book=>{
        if(!book){
            return res.status(404).json("没有任何内容")
        }

        return res.json(book);
    }).catch(err=>res.json(err));

})
// 将这个路由exports出去
module.exports = router;