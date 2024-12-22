<template>
  <div>
    <div class="btn_group" tabindex="-1" aria-hidden="true">
                    <div class="search-box">
                                <el-input placeholder="请输入内容" 
                                v-model="input" 
                                prefix-icon="el-icon-search"
                                clearable> </el-input>
                    </div> 
                </div>
                <Task :taskAll="this.taskAll" isTeacher="1"/>
  </div>
</template>

<script>
import {reqCourseTasks,reqTeacherTaskStatus} from '@/api'
import Task from '@/components/Task'
export default {
  components: {
    Task
  },
    data () {
        return {
            taskAll:[],
            input:''
        }
    },
    mounted() {
        this.loadTasks()  
  },
  methods: {
  async loadTasks() {
    // 获取 courseId 参数的值
    const courseId = this.$route.params.courseId;
    
    if (!courseId) {
      console.error("课程ID不存在");
      return; // 如果 courseId 不存在，退出函数
    }
    
    try {
      // 调用接口获取任务状态
      const res = await reqTeacherTaskStatus(courseId);
      
      // 检查返回的状态码
      if (res.data.code === 200) {
        this.taskAll = res.data.data; // 将返回的任务数据保存到 taskAll
        console.log("任务列表数据：", res.data.data);
      } else {
        console.error("获取任务失败，错误代码：", res.data.code);
      }
    } catch (error) {
      console.error('请求失败', error);
    }
  }
}

}
</script>

<style>

.btn_group::after {
content: "";
display: block;
clear:both;
}
.search-box {
            cursor: pointer;
            transition: all 0.3s ease;
            padding: 15px 0 0 25px;
            float: left;
}
</style>