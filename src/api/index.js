import {Get, Post} from "./server";


// 用户登录
export const login = async (userData) => {
  return Post('/api/login', userData);
};

export const music = () => {
  return Get('/api/music');
};
export const addMusic = (music) => {
  return Post('/api/add-music', music);
};
export const archiveAllMessagesApi = () => { // 发送POST请求进行归档所有消息
  return Post('/api/archive')
};
export const fetchMessagesApi = () => { // 发送GET请求获取所有消息
  return Get('/api/messages')
};
export const uploadApi = (formData) => { // 发送POST请求进行上传消息
  return Post('/api/upload', formData, {}, {
    'Content-Type': 'multipart/form-data'
  })
};
export const fetchLiveStatusApi = () => { // 发送GET请求获取所有消息
  return Get('/api/livestatus')
};

export const approveApi = (id) => { // 发送POST请求进行审批
  return Post('/api/approve/' + id)
};

export const rejectApi = (id) => { // 发送POST请求进行审批
  return Post('/api/reject/' + id)
};


export const getGiftCountApi = (id) => {
  return Get('/api/gift-count/' + id)
};
export const getGiftRankingApi = () => {
  return Get('/api/gift-ranking')
};
