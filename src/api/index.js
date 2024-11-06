import commonRequest from "@/composable/useCommonRequest";

// 用户登录
export const login = async (userData) => {
  return commonRequest('/api/login', 'POST', userData);
};

export const music = () => {
  return commonRequest('/api/music', 'GET');
};

export const archiveAllMessagesApi = () => { // 发送POST请求进行归档所有消息
  return commonRequest('/api/archive', 'POST')
};
export const fetchMessagesApi = () => { // 发送GET请求获取所有消息
  return commonRequest('/api/messages', 'GET')
};
export const uploadApi = (formData) => { // 发送POST请求进行归档所有消息
  return commonRequest('/api/upload', 'POST', formData, null, {
    'Content-Type': 'multipart/form-data'
  })
};
export const fetchLiveStatusApi = () => { // 发送GET请求获取所有消息
  return commonRequest('/api/livestatus', 'GET')
};

export const approveApi = (id) => { // 发送POST请求进行审批
  return commonRequest('/api/approve/' + id, 'POST')
};

export const rejectApi = (id) => { // 发送POST请求进行审批
  return commonRequest('/api/reject/' + id, 'POST')
};
