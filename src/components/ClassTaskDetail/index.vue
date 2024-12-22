<template>
  <div class="box">
    <div class="subNav">
      任务
    </div>
    <div class="subPageMain clearfix" style="padding: 0;">
      <div class="editContainer fulscren clearfix">
        <div class="edit_main clearfix">
          <div class="mark_item" v-if="this.choiceQuestions.length != 0">
            <h2 class="type_tit">选择题（共{{this.choiceQuestions.length}}题）</h2>
            <div v-for="(item, index) in this.choiceQuestions" :key="item.id" class="marBom60 questionLi singleQuesId" style="word-wrap: break-word;" aria-label="题目详情">
              <h3 class="mark_name colorDeep">
                {{index + 1}}. <span class="colorShallow">(选择题, {{item.fullscore}}分)</span>
                {{item.questionText}} （&nbsp; &nbsp; &nbsp; ）。
              </h3>
              <ul class="mark_letter colorDeep">
                <li>
                  <input v-model="selectAnswer[index].answer" class="radio" type="radio" :name="index" :value="{topicId: item.id, answer: item.options1}">A. {{item.options1}}</li>
                <li>
                  <input v-model="selectAnswer[index].answer" class="radio" type="radio" :name="index" :value="{topicId: item.id, answer: item.options2}">B. {{item.options2}}</li>
                <li>
                  <input v-model="selectAnswer[index].answer" class="radio" type="radio" :name="index" :value="{topicId: item.id, answer: item.options3}">C. {{item.options3}}</li>
                <li>
                  <input v-model="selectAnswer[index].answer" class="radio" type="radio" :name="index" :value="{topicId: item.id, answer: item.options4}">D. {{item.options4}}</li>
              </ul>
            </div>
          </div>

          <div class="mark_item">
            <h2 class="type_tit">判断题（共{{this.judgeQuestions.length}}题）</h2>
            <div v-for="(item, index) in this.judgeQuestions" :key="item.id" class="marBom60 questionLi singleQuesId" style="word-wrap: break-word;" id="question213162988" data="213162988" aria-label="题目详情">
              <h3 class="mark_name colorDeep">
                {{index + 1}}. <span class="colorShallow">(判断题, {{item.fullscore}}分)</span>
                {{item.questionText}}（ &nbsp; &nbsp; &nbsp; ）。
              </h3>
              <ul class="mark_letter colorDeep">
                <li>
                  <input v-model="judgeAnswer[index].answer" class="radio" type="radio" :name="'选择' + index" :value="{topicId: item.id, answer: '正确'}">
                  正确
                </li>
                <li>
                  <input v-model="judgeAnswer[index].answer" class="radio" type="radio" :name="'选择' + index" :value="{topicId: item.id, answer: '错误'}">
                  错误
                </li>
              </ul>
            </div>
          </div>

          <div class="mark_item">
            <h2 class="type_tit">应用题（共{{this.useQuestions.length}}题）</h2>
            <div v-for="(item, index) in this.useQuestions" :key="item.id" class="marBom60 questionLi singleQuesId" style="word-wrap: break-word;" id="question213162988" data="213162988" aria-label="题目详情">
              <h3 class="mark_name colorDeep">
                {{index + 1}}. <span class="colorShallow">(应用题, {{item.fullscore}}分)</span>
                {{item.questionText}}
              </h3>
              <ul class="mark_letter colorDeep">
                <textarea v-model="useAnswer[index].answer" class="chandler-content_input-area" placeholder="请作答..."></textarea>
              </ul>
            </div>
          </div>

          <div class="btn_create clearfix">
            <button @click="submitBtn" class="sigin-btn">提交</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reqStudentGetTopic, reqSubmitTask } from '@/api'
import { Message } from 'element3'

