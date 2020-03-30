/**
 审批

 查询当前所有待审批预约
 查询某个实验室的待审批预约
 审批预约
 */

const express = require('express');
// 实例化router
const router = express.Router();
const passport = require('passport');
const Review = require('../../models/Review');
const Book = require('../../models/Book');
const Lab = require('../../models/Laboratory');
const User = require('../../models/User');

router.get('/test',(req,res)=>{
    res.json("review api work!");
})

// $route : GET /api/reviews/not
// @desc :  查询所有未审批预约
// @access : public
router.get('/not',(req,res)=>{
    Book.find({status:"0"}).then(book=>{
        if(!book){
            res.json("当前没有未审批预约");
        }
        res.json(book);
    }).catch(err=>res.json({message:err,status:1}));
}) 


// $route : GET /api/reviews/not/:id
// @desc :  查询某人未审批预约
// @access : public
router.get('/not/:id',(req,res)=>{
   // 通过这个id找name
    
    User.findOne({_id:req.params.id}).then(user=>{
        if(!user)return res.status(404).json("没有这个人");
        username = user.username;
        Lab.findOne({owner_1:username}).then(lab=>{
            if(!lab)res.json({message:"该用户没有管理实验室",status:0});
            Book.find({lab_id:lab._id}).then(book=>{
                if(!book)res.json({message:"该实验室没有未预约审批",status:0});
                res.json(book);
            }).catch(err=>res.json(err));
        }).catch(err=>res.json(err));
    }).catch(err=>res.json(err));
    
    

   
   
}) 

module.exports = router;
