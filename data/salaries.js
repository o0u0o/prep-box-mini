/**
 * 面试准备盒 · 模拟薪资爆料数据
 *
 * 数据性质：仅为前端开发联调用模拟数据，非真实薪酬披露。
 * 字段约定：
 *   - id        唯一标识
 *   - title     岗位名称
 *   - amount    月薪（元）
 *   - workYear  工作经验
 *   - city      工作城市
 *   - date      爆料日期
 *   - extra     补充说明（可选）
 *
 * 使用方式：
 *   - 仅作为开发占位结构；生产或真实企业详情不得自动注入模拟薪资。
 */

const byCompany = {};
const generic = [];

function getByCompanyId(id) {
  return byCompany[Number(id)] || [];
}

module.exports = {
  byCompany,
  generic,
  getByCompanyId
};
