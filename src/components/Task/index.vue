<template>
  <div class="task">
    <div v-if="this.isTeacher != 1" class="filter">
      <span class="title">筛选</span>
      <span class="ipt-radio circl-choosed">
        <input
          name="group-radio"
          type="radio"
          @click="changeStatus(0)"
          checked="checked"
          tabindex="-1"
        /><i class="icon-radio"></i>
      </span>
      <div class="fs12 color181E33 lineheight20 inlineBlock">全部</div>

      <span class="ipt-radio circl-choosed">
        <input
          name="group-radio"
          type="radio"
          @click="changeStatus(1)"
          tabindex="-1"
        /><i class="icon-radio"></i>
      </span>
      <div class="fs12 color181E33 lineheight20 inlineBlock">已完成</div>

      <span class="ipt-radio circl-choosed">
        <input
          name="group-radio"
          type="radio"
          @click="changeStatus(2)"
          tabindex="-1"
        /><i class="icon-radio"></i>
      </span>
      <div class="fs12 color181E33 lineheight20 inlineBlock">未完成</div>
    </div>

    <div v-if="!Object.keys(taskAll).length" class="bottomList">
      <div class="not-data color181E33">暂无数据</div>
    </div>
    <div v-else class="bottomList" tabindex="0" aria-label="作业列表">
      <ul>
        <li
          v-for="value in taskAll"
          :key="value.taskId"
          @click="goTask(value)"
          tabindex="0"
          :aria-label="value.taskName"
          role="link"
          class="task-item"
          @mouseover="hoveredTask = value.taskId"
          @mouseleave="hoveredTask = null"
        >
          <div class="tag icon-zy-g"></div>
          <div class="right-content">
            <p class="overHidden2 fl">{{ value.taskName }}</p>
            <div class="clear"></div>
            <p class="status fl" v-if="this.isTeacher != 1">
              {{
                value.status == 0
                  ? "未完成"
                  : value.status == 1
                  ? "已完成"
                  : "待批阅"
              }}
            </p>
            <p class="status fl" v-else>本期作业</p>
            <div class="clear"></div>
          </div>
          <!-- 新增：教师端删除按钮 -->
          <div
            v-if="this.isTeacher && hoveredTask === value.taskId"
            class="delete-icon"
            @click.stop="deleteTaskItem(value.taskId)"
            :aria-label="'删除任务: ' + value.taskName"
          >
            &#x2715;
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { showAllStuCourseTasks, deleteTask, reqStudentTask } from "@/api";

export default {
  props: ["taskAll", "isTeacher"],
  data() {
    return {
      hoveredTask: null,
    };
  },
  mounted() {
    // 保持原有的mounted钩子
  },
  methods: {
    changeStatus(changeNum) {
      console.log(changeNum);
      // 保持原有的changeStatus方法
    },
    async goTask(value) {
      if (this.isTeacher) {
        console.log("点击作业");
        // const res = await showAllStuCourseTasks(value.taskId);
        // console.log("测试：", res.data);

        const courseId = this.taskAll[0].courseId;
        console.log("demo测试");
        console.log(this.taskAll[0].courseId); // 构建跳转的完整路径
        let url = "/teacherClass/" + courseId + "/marking/" + value.taskId; // 在新窗口中打开链接

        window.open(url, "_blank"); // this.$router.push(url);
      } else {
        if (value.status === 0) {
          let url = "/classTaskDetail/" + value.taskId;
          window.open(url, "_blank");
        } else if (value.status === 1) {
          console.log("跳转新界面", value.status);
          let url = "/gradedTaskResult/" + value.taskId;
          window.open(url, "_blank");
        } else {
          console.log("任务状态不需要操作", value.status);
        }
      }
    },
    // 新增：删除任务方法
    async deleteTaskItem(taskId) {
      try {
        await deleteTask(taskId);
        // 从列表中移除已删除的任务
        this.$emit(
          "update:taskAll",
          this.taskAll.filter((task) => task.taskId !== taskId)
        );
        console.log("任务删除成功");
        // 这里可以添加成功提示，例如使用 Element UI 的 Message 组件
        // this.$message.success('任务删除成功');
      } catch (error) {
        console.error("删除任务时出错:", error);
        // 这里可以添加错误提示
        // this.$message.error('删除任务失败，请重试');
      }
    },
  },
};
</script>

<style scoped>
.task .bottomList {
  position: relative;
  min-height: 600px;
}
.bottomList .not-data {
  width: 100%;
  font-size: 20px;
  position: absolute;
  text-align: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.filter {
  padding: 20px 30px;
}
.filter .title {
  display: inline-block;
  font-size: 12px;
  color: #a8a8b3;
}
.filter .circl-choosed {
  margin-left: 20px;
  margin-right: 6px;
}
.ipt-radio {
  display: inline-block;
  width: 16px;
  height: 16px;
  position: relative;
}
.lineheight20 {
  line-height: 20px;
}
.color181E33 {
  color: var(--text-color);
}
.inlineBlock {
  display: inline-block;
}
.fs12 {
  font-size: 12px;
}
ul,
ol,
li {
  list-style-type: none;
}
.bottomList ul li {
  position: relative;
  padding-left: 30px;
  cursor: pointer;
  transition: transform 0.3s;
  height: 70px;
}
.bottomList ul li:hover {
  background-color: var(--body-color);
}
.bottomList ul li .tag {
  position: absolute;
  border-radius: 8px;
  top: -5px;
  left: 10px;
}
.icon-zy-g {
  width: 84px;
  height: 84px;
  -webkit-transform: scale(0.5);
  -moz-transform: scale(0.5);
  -ms-transform: scale(0.5);
  -o-transform: scale(0.5);
  transform: scale(0.5);
  background: url(@/assets/homeWork.png);
}
.bottomList ul li .right-content {
  margin-left: 62px;
  padding: 14px 20% 14px 0;
  min-height: 40px;
  border-bottom: 1px solid #f2f2f2;
}
.bottomList ul li .right-content p {
  line-height: 20px;
  font-size: 14px;
  font-weight: 400;
  max-width: 92%;
}
.bottomList ul li .right-content p.status {
  font-size: 14px;
  font-weight: 400;
  color: #a8a8b3;
  line-height: 17px;
  margin-top: 4px;
}
.overHidden2 {
  overflow: hidden;
  color: var(--text-color);
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.fl {
  float: left;
}
.clear {
  clear: both;
}
.status::after {
  content: "";
  display: block;
  clear: both;
}

/* 新增：删除图标样式 */
.task-item {
  position: relative;
}
.delete-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 20px;
  color: #ff4d4f;
  transition: color 0.3s;
}
.delete-icon:hover {
  color: #ff7875;
}
</style>