export default {
  data() {
    return {
      choiceQuestions: [],
      judgeQuestions: [],
      useQuestions: [],
      selectAnswer: [],
      judgeAnswer: [],
      useAnswer: [],
      data: [],
      taskId: this.$route.params.taskId,
      studentId: 123 // 假设这是从用户信息中获取的学生ID
    }
  },
  mounted() {
    this.loadTopic()
  },
  methods: {
    async loadTopic() {
      try {
        const res = await reqStudentGetTopic({ taskId: this.taskId })
        if (res.data.code == 200) {
          res.data.data.forEach(item => {
            // 检查并打印每个题目对象的 fullscore 和 correctAnswer
            switch (item.questionType) {
              case '选择题':
                this.choiceQuestions.push(item)
                this.selectAnswer.push({ 
                  topicId: item.id, 
                  answer: '', 
                  correctAnswer: item.correctAnswer || '', 
                  fullscore: item.fullscore || 0 // 确保 fullscore 存在并提供默认值
                })
                break
              case '判断题':
                this.judgeQuestions.push(item)
                this.judgeAnswer.push({ 
                  topicId: item.id, 
                  answer: '', 
                  correctAnswer: item.correctAnswer || '', 
                  fullscore: item.fullscore || 0 // 确保 fullscore 存在并提供默认值
                })
                break
              case '应用题':
                this.useQuestions.push(item)
                this.useAnswer.push({ 
                  topicId: item.id, 
                  answer: '', 
                  correctAnswer: item.correctAnswer || '', 
                  fullscore: item.fullscore || 0 // 确保 fullscore 存在并提供默认值
                })
                break
              default:
                break
            }
          })
        }
      } catch (error) {
        console.log('TaskDerail: 出错', error)
      }
    },
    async submitBtn() {
      // 提交选择题的答案
      this.selectAnswer.forEach(item => {
        console.log("正确答案：", item.correctAnswer)
        console.log("选择题分数：", item.fullscore)
        const answer=item.answer.answer
        const correctAnswer = item.correctAnswer || ""
        const result = answer === correctAnswer ? "1" : "0"
        const score = result === "1" ? item.fullscore : 0
        this.data.push({
          "topicId": item.answer.topicId,
          "taskId": this.taskId,
          "studentId": this.studentId,
          "answer": answer,
          "rightAnswer": correctAnswer,
          "result": result,
          "getScore": score,
          "questionType":"选择题"
        })
      })

      // 提交判断题的答案
      this.judgeAnswer.forEach(item => {
        console.log("判断题分数：", item.fullscore)
        console.log("正确答案：", item.correctAnswer)
        console.log("判断题答案",item.answer.answer)
        const topicId=item.answer.topicId
        const answer=item.answer.answer
        const correctAnswer = item.correctAnswer || ""
        const result = answer === correctAnswer ? "1" : "0"
        const score = result === "1" ? item.fullscore : 0
        this.data.push({
          "topicId": topicId,
          "taskId": this.taskId,
          "studentId": this.studentId,
          "answer": answer,
          "rightAnswer": correctAnswer,
          "result": result,
          "getScore": score,
          "questionType":"判断题"
        })
      })

      // 处理应用题（简答题）
      this.useAnswer.forEach((item, index) => {
        const correctAnswer = item.correctAnswer || ""
        console.log("应用题分数：", item.fullscore)
        console.log("正确答案：", item.correctAnswer)
        this.data.push({
          "topicId": this.useQuestions[index].id,
          "taskId": this.taskId,
          "studentId": this.studentId,
          "answer": item.answer,
          "rightAnswer": correctAnswer,  // 简答题没有正确答案
          "getScore": 0 , // 这里的分数可以根据后端批阅后给定
          "questionType":"简答题"
        })
      })

      // 提交数据到后端
      try {
        console.log("任务数据：",this.data)
       
  const res = await reqSubmitTask(this.data);
       
    
  
  Message({
    message: '任务提交成功',
    type: 'success'
  });
  setTimeout(() => {
    window.close();
  }, 800);
} catch (error) {
  console.log('请求失败:', error);
  if (error.response) {
    console.error('后端错误响应:', error.response.data);
    console.error('状态码:', error.response.status);
  }
}

    }
  }
}
</script>






