<template>
    <div class="fillContainer">
        <div class="table_container">
            <el-table
                v-if="tableData.length > 0"
                :data="tableData"
                max-height="450"
                border
                style="width: 100%">
                <el-table-column
                    prop="username"
                    align="center"
                    label="用户名"
                    :show-overflow-tooltip="true"
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="email"
                    align="center"
                    label="邮箱"
                    :show-overflow-tooltip="true"
                    width="350">
                </el-table-column>
                <el-table-column
                    prop="avatar"
                    align="center"
                    label="用户头像"
                    :show-overflow-tooltip="true"
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="phone"
                    align="center"
                    label="用户电话"
                    :show-overflow-tooltip="true"
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="identity"
                    align="center"
                    label="身份"
                    :show-overflow-tooltip="true"
                    width="170">
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    prop="operation"
                    width="220">
                <template slot-scope="scope">
                    <el-button
                    size="small"
                    type="warning"
                    icon="edit"
                    v-if="user.identity == '超级管理员'"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                    size="small"
                    type="danger"
                    icon="delete"
                    v-if="user.identity == '超级管理员'"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <el-row  :span="24">
                <div class="pagination">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="paginations.page_index"
                        :page-sizes="paginations.page_sizes"
                        :page-size="paginations.page_size"
                        :layout="paginations.layout"
                        :total="paginations.total">
                    </el-pagination>
                </div>
            </el-row>
            
        </div>
        <UserDialog :dialog="dialog" :formData="formData" @update="getUserList"></UserDialog>
    </div>
</template>

<script>
// 引入实验室Dialog
import UserDialog from '../components/UserDialog'

export default {
    name:"userlist",
    data(){
        return {
            // 筛选的数据
            filterTableData:[],
            // 筛选设置
            paginations:{
                page_index: 1,// 当前位于哪一页
                total: 0,//总数
                page_size:5,//一页显示多少条
                page_sizes:[5,10,15,20],//每页显示多少条
                layout:"total,sizes,prev,pager,next,jumper" //翻页属性
            },
            //存储表格的数据
            formData:{
                id:"",
                username:"",
                email:"",
                password:"",
                avatar:"",
                phone:"",
                identity:""
            },
            tableData:[],
            allTableData:[],
            // 添加部分dialog属性
            dialog:{
                show:false,
                title:'修改用户信息',
                option:'edit'
            }
        };
    },
    computed:{
        user(){
            return this.$store.getters.user;
        }
    },
    created(){
        this.getUserList();
    },
    methods:{
        getUserList(){
            this.$axios.get("/api/admin")
            .then(res=>{
                this.allTableData = res.data;
                this.filterTableData = res.data;
                // 设置分页数据
                this.setPaginations();
            }).catch(err=>{console.log(err)});
        },
        handleEdit(index,row){
            this.dialog = {
                show : true,
                title: "修改用户信息",
                option: "edit"
            };
            this.formData = {
                id:row._id,
                username:row.username,
                email:row.email,
                password:row.password,
                avatar:row.avatar,
                phone:row.phone,
                identity:row.identity
            };
        },
        handleDelete(index,row){
            this.$axios.delete(`/api/admin/delete/${row._id}`)
            .then(res=>{
                this.$message('删除成功!');
                this.getUserList();
            });
        },
        handleSizeChange(page_size){
            // 切换size
            this.paginations.page_index = 1;
            this.paginations.page_size = page_size;
            this.tableData = this.allTableData.filter((item,index) => {
              return index < page_size   
            })
        },
        handleCurrentChange(page){
            // 获取当前页面第一行数据的下标 = 一页的个数 * （当前页码 - 1）
            let index = this.paginations.page_size * (page - 1);
            // 获取当前页面最后一个数据 + 1 的下标
            let nums = this.paginations.page_size * page;
            // 存储筛选出来的结果
            let tables = [];
            // 遍历 [inde,nums),存入到容器中
            for (let i = index; i < nums; i++){
                if(this.allTableData[i]){
                    tables.push(this.allTableData[i]);
                }
            }
            // 刷新当前表格数据
            this.tableData = tables;
        },
        setPaginations(){
            // 分页属性设置
            this.paginations.total = this.allTableData.length;//总页数
            this.paginations.page_index = 1;//默认第一页
            this.paginations.page_size = 5;//每一页展示的条数
            // 设置默认的分页数据
            this.tableData = this.allTableData.filter((item,index) => {
              return index < this.paginations.page_size;    
            })
        }
    },
    components:{
        UserDialog
    }
}
</script>
<style scoped>
.fillContainer{
    width: 90%;
    height: 100%;
    padding-left: 100px;
    padding-top: 50px;
    box-sizing:border-box;
}

.btnRight{
    float: right;
}

.pagination{
    text-align: right;
    margin-top: 10px;
}
</style>