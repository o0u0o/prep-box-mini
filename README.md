# 面试准备盒 · PrepBox

> 面试前，准备一下。

一个微信小程序，帮助求职者在面试 / 入职前，基于公开可核验的信息（裁判文书、行政处罚、失信被执行、媒体报道等）快速了解一家公司的背景，提前发现潜在风险，把面试准备做得更扎实。

---

## ✨ 核心特性

- 🔍 **快速检索**：按公司名称 / 类型 / 地址 / 来源 / 备注关键词搜索
- 🏷️ **风险标签**：用语义化配色区分劳动争议 / 行政处罚 / 失信被执行 / 培训机构 / 招聘风险线索 / 其他可核验线索
- 🤝 **众包贡献**：用户可投稿，进入审核池后才公开展示
- ⚖️ **合规优先**：内置投稿须知、隐私政策、申诉反馈页，所有文案强调"仅作参考、不作定性"
- 🗂️ **可切换数据源**：本地 JSON 模式 (`useLocalData=true`) 与远程 API 模式无缝切换

## 🛠️ 技术栈

- 微信小程序原生框架（基础库 ≥ 2.9.3，推荐 3.x）
- [Lin-UI](https://doc.mini.talelin.com/) `^0.6.13` 组件库
- ES6 + 模块化（适配器模式：`DataSource → Http / 本地 JSON`）

## 📁 项目结构

```
prepbox/
├── app.{js,json,wxss}      全局配置与设计 Token
├── config/config.js         API 地址 + 本地数据开关 useLocalData
├── data/                    本地数据（.js 模块格式）
│   ├── companies.js         公司/机构列表
│   └── categories.js        类型枚举
├── model/
│   ├── datasource.js        数据源适配器：本地 JSON ↔ 远程 API
│   └── company.js           Company 业务模型
├── pages/
│   ├── home/                首页（搜索 / 风险线索列表）
│   ├── contribute/          贡献入口（投稿表单，含合规门槛）
│   ├── notice/              投稿须知
│   ├── privacy/             隐私政策
│   ├── review-status/       提交后的"审核中"提示页
│   ├── appeal/              申诉 / 反馈
│   └── detail/              公司详情（待启用）
├── utils/
│   ├── http.js              纯网络层
│   └── util.js
├── miniprogram_npm/         构建产物（被 .gitignore 排除）
└── doc/                     设计文档
```

## 🚀 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 在微信开发者工具中：菜单 → 工具 → 构建 npm
#    （会生成 miniprogram_npm/）

# 3. 打开开发者工具，导入本目录，AppID 使用项目自带或自己的测试号
```

### 本地数据 / 远程 API 切换

编辑 [config/config.js](config/config.js)：

```js
const config = {
  apiBaseUrl: 'https://your-backend.example.com/api/',
  useLocalData: true   // true → 走 data/*.js 本地数据，无需后端
                       // false → 走 apiBaseUrl 真实接口
};
```

## 🧭 合规边界

- 优先展示 **公开可核验** 的信息（裁判文书、行政处罚、失信被执行、媒体报道等），并提示用户以官方最新公示为准
- 所有用户投稿默认 **进入审核池**，审核通过后才公开
- 文案中坚持 **"仅作面试 / 求职参考，不构成对企业的最终定性"**
- 提供 **申诉、反馈** 通道，发现失实、状态变更或来源失效可更正、隐藏或下线

## 📝 License

ISC
