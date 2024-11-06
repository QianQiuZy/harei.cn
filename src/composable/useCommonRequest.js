import request, { RequestError } from "./useRequest";

import router from "@/router";
import {useToast} from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const $toast = useToast();
async function useCommonRequest(
  url,
  method,
  data,
  params,
  headers,
) {
  let response;

  response= await request(url, method, data, params, headers);
  return response.data;
  // if (code === "00000") {
  //   return result.data;
  // } else if (code.startsWith("A03")) {
  //   $toast.error("请先登录");
  //   inputMessage = false;
  //   //状态码以A03为前缀表示用户权限异常
  //   router.push({
  //     name: "login",
  //   });
  // }
  // throw new RequestError(result.message, code, null, inputMessage);
}
export default useCommonRequest;