<style scoped>
.chandler-content_input-area {
      display: inline-block;
      padding: 5px 14px;
      border: 1px solid #D5D7D9;
      border-radius: 4px;
      width: 100%;
      min-height: 90px;
      color: #413659;
      font-size: 14px;
      line-height: 22px;
      margin-top: 10px;
      background: transparent;
  }
/* 定制单选按钮样式 */
.radio {
  display: inline-block;
  border-radius: 50%; 
  border: 2px solid #ccc; 
  background-color: #fff; 
  cursor: pointer;
  margin: 0px 8px 0;
}
/* 选中状态下的单选按钮样式 */
.radio:checked {
  background-color: #007bff; 
  border-color: #007bff; 
}
.mark_letter li {
    margin-top: 16px;
}
.mark_letter {
    margin: 0 20px;
}
.colorDeep {
    color: #181E33;
}
ul, ol, li {
    list-style-type: none;
}
.colorShallow {
    color: #A8A8B3;
}
.mark_name {
    margin: 0 20px;
    font-size: 14px;
    overflow-wrap: break-word;
    font-weight: 400;
}
.marBom60 {
    margin-bottom: 30px;
}
.type_tit {
    padding-left: 20px;
    /* padding: 30px 0 30px 20px; */
    margin-bottom: 30px;
    font-size: 16px;
    color: #181E33;
    font-weight: bold;
}
.mark_item {
    margin-bottom: 10px;
    overflow: hidden;
}
.mark_item {
    margin: 10px 20px 20px;
    font-size: 14px;
}

.title{
  text-align: left;
  height: 53px;
  line-height: 47px;
  border-bottom: 3px solid #f0f0f2;
  width: 100%;
	font-size: 20px;
	font-weight: 600;
	letter-spacing: 3px;
	color: rgba(40,40,40,0.8);
	margin: 10px 0px;
}
.h4title {
  letter-spacing: 3px;
    width: 100%;
    text-align: left;
	margin:0 0 10px 0px;
}
.h5title {
    letter-spacing: 3px;
    width: 100%;
    text-align: left;
	margin:0 0 10px 0px;
}
/* 表单 */
.inputs {
  float: left;
  display: block;
  width: 900px;
  height: 50px;
  border-radius: 10px;
  outline: none;
  border: 1px solid #c6c5ce;
  font-size: 20px;
  margin-top: 10px;
  padding: 0 15px;
  font-family: "Leelawadee", Courier, monospace;
  box-sizing: border-box;
}
 .clearfix::after {
      content: "";
      display: table;
      clear: both;
  }
.sigin-btn {
  width: 100px;
  height: 40px;
  background-color: #2235a0;
  border-radius: 10px;
  color: #fff;
  margin: 15px auto 30px;
  font-family: "Leelawadee", Courier, monospace;
  font-size: 20px;
  cursor: pointer;
  border: 0;
  display: inherit;
}


.box {
    width: 100%;
    height: 100%;
    position: relative;
}
.subNav {
    width: 100%;
    height: 40px;
    background: #3A4357;
    box-shadow: 0 2px 17px 0 rgba(211,211,211,0.50);
    text-align: center;
    line-height: 40px;
    font-size: 16px;
    color: #A8A8B3;
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
    background: #FFFFFF;
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
    /* text-align: center; */
    position: relative;
    min-height: 800px;
    width: 100%;
    margin: 0;
    padding: 20px 10px 0 ;
    background: #FFFFFF;
    border-radius: 8px;
}

  /* 设置滚动条的样式 */
  .editContainer::-webkit-scrollbar {
     width:8px;
  }
  /* 滚动槽 */
  .editContainer::-webkit-scrollbar-track {
     -webkit-box-shadow:rgba(254,254,254,1);
     border-radius:10px;
  }
  /* 滚动条滑块 */
  .editContainer::-webkit-scrollbar-thumb {
     border-radius:3px;
     background-color: rgba(40,40,40,0.6);
  }
</style>