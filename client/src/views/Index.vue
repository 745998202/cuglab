<template>
<div class="index">
    <HeadNav></HeadNav>
    <LeftMenu :urlList="urlList"></LeftMenu>
    <div class="rightContainer">
        <router-view></router-view>
    </div> 
    
</div>
</template>

<script>
import HeadNav from '../components/HeadNav';
import LeftMenu from '../components/LeftMenu';
export default {
    name: "index",
    components:{
        HeadNav,
        LeftMenu
    },
    data(){
        return {
            urlList:{
                "超级管理员":[
                                {
                                icon: "fa-money",
                                name: "实验室管理",
                                path: "fund",
                                children: [
                                    { path: "lablist", name: "实验室信息编辑" }
                                    ]
                                },
                                {
                                icon: "fa-asterisk",
                                name: "信息管理",
                                path: "userlist",
                                children: [{ path: "userlist", name: "用户管理" }]
                                }
                            ],
                "实验室管理员":[
                                {
                                icon: "fa-money",
                                name: "实验室管理",
                                path: "fund",
                                children: [
                                    { path: "reviewList", name: "预约审批" }
                                    ]
                                },
                                {
                                icon: "fa-asterisk",
                                name: "信息管理",
                                path: "infoshow",
                                children: [{ path: "infoshow", name: "个人信息" }]
                                }
                            ],
                "普通用户":[
                                {
                                icon: "fa-money",
                                name: "预约管理",
                                path: "booklablist",
                                children: [
                                    { path: "booklablist", name: "实验室预约" }
                                    ]
                                },
                                {
                                icon: "fa-asterisk",
                                name: "信息管理",
                                path: "infoshow",
                                children: [{ path: "infoshow", name: "个人信息" }]
                                }
                            ]
            }
        }
    },
    computed:{
        user(){
            return this.$store.getters.user;
        }
    }
};
</script>
<style>
.index {
    width:100%;
    height:100%;
    overflow: hidden;
}
.rightContainer{
    position: relative;
    top:0;
    left: 180px;
    width: calc(100% - 180px);
    height: calc(100% - 71px);
    overflow: auto;
}
</style>