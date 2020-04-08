<template>
    <div class="fillContainer">
        <el-row v-for="lab in LabsData" :key="lab._id">
            <el-col :span="24">
                <el-card :body-style="{ padding: '10px' }"  shadow="always">
                    <el-col :span="8">
                        <el-image
                            style="width: 400px; height: 300px; border-radius:20px; "
                            src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1808242258,1926634704&fm=26&gp=0.jpg"
                            fit="fill">
                            </el-image>
                    </el-col>
                    <el-col :span="16">
                        <div style="padding: 14px;">
                            <el-row class="labsItem">
                                <el-col :span="1"><i class="el-icon-s-home"></i></el-col>
                                <el-col :span="10"><span>实验室名：{{ lab.lab_name}}</span></el-col>
                            </el-row>
                            <el-row class="labsItem">
                                <el-col :span="1"><i class="el-icon-info"></i></el-col>
                                <el-col :span="10"><span>实验室信息：{{ lab.info}}</span></el-col>
                            </el-row>
                            <el-row class="labsItem">
                                <el-col :span="1"><i class="el-icon-s-cooperation"></i></el-col>
                                <el-col :span="10"><span>容量：{{ lab.capacity}}</span></el-col>
                            </el-row>
                            <el-row class="labsItem">
                                <el-col :span="1"><i class="el-icon-user-solid"></i></el-col>
                                <el-col :span="10"><span>主负责人：{{ lab.owner_1}}</span></el-col>
                            </el-row>
                            <el-row class="labsItem">
                                <el-col :span="1"><i class="el-icon-user"></i></el-col>
                                <el-col :span="10"><span>副负责人：{{ lab.owner_2}}</span></el-col>
                            </el-row>
                            <div class="bottom clearfix">
                                <el-button type="primary" @click="bookLab(lab)" class="button">预定</el-button>
                            </div>
                        </div>
                    </el-col>
                
                </el-card>
            </el-col>
        </el-row>
        <el-drawer
            title="预定实验室"
            :visible.sync="drawer"
            :direction="direction"
            :before-close="handleClose">
            
            <el-calendar>
        <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
            <template
                slot="dateCell"
                slot-scope="{date, data}">
                <div>
                    <p>{{ data.day.split('-').slice(1).join('-') }} </p>
                    <div v-if="bookedDates.includes(data.day)" style="color:#F56C6C">
                        <el-row >
                            <el-col v-if="bookedParts[bookedDates.indexOf(data.day)].includes('1-2节')" :span="12">1-2</el-col>
                            <el-col v-if="bookedParts[bookedDates.indexOf(data.day)].includes('3-4节')" :span="12">3-4</el-col>
                        </el-row>
                        <el-row >
                            <el-col v-if="bookedParts[bookedDates.indexOf(data.day)].includes('5-6节')" :span="12">5-6</el-col>
                            <el-col v-if="bookedParts[bookedDates.indexOf(data.day)].includes('7-8节')" :span="12">7-8</el-col>
                        </el-row>
                        <el-row >
                            <el-col v-if="bookedParts[bookedDates.indexOf(data.day)].includes('9-10节')" :span="16">9-10</el-col>
                            
                        </el-row>
                       
                    </div>
                </div>
            </template>
            </el-calendar>
            <div style="padding:10px">上述表格中<a style="color:#F56C6C">红色字体</a>表示已被预订</div>
            <el-form :model="bookInfo" :rules="rules" ref="bookInfo" label-width="100px" class="demo-ruleForm">
                <el-form-item label="预订日期" required>
                <el-form-item prop="book_date">
                    <el-date-picker
                        v-model="bookInfo.book_date"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                </el-form-item>
                <el-form-item label="预订时间" prop="part" required>
                    <el-checkbox-group v-model="bookInfo.part">
                    <el-checkbox label="1-2节" name="1"></el-checkbox>
                    <el-checkbox label="3-4节" name="2"></el-checkbox>
                    <el-checkbox label="5-6节" name="3"></el-checkbox>
                    <el-checkbox label="7-8节" name="4"></el-checkbox>
                    <el-checkbox label="9-10节" name="5"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('bookInfo')">立即预定</el-button>
                    <el-button @click="resetForm('bookInfo')">重置</el-button>
                </el-form-item>
                </el-form>
        </el-drawer>
    </div>
    
</template>

<script>
import Dialog from '../components/Dialog'
Date.prototype.format = function(formatStr){   
        var str = formatStr;   
        var Week = ['日','一','二','三','四','五','六'];   
        str=str.replace(/yyyy|YYYY/,this.getFullYear());  
        str=str.replace(/MM/,(this.getMonth()+1)>9?(this.getMonth()+1).toString():'0' + (this.getMonth()+1));   
        str=str.replace(/dd|DD/,this.getDate()>9?this.getDate().toString():'0' + this.getDate());   
       return str;   
        }
export default {
    name:"booklablist",
    data(){
        return {
            LabsData:[],
            value2:{
                "time" : "2020-04-11"
            },
            dialog:{
                show:false,
                title:'',
                option:'edit'
            },
            drawer: false,
            direction: 'rtl',
            bookInfo:{
                part:[],
                book_date:""
            },
            rules:{
                book_date:[
                    {
                        required:true,message:"预定日期不能为空",trigger:"blur"
                    }
                ]
            },
            bookedDates:[],
            bookedParts:[]
        };
    },
    computed:{
        user(){
            return this.$store.getters.user;
        }
    },
    created(){
        this.getBookList();
    },
    methods:{
        
        getBookList(){
            this.$axios.get("/api/labs")
            .then(res=>{
                this.LabsData = res.data;
            }).catch(err=>{console.log(err)});
        },
        bookLab(lab){
            this.bookInfo = {
                    picture:lab.picture,
                    lab_id:lab._id,
                    lab_name:lab.lab_name,
                    book_date:"",
                    part:[],
                    book_user:this.user.username,
                    status:"0"
            }
            this.$axios.get(`/api/reviews/${lab._id}`)
            .then(status=>{
                this.drawer = true;
                for(let i = 0; i<status.data.length;i++){
                    this.bookedDates.push(new Date(status.data[i].book_date).format("yyyy-MM-dd").toString());
                    this.bookedParts.push(status.data[i].part);
                    var newdate = (new Date(status.data[i].book_date)).getTime();
                }
                
                
            }).catch(err=>{
                this.$message({
                    message:"获取预定信息失败！",
                    type:"error"
                })
            })
            
        },
        handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      }, submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios.post("api/books/add",this.bookInfo)
            .then(res=>{
                this.$message({
                    message:"预定成功",
                    type:"success"
                })
            }).catch(err=>{
                this.$message({
                    message:"预定失败",
                    type:"false"
                })
            })
            this.$emit('update');       
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    components:{
        Dialog
    }
}
</script>
<style scoped>
.labImage{
    padding:10px;
}
.fillContainer{
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing:border-box;
}
  .time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 20px;
    line-height: 50px;
  }

  .button {
    float: right;
  }

  .image {
    width: 100%;
    display: inline-block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }

  .labsItem{
      height: 47px;
  }
</style>