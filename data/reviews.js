/**
 * 面试准备盒 · 模拟点评数据
 *
 * 数据性质：仅为前端开发联调用模拟数据，非真实员工评价。
 * 字段约定：
 *   - id          唯一标识
 *   - author      作者昵称（脱敏，匿名）
 *   - position    岗位（可选）
 *   - score       综合星级（1-5 整数）
 *   - recommend   是否推荐入职
 *   - content     点评正文
 *   - tags[]      关键词标签
 *   - workYear    在职/离职信息
 *   - date        点评日期
 *   - dimensions  细分维度评分 { salary, growth, culture, workLife }（1-5）
 *
 * 使用方式：
 *   - 仅作为开发占位结构；生产或真实企业详情不得自动注入模拟点评。
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
