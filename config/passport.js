const JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {}

const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require('../config/keys');
// 利用配置信息验证请求
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport =>{
    passport.use(new JwtStrategy(opts, (jwt_payload, done)=> {
        // console.log(jwt_payload);
        // 1. 使用rule加密获得token
        // 2. 携带token解密成为jwt_payload
        // 3. 验证解密后的内容
        // 4. 验证成功之后返回对应的内容，返回值会成为新的请求到达路由处
        User.findById(jwt_payload.id)
        .then(user=>{
            if(user){
                return done(null,user);
            }
            return done(null,false);
        })
        .catch(err=>console.log(err));
    }));
}