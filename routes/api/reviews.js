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
const Status = require('../../models/Status');

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
router.get('/not/:name',(req,res)=>{
   // 通过这个id找name
    Lab.findOne({owner_1:req.params.name}).then(lab=>{
        if(!lab)res.json({message:"该用户没有管理实验室",status:0});
        Book.find({lab_id:lab._id,status:"0"}).then(book=>{
            if(!book)res.json({message:"该实验室没有未预约审批",status:0});
            res.json(book);
        }).catch(err=>res.json(err));
    }).catch(err=>res.json(err));
   
}) 

router.get('/:id',(req,res)=>{
    Status.find({lab_id:req.params.id})
    .then(status=>{
        if(!status){
            console.log(1);
            res.json({message:"暂无预约信息"});
        }
        console.log(status);
        res.json(status);
    })
})
router.post('/agree/:id',(req,res)=>{
    // 将book表中某一条的id传上来作为凭据
    // 1. 修改book表中的数据,将status变为1
    // 2. 创建审批信息，存储下来
    Book.update({_id:req.params.id},{status:"1"})
    .catch(err=>{
        res.status(500).err({message:"审批失败"})
    });

    const ReviewFields = {}
    if(req.body.review_user) ReviewFields.review_user = req.body.review_user;
    if(req.body.review_date) ReviewFields.review_date = req.body.review_date;
    if(req.body.lab_id) ReviewFields.lab_id = req.body.lab_id;
    if(req.body.book_date) ReviewFields.book_date = req.body.book_date;
    if(req.body.book_part) ReviewFields.book_part = req.body.book_part;
    if(req.body.book_user) ReviewFields.book_user = req.body.book_user;
    new Review(ReviewFields).save().then(review=>{
        res.json(review)
    }).catch(err=>{
        res.status(500).json({message:err});
    })
})

router.post('/refuse/:id',(req,res)=>{

    // 从Status中寻找这一天
    console.log(req.body);
    Status.findOne({book_date:req.body.book_date})
    .then(status =>{
        // 判断这一天是否只有这一个预定
        if(status.part == req.body.part){
            // 完全相同则删除
            Status.deleteOne({book_date:req.body.book_date})
            .catch(err=>{console.log(err)});
        }else{
            // 不完全相同则更新Status
            let newpart = status.part.filter((item)=>{
                //取出重复的
                return !req.body.part.includes(item);
            })
            Status.update({book_date:req.body.book_date},{part:newpart})
            .catch(err=>{console.log(err)})
        }
    })

    Book.deleteOne({_id:req.params.id})
    .then(book=>{
        res.json({message:"审批成功！"});
    })
    .catch(err=>{
        res.status(500).json({message:"删除book表失败"})
    });

    
})
module.exports = router;
