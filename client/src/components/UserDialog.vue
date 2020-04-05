<template>
    <div class="dialog">
        <el-dialog
            :title="dialog.title"
            :visible.sync="dialog.show"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :modal-append-to-body="false"
        >
            <div class="form">
                <el-form
                    ref="form"
                    :model="formData"
                    :rules="form_rules"
                    label-width="120px"
                    style="margin:10px;width:auto;"    
                >
                    <el-form-item prop="username" label="用户名：">
                        <el-input type="username" v-model="formData.username"></el-input>
                    </el-form-item>
                   <el-form-item prop="email" label="邮箱:">
                        <el-input type="email" v-model="formData.email"></el-input>
                    </el-form-item>

                    <el-form-item prop="avatar" label="用户头像:">
                        <el-input type="avatar" v-model="formData.avatar"></el-input>
                    </el-form-item>

                    <el-form-item prop="phone" label="用户电话:">
                        <el-input type="phone" v-model="formData.phone"></el-input>
                    </el-form-item>

                    <el-form-item label="用户身份:">
                        <el-select v-model="formData.identity" placeholder="用户身份">
                            <el-option v-for="(formtype,index) in format_type_list" :key="index"
                            :label="formtype" :value="formtype"></el-option>
                        </el-select>
                    </el-form-item>   

                    <el-form-item class="text_right">
                        <el-button @click="dialog.show = false">取消</el-button>
                        <el-button @click="onSubmit('form')">提交</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name:"userdialog",
    data(){
        return {
            format_type_list:[
                "普通用户",
                "实验室管理员",
                "超级管理员"
            ],
            form_rules:{
                describe:[
                    {
                        required:true,
                        message:"收支描述不能为空",
                        trigger:'blur'
                    }
                ],
                income:[
                    {
                        required:true,
                        message:"收入不能为空",
                        trigger:"blur"
                    }
                ]
            }
        }
    },
    props:{
        dialog: Object,
        formData: Object
    },
    methods:{
        onSubmit(form){
            this.$refs[form].validate(valid =>{
                if(valid){
                    const url = this.dialog.option == "add" ? "add" : `update/${this.formData.id}`;
                    console.log(url);
                    this.$axios.post(`/api/admin/${url}`,this.formData)
                    .then(res=>{
                        this.$message({
                            message:"数据修改成功",
                            type:"success"
                        });
                        // 隐藏dialog
                        this.dialog.show = false;
                        this.$emit('update');
                    })
                }
            })
            console.log("提交");
            this.dialog.show = false;
        }
    }
};
</script>
<style scoped>

</style>