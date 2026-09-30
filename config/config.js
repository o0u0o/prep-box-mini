const config = {
  // 后端域名（不含 /app/ 路径前缀）
  // 所有具体接口路径在 model/datasource.js 中以 /app/... 开头拼接
  apiBaseUrl: 'https://laitou.aiuiot.com/laitou-java',
  /**
   * 数据源开关：
   *   true  → 读取 /data/*.js 本地数据（当前阶段，无后端依赖）
   *   false → 走后端 API（后端就绪后切换）
   */
  useLocalData: true
};

export {
  config
};
