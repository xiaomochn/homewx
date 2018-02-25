//index.js
//获取应用实例
const app = getApp()
const AV = require('../../libs/av-weapp-min.js')
const util = require('../../utils/util.js')

Page({
  data: {
    motto: 'Hello World',
    statustext:"正在查询", 
    userInfo: {},
    allInfo:{},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap:function(){
    this.sendJpushMessage("opendoor\r\n")
  }, 
  sendJpushMessage: function(message) {
    wx.request({
      url: 'https://api.jpush.cn/v3/push', 
      method:'POST',
      data: {
        "platform": ["android"],
        "audience": "all",
        "message": {
          "msg_content": "mess",
          "extras":{
            "c": app.globalData.user.authData.lc_weapp.openid,
"d":"1",
            "e": message,
            "f": app.globalData.userAllInfo.userInfo.nickName
          }
        }
      },
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization':'Basic MDEyOGE3ZjU3MDdjY2YxYjQ1MWJhOGFhOjQ5NjAxMzM2NDk2NmQ0YmIyNTFjMWU3YQ=='
      },
      success: function (res) {
        console.log(res.data)
        wx.showToast({
          title: res.data.sendno,
          icon: 'success',
          duration: 2000
        })
      }
    })
    // wx.navigateTo({
    //   url: '../opent/opent'
    // }) 
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        allInfo: app.globalData.userAllInfo
      })

    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    this.loginInit()
   
  },
  // webscoket 服务启动
 
  realtimeMessageInit:function(currentuser){// 用户id 
 let  _this = this
 console.log(currentuser)
  app.globalData.realtime.createIMClient(currentuser).then( jerry=> {
      jerry.on('message', function (message, conversation) {
        console.log(message.content._lctext)
        let msg = message.content._lctext
        // let msginfo= {
        //   "allow":"门已开",
        //   "notallow": "门已锁" 

        // } 
       
        // console.log(msginfo.a)
         
        _this.setData({
          statustext : message.content._lctext
        })
      
       
        // this.message2Activity(message)
      });
    }).catch(console.error);
    


    // app.globalData.realtime.createIMClient(currentuser+"1").then(function (tom) {
    //   // 创建与Jerry之间的对话
    //   return tom.createConversation({
    //     members: [currentuser],
    //     name: 'Tom & Jerry',
    //   });
    // }).then(function (conversation) {
    //   // 发送消息 
    //   return conversation.send(new app.globalData.TextMessage('耗子，起床！'));
    // }).then(function (message) { 
    //   console.log('Tom & Jerry', '发送成功！');
    // }).catch(console.error);
  },

  message2Activity: function (message) {
    console.log(message)
  },
  loginInit:function(){

    AV.User.loginWithWeapp().then(user => {
      app.globalData.user = user.attributes;

      this.realtimeMessageInit(app.globalData.user.authData.lc_weapp.openid)
      wx.request({
        url: 'https://d.apicloud.com/mcm/api/homeuser?filter={"where":{"uuid":"' + app.globalData.user.authData.lc_weapp.openid + '"},"limit":3}',  
        method: 'GET',
        header: util.getheader(),
        success: res=> {  
          console.log("1111"+res.data[0].deviceid)
          if (res.data.length>0){
            this.realtimeMessageInit(res.data[0].deviceid)
            this.sendJpushMessage("statusn:lock\r\n")
          }
         
        }
      }) 
    }).catch(console.error);
  },
  
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
