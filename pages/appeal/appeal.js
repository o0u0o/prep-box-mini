Page({
  data: {
    typeOptions: ['企业申诉', '内容更正', '删除请求', '其他'],
    typeIndex: -1,
    form: {
      type: '',
      target: '',
      contact: '',
      content: ''
    }
  },

  onTypePick(event) {
    const typeIndex = Number(event.detail.value);
    this.setData({
      typeIndex,
      'form.type': this.data.typeOptions[typeIndex] || ''
    });
  },

  bindTarget(event) {
    this.setData({ 'form.target': event.detail.value });
  },

  bindContact(event) {
    this.setData({ 'form.contact': event.detail.value });
  },

  bindContent(event) {
    this.setData({ 'form.content': event.detail.value });
  },

  submit() {
    const { form } = this.data;
    if (!form.type || !form.target || !form.content) {
      wx.lin.showToast({ title: '请完整填写必填项', icon: 'error' });
      return;
    }
    // TODO: 后端申诉接口未上线，先以本地占位提示
    wx.lin.showToast({
      title: '已收到，会在 3-5 个工作日内复核',
      icon: 'success'
    });
    setTimeout(() => wx.navigateBack({ delta: 1 }), 1200);
  }
});
