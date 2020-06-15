/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}
// 全屏
export function fullScreen(el) {
  var isFullscreen =
    document.fullScreen ||
    document.mozFullScreen ||
    document.webkitIsFullScreen;
  if (!isFullscreen) {
    // 进入全屏
    (el.requestFullscreen && el.requestFullscreen()) ||
      (el.mozRequestFullScreen && el.mozRequestFullScreen()) ||
      (el.webkitRequestFullscreen && el.webkitRequestFullscreen()) ||
      (el.msRequestFullscreen && el.msRequestFullscreen());
  } else {
    // 退出全屏
    document.exitFullscreen
      ? document.exitFullscreen()
      : document.mozCancelFullScreen
      ? document.mozCancelFullScreen()
      : document.webkitExitFullscreen
      ? document.webkitExitFullscreen()
      : "";
  }
}
/**
 * 转换文件大小单位
 * @param {*} fileByte byte大小
 * @param {*} toFixedNum 保留小数位 
 */
export function getFileSize(fileByte,toFixedNum=2) {
  if (!fileByte) return;
  let fileSizeByte = fileByte;
  let fileSizeMsg = "";
  if (fileSizeByte < 1048576) fileSizeMsg = (fileSizeByte / 1024).toFixed(toFixedNum) + "KB";
  else if (fileSizeByte == 1048576) fileSizeMsg = "1MB";
  else if (fileSizeByte > 1048576 && fileSizeByte < 1073741824) fileSizeMsg = (fileSizeByte / (1024 * 1024)).toFixed(toFixedNum) + "MB";
  else if (fileSizeByte > 1048576 && fileSizeByte == 1073741824) fileSizeMsg = "1GB";
  else if (fileSizeByte > 1073741824 && fileSizeByte < 1099511627776) fileSizeMsg = (fileSizeByte / (1024 * 1024 * 1024)).toFixed(toFixedNum) + "GB";
  else fileSizeMsg = "文件超过1TB";
  return fileSizeMsg;
}

