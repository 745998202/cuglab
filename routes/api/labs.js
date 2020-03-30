/*  
1. 添加实验室
2. 删除实验室
3. 修改实验室数据
2. 查询所有实验室数据（概览页）
3. 查询某个实验室详细数据
*/

// 处理用户事宜

const express = require('express');
// 实例化router
const router = express.Router();
const passport = require('passport');

const Lab = require('../../models/Laboratory');


// 测试
router.get('/test',(req,res)=>{
    res.json({message : "lab api works!"})
});


// $route : /api/labs/add
// @desc :  添加实验室
// @access : private

router.post('/add',passport.authenticate("jwt",{session:false}),(req,res)=>{
    // 数据校验
    const LabFields = {};
    if(req.body.lab_name)   LabFields.lab_name = req.body.lab_name;
    if(req.body.owner_1)    LabFields.owner_1 = req.body.owner_1;
    if(req.body.owner_2)    LabFields.owner_2 = req.body.owner_2;
    if(req.body.picture)    LabFields.picture = req.body.picture;
    if(req.body.info)       LabFields.info = req.body.info;
    if(req.body.capacity)   LabFields.capacity = req.body.capacity;

    new Lab(LabFields).save().then(lab=>{
        res.json(lab);
    }).catch(err=>{
        console.log(err);
        res.json({message:"创建实验室失败！",status:1});
    })

})

// $route : /api/labs/delete/:id
// @desc :  删除某个实验室
// @access : private
router.post('/delete/:id',passport.authenticate("jwt",{session:false}),(req,res)=>{
    // 数据校验
    Lab.findOneAndRemove({_id:req.params.id},{useFindAndModify:false})
    .then(lab=>res.json(lab)).catch(err => res.status(404).json("删除失败"));

})


// $route : /api/labs/update/:id
// @desc :  修改某个实验室信息
// @access : private

router.post('/update/:id',passport.authenticate("jwt",{session:false}),(req,res)=>{
    const LabFields = {};
    if(req.body.lab_name)   LabFields.lab_name = req.body.lab_name;
    if(req.body.owner_1)    LabFields.owner_1 = req.body.owner_1;
    if(req.body.owner_2)    LabFields.owner_2 = req.body.owner_2;
    if(req.body.picture)    LabFields.picture = req.body.picture;
    if(req.body.info)       LabFields.info = req.body.info;
    if(req.body.capacity)   LabFields.capacity = req.body.capacity;

    Lab.findOneAndUpdate(
        {_id:req.params.id},
        {$set:LabFields},       
        {new:true}
    ).then(lab=>res.json(lab)).catch(err=>{
        console.log("更新错误");
        res.json({message:"更新失败!",status:1});
    })
})

// $route : GET /api/labs/
// @desc :  查询所有实验室信息
// @access : private
router.get('/',passport.authenticate("jwt",{session:false}),(req,res)=>{
    Lab.find()
    .then(lab=>{
        if(!lab){
            return res.status(404).json('没有任何内容');
        }

        res.json(lab);
    }).catch(err=>res.status(404).json(err));
})

// $route : GET /api/labs/:id
// @desc :  查询某个实验室信息
// @access : private
router.get('/:id',passport.authenticate("jwt",{session:false}),(req,res)=>{
    Lab.findOne({_id:req.params.id})
    .then(lab=>{
        if(!lab){
            return res.status(404).json('没有任何内容');
        }
        res.json(lab);
    }).catch(err=>res.status(404).json(err));
})
module.exports = router;
