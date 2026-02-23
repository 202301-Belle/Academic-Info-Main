// pages/index/index.js

const authUtil = require('../../utils/auth.js');

// 页面路由常量
const PAGE_ROUTES = {
  SEARCH: '/pages/search/search',
  TUTOR_LIBRARY: '/pages/tutor-library/tutor-library',
  RESEARCH_MATCH: '/pages/research-match/research-match',
  COOP_MINING: '/pages/coop-mining/coop-mining',
  FAVORITES: '/pages/favorites/favorites'
};

// 防抖延迟时间（毫秒）
const SEARCH_DEBOUNCE_DELAY = 300;

Page({
  data: {
    showActionSheet: false,
    showCoopSheet: false,
    newsList: [
      {
        id: 1,
        title: '中国"人造太阳"EAST创造"亿度千秒"世界纪录',
        desc: '中国科学院等离子体物理研究所团队成功实现1亿摄氏度1066秒高质量燃烧，标志我国聚变能源研究从基础科学向工程实践重大跨越，为人类加快实现聚变发电奠定基础'
      },
      {
        id: 2,
        title: '中南大学湘雅医院龚学军、李宜雄教授团队',
        desc: '在胰腺癌诊治领域连续发表《Molecular Cancer》《Research》等高水平研究，构建微生物组-代谢组相互作用网络，开发无创CT影像纤维化量化模型'
      },
      {
        id: 3,
        title: '北华大学经管学院实现国家级项目双突破',
        desc: '高俊峰副教授获2025年国家社科基金一般项目《人工智能赋能网络暴力信息特征识别与风险治理研究》，徐雪娇副教授获教育部人文社科青年基金项目'
      },
      {
        id: 4,
        title: '零碳制氢技术连发《自然》《科学》',
        desc: '北京大学马丁团队开发新型催化剂，从源头消除二氧化碳排放，实现高产率氢气生产，为零碳排放工业制氢奠定科学基础'
      },
      {
        id: 5,
        title: '华中农大发现水稻耐高温"开关"',
        desc: '科研团队发现关键基因QT12，导入商业品种后在夜间高温条件下产量提升78%，为全球变暖背景下保障粮食安全提供新方案'
      }
    ]
  },

  /**
   * 页面加载时触发
   */
  onLoad(options) {
    // 初始化防抖定时器（存储在实例属性而非data中，避免不必要的响应式更新）
    this.searchTimer = null;
    // 可以在这里加载新闻数据
    // this.loadNewsList();
    console.log('页面加载完成，数据:', this.data);
    console.log('页面参数:', options);
    
    // 确保数据正确初始化
    if (!this.data.newsList || this.data.newsList.length === 0) {
      console.warn('新闻列表为空');
    }
  },

  /**
   * 页面显示时触发
   */
  onShow() {
    console.log('页面显示，当前数据:', this.data);
  },

  /**
   * 页面渲染完成时触发
   */
  onReady() {
    console.log('页面渲染完成');
  },

  /**
   * 搜索处理（带防抖）
   */
  onSearch(e) {
    const keyword = (e.detail?.value || '').trim();
    if (!keyword) {
      return;
    }

    // 清除之前的定时器
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
      this.searchTimer = null;
    }

    // 设置防抖，延迟后执行搜索
    this.searchTimer = setTimeout(() => {
      this.navigateToPage(PAGE_ROUTES.SEARCH, { keyword });
      this.searchTimer = null;
    }, SEARCH_DEBOUNCE_DELAY);
  },

  /**
   * 打开查导师弹窗
   */
  openActionSheet() {
    this.setData({ showActionSheet: true });
  },

  /**
   * 关闭查导师弹窗
   */
  closeActionSheet() {
    this.setData({ showActionSheet: false });
  },

  /**
   * 关闭所有弹窗
   */
  closeAllSheets() {
    this.setData({ 
      showActionSheet: false, 
      showCoopSheet: false 
    });
  },

  /**
   * 阻止默认滚动行为（用于遮罩层）
   */
  preventDefault() {
    // 阻止遮罩层下的滚动
    return false;
  },

  /**
   * 导航到搜索页面
   */
  navigateToSearch() {
    if (!authUtil.checkLogin('/pages/index/index')) {
      return;
    }
    this.closeActionSheet();
    this.navigateToPage(PAGE_ROUTES.SEARCH);
  },

  /**
   * 导航到院校导师库
   */
  navigateToTutorLibrary() {
    if (!authUtil.checkLogin('/pages/index/index')) {
      return;
    }
    this.closeActionSheet();
    this.navigateToPage(PAGE_ROUTES.TUTOR_LIBRARY);
  },

  /**
   * 打开查合作弹窗
   */
  navigateToCoop() {
    if (!authUtil.checkLogin('/pages/index/index')) {
      return;
    }
    this.setData({ showCoopSheet: true });
  },

  /**
   * 导航到研究领域匹配
   */
  navigateToResearchMatch() {
    if (!authUtil.checkLogin('/pages/index/index')) {
      return;
    }
    this.closeAllSheets();
    this.navigateToPage(PAGE_ROUTES.RESEARCH_MATCH);
  },

  /**
   * 导航到学术合作挖掘
   */
  navigateToCoopMining() {
    if (!authUtil.checkLogin('/pages/index/index')) {
      return;
    }
    this.closeAllSheets();
    this.navigateToPage(PAGE_ROUTES.COOP_MINING);
  },

  /**
   * 导航到收藏页面
   */
  navigateToFav() {
    if (!authUtil.checkLogin('/pages/index/index')) {
      return;
    }
    this.navigateToPage(PAGE_ROUTES.FAVORITES);
  },

  /**
   * 通用页面导航方法
   * @param {string} url - 页面路径
   * @param {object} params - 查询参数对象
   */
  navigateToPage(url, params = {}) {
    if (!url) {
      console.warn('导航失败：页面路径为空');
      return;
    }

    try {
      // 构建查询字符串
      const queryString = Object.keys(params)
        .filter(key => params[key] !== null && params[key] !== undefined && params[key] !== '')
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
      
      const fullUrl = queryString ? `${url}?${queryString}` : url;
      
      wx.navigateTo({
        url: fullUrl,
        fail: (err) => {
          console.error('页面跳转失败:', err);
          wx.showToast({
            title: '页面跳转失败',
            icon: 'none',
            duration: 2000
          });
        }
      });
    } catch (error) {
      console.error('导航错误:', error);
      wx.showToast({
        title: '操作失败',
        icon: 'none',
        duration: 2000
      });
    }
  },

  /**
   * 图片加载错误处理
   */
  onImageError(e) {
    console.error('图片加载失败:', e.detail);
  },

  /**
   * 页面卸载时清理定时器
   */
  onUnload() {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
      this.searchTimer = null;
    }
  }
})
