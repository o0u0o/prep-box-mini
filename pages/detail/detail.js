import { Company } from '../../model/company';
import { withPrivacy } from '../../utils/privacy';

Page(withPrivacy({
  data: {
    company: null,
    activeTab: 0, // 0=基本信息  1=薪资  2=点评
    activeKey: '0', // l-segment 需要字符串 key
    salary: { total: 0 },
    review: { total: 0 },
    // 隐私授权字段（showPrivacy / privacyContractName）由 withPrivacy 注入
    // 默认匿名头像（当找不到匹配时作为备用）
    defaultAvatar: '/imgs/avatar/1.png'
  },

  async onLoad(options) {
    this.registerPrivacyListener();
    const id = options && options.id;
    if (!id) {
      wx.showToast({ title: '缺少参数 id', icon: 'none' });
      return;
    }
    const company = await Company.getById(id);
    if (!company) {
      wx.showToast({ title: '未找到该公司', icon: 'none' });
      return;
    }
    wx.setNavigationBarTitle({ title: company.name });

    this.setData({
      company,
      salary: this._buildSalary(company),
      review: this._buildReview(company)
    });
  },

  // l-segment 切换
  onTabChange(event) {
    // l-segment 的 linchange 事件 detail: { activeKey, currentIndex }
    const detail = (event && event.detail) || {};
    let index = detail.index;
    if (detail.currentIndex !== undefined) {
      index = detail.currentIndex;
    } else if (detail.activeKey !== undefined) {
      index = detail.activeKey;
    }
    const numericIndex = Number(index);
    const activeTab = Number.isNaN(numericIndex) ? 0 : numericIndex;
    this.setData({
      activeTab,
      activeKey: String(activeTab)
    });
  },

  // 复制信用代码（需隐私授权后才可调用剪贴板 API）
  copyCode() {
    const code = this.data.company && this.data.company.socialCreditCode;
    if (!code) {
      return;
    }
    const doCopy = () => {
      wx.setClipboardData({
        data: code,
        success: () => {
          wx.showToast({ title: '复制成功', icon: 'success' });
        }
      });
    };
    if (wx.requirePrivacyAuthorize) {
      wx.requirePrivacyAuthorize({
        success: doCopy,
        fail: () => {
          wx.showToast({ title: '需要同意隐私政策后才能复制', icon: 'none' });
        }
      });
    } else {
      doCopy();
    }
  },

  // —— 隐私授权逻辑由 utils/privacy.js 统一提供 ——

  // 申诉入口
  goAppeal() {
    wx.navigateTo({ url: '/pages/appeal/appeal' });
  },

  // 爆料薪资
  goContributeSalary() {
    const companyId = (this.data.company && this.data.company.id) || '';
    wx.navigateTo({
      url: `/pages/contribute/contribute?type=salary&companyId=${companyId}`
    });
  },

  // 写点评
  goContributeReview() {
    const companyId = (this.data.company && this.data.company.id) || '';
    wx.navigateTo({
      url: `/pages/contribute/contribute?type=review&companyId=${companyId}`
    });
  },

  // 展开/收起点评
  toggleReviewExpand(event) {
    const { index } = event.currentTarget.dataset;
    const key = `review.list[${index}].expanded`;
    const current = this.data.review.list[index].expanded;
    this.setData({
      [key]: !current
    });
  },

  /**
   * 薪资视图模型
   * 数据来源优先级：company.salaries（用户爆料数组） > 空态
   * 单条 salary 字段约定：{ id, title, amount, workYear, city, date, extra }
   */
  _buildSalary(company) {
    const list = (company && company.salaries) || [];
    if (!list.length) {
      return { total: 0 };
    }

    const amounts = list
      .map(salary => Number(salary.amount) || 0)
      .filter(amount => amount > 0);
    const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0);
    const avg = amounts.length ? Math.round(totalAmount / amounts.length) : 0;
    const min = amounts.length ? Math.min(...amounts) : 0;
    const max = amounts.length ? Math.max(...amounts) : 0;

    let avgPercent = 50;
    if (min !== max) {
      avgPercent = Math.round(((avg - min) / (max - min)) * 100);
    }

    // 按岗位聚合
    const jobMap = {};
    list.forEach(salary => {
      const title = salary.title || '其他岗位';
      if (!jobMap[title]) {
        jobMap[title] = { title, count: 0, sum: 0 };
      }
      jobMap[title].count += 1;
      jobMap[title].sum += Number(salary.amount) || 0;
    });
    const byJob = Object.keys(jobMap).map(title => ({
      title: jobMap[title].title,
      count: jobMap[title].count,
      avg: jobMap[title].count
        ? Math.round(jobMap[title].sum / jobMap[title].count)
        : 0
    })).sort((a, b) => b.count - a.count);

    // 按时间倒序，最多展示 5 条
    const sortedList = list.slice()
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
      .slice(0, 5);

    return {
      total: list.length,
      avg,
      min,
      max,
      avgPercent,
      byJob,
      list: sortedList
    };
  },

  /**
   * 点评视图模型
   * 数据来源：company.reviews 数组
   * 单条字段：{ id, author, position, score(1-5), recommend(bool), content, tags[], workYear, date, dimensions{ salary, growth, culture, workLife } }
   */
  _buildReview(company) {
    const list = (company && company.reviews) || [];
    if (!list.length) {
      return { total: 0 };
    }

    const scores = list.map(review => Number(review.score) || 0);
    const averageScore = scores.length
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length
      : 0;
    const recommendCount = list.filter(review => review.recommend).length;
    const recommendRate = list.length ? Math.round(recommendCount / list.length * 100) : 0;

    // 维度聚合（5 分制）
    const dimensionDefinitions = [
      { key: 'salary', label: '薪酬福利' },
      { key: 'growth', label: '成长空间' },
      { key: 'culture', label: '企业文化' },
      { key: 'workLife', label: '工作强度' }
    ];
    const dimensions = dimensionDefinitions.map(dimension => {
      const scoresByDimension = list
        .map(review => review.dimensions && Number(review.dimensions[dimension.key]))
        .filter(score => score > 0);
      const score = scoresByDimension.length
        ? scoresByDimension.reduce((sum, value) => sum + value, 0) / scoresByDimension.length
        : 0;
      return {
        label: dimension.label,
        score: score.toFixed(1),
        percent: Math.round(score / 5 * 100)
      };
    });

    const sortedList = list.slice()
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
      .slice(0, 10)
      .map((review, index) => {
        if (review.avatar) {
          return { ...review };
        }

        // 根据稳定的作者/id 字符串分配 1-5 号本地头像。
        const seed = review.author || (review.id ? String(review.id) : String(index));
        let hash = 0;
        for (let i = 0; i < seed.length; i += 1) {
          hash += seed.charCodeAt(i);
        }
        const avatarId = (hash % 5) + 1;
        return {
          ...review,
          avatar: `/imgs/avatar/${avatarId}.png`
        };
      });

    return {
      total: list.length,
      avg: averageScore.toFixed(1),
      avgInt: Math.round(averageScore),
      recommendRate,
      dimensions,
      list: sortedList
    };
  }
}));
