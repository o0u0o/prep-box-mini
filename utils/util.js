function promisify(api) {
  return (params = {}) => new Promise((resolve, reject) => {
    api({
      ...params,
      success: resolve,
      fail: reject
    });
  });
}

export {
  promisify
};
