import axios from 'axios';
import { Message , Loading } from 'element-ui'; // 引入{消息、加载}
import router from './router/index';
// 请求动画
let loading = '123'
function startLoading(){//开始加载动画
    loading = Loading.service({// 加载动画信息
        lock:true, // 是否锁定
        text:"拼命加载中...", // 加载时显示的内容
        background:'rgba(0,0,0,0.7)' //背景颜色
    });
}

function endLoading(){// 结束加载动画
    console.log(loading);
    loading.close();
}
// 请求拦截
axios.interceptors.request.use(config=>{
    //加载动画
    startLoading();
    if(localStorage.eleToken){
        // 设置统一的请求header
        config.headers.Authorization = localStorage.eleToken;
    }
    return config;
},err=>{
    return Promise.reject(error);
})
// 响应拦截
axios.interceptors.response.use(response=>{
    //结束加载动画
    endLoading();
    return response;
},error=>{
    //错误提醒
    endLoading();
    // 显示错误Message
    Message.error(error.response.data);

    const { status } = error.response;
    if(status == 401){
        Message.error('token失效,请重新登录！');
        //清除token
        localStorage.removeItem('eleToken');
        //跳转到登录页面
        router.push('/login');
    }
    return Promise.reject(error);
})


export default axios;