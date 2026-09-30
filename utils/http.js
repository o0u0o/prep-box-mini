import { config } from '../config/config';
import { promisify } from './util';

const REQUEST_TIMEOUT_MS = 15000;

/**
 * 统一网络请求工具
 *  - 自动拼接 apiBaseUrl
 *  - 自动注入 Content-Type
 *  - 统一处理网络错误 / 非 2xx 状态码 / 业务错误码
 *  - 可选 loading 提示
 */
class Http {
  static async request({
    url,
    data = {},
    method = 'GET',
    header = {},
    showLoading = false,
    loadingText = '加载中'
  }) {
    if (showLoading) {
      wx.showLoading({ title: loadingText, mask: true });
    }

    let response;
    try {
      response = await promisify(wx.request)({
        url: Http._joinUrl(config.apiBaseUrl, url),
        data,
        method,
        timeout: REQUEST_TIMEOUT_MS,
        header: {
          'content-type': 'application/json',
          ...header
        }
      });
    } catch (error) {
      Http._toast('网络异常，请稍后重试');
      throw error;
    } finally {
      if (showLoading) {
        wx.hideLoading();
      }
    }

    // HTTP 层
    if (response.statusCode < 200 || response.statusCode >= 300) {
      Http._toast(`服务器异常 (${response.statusCode})`);
      throw new Error(`HTTP ${response.statusCode}`);
    }

    // 业务层（约定 { code, msg, data }；code===0 视为成功，其余 toast）
    const body = response.data;
    const hasBusinessError = body
      && typeof body === 'object'
      && 'code' in body
      && body.code !== 0
      && body.code !== 200;
    if (hasBusinessError) {
      Http._toast(body.msg || '请求失败');
    }
    return body;
  }

  static _toast(title) {
    wx.showToast({ title, icon: 'none', duration: 2000 });
  }

  // 拼接 baseUrl 与路由，容忍边界斜杠，避免出现 // 双斜杠
  static _joinUrl(baseUrl, endpoint) {
    const normalizedBaseUrl = (baseUrl || '').replace(/\/+$/, '');
    const normalizedEndpoint = (endpoint || '').replace(/^\/+/, '');
    return `${normalizedBaseUrl}/${normalizedEndpoint}`;
  }
}

export { Http };
