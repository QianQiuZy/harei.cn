// mock/index.js
import './mock-api';
import Mock from 'mockjs';

// 配置 Mock.js 全局延时，模拟网络延迟
Mock.setup({
  timeout: '200-600', // 随机延时 200 到 600 毫秒
});
