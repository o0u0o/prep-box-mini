import { Company } from '../../model/company';
const CATEGORIES = require('../../data/categories.js');

const REQUIRED_FIELD_MESSAGES = Object.freeze({
  name: '请填写公司/机构名称',
  type: '请选择类型',
  province: '请选择省/市/区',
  source: '请填写信源（裁判文书号 / 公告链接 / 媒体报道 URL）'
});

Page({
  data: {
    // 类型选项
    typeOptions: CATEGORIES,

    // 表单字段
    form: {
      name: '',
      type: '',
      province: '',
      city: '',
      district: '',
      address: '',
      source: '',
      remark: ''
    },

    // 选中的省/市/区数组（picker mode=region 用）
    region: [],
    regionText: '',

    // 字符计数
    remarkLen: 0,
    sourceLen: 0,

    // 校验错误（字段名 -> 错误提示文案）
    errors: {},

    // 同意条款
    agreed: false,

    // 预览弹窗
    showPreview: false
  },

  // ============ 字段绑定 ============

  bindName(event) {
    this._setField('name', (event.detail.value || '').trim());
  },
  bindAddress(event) {
    this._setField('address', event.detail.value || '');
  },
  bindSource(event) {
    const value = event.detail.value || '';
    this._setField('source', value.trim());
    this.setData({ sourceLen: value.length });
  },
  bindRemark(event) {
    const value = event.detail.value || '';
    this._setField('remark', value);
    this.setData({ remarkLen: value.length });
  },

  // 类型 radio
  onTypeChange(event) {
    // lin-ui radio-group 触发 linchange 时 detail 是 { key, ... }
    const value = (event.detail && (event.detail.key || event.detail.currentKey)) || '';
    this._setField('type', value);
  },

  // 省市区 picker
  onRegionChange(event) {
    const region = event.detail.value || [];
    const [province = '', city = '', district = ''] = region;
    this.setData({
      region,
      regionText: region.filter(Boolean).join(' / '),
      'form.province': province,
      'form.city': city,
      'form.district': district
    });
    // 清除 province 错误
    if (this.data.errors.province && province) {
      const errors = { ...this.data.errors };
      delete errors.province;
      this.setData({ errors });
    }
  },

  // 内部：设置字段并清错
  _setField(key, value) {
    this.setData({ [`form.${key}`]: value });
    if (this.data.errors[key] && value) {
      const errors = { ...this.data.errors };
      delete errors[key];
      this.setData({ errors });
    }
  },

  // ============ 同意条款 ============

  toggleAgree() {
    this.setData({ agreed: !this.data.agreed });
  },
  goNotice() {
    wx.navigateTo({ url: '/pages/notice/notice' });
  },
  goPrivacy() {
    wx.navigateTo({ url: '/pages/privacy/privacy' });
  },

  // ============ 校验 ============

  _validate() {
    const errors = {};
    const { form } = this.data;
    Object.entries(REQUIRED_FIELD_MESSAGES).forEach(([field, message]) => {
      if (!form[field]) {
        errors[field] = message;
      }
    });
    this.setData({ errors });
    return Object.keys(errors).length === 0;
  },

  // ============ 预览 ============

  openPreview() {
    if (!this._validate()) {
      wx.lin.showToast({ title: '请先完善必填项', icon: 'error' });
      return;
    }
    if (!this.data.agreed) {
      wx.lin.showToast({
        title: '请先勾选同意《投稿须知》与《隐私政策》',
        icon: 'error'
      });
      return;
    }
    this.setData({ showPreview: true });
  },

  closePreview() {
    this.setData({ showPreview: false });
  },

  // ============ 提交 ============

  async confirmSubmit() {
    this.setData({ showPreview: false });
    const payload = { ...this.data.form };
    const response = await Company.addCompanyInfo(payload);
    if (response && response.code === 500) {
      wx.lin.showToast({ title: '已有相同记录，无需重复提交', icon: 'error' });
      return;
    }
    if (response && response.code === 0) {
      wx.lin.showToast({ title: '提交成功，等待审核', icon: 'success' });
      setTimeout(() => {
        wx.navigateBack();
      }, 1200);
    }
  }
});
