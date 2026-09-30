# 贡献指南

感谢你参与面试准备盒（PrepBox）。为了让评审和长期维护更高效，请在提交代码前阅读本指南。

## 开发环境

- Node.js `^20.19.0`、`^22.13.0` 或 `>=24`
- npm（建议使用 Node.js 自带版本）
- 微信开发者工具，基础库不低于 `2.32.3`

首次安装依赖：

```bash
npm ci
```

安装完成后，在微信开发者工具中执行“工具 → 构建 npm”。`miniprogram_npm/` 是生成目录，不应提交。

## 提交前检查

```bash
npm test
npm run audit
```

`npm test` 会依次执行：

1. JavaScript 静态检查；
2. 页面注册、组件引用、WXSS 变量和数据结构检查。

`npm run audit` 单独检查第三方依赖是否存在高等级安全漏洞。

也可以单独运行：

```bash
npm run lint
npm run validate
npm run audit
```

## 编码约定

- 所有文本文件使用 UTF-8、LF 换行和两个空格缩进；不要使用 Tab。
- JavaScript 使用单引号和分号，具体规则以 `eslint.config.cjs` 为准。
- 页面目录必须包含同名的 `.js`、`.json`、`.wxml`、`.wxss` 四个文件，并在 `app.json` 中注册。
- 只在页面 JSON 的 `usingComponents` 中注册实际使用的组件。
- 新增全局样式值时优先复用 `app.wxss` 的设计 Token。
- 函数和变量采用 `camelCase`；常量采用 `UPPER_SNAKE_CASE`；CSS 类采用 `kebab-case`。
- `companys` 是现有后端响应字段，为兼容接口暂时保留。新代码内部变量应使用语法正确的 `companies`。
- 不提交密钥、令牌、个人联系方式、未脱敏材料和开发者工具私有配置。

## 数据与内容要求

企业风险信息属于高敏感内容。新增或修改 `data/companies.js` 时：

- 保留可核验的公开来源和更新时间；
- 使用客观描述，不写未经证实的定性结论；
- `uscc` 与 `legal_rep_name` 字段必须存在，无法核实时使用空字符串；
- 不收录身份证号、手机号、详细住址等非必要个人信息；
- 确认内容符合 `doc/2.数据来源.md` 中的数据来源与展示规范。

## 分支、提交与 Pull Request

建议从最新主分支创建短生命周期分支，例如：

```text
feature/search-history
fix/detail-layout
refactor/data-source
```

提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

```text
feat(search): 增加搜索历史
fix(detail): 修复长公司名溢出
refactor(data): 简化字段标准化逻辑
docs: 更新数据来源说明
```

提交 Pull Request 前请确认：

- 改动范围单一，没有混入无关格式化；
- `npm test` 全部通过；
- 在微信开发者工具中检查过涉及页面；
- UI 改动附有截图，行为改动说明了验证步骤；
- 新增公开信息附有来源，且已完成必要脱敏。
