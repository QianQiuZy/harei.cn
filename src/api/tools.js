import {useToast} from "vue-toast-notification";

const $toast = useToast();

const handleRequestHeader = (config) => {
  return config
}
const handleAuth = (config) => {
  config.headers['token'] = localStorage.getItem('token')  || ''
  return config
}
const handleNetworkError = (errStatus) => {
  let errMessage
  if (errStatus) {
    switch (errStatus) {
      case 400:
        errMessage = '错误的请求'
        break
      case 401:
        errMessage = '未授权，请重新登录'
        break
      case 403:
        errMessage = '拒绝访问'
        break
      case 404:
        errMessage = '请求错误,未找到该资源'
        break
      case 405:
        errMessage = '请求方法未允许'
        break
      case 408:
        errMessage = '请求超时'
        break
      case 500:
        errMessage = '服务器端出错'
        break
      case 501:
        errMessage = '网络未实现'
        break
      case 502:
        errMessage = '网络错误'
        break
      case 503:
        errMessage = '服务不可用'
        break
      case 504:
        errMessage = '网络超时'
        break
      case 505:
        errMessage = 'http版本不支持该请求'
        break
      default:
        errMessage = `其他连接错误 --${errStatus}`
    }
  } else {
    errMessage = `无法连接到服务器！`
  }
  $toast.error(errMessage, {
    position: "top",
  })
}
const handleAuthError = (error) => {
  // TODO: 授权错误处理

}
const handleGeneralError = (error) => {
  // TODO: 处理通用错误
}

export {
  handleRequestHeader,
  handleAuth,
  handleNetworkError,
  handleAuthError,
  handleGeneralError
}
