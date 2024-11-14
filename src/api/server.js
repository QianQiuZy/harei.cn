import axios from 'axios';
import {
  handleRequestHeader, handleAuth, handleAuthError, handleGeneralError, handleNetworkError
} from './tools'

axios.interceptors.request.use((config) => {
  config = handleRequestHeader(config);
  config = handleAuth(config);
  return config
})
axios.interceptors.response.use((response) => {
  if (response.status !== 200) return Promise.reject(response.data);
  handleAuthError(response.data);
  handleGeneralError(response.data);
  return response
}, (err) => {
  handleNetworkError(err?.response?.status)
 return Promise.reject(err.response || err)
})
export const Get = (url, params = {}) => new Promise((resolve) => {
  axios.get(url, {params}).then((result) => {
    let res = result.data;
    resolve(res);
  }).catch((err) => {
    resolve(err)
  })
})
export const Post = (url, data, params = {},options = {}) => {
  return new Promise((resolve) => {
    axios.post(url, data, {params, ...options}).then((result) => {
      resolve(result.data)
    }).catch((err) => {
      resolve(err)
    })
  })
}
