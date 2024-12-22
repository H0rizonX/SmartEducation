<template>
  <div class="score">
    <div class="score_judge">
      <div class="score_judge_mark">
        <div class="mark_title">
          {{ title }}
        </div>
        <div class="mark_work">
          <div class="mark_answer" v-show="choose">
            <div
              class="topic_detail"
              v-for="item in chooseArr"
              :key="item.topicId"
            >
              <div class="topic_question">
                <p class="questionType">
                  {{ item.questionType }}
                </p>
                <div class="question_score">
                  <p class="questionScore">学生得分:</p>
                  <p class="questionScores">{{ item.getScore }}</p>
                </div>
              </div>
              <div class="topic_nav">
                <span>题目:</span>
                <p class="topic_title">{{ item.questionText }}</p>
              </div>

              <div class="topic_answer">
                <p>学生答案:</p>
                <p>{{ item.answer }}</p>
              </div>

              <div class="topic_answer right_answer">
                <p>正确答案:</p>
                <p>{{ item.rightAnswer }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="mark_work">
          <div class="mark_answer" v-show="judgment">
            <div
              class="topic_detail"
              v-for="item in judgmentArr"
              :key="item.topicId"
            >
              <div class="topic_question">
                <p class="questionType">{{ item.questionType }}</p>
                <div class="question_score">
                  <p class="questionScore">学生得分:</p>
                  <p class="questionScores">{{ item.getScore }}</p>
                </div>
              </div>
              <div class="topic_nav">
                <span>题目:</span>
                <p class="topic_title">{{ item.questionText }}</p>
              </div>

              <div class="topic_answer">
                <p>学生答案:</p>
                <p>{{ item.answer }}</p>
              </div>

              <div class="topic_answer right_answer">
                <p>正确答案:</p>
                <p>{{ item.rightAnswer }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="mark_work">
          <div class="mark_answer" v-show="fill">
            <div
              class="topic_detail"
              v-for="item in fillArr"
              :key="item.topicId"
            >
              <div class="topic_question">
                <p class="questionType">{{ item.questionType }}</p>
                <div class="question_score">
                  <p class="questionScore">学生得分:</p>
                  <p class="questionScores">{{ item.getScore }}</p>
                </div>
              </div>
              <div class="topic_nav">
                <span>题目:</span>
                <p class="topic_title">{{ item.questionText }}</p>
              </div>

              <div class="topic_answer">
                <p>学生答案:</p>
                <p>{{ item.answer }}</p>
              </div>

              <div class="topic_answer right_answer">
                <p>正确答案:</p>
                <p>{{ item.rightAnswer }}</p>
              </div>

              <div class="topic_giveScore">
                <p>教师批阅</p>
                <el-input
                  v-model="item.getScore"
                  style="width: 240px"
                  :placeholder="`满分: ${item.fullscore}`"
                  type="num"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="submit_btn">
          <el-button type="primary" round @click="handleScore">
            提交分数
          </el-button>
        </div>
      </div>
      <!-- <div class="score_judge_remark">
        <h3>教师评语</h3>
        <el-input
          v-model="textarea"
          style="width: 100%"
          :rows="3"
          type="textarea"
          placeholder="请输入评语"
          show-word-limit
        />
      </div> -->
    </div>
    <!-- <div class="score_user">
      <div class="score_user_img">
        <img src="" />
      </div>
      <div class="score_user_info">
        <p v-for="item in user" :key="item.id">{{ item }}</p>
      </div>
    </div> -->
  </div>
</template>
  <script>
import { ref } from "vue";
import { reqWork, submitScores } from "@/api";
// import { ElMessage } from "element-plus";
export default {
  data() {
    const textarea = ref("");
    const choose = ref(false);
    const judgment = ref(false);
    const fill = ref(false);

    const topic = ref([]);

    const chooseArr = ref([]);
    const fillArr = ref([]);
    const judgmentArr = ref([]);
    const num = ref(0);
    const input = ref();
    return {
      user: {
        name: "谭罗嘉",
        id: "2022401857",
        Class: "软件六班",
      },
      textarea,
      choose,
      judgment,
      fill,
      title: "作业详情",
      topic,
      chooseArr,
      fillArr,
      judgmentArr,
      num,
      input,
    };
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    async getDetail() {
      const id = this.$route.params.stuId;
      const taskId = this.$route.params.taskId;
      console.log("预加载学生信息");
      // console.log(id);
      // console.log(taskId);
      try {
        const res = await reqWork(taskId, id);
        // console.log(res);
        this.topic = res.data.data;
        // console.log(this.topic);

        for (let t of this.topic) {
          if (t.questionType === "选择题") {
            this.chooseArr.push(t);
            this.choose = true;
          } else if (t.questionType === "判断题") {
            this.judgmentArr.push(t);
            this.judgment = true;
          } else if (t.questionType === "简答题") {
            this.fillArr.push(t);
            this.fill = true;
          } else {
            console.log("题目出错");
            console.log(t);
          }
        }

        console.log(this.chooseArr);
        console.log(this.judgmentArr);
        console.log(this.fillArr);
      } catch (error) {
        console.log(error);
      }
    },

    handleScore() {
      // console.log(obj);

      for (let t of this.fillArr) {
        if (t.getScore > t.fullscore) {
          alert("请不要超过设置的最大值");
          t.getScore = "";
        }
      }

      const stuId = this.$route.params.stuId;
      const taskId = this.$route.params.taskId;
      const responseWork = [
        ...this.chooseArr,
        ...this.judgmentArr,
        ...this.fillArr,
      ];

      console.log("合并之后的数据");
      console.log(responseWork);

      this.submitWork(taskId, stuId, responseWork);
    },

    async submitWork(taskId, id, data) {
      try {
        const res = await submitScores(taskId, id, data);
        console.log("分数上传");
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
  
  <style>
.score {
  min-height: 96vh;
  max-height: 4000px;

  width: 1200px;
  /* background-color: #fff; */
  margin: 2vh auto;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  padding: 10px;
  box-sizing: border-box;
}

.score_judge {
  height: 100%;
  width: 1200px;
  /* background-color: #fff; */
  margin-right: 20px;
  border-radius: 8px;
}
.score_user {
  height: 100%;
  width: 300px;
  background-color: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  padding-top: 60px;
}
.score_user_img {
  height: 64px;
  width: 64px;
  background-color: black;
  border-radius: 50%;
}
.score_user_img img {
  height: 100%;
  width: 100%;
  border-radius: 50%;
}
.score_user_info {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  justify-content: center;
  margin-left: 20px;
}
.score_judge_mark {
  height: 100%;
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
}

/* .score_judge_remark {
  height: 13%;
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
  margin-top: 2%;
  padding: 0 2%;
} */

.mark_title {
  font-size: 30px;
  font-weight: 800;
  margin-left: 40px;
}

.mark_work {
  /* min-height: 100px; */
  width: 100%;
}

.mark_answer {
  width: 80%;
  height: auto;
  margin: 20px auto;
}

.topic_title {
  font-size: 20px;
  font-weight: 800;
  margin-left: 10px;
  width: auto;
  display: inline;
}

.topic_nav {
  width: auto;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.topic_question {
  width: auto;
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.question_score {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.questionType {
  font-weight: bold;
  font-size: 20px;
}

.questionScore {
  color: #00cc7e;
}

.questionScores {
  color: #f53f3f;
  font-size: 26px;
}

.topic_answer {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 20px 0;
}

.topic_answer p {
  margin: 0 5px;
}

.right_answer {
  color: #00cc7e;
}

.submit_btn {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.submit_btn button {
  width: 200px;
  height: 40px;
  font-size: 16px;
}
</style>
  