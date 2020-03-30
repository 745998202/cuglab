// 处理用户事宜

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
    res.json({message : "user login works!  "})
});


// $route : /api/users/register
// @desc :  注册
// @access : public 
router.post("/register",(req,res) => {
    // 查询邮箱是否存在
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
})


// $route : /api/users/login
// @desc :  登陆
// @access : public 
router.post('/login',(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    // 查询数据库，email是否存在
    User.findOne({email})
    .then(user=>{
        if(!user){
            return res.status(404).json("用户不存在");
        }
        // 如果用户存在,密码匹配 使用bcrypt
        bcrypt.compare(password,user.password)
        .then(isMatch=>{
            if(isMatch){ // 如果匹配，返回token
                const rule = {
                    id:user.id,
                    username:user.username,
                    avatar:user.avatar,
                    identity:user.identity
                }    //创建token规则
                jwt.sign(rule,keys.secretOrKey,{expiresIn:3600},(err,token)=>{  // 规则,密码名,过期时间,回调函数
                    if(err) throw err;
                    res.json({
                        success: true,
                        token:"Bearer "+token   // 'Bearer '+token 才能匹配成功
                    })
                })
            }
            else{
                return res.status(400).json("密码错误");
            }
        })
    })
})
module.exports = router;
