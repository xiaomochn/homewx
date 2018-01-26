//app.js
const AV = require('./libs/av-weapp-min.js')
const Realtime = require('./libs/realtime.weapp.min.js').Realtime
App({
  
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
             
              this.globalData.userInfo = res.userInfo
              this.globalData.userAllInfo = res
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    AV.init({
      appId: 'NPPHU9xCMP2IRkkACQNOjt7f-gzGzoHsz',
      appKey: '0PC4OzV7L9vD7SnMbCxnNqSL',
    });
    this.globalData.realtime = new Realtime({
      appId: 'NPPHU9xCMP2IRkkACQNOjt7f-gzGzoHsz',
      appKey: '0PC4OzV7L9vD7SnMbCxnNqSL',
      region: 'cn', // 美国节点为 "us"
    });
    this.globalData.TextMessage = require('./libs/realtime.weapp.min.js').TextMessage
  },
  globalData: {
    userInfo: null,
    userAllInfo:null,
    user:null,
    realtime:null,
    TextMessage:null
  }
})