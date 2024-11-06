import axios from "axios";
import {config} from "./useConfig";

// 超时设定
axios.defaults.timeout = 10000;
axios.defaults.baseURL = config.apiUrl;

export class RequestError extends Error {
  message;
  status;
  error;

  constructor(
    message,
    status,
    error) {
    super();
    this.message = message;
    this.status = status;
    this.error = error;
  }

}

async function useRequest(
  url,
  method,
  data,
  params,
  headers,
  otherConfig = {}
) {
  let res;
  try {
    res = await axios({
      method: method,
      url: `${url}`,
      params,
      data,
      headers: headers || {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token") || "",
      },
      ...otherConfig,
    });
  } catch (error) {
    throw new RequestError("网络异常", "", null);
  }

  if (res.status > 400) {
    let e;
    const error = res.data.message;
    e = new RequestError(res.statusText, res.status.toString(), error);
    throw e;
  }
  return res;
}

export default useRequest;
