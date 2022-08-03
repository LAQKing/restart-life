// miniprogram/pages/liferestart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageId: '0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.length>0){
      this.setData({
        pageId: options.id
      })
    }


    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  onHide(){
    if (this.data.pageId == '1') {
      wx.redirectTo({
        url: '../../index/index',
      })
    }
  },
  onUnload() {
    if (this.data.pageId == '1') {
      wx.redirectTo({
        url: '../../index/index',
      })
    }
  },
  toRanking(e) {
    wx.navigateTo({
      url: 'ranking'
    })
  },
  toTalents(e) {
    wx.navigateTo({
      url: '../talents/talents'
    })
  },
  onShareTimeline(e) {
    return {
      title: "人生重开模拟器"
    }
  },
  onShareAppMessage: function () {
    return {
      title: '人生重开模拟器'
    }
  },
})