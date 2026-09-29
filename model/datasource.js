/**
 * datasource.js — 数据源适配器
 *
 * 职责：根据 config.useLocalData 决定从本地 JSON 还是远程 API 获取数据。
 * model 层只调用 DataSource 的方法，不关心底层来源。
 *
 * 扩展路径：
 *   useLocalData = true  → 读取 /data/*.json（当前阶段）
 *   useLocalData = false → 走 Http.request() 调后端 API（后端就绪后切换）
 */

import { config } from '../config/config';
import { Http } from '../utils/http';

// ---- 本地数据（以 .js 模块形式导出，兼容小程序构建器） ----
const localCompanies  = require('../data/companies.js');
const localCategories = require('../data/categories.js');

// ---------------- 字段补全 ----------------
// 旧数据只有 type/source/remark，新版页面需要 status/scaleTags/riskTags/法人/信用代码 等。
// 这里在「读取」时统一补齐展示结构，但不擅自推断真实工商状态/规模；
// 后端就绪后该函数可整体删除——返回结构与服务端约定一致。
function normalize(c) {
  if (!c) return c;
  if (c._normalized) return c;

  const remark = c.remark || '';
  const source = c.source || '';

  // 1) 法定代表人（结构化字段 legal_rep_name，兼容旧字段 legalRepresentative）
  const legalRepresentative = c.legal_rep_name || c.legalRepresentative || '未公开';

  // 2) 统一社会信用代码（结构化字段 uscc，兼容旧字段 socialCreditCode）
  const socialCreditCode = c.uscc || c.socialCreditCode || '';

  // 3) 经营状态：不擅自推断。仅在 remark 明确出现"注销"时展示注销，否则待核验。
  let status = c.status;
  if (!status) status = /注销/.test(remark) ? '注销' : '待核验';

  // 4) 规模标签：无公开依据时不展示默认规模。
  const scaleTags = c.scaleTags && c.scaleTags.length ? c.scaleTags : [];

  // 5) 风险标签：用 type + source + update_time 兜底构造一条
  let riskTags = c.riskTags;
  if (!riskTags || !riskTags.length) {
    riskTags = c.type ? [{
      label: c.type,
      source: source,
      date: c.update_time || ''
    }] : [];
  }

  return Object.assign({}, c, {
    status,
    scaleTags,
    riskTags,
    legalRepresentative,
    registeredCapital: c.registeredCapital || '未公开',
    establishDate: c.establishDate || '未公开',
    socialCreditCode,
    _normalized: true
  });
}

function normalizeList(list) {
  return (list || []).map(normalize);
}

class DataSource {

  // ======================== 公司列表（按城市） ========================
  static async getCompaniesByCity(cityName) {
    if (config.useLocalData) {
      const filtered = localCompanies.companys.filter(
        c => c.city.indexOf(cityName) > -1
      );
      return { companys: normalizeList(filtered) };
    }
    return await Http.request({
      url: `/app/company/list/city/${cityName}`
    });
  }

  // ======================== 公司搜索（关键词） ========================
  static async searchCompanies(keyword) {
    if (config.useLocalData) {
      if (!keyword) return { companys: normalizeList(localCompanies.companys) };
      const kw = keyword.toLowerCase();
      const filtered = localCompanies.companys.filter(c =>
        c.name.toLowerCase().indexOf(kw) > -1 ||
        c.type.indexOf(kw) > -1 ||
        c.address.indexOf(kw) > -1 ||
        (c.source && c.source.indexOf(kw) > -1) ||
        (c.remark && c.remark.indexOf(kw) > -1)
      );
      return { companys: normalizeList(filtered) };
    }
    return await Http.request({
      url: '/app/company/list/like',
      data: { keyword }
    });
  }

  // ======================== 公司详情（按 id） ========================
  static async getCompanyById(id) {
    if (config.useLocalData) {
      const cid = Number(id);
      const found = localCompanies.companys.find(c => c.id === cid);
      if (!found) return null;
      // 详情页仅展示记录自身携带的薪资 / 点评数据。
      // data/salaries.js 与 data/reviews.js 是开发联调用模拟数据，不自动注入真实企业，
      // 避免用户误认为模拟内容是实际员工评价或真实薪酬披露。
      const detail = Object.assign({}, found, {
        salaries: found.salaries || [],
        reviews:  found.reviews  || []
      });
      return normalize(detail);
    }
    return await Http.request({
      url: `/app/company/${id}`
    });
  }

  // ======================== 提交公司信息 ========================
  static async addCompany(companyData) {
    if (config.useLocalData) {
      // 本地模式：模拟写入成功，返回与后端一致的响应结构
      console.info('[datasource:local] addCompany', companyData);
      return { code: 0, msg: '已进入审核池（本地）' };
    }
    return await Http.request({
      url: '/app/company/from/wx/add',
      method: 'POST',
      data: companyData
    });
  }

  // ======================== 获取分类列表 ========================
  static async getCategories() {
    if (config.useLocalData) {
      return localCategories;
    }
    // 后端就绪后增加对应接口
    return await Http.request({ url: '/app/category/list' });
  }

  // ======================== 微信登录（session） ========================
  static async getSessionInfo(code) {
    if (config.useLocalData) {
      return { openid: 'local-openid-0001' };
    }
    return await Http.request({
      url: '/wechat/session/info',
      data: { code }
    });
  }
}

export { DataSource };
