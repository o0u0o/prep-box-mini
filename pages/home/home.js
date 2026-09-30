import { Company } from '../../model/company';
import { withPrivacy } from '../../utils/privacy';

Page(withPrivacy({
  data: {
    companyData: [],
    isSearch: false
    // 隐私授权字段（showPrivacy / privacyContractName）由 withPrivacy 注入
  },

  async onLoad() {
    this.checkPrivacy();
    await this.loadCompanies();
  },

  async loadCompanies(searchTerm = '') {
    const keyword = searchTerm.trim();
    const response = await Company.searchByKeyword(keyword);
    this.setData({
      companyData: (response && response.companys) || [],
      isSearch: Boolean(keyword)
    });
  },

  async onSearchConfirm(event) {
    await this.loadCompanies(event.detail.value || '');
  },

  // 跳转：投稿须知 / 隐私政策 / 申诉反馈
  goNotice() {
    wx.navigateTo({ url: '/pages/notice/notice' });
  },

  goPrivacy() {
    wx.navigateTo({ url: '/pages/privacy/privacy' });
  },

  goAppeal() {
    wx.navigateTo({ url: '/pages/appeal/appeal' });
  },

  // 跳转公司详情
  goDetail(event) {
    const { id } = event.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/detail/detail?id=${id}` });
  },

  // 热门标签点击：等价触发一次搜索
  async onTagTap(event) {
    await this.loadCompanies(event.currentTarget.dataset.kw || '');
  }
}));
