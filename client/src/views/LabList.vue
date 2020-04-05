<template>
    <div class="fillContainer">
        <div>
            <el-form :inline="true" ref="add_data">
                <el-form-item class="btnRight">
                    <el-button type="primary" size="small" icon="view" 
                    v-if="user.identity == 'superadmin'"
                    @click="handleAdd()" >添加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table_container">
            <el-table
                v-if="tableData.length > 0"
                :data="tableData"
                max-height="450"
                border
                style="width: 100%">
                <el-table-column
                    prop="lab_name"
                    align="center"
                    label="实验室名"
                    width="70">
                </el-table-column>
                <el-table-column
                    prop="info"
                    align="center"
                    label="实验室信息"
                    width="250">
                </el-table-column>
                <el-table-column
                    prop="picture"
                    align="center"
                    label="实验室内景"
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="capacity"
                    align="center"
                    label="容量"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="owner_1"
                    align="center"
                    label="主负责人"
                    width="170">
                </el-table-column>
                <el-table-column
                    prop="owner_2"
                    align="center"
                    label="副负责人"
                    width="170">
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    prop="operation"
                    width="180">
                <template slot-scope="scope">
                    <el-button
                    size="small"
                    type="warning"
                    icon="edit"
                    v-if="user.identity == 'superadmin'"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                    size="small"
                    type="danger"
                    icon="delete"
                    v-if="user.identity == 'superadmin'"
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
        <LabDialog :dialog="dialog" :formData="formData" @update="getLabList"></LabDialog>
    </div>
</template>

<script>
// 引入实验室Dialog
import LabDialog from '../components/LabDialog'

export default {
    name:"lablist",
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
                lab_name:"",
                owner_1:"",
                owner_2:"",
                picture:"",
                info:"",
                capacity:""
            },
            tableData:[],
            allTableData:[],
            // 添加部分dialog属性
            dialog:{
                show:false,
                title:'',
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
        this.getLabList();
    },
    methods:{
        getLabList(){
            this.$axios.get("/api/labs")
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
                title: "修改实验室数据",
                option: "edit"
            };
            this.formData = {
                lab_name:row.lab_name,
                info:row.info,
                picture:row.picture,
                capacity:row.capacity,
                owner_1:row.owner_1,
                owner_2:row.owner_2,
                id:row._id
            };
        },
        handleDelete(index,row){
            this.$axios.delete(`/api/labs/delete/${row._id}`)
            .then(res=>{
                this.$message('删除成功!');
                this.getLabList();
            });
        },handleAdd(){
            this.dialog = {
                show : true,
                title: "添加实验室",
                option: "add"
            };
            this.formData = {
                lab_name:"",
                info:"",
                picture:"",
                capacity:"",
                owner_1:"",
                owner_2:"",
                id:""
            };
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
        LabDialog
    }
}
</script>
<style scoped>
.fillContainer{
    width: 100%;
    height: 100%;
    padding: 16px;
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