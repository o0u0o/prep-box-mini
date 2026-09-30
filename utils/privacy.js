/**
 * 隐私授权 mixin
 *
 * 在 app.json 开启 "__usePrivacyCheck__": true 后，所有调用敏感 API
 * 的页面都需要监听 onNeedPrivacyAuthorization 并提供同意/拒绝弹窗。
 * 本模块抽离这部分重复逻辑，让页面通过 withPrivacy(...) 一键接入。
 *
 * 用法：
 *   import { withPrivacy } from '../../utils/privacy';
 *   Page(withPrivacy({
 *     data: { ... },
 *     onLoad() { this.checkPrivacy(); }   // 可选：首次进入主动检查
 *   }));
 *
 * WXML 端需要保留同名状态字段（showPrivacy / privacyContractName）
 * 与按钮事件（onAgreePrivacy / onRejectPrivacy / goPrivacyDetail），
 * 共用的弹窗模板可继续放在各页面 WXML 中。
 */

const PRIVACY_METHODS = {
  /**
   * 首次进入页面调用：若用户尚未同意则主动弹窗
   * 仅基础库 >= 2.32.3 生效，否则静默放行
   */
  checkPrivacy() {
    if (!wx.getPrivacySetting) {
      return;
    }
    wx.getPrivacySetting({
      success: res => {
        if (res.needAuthorization) {
          this.setData({
            showPrivacy: true,
            privacyContractName: res.privacyContractName || '《隐私政策》'
          });
        }
      }
    });
    this._registerPrivacyListener();
  },

  /**
   * 仅注册 onNeedPrivacyAuthorization 监听（不主动弹窗）
   * 适合详情页/二级页：只在调用敏感 API 时再触发授权
   */
  registerPrivacyListener() {
    this._registerPrivacyListener();
  },

  _registerPrivacyListener() {
    if (!wx.onNeedPrivacyAuthorization || this._privacyListenerRegistered) {
      return;
    }
    this._privacyListenerRegistered = true;
    wx.onNeedPrivacyAuthorization(resolve => {
      this._privacyResolve = resolve;
      if (wx.getPrivacySetting) {
        wx.getPrivacySetting({
          success: res => {
            this.setData({
              showPrivacy: true,
              privacyContractName: res.privacyContractName || '《隐私政策》'
            });
          },
          fail: () => {
            this.setData({ showPrivacy: true });
          }
        });
      } else {
        this.setData({ showPrivacy: true });
      }
    });
  },

  // 同意：由 <button open-type="agreePrivacyAuthorization"> 触发
  onAgreePrivacy() {
    this.setData({ showPrivacy: false });
    if (typeof this._privacyResolve === 'function') {
      this._privacyResolve({ event: 'agree', buttonId: 'agree-btn' });
      this._privacyResolve = null;
    }
  },

  // 拒绝
  onRejectPrivacy() {
    this.setData({ showPrivacy: false });
    if (typeof this._privacyResolve === 'function') {
      this._privacyResolve({ event: 'disagree' });
      this._privacyResolve = null;
    }
  },

  // 弹窗内查看隐私政策详情
  goPrivacyDetail() {
    wx.navigateTo({ url: '/pages/privacy/privacy' });
  }
};

const PRIVACY_DATA = {
  showPrivacy: false,
  privacyContractName: '《隐私政策》'
};

/**
 * 将隐私授权能力合并进 Page 配置对象
 * 同名方法/字段优先使用页面自身定义，保留覆盖能力
 */
function withPrivacy(pageOptions = {}) {
  const merged = { ...pageOptions };
  merged.data = {
    ...PRIVACY_DATA,
    ...(pageOptions.data || {})
  };
  Object.keys(PRIVACY_METHODS).forEach(key => {
    if (!(key in merged)) {
      merged[key] = PRIVACY_METHODS[key];
    }
  });
  return merged;
}

export { withPrivacy };
