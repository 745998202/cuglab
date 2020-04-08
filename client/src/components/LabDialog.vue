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
                    <el-form-item prop="lab_name" label="实验室名：">
                        <el-input type="describe" v-model="formData.lab_name"></el-input>
                    </el-form-item>
                   <el-form-item prop="info" label="实验室信息:">
                        <el-input type="info" v-model="formData.info"></el-input>
                    </el-form-item>

                    <el-form-item prop="picture" label="实验室内景:">
                        <el-input type="picture" v-model="formData.picture"></el-input>
                    </el-form-item>

                    <el-form-item prop="capacity" label="容量:">
                        <el-input type="capacity" v-model="formData.capacity"></el-input>
                    </el-form-item>

                    <el-form-item prop="owner_1" label="主负责人:">
                        <el-input type="owner_1" v-model="formData.owner_1"></el-input>
                    </el-form-item>

                    <el-form-item prop="owner_2" label="副负责人:">
                        <el-input type="owner_2" v-model="formData.owner_2"></el-input>
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
    name:"labdialog",
    data(){
        return {
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
                    this.$axios.post(`/api/labs/${url}`,this.formData)
                    .then(res=>{
                        this.$message({
                            message:"数据添加成功",
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