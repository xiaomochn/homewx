const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const sha1 = require('sha1.min.js')
const getheader =str=>{
  let now = Date.now();
  let appKey = sha1.hex_sha1("A6970328512280UZ" + "A411EB7A-E27D-E60F-EB23-F893EF978E06UZ" + now) + "." + now
  return {
    "X-APICloud-AppId": "A6970328512280",
    "X-APICloud-AppKey": appKey,
    "Content-Type": 'application/json'
  }
}

module.exports = {
  formatTime: formatTime,
  getheader: getheader
}
