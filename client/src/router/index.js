import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Register from '../views/Register.vue'
import NotFound from '../views/404.vue'
import Login  from '../views/Login.vue'
import Index from '../views/Index.vue'

import FundList from "../views/FundList.vue"
import InfoShow from "../views/InfoShow.vue"
import LabList from "../views/LabList.vue"
import UserList from "../views/UserList.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect:'/index'
  },
  {
    path:'/index',
    name:'index',
    component: Index,
    children:[
      {path:"",component:Home},
      {path:"/home",name:"home",component:Home},
      {path:"/infoshow",name:"infoshow",component:InfoShow},
      {path:"/fundlist",name:"fundlist",component:FundList},
      {path:"/lablist",name:"lablist",component:LabList},
      {path:"/userlist",name:"userlist",component:UserList}
    ]
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '*',
    name: '/404',
    component: NotFound
  },
  {
    path: '/login',
    name: 'login',
    component:Login
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由守卫
router.beforeEach((to,from,next)=>{
  const isLogin = localStorage.eleToken ? true : false;//取出当前token
  if(to.path == '/login' || to.path == '/register'){
    next();
  }else{
    isLogin ? next() : next("/login"); 
  }
})
export default router
