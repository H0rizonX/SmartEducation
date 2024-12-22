<template>
  <div class="marking">
    <div class="marking_back">
      <p>返回</p>
    </div>
    <div class="marking_line"></div>
    <div class="marking_nav">
      <div class="marking_nav_title">
        <h3>{{ name }}</h3>
      </div>
      <div class="marking_nav_func">
        <!-- <el-select v-model="value" placeholder="默认班级" style="width: 240px">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select> -->
        <div class="marking_nav_func_R">
          <div class="marking_nav_func_export">
            <!-- <button>导出成绩</button> -->
          </div>

          <div class="marking_nav_func_Search">
            <el-input
              v-model="input2"
              style="width: 240px"
              placeholder="请输入学号"
              prefix-icon="el-icon-search"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- 分割线 -->
    <div class="marking_line"></div>

    <div class="marking_func">
      <!-- <form method="GET">
        <input type="radio" name="status" value="1" checked="true" /> 已交
        <input type="radio" name="status" value="2" /> 未交
      </form> -->
      <el-table :data="tableData" border stripe style="width: 100%">
        <el-table-column prop="stuName" label="姓名" />
        <el-table-column prop="stuId" label="学号" />
        <el-table-column prop="status" label="状态" />
        <el-table-column prop="score" label="成绩" />
        <el-table-column prop="operate" label="操作">
          <template #default="{ row }">
            <el-button
              link
              type="primary"
              size="small"
              @click="handleClick(row)"
            >
              批阅
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import { reqStudentTask } from "@/api";
export default {
  data() {
    const value = ref("");
    const input2 = ref("");
    const tableData = ref([]);
    return {
      name: "作业批改",
      options: [
        {
          value: 1,
          label: "默认班级",
        },
        {
          value: 2,
          label: "软件一班",
        },
        {
          value: 3,
          label: "软件二班",
        },
        {
          value: 4,
          label: "软件三班",
        },
        {
          value: 5,
          label: "软件四班",
        },
        {
          value: 6,
          label: "软件五班",
        },
        {
          value: 7,
          label: "软件六班",
        },
      ],
      value,
      input2,
      // tableData: [
      //   {
      //     id: "2022401857",
      //     label: "用户甲",
      //     status: "已批改",
      //     scores: "66",
      //   },
      //   {
      //     id: "2022401857",
      //     label: "用户乙",
      //     status: "已批改",
      //     scores: "66",
      //   },
      // ],
      tableData,
    };
  },
  mounted() {
    console.log("进入评分页面");
    this.getDetail();
  },
  methods: {
    /**
     * 跳转到个人作业页面
     */
    handleClick(row) {
      console.log("点击了");
      console.log(row);
      this.$router.push(
        "/course/word/" + row.stuId + "/" + this.$route.params.taskId
      );
    },

    async getDetail() {
      const id = this.$route.params.taskId;
      try {
        console.log("请求个人数据");
        const res = await reqStudentTask(id);
        console.log(res.data);
        this.tableData = res.data.data;

        for (let t of this.tableData) {
          if (t.score === -1) {
            t.score = "未批阅";
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
<style>
.marking {
  /* width: 100vw; */
  height: 96vh;
  width: 1200px;
  margin: 2vh auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  /* background-color: aqua; */
}
.marking_line {
  height: 0.4px;
  width: 98%;
  margin: 0 auto;
  background-color: #999;
  display: flex;
  flex-direction: column;
}
.marking_back {
  width: 100%;
  height: 30px;
  /* background-color: rebeccapurple; */
  margin: 0 auto;
  /* background-color: aqua; */
}
.marking_back p {
  font-size: 16px;
  color: #666;
  /* background-color: red; */
  line-height: 30px;
  margin-left: 20px;
}
.marking_nav {
  height: 160px;
  width: 98%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  position: relative;
}
.marking_nav_title {
  height: 30px;
  margin-top: 20px;
  margin-left: 30px;
}
.marking_nav_func {
  height: 80px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.marking_nav_func_R {
  width: 30%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

.marking_nav_func_export button {
  width: 100px;
  height: 40px;
  background-color: transparent;
  /* outline: none; */
  border: none;
  font-size: 16px;
  color: #999;
}
.marking_func {
  width: 98%;
  height: auto;
  margin: 0 auto;
  margin-top: 20px;
}
</style>