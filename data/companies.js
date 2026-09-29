/**
 * 面试准备盒 · 本地企业风险参考数据
 *
 * 数据来源：主要来自政府部门 / 人民法院 / 主流媒体已公开披露的失信被执行人公告、
 * 重大劳动保障违法案件或用户提交的可核验线索；各条 source 字段记录来源说明、公告信息、
 * 案号或核验建议。展示前仍应结合官方最新公示复核。
 *
 * 字段约定（v2，与后端 API 对齐）：
 *   - id                  唯一标识
 *   - name                企业全称
 *   - logo                Logo URL
 *   - status              经营状态（存续 / 注销 / 吊销 / 未公开）
 *   - scaleTags[]         规模/性质标签（小微企业 / 国有企业 / 高新技术企业…）
 *   - riskTags[]          风险标签 [{ label, source, date }]
 *   - legal_rep_name      法定代表人姓名（来自公开来源或待核验线索）
 *   - registeredCapital   注册资本
 *   - establishDate       成立日期
 *   - uscc                统一社会信用代码
 *   - province/city/district/address
 *   - source              信息来源原文（保留，详情页可点击查证）
 *   - type                旧版单分类（保留以兼容首页热门标签搜索）
 *   - remark              说明性备注
 *   - is_real / create_time / update_time
 *
 * 重要说明：
 *   1. 本数据仅作"求职前公开信息查询"参考使用，非个人评价、非平台定性；
 *   2. 对涉及争议或负面记录的内容，应以信用中国、国家企业信用信息公示系统、
 *      中国执行信息公开网、人民法院/人社部门公告等官方最新信息为准；
 *   3. 如企业相关信息已变更、履行完毕、状态解除或来源存在误差，欢迎联系运营者更正／删除。
 */

const LOGO = 'https://img.icons8.com/color/240/company.png';
const TIME = '2026-05-10';


