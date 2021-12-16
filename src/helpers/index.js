const average = (nums) => {
  return nums.reduce((a, b) => a + b) / nums.length;
};

const formatNumber = (num) => parseFloat(num.toFixed(2));

module.exports = {
  formatNumber,
  average,
};
