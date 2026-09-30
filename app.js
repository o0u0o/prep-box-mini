import { config } from './config/config';
import { DataSource } from './model/datasource';
import { promisify } from './utils/util';

App({
  globalData: {
    userInfo: null,
    openId: ''
  },

  async onLaunch() {
    // 启动日志（保留 1 条审计）
    const logs = [Date.now()];
    wx.setStorageSync('logs', logs);

    // 本地数据模式：跳过远程登录，使用固定的开发环境 openid。
    if (config.useLocalData) {
      this.globalData.openId = 'local-openid-0001';
      return;
    }

    // 真实登录：wx.login -> 后端换 openId（统一走 DataSource，便于切换/Mock）
    try {
      const { code } = await promisify(wx.login)();
      if (!code) {
        return;
      }
      const session = await DataSource.getSessionInfo(code);
      this.globalData.openId = session && session.openid ? session.openid : '';
    } catch (error) {
      // 登录失败不阻塞页面渲染；具体错误已由 Http 统一 toast
      console.warn('[app] login failed', error);
    }

    // 注意：wx.getUserInfo 自基础库 2.10.4 起已废弃。
    // 需要用户头像/昵称时，请在页面通过 <button open-type="getUserInfo"> 或 wx.getUserProfile 触发。
  }
});
