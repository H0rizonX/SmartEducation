import requests from "./ajax";

export const reqLogin = (params) =>
  requests({ url: "/login", method: "post", params });

export const reqSignup = (params) =>
  requests({ url: "/register", method: "post", params });

export const reqHomePage = () =>
  requests({ url: "/student/HomePage", method: "get" });

export const reqAddCourse = (params) =>
  requests({ url: "/student/addCourse", method: "post", params });

export const reqStudentPersonal = () =>
  requests({ url: "/student/personalInfo", method: "get" });

//上传图片
export const reqPictureUpload = (file) =>
  requests({ url: "/common/upload", method: "post", data: file });

export const reqCourseTasks = (courseId) =>
  requests({ url: `/course/courseTasks/${courseId}`, method: "get" });

export const reqTeacherCourse = () =>
  requests({ url: "/teacher/courses", method: "get" });

export const reqTeacherAddClass = (params) =>
  requests({ url: "/teacher/add", method: "post", data: params });

//退课按钮
export const reqRemoveCourse = (courseId) =>
  requests({ url: `/student/remove/${courseId}`, method: "delete" });

//修改个人信息
export const reqStudentPersonalUpdate = (params) =>
  requests({
    url: "/student/personalInfo/update",
    method: "put",
    data: params,
  });

//课程首页
export const reqCourseHomepage = (courseId) =>
  requests({ url: `/course/${courseId}`, method: "get" });

//查看教师的个人信息
export const reqTeacherPersonal = () =>
  requests({ url: "/teacher/personalInfo", method: "get" });

//修改老师个人信息
export const reqTeacherPersonalUpdate = (params) =>
  requests({
    url: "/teacher/personalInfo/update",
    method: "put",
    data: params,
  });

//查询所有资料
export const reqCourseMaterial = (courseId) =>
  requests({ url: `/course/material/${courseId}`, method: "get" });

//根据id删除资料
export const reqRemoveMaterial = (params) =>
  requests({ url: `/teacher/delete`, method: "delete", params });

//上传资料
export const reqFileUpload = (courseId, file) =>
  requests({
    url: `/common/teacher/${courseId}/fileUpload`,
    method: "post",
    data: file,
  });

//查询所有讨论
export const reqAllDiscussions = (courseId) =>
  requests({ url: `/discussions/${courseId}/byCourse`, method: "get" });

//添加讨论
export const reqAddDiscussion = (courseId, data) =>
  requests({ url: `/discussions/${courseId}/add`, method: "post", data: data });

//查询我的讨论
export const reqAllMyDiscussion = (courseId) =>
  requests({ url: `/discussions/course/${courseId}`, method: "get" });

//查询学习记录
export const reqGetRecord = (params) =>
  requests({ url: "/record/get", method: "get", params });

//gpt聊天
export const reqGptAsk = (params) =>
  requests({ url: "/gpt/ask", method: "get", params });

//语音
export const reqAudioGet = (params) =>
  requests({ url: "/audio/get", method: "post", params });

//画图
export const reqImageWordtoimg = (params) =>
  requests({ url: "/image/wordtoimg", method: "post", params });

//识别物品
export const reqSeeGoods = (file) =>
  requests({ url: "/currency/getmessage", method: "post", data: file });

//获取ppt所有模板的封面
export const reqPptTemplateList = () =>
  requests({ url: "/ppt/getTempList", method: "get" });

//选择类型后根据描述获取ppt
export const reqGetPpt = (params) =>
  requests({ url: "/ppt/getPpt", method: "post", params });

//翻译
export const reqTranslate = (data) =>
  requests({ url: "/common/translate", method: "post", data: data });

//任务初次创建 /teacher/addTask
export const reqAddTask = (data) =>
  requests({ url: "/teacher/addTask", method: "post", data: data });

//老师在任务中添加题目
export const reqAddTopics = (data) =>
  requests({ url: "/teacher/addTopics", method: "post", data: data });

//查询课程中所有学生
export const reqAllStudent = (courseId) =>
  requests({ url: `/teacher/displayStudent/${courseId}`, method: "get" });

//学生查看任务题目
export const reqStudentGetTopic = (params) =>
  requests({ url: "/student/getTopic", method: "get", params });

//学生提交任务
export const reqSubmitTask = (data) =>
  requests({ url: "/student/submitTask", method: "post", data: data });

// 查询课程对应的所有任务
export const reqTeacherTaskStatus = (courseId) =>
  requests({ url: `/teacher/courseTasks/${courseId}`, method: "get" });

// 查看课程对应的所有学生任务状态

export const showAllStuCourseTasks = (taskId) =>
  requests({ url: `/teacher/courseTasks/getOne/${taskId}`, method: "get" });

//删除任务
export const deleteTask = (taskId) =>
  requests({ url: `/teacher/deleteTask/${taskId}`, method: "delete" });

export const getTaskTopicDetail = (taskId) =>
  requests({ url: `/student/getTaskTopicDetail/${taskId}`, method: "get" });

// 获取学生作业列表
export const reqStudentTask = (id) =>
  requests({
    url: `/teacher/courseTasks/getOne/${id}`,
    method: "get",
  });

// 获取学生个人作业
export const reqWork = (taskId, id) =>
  requests({
    url: `/teacher/courseTasks/getOne/${taskId}/getStudentAllTopic/${id}`,
    method: "get",
  });

// 提交学生分数
export const submitScores = (taskId, id, data) =>
  requests({
    url: `/teacher/courseTasks/getOne/${taskId}/getStudentAllTopic/${id}/topics`,
    method: "post",
    data: data,
  });
