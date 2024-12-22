<template>
  <div class="box">
    <div class="subNav">任务结果</div>
    <div class="subPageMain clearfix" style="padding: 0">
      <div class="editContainer fulscren clearfix">
        <div class="edit_main clearfix">
          <div v-if="loading" class="loading">正在加载数据...</div>
          <div v-else-if="error" class="error">{{ error }}</div>
          <div v-else>
            <h2 class="total-score">总分: {{ totalScore }} / {{ maxScore }}</h2>

            <div class="mark_item" v-if="gradedChoiceQuestions.length > 0">
              <h2 class="type_tit">
                选择题（共{{ gradedChoiceQuestions.length }}题）
              </h2>
              <div
                v-for="(item, index) in gradedChoiceQuestions"
                :key="item.id"
                class="marBom60 questionLi singleQuesId"
                style="word-wrap: break-word"
                aria-label="题目详情"
              >
                <h3 class="mark_name colorDeep">
                  {{ index + 1 }}.
                  <span class="colorShallow"
                    >(选择题, {{ item.fullscore }}分)</span
                  >
                  {{ item.questionText }} （&nbsp; &nbsp; &nbsp; ）。·
                </h3>
                <ul class="mark_letter colorDeep">
                  <li
                    :class="{
                      'correct-answer': item.rightAnswer === item.options1,
                      'wrong-answer':
                        item.answer === item.options1 &&
                        item.answer !== item.rightAnswer,
                    }"
                  >
                    A. {{ item.options1 }}
                  </li>
                  <li
                    :class="{
                      'correct-answer': item.rightAnswer === item.options2,
                      'wrong-answer':
                        item.answer === item.options2 &&
                        item.answer !== item.rightAnswer,
                    }"
                  >
                    B. {{ item.options2 }}
                  </li>
                  <li
                    :class="{
                      'correct-answer': item.rightAnswer === item.options3,
                      'wrong-answer':
                        item.answer === item.options3 &&
                        item.answer !== item.rightAnswer,
                    }"
                  >
                    C. {{ item.options3 }}
                  </li>
                  <li
                    :class="{
                      'correct-answer': item.rightAnswer === item.options4,
                      'wrong-answer':
                        item.answer === item.options4 &&
                        item.answer !== item.rightAnswer,
                    }"
                  >
                    D. {{ item.options4 }}
                  </li>
                </ul>
                <div class="result-info">
                  <p>你的答案: {{ item.answer }}</p>
                  <p>正确答案: {{ item.rightAnswer }}</p>
                  <p class="score">
                    得分: {{ item.getScore }} / {{ item.fullscore }}
                  </p>
                </div>
              </div>
            </div>

            <div class="mark_item" v-if="gradedJudgeQuestions.length > 0">
              <h2 class="type_tit">
                判断题（共{{ gradedJudgeQuestions.length }}题）
              </h2>
              <div
                v-for="(item, index) in gradedJudgeQuestions"
                :key="item.id"
                class="marBom60 questionLi singleQuesId"
                style="word-wrap: break-word"
                aria-label="题目详情"
              >
                <h3 class="mark_name colorDeep">
                  {{ index + 1 }}.
                  <span class="colorShallow"
                    >(判断题, {{ item.fullscore }}分)</span
                  >
                  {{ item.questionText }}（ &nbsp; &nbsp; &nbsp; ）。
                </h3>
                <ul class="mark_letter colorDeep">
                  <li
                    :class="{
                      'correct-answer': item.rightAnswer === '正确',
                      'wrong-answer':
                        item.answer === '正确' &&
                        item.answer !== item.rightAnswer,
                    }"
                  >
                    正确
                  </li>
                  <li
                    :class="{
                      'correct-answer': item.rightAnswer === '错误',
                      'wrong-answer':
                        item.answer === '错误' &&
                        item.answer !== item.rightAnswer,
                    }"
                  >
                    错误
                  </li>
                </ul>
                <div class="result-info">
                  <p>你的答案: {{ item.answer }}</p>
                  <p>正确答案: {{ item.rightAnswer }}</p>
                  <p class="score">
                    得分: {{ item.getScore }} / {{ item.fullscore }}
                  </p>
                </div>
              </div>
            </div>

            <div class="mark_item" v-if="gradedUseQuestions.length > 0">
              <h2 class="type_tit">
                应用题（共{{ gradedUseQuestions.length }}题）
              </h2>
              <div
                v-for="(item, index) in gradedUseQuestions"
                :key="item.id"
                class="marBom60 questionLi singleQuesId"
                style="word-wrap: break-word"
                aria-label="题目详情"
              >
                <h3 class="mark_name colorDeep">
                  {{ index + 1 }}.
                  <span class="colorShallow"
                    >(应用题, {{ item.fullscore }}分)</span
                  >
                  {{ item.questionText }}
                </h3>
                <div class="result-info">
                  <h4>你的答案:</h4>
                  <p class="answer-text">{{ item.answer }}</p>
                  <h4>参考答案:</h4>
                  <p class="answer-text">{{ item.rightAnswer }}</p>
                  <p class="score">
                    得分: {{ item.score }} / {{ item.fullscore }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { reqStudentGetTopic, getTaskTopicDetail } from "@/api";

const route = useRoute();
const taskId = route.params.taskId;

const loading = ref(true);
const error = ref(null);
const gradedChoiceQuestions = ref([]);
const gradedJudgeQuestions = ref([]);
const gradedUseQuestions = ref([]);

const totalScore = computed(() => {
  return [
    ...gradedChoiceQuestions.value,
    ...gradedJudgeQuestions.value,
    ...gradedUseQuestions.value,
  ].reduce((sum, question) => sum + parseFloat(question.getScore || 0), 0);
});

const maxScore = computed(() => {
  return [
    ...gradedChoiceQuestions.value,
    ...gradedJudgeQuestions.value,
    ...gradedUseQuestions.value,
  ].reduce((sum, question) => sum + question.fullscore, 0);
});

onMounted(async () => {
  try {
    const res = await getTaskTopicDetail(taskId);
    if (res.data.code === 200) {
      console.log(res.data);
      const data = res.data.data;
      data.forEach((item) => {
        switch (item.questionType) {
          case "选择题":
            gradedChoiceQuestions.value.push(item);
            break;
          case "判断题":
            gradedJudgeQuestions.value.push(item);
            break;
          case "简答题":
            gradedUseQuestions.value.push(item);
            break;
          default:
            console.warn(`未知题型: ${item.questionType}`);
        }
      });
    } else {
      throw new Error("获取数据失败");
    }
  } catch (err) {
    error.value = "加载数据时出错: " + err.message;
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.box {
  width: 100%;
  height: 100%;
  position: relative;
}

.subNav {
  width: 100%;
  height: 40px;
  background: #3a4357;
  box-shadow: 0 2px 17px 0 rgba(211, 211, 211, 0.5);
  text-align: center;
  line-height: 40px;
  font-size: 16px;
  color: #a8a8b3;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 2;
}

.subPageMain {
  position: relative;
  top: 40px;
  width: 1080px;
  margin: 0 auto;
  margin-top: 30px;
  background: #ffffff;
  box-shadow: 0 2px 17px 0 rgba(239, 239, 239, 0.5);
  border-radius: 10px;
  margin-bottom: 70px;
}

.editContainer.fulscren {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  box-shadow: none;
}

.editContainer.fulscren .edit_main {
  position: relative;
  min-height: 800px;
  width: 100%;
  margin: 0;
  padding: 20px 10px 0;
  background: #ffffff;
  border-radius: 8px;
}

.mark_item {
  margin: 10px 20px 20px;
  font-size: 14px;
}

.type_tit {
  padding-left: 20px;
  margin-bottom: 30px;
  font-size: 16px;
  color: #181e33;
  font-weight: bold;
}

.marBom60 {
  margin-bottom: 30px;
}

.mark_name {
  margin: 0 20px;
  font-size: 14px;
  overflow-wrap: break-word;
  font-weight: 400;
}

.colorDeep {
  color: #181e33;
}

.colorShallow {
  color: #a8a8b3;
}

.mark_letter {
  margin: 0 20px;
}

.mark_letter li {
  margin-top: 16px;
}

.total-score {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin: 20px 0;
  color: #2235a0;
}

.result-info {
  margin: 10px 20px;
  padding: 10px;
  background-color: #f8f8f8;
  border-radius: 5px;
}

.result-info p {
  margin: 5px 0;
}

.score {
  font-weight: bold;
  color: #2235a0;
}

.correct-answer {
  color: #4caf50;
  font-weight: bold;
}

.wrong-answer {
  color: #f44336;
  font-weight: bold;
}

.answer-text {
  white-space: pre-wrap;
  word-wrap: break-word;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.loading,
.error {
  text-align: center;
  font-size: 18px;
  margin-top: 20px;
}

.error {
  color: #f44336;
}

/* 响应式设计 */
@media (max-width: 1080px) {
  .subPageMain {
    width: 100%;
    margin-top: 10px;
  }

  .edit_main {
    padding: 10px;
  }

  .mark_name {
    font-size: 14px;
  }
}
</style>