// 管理员对于用户进行增删改查

const express = require('express');
// 实例化router
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const keys = require('../../config/keys');
const User = require('../../models/User');
// 测试

router.get('/test',(req,res)=>{
    res.json({message : "admin works!"});
});

router.post('/add',(req,res)=>{
    //增加用户，与注册相同
    User.findOne({email: req.body.email})
    .then(user=>{
        if(user){
            return res.status(400).json("邮箱已被注册!");
        }else{
            var avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});
            const newUser = new User({
                username: req.body.username,
                avatar:avatar,
                email:req.body.email,
                password:req.body.password,
                identity:req.body.identity,
                phone:req.body.phone
            })
            bcrypt.genSalt(10, function(err, salt) {    // 加密密码存储
                bcrypt.hash(newUser.password, salt, (err, hash)=> {
                    // Store hash in your password DB.
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                    .then(user=>res.json(user))
                    .catch(err=>console.log(err));
                });
            });
        }
    })
});

router.delete('/delete/:id',(req,res)=>{
    //删除用户
    User.findOneAndRemove({_id:req.params.id},{useFindAndModify:false})
    .then(user=>res.json(user)).catch(err => res.status(404).json("删除失败"));
})

router.post('/update/:id',(req,res)=>{
    const UserFields = {};
    if(req.body.username)   UserFields.username = req.body.username;
    if(req.body.email)   UserFields.email = req.body.email;
    if(req.body.password)   UserFields.password = req.body.password;
    if(req.body.identity)   UserFields.identity = req.body.identity;
    if(req.body.phone)   UserFields.phone = req.body.phone;
    if(req.body.avatar)   UserFields.avatar = req.body.avatar;

    User.findOneAndUpdate(
        {_id:req.params.id},
        {$set:UserFields},       
        {new:true}
    ).then(user=>res.json(user)).catch(err=>{
        console.log("更新错误");
        res.json({message:"更新失败!",status:1});
    })
});

router.get('/',(req,res)=>{
    //获取所有用户信息
    User.find().then(user=>{
        if(!user){
            return res.status(404).json("没有任何内容");
        }

        res.json(user);
    }).catch(err=>res.json(err));
});

router.get('/:id',(req,res)=>{
    //获取所有用户信息
    User.findOne({_id:req.params.id}).then(user=>{
        if(!user){
            return res.status(404).json("没有任何内容");
        }

        res.json(user);
    }).catch(err=>res.json(err));
})






module.exports = router;