const realRecords = [
  // ===== 贵州（既有 2 条，保留） =====
  {
    id: 1,
    name: '共创绿洲贵州医疗系统技术有限公司',
    uscc: '91520112MA6J8MLD96',
    legal_rep_name: '梁娜',
    logo: LOGO,
    province: '贵州省',
    city: '贵阳市',
    district: '乌当区',
    address: '贵州省大健康医药产业智汇云锦孵化基地B2栋',
    source: '员工劳动仲裁公开胜诉案件（用户投稿，建议求职前查询裁判文书网）',
    type: '劳动争议',
    remark: '存在拖欠工资及加班费仲裁记录，建议入职前与现有员工核实。',
    is_real: true,
    create_time: TIME,
    update_time: TIME
  },
  {
    id: 2,
    name: '贵州晟泰科技开发有限公司',
    uscc: '91520103MACAHPUP4C',
    legal_rep_name: '刘江海',
    logo: LOGO,
    province: '贵州省',
    city: '贵阳市',
    district: '云岩区',
    address: '渔安安井片区未来方舟D9-2栋12层2号',
    source: '用户投稿；建议求职前查询裁判文书网/信用中国',
    type: '劳动争议',
    remark: '存在劳务合同纠纷历史记录。',
    is_real: true,
    create_time: TIME,
    update_time: TIME
  },

  // ===== 贵州 · 省人社厅 2024 年第二批拖欠农民工工资失信联合惩戒名单（2024-07-11 公告） =====
  {
    id: 3,
    name: '贵州永久鑫隆建筑工程有限公司',
    uscc: '91520103MA6E8TN42B',
    legal_rep_name: '汪训加',
    logo: LOGO,
    province: '贵州省',
    city: '贵阳市',
    district: '云岩区',
    address: '贵州省贵阳市云岩区三桥南路9号筑成·康家－楠荞苑17号楼1单元2层3号',
    source: '贵州省人力资源和社会保障厅《2024年第二批拖欠农民工工资失信联合惩戒名单》（2024-07-11）：；织金县人社局立案调查',
    type: '劳动争议',
    remark: '在织金县"山禾源·水乡"项目拖欠 163 名农民工工资，逾期未整改。',
    is_real: true,
    create_time: TIME,
    update_time: TIME
  },
  {
    id: 4,
    name: '贵州唯家装饰工程有限公司',
    uscc: '91520330MA7KHTX18Q',
    legal_rep_name: '曾斌',
    logo: LOGO,
    province: '贵州省',
    city: '遵义市',
    district: '习水县',
    address: '贵州省习水县东皇街道四坪社区乌江南路棚户区安置房2栋3楼3-8、9-15号',
    source: '贵州省人力资源和社会保障厅《2024年第二批重大劳动保障违法案件》（2024-07-11）；习水县人社局立案',
    type: '劳动争议',
    remark: '拖欠张某等 21 名劳动者 2022-2023 年工资 17.06 万元，公司负责人为逃避支付申请注销。',
    is_real: true,
    create_time: TIME,
    update_time: TIME
  },
  {
    id: 5,
    name: '贵州集德承池城市建设有限公司',
    uscc: '91520330MA6HR5N19Y',
    legal_rep_name: '杨杰',
    logo: LOGO,
    province: '贵州省',
    city: '遵义市',
    district: '习水县',
    address: '贵州省习水县东皇街道双垭子社区习酒大道习部未来港3栋3层16、28号',
    source: '贵州省人力资源和社会保障厅《2024年第二批重大劳动保障违法案件》（2024-07-11）；习水县人社局立案',
    type: '劳动争议',
    remark: '承建寨坝镇戴斯·常青藤康养中心透水砼项目，拖欠 20 名劳动者工资 13.63 万元，逾期未整改。',
    is_real: true,
    create_time: TIME,
    update_time: TIME
  },
  {
    id: 6,
    name: '仁怀益居装饰有限公司',
    uscc: '91520382MAAJM1B991',
    legal_rep_name: '陈军军',
    logo: LOGO,
    province: '贵州省',
    city: '遵义市',
    district: '仁怀市',
    address: '贵州省遵义市仁怀市符阳路283号',
    source: '贵州省人力资源和社会保障厅《2024年第二批重大劳动保障违法案件》（2024-07-11）；仁怀市人社局立案',
    type: '劳动争议',
    remark: '承建仁怀市茗海汤泉足浴养生会所工程，拖欠 10 名工人工资 13.66 万元。',
    is_real: true,
    create_time: TIME,
    update_time: TIME
  },
  {
    id: 7,
    name: '安顺卓京红鲤贸易有限公司',
    uscc: '',
    legal_rep_name: '',
    logo: LOGO,
    province: '贵州省',
    city: '安顺市',
    district: '',
    address: '（详细注册地址以"信用中国（贵州）"网站公示为准）',
    source: '贵州省人力资源和社会保障厅《2024年第二批拖欠农民工工资失信联合惩戒名单》（2024-07-11）',
    type: '失信被执行',
    remark: '被列入贵州省 2024 年第二批拖欠农民工工资失信联合惩戒对象名单。',
    is_real: true,
    create_time: TIME,
    update_time: TIME
  },
  {
    id: 8,
    name: '贵州鼎筑名品装饰工程有限公司',
    uscc: '',
    legal_rep_name: '',
    logo: LOGO,
    province: '贵州省',
    city: '',
    district: '',
    address: '（详细注册地址以"信用中国（贵州）"网站公示为准）',
    source: '贵州省人力资源和社会保障厅《2024年第二批拖欠农民工工资失信联合惩戒名单》（2024-07-11）',
    type: '失信被执行',
    remark: '被列入贵州省 2024 年第二批拖欠农民工工资失信联合惩戒对象名单。',
    is_real: true,
    create_time: TIME,
    update_time: TIME
  },
  {
    id: 9,
    name: '贵州绿水青山能源有限公司',
    uscc: '',
    legal_rep_name: '',
    logo: LOGO,
    province: '贵州省',
    city: '',
    district: '',
    address: '（详细注册地址以"信用中国（贵州）"网站公示为准）',
    source: '贵州省人力资源和社会保障厅《2024年第二批拖欠农民工工资失信联合惩戒名单》（2024-07-11）',
    type: '失信被执行',
    remark: '被列入贵州省 2024 年第二批拖欠农民工工资失信联合惩戒对象名单。',
    is_real: true,
    create_time: TIME,
    update_time: TIME
  },
  {
    id: 10,
    name: '贵州驰识建筑工程有限公司',
    uscc: '',
    legal_rep_name: '',
    logo: LOGO,
    province: '贵州省',
    city: '',
    district: '',
    address: '（详细注册地址以"信用中国（贵州）"网站公示为准）',
    source: '贵州省人力资源和社会保障厅《2024年第二批拖欠农民工工资失信联合惩戒名单》（2024-07-11）',
    type: '失信被执行',
    remark: '被列入贵州省 2024 年第二批拖欠农民工工资失信联合惩戒对象名单。',
    is_real: true,
    create_time: TIME,
    update_time: TIME
  },

  // ===== 四川 · 达州市达川区人民法院 2024-04-30 失信被执行人公告（拖欠工资案件专项） =====
  {
    id: 11,
    name: '达县赢川矿业有限公司',
    uscc: '915117002103288809',
    legal_rep_name: '宋忠奎',
    logo: LOGO,
    province: '四川省',
    city: '达州市',
    district: '达川区',
    address: '（注册地址以国家企业信用信息公示系统为准）',
    source: '达州市达川区人民法院《拖欠工资案件失信被执行人公告》（2024-04-30，澎湃新闻转发）；执行案号：(2022)川1703执37号；执行标的额：75000元',
    type: '失信被执行',
    remark: '因拖欠工资被人民法院依法纳入失信被执行人名单。',
    is_real: true,
    create_time: TIME,
    update_time: TIME
  },
  {
    id: 12,
    name: '四川龙云建筑装饰工程有限公司',
    uscc: '9151170005216076X9',
    legal_rep_name: '吴文武',
    logo: LOGO,
    province: '四川省',
    city: '达州市',
    district: '达川区',
    address: '（注册地址以国家企业信用信息公示系统为准）',
    source: '达州市达川区人民法院《拖欠工资案件失信被执行人公告》（2024-04-30，澎湃新闻转发）；执行案号：(2024)川1703执恢262号；执行标的额：153764元',
    type: '失信被执行',
    remark: '因拖欠工资被人民法院依法纳入失信被执行人名单。',
    is_real: true,
    create_time: TIME,
    update_time: TIME
  },
  {
    id: 13,
    name: '四川星垣房地产开发有限公司',
    uscc: '91511703MA62E59H6A',
    legal_rep_name: '严状',
    logo: LOGO,
    province: '四川省',
    city: '达州市',
    district: '达川区',
    address: '（注册地址以国家企业信用信息公示系统为准）',
    source: '达州市达川区人民法院《拖欠工资案件失信被执行人公告》（2024-04-30，澎湃新闻转发）；执行案号：(2024)川1703执1359号；执行标的额：275573元',
    type: '失信被执行',
    remark: '因拖欠工资被人民法院依法纳入失信被执行人名单。',
    is_real: true,
    create_time: TIME,
    update_time: TIME
  },
  {
    id: 14,
    name: '四川宅牛装饰工程有限公司',
    uscc: '91511703MA69YHFU9L',
    legal_rep_name: '奉迎春',
    logo: LOGO,
    province: '四川省',
    city: '达州市',
    district: '达川区',
    address: '（注册地址以国家企业信用信息公示系统为准）',
    source: '达州市达川区人民法院《拖欠工资案件失信被执行人公告》（2024-04-30，澎湃新闻转发）；执行案号：(2024)川1703执213号；执行标的额：162370元',
    type: '失信被执行',
    remark: '因拖欠工资被人民法院依法纳入失信被执行人名单。',
    is_real: true,
    create_time: TIME,
    update_time: TIME
  },
  {
    id: 15,
    name: '达州市嘉思睿砼业有限公司',
    uscc: '91511700MA685TWD1Q',
    legal_rep_name: '蔡嘉妮',
    logo: LOGO,
    province: '四川省',
    city: '达州市',
    district: '达川区',
    address: '（注册地址以国家企业信用信息公示系统为准）',
    source: '达州市达川区人民法院《拖欠工资案件失信被执行人公告》（2024-04-30，澎湃新闻转发）；执行案号：(2023)川1703执992号；执行标的额：100000元',
    type: '失信被执行',
    remark: '因拖欠工资被人民法院依法纳入失信被执行人名单。',
    is_real: true,
    create_time: TIME,
    update_time: TIME
  },
  {
    id: 16,
    name: '大竹县建设劳务开发有限公司',
    uscc: '915117246823814875',
    legal_rep_name: '邱治全',
    logo: LOGO,
    province: '四川省',
    city: '达州市',
    district: '大竹县',
    address: '（注册地址以国家企业信用信息公示系统为准）',
    source: '达州市达川区人民法院《拖欠工资案件失信被执行人公告》（2024-04-30，澎湃新闻转发）；执行案号：(2023)川1703执恢706号；执行标的额：353725元',
    type: '失信被执行',
    remark: '因拖欠工资被人民法院依法纳入失信被执行人名单。',
    is_real: true,
    create_time: TIME,
    update_time: TIME
  },
  {
    id: 17,
    name: '达州市鑫洪建筑劳务有限公司',
    uscc: '91511703058233333G',
    legal_rep_name: '唐华强',
    logo: LOGO,
    province: '四川省',
    city: '达州市',
    district: '达川区',
    address: '（注册地址以国家企业信用信息公示系统为准）',
    source: '达州市达川区人民法院《拖欠工资案件失信被执行人公告》（2024-04-30，澎湃新闻转发）；执行案号：(2023)川1703执1720号；执行标的额：94017.34元',
    type: '失信被执行',
    remark: '因拖欠工资被人民法院依法纳入失信被执行人名单。',
    is_real: true,
    create_time: TIME,
    update_time: TIME
  },
  {
    id: 18,
    name: '四川中成信合建筑工程有限公司',
    uscc: '91510100556415797K',
    legal_rep_name: '李航',
    logo: LOGO,
    province: '四川省',
    city: '达州市',
    district: '达川区',
    address: '（注册地址以国家企业信用信息公示系统为准）',
    source: '达州市达川区人民法院《拖欠工资案件失信被执行人公告》（2024-04-30，澎湃新闻转发）；执行案号：(2024)川1703执572号；执行标的额：1722938元',
    type: '失信被执行',
    remark: '因拖欠工资被人民法院依法纳入失信被执行人名单（标的额最大）。',
    is_real: true,
    create_time: TIME,
    update_time: TIME
  },

  // ===== 四川 · 峨眉山市人民法院 2026-04-29 公告（强制执行典型案例） =====
  {
    id: 19,
    name: '夹江县德农茶叶有限公司',
    uscc: '92511126MACBT2C33F',
    legal_rep_name: '马万芳',
    logo: LOGO,
    province: '四川省',
    city: '乐山市',
    district: '夹江县',
    address: '（注册地址以国家企业信用信息公示系统为准）',
    source: '峨眉山市人民法院《最新失信被执行人名单》（2026-04-29，腾讯新闻"天下峨眉"转发）；案由：国内非涉外仲裁裁决（工伤赔偿）',
    type: '强制执行',
    remark: '执行董事：马万芳。员工王某某操作茶叶成型机时压伤手指被认定工伤，公司未依法缴纳工伤保险费，仲裁裁决后未履行赔偿义务被强制执行。',
    is_real: true,
    create_time: TIME,
    update_time: TIME
  },
  {
    id: 20,
    name: '乐山飞泽消防设备有限公司',
    uscc: '91511181MA7L4W5BX2',
    legal_rep_name: '李跃奎',
    logo: LOGO,
    province: '四川省',
    city: '乐山市',
    district: '峨眉山市',
    address: '（注册地址以国家企业信用信息公示系统为准）',
    source: '峨眉山市人民法院《最新失信被执行人名单》（2026-04-29，腾讯新闻"天下峨眉"转发）；案由：劳动争议',
    type: '劳动争议',
    remark: '拖欠员工谢某某劳动报酬 23180 元，调解协议未按约履行被强制执行，账户被法院冻结扣划。',
    is_real: true,
    create_time: TIME,
    update_time: TIME
  }
];

module.exports = {
  companys: realRecords
};
