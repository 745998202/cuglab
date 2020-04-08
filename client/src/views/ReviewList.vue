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
                    prop="lab_name"
                    align="center"
                    label="实验室"
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="book_date"
                    align="center"
                    label="预定时间"
                    width="350">
                </el-table-column>
                <el-table-column
                    prop="book_user"
                    align="center"
                    label="预定人"
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="part"
                    align="center"
                    label="预定时间段"
                    width="200">
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
                    v-if="user.identity == '实验室管理员'"
                    @click="handleAgree(scope.$index, scope.row)">同意</el-button>
                    <el-button
                    size="small"
                    type="danger"
                    icon="delete"
                    v-if="user.identity == '实验室管理员'"
                    @click="handleRefuse(scope.$index, scope.row)">拒绝</el-button>
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
        <UserDialog :dialog="dialog" :formData="formData" @update="getReviewList"></UserDialog>
    </div>
</template>

<script>
// 引入实验室Dialog
import UserDialog from '../components/UserDialog'

export default {
    name:"reviewlist",
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
                lab_id:"",
                lab_name:"",
                book_date:"",
                book_user:"",
                status:"",
                part:""
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
        this.getReviewList();
    },
    methods:{
        getReviewList(){
            this.$axios.get(`/api/reviews/not/${this.user.username}`)
            .then(res=>{
                this.allTableData = res.data;
                this.filterTableData = res.data;
                // 设置分页数据
                this.setPaginations();
            }).catch(err=>{console.log(err)});
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
        },
        handleAgree(index,row){
            const ReviewFields = {
                review_user : this.user.username,
                review_date : row.book_date,
                lab_id: row.lab_id,
                book_date:row.book_date,
                book_part:row.part,
                book_user:row.book_user
            }
            this.$axios.post(`/api/reviews/agree/${row._id}`,ReviewFields)
            .then(res=>{
                this.$message({
                    type:"success",
                    message:"审批成功！"
                })
                this.getReviewList();
            })
        },
        handleRefuse(index,row){
            console.log(row._id);
            const refuseFields = {
                book_date: row.book_date,
                part:row.part
            }
            this.$axios.post(`/api/reviews/refuse/${row._id}`,refuseFields)
            .then(res=>{
                this.$message({
                    type:"success",
                    message:"审批成功！"
                })
                this.getReviewList();
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