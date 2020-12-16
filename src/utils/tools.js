import moment from 'moment'
import store from '@/store'
export function getChildren(tree, id, leafStr = 'children') {
  for (let index = 0; index < tree.length; index++) {
    const element = tree[index]
    if (element.id === id) {
      return element[leafStr] || []
    } else if (element[leafStr] && element[leafStr].length > 0) {
      const a = getChildren(element[leafStr], id, leafStr)
      if (a && a.length > 0) {
        return a
      }
    } else {
      element[leafStr] = []
    }
  }
  return []
}
/**
 * 获取权限许可的路由表中的第一个路由
 * @param {*} arr
 */
export function getFirstRouterByMap(arr, count = 1) {
  let path = ''
  if (arr && arr.length > 0) {
    path = arr[0].path
    if (path !== '' && !path.startsWith('/')) {
      path = '/' + path
    }
    if (arr[0].children && count !== 0) {
      path += getFirstRouterByMap(arr[0].children, --count)
    }
  }
  return path
}

/**
 * 获取URL中的参数
 * @param {*} name
 */
export function GetQueryValue(name) {
  return (
    decodeURIComponent(
      (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(
        location.href
      // eslint-disable-next-line no-sparse-arrays
      ) || [, ''])[1].replace(/\+/g, '%20')
    ) || null
  )
}
export function isJSON(str) {
  if (typeof str === 'string') {
    try {
      var obj = JSON.parse(str)
      if (typeof obj === 'object' && obj) {
        return true
      } else {
        return false
      }
    } catch (e) {
      console.log('error：' + str + '!!!' + e)
      return false
    }
  }
  // console.log('It is not a string!')
}
export function isNumber(value) {
  return typeof value === 'number' && !isNaN(value)
}
export function isArray(val) {
  if (Array.isArray) {
    return Array.isArray(val)
  } else {
    return Object.prototype.toString.call(val) === '[object Array]'
  }
}

/**
 * 获取格式化时间
 * @param {*} date 原始时间
 * @param {*} model 格式化模式 默认YYYY-MM-DD HH:mm:ss
 */
export function getTime(date, model) {
  if (!date) {
    return ''
  } else if (model) {
    return moment(date).format(model)
  } else {
    return moment(date).format('YYYY-MM-DD HH:mm:ss')
  }
}
/**
 * 统计字符个数 规则：中文及中文标点4个字符 英文大写三个字符 英文小写两个字符 英文标点1个字符
 * @param {*} value
 */
export function getStrLength(value) {
  let count = 0
  value.split('').map(item => {
    if (
      item.match(/[\u4e00-\u9fa5]/g) ||
      item.match(
        /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/
      )
    ) {
      count += 4
    } else if (item.match(/[\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F]/g)) {
      count += 1
    } else if (item.match(/[A-Z]/)) {
      count += 3
    } else {
      count += 2
    }
  })
  return count
}
/**
 * 根据字符数裁剪字符串 规则：中文及中文标点4个字符 英文大写三个字符 英文小写两个字符 英文标点1个字符
 * @param {*} str
 * @param {*} word
 */
export function cutStrByWord(str, word) {
  let count = 0
  for (let index = 0; index < str.split('').length; index++) {
    const element = str.split('')[index]
    if (
      element.match(/[\u4e00-\u9fa5]/g) ||
      element.match(
        /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/
      )
    ) {
      count += 4
      if (count >= word) {
        return str.slice(0, index)
      }
    } else if (element.match(/[\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F]/g)) {
      count += 1
      if (count >= word) {
        return str.slice(0, index)
      }
    } else if (element.match(/[A-Z]/)) {
      count += 3
      if (count >= word) {
        return str.slice(0, index)
      }
    } else {
      count += 2
      if (count >= word) {
        return str.slice(0, index)
      }
    }
  }
  if (count < word) {
    return str
  }
}
/**
 * 距离目标日期的差值
 * @param {*} date 目标时间 时间戳
 * @param {*} type +：距离还有多少天 ，-：多少天之前，默认+
 * @param {*} mode detailed:详细模式，具体到时分秒的距离，normal:普通模式，只显示天数
 */
export function distanceDate(date, type, mode) {
  const day = 1000 * 60 * 60 * 24
  const hour = 1000 * 60 * 60
  const minute = 1000 * 60
  const second = 1000
  let value = date - moment().valueOf()
  let result = 0
  if (type && type === '-') {
    value = moment().valueOf() - date
  } else {
    value = date - moment().valueOf()
  }
  if (mode === 'detailed') {
    if (parseInt(value / day) === 0) {
      if (parseInt(value / hour) === 0) {
        if (parseInt(value / minute) === 0) {
          result =
            (parseInt(value / second) <= 0 ? 1 : parseInt(value / second)) +
            '秒'
        } else {
          result =
            (parseInt(value / minute) <= 0 ? 1 : parseInt(value / second)) +
            '分钟'
        }
      } else {
        result =
          (parseInt(value / hour) <= 0 ? 1 : parseInt(value / hour)) + '小时'
      }
    } else {
      result = (parseInt(value / day) <= 0 ? 1 : parseInt(value / day)) + '天'
    }
  } else {
    result =
      parseInt(value / day) < 1 && parseInt(value / day) > 0
        ? 1
        : parseInt(Math.ceil(value / day))
  }
  return result
}

/**
 * json转换异常抛出
 * @param {*} text
 */
export function jsonParse(text) {
  try {
    JSON.parse(text)
  } catch (error) {
    return text
  }
}
/**
 * 处理JSON转换数组，常用用例：上传图片'[]'形式的数据
 * @param {*} json
 */
export function getArrayFromJSON(json) {
  return json && isJSON(json) ? JSON.parse(json) : []
}

export function isEmptyObject(data) {
  return JSON.stringify(data) === '{}'
}

// 全屏
export function fullScreen(el) {
  var isFullscreen =
    document.fullScreen ||
    document.mozFullScreen ||
    document.webkitIsFullScreen
  if (!isFullscreen) {
    // 进入全屏
    (el.requestFullscreen && el.requestFullscreen()) ||
      (el.mozRequestFullScreen && el.mozRequestFullScreen()) ||
      (el.webkitRequestFullscreen && el.webkitRequestFullscreen()) ||
      (el.msRequestFullscreen && el.msRequestFullscreen())
  } else {
    // 退出全屏
    document.exitFullscreen
      ? document.exitFullscreen()
      : document.mozCancelFullScreen
        ? document.mozCancelFullScreen()
        : document.webkitExitFullscreen
          ? document.webkitExitFullscreen()
          : ''
  }
}

export function filterHTMLTag(msg) {
  var a = msg.replace(/<\/?[^>]*>/g, '') // 去除HTML Tag
  a = msg.replace(/[|]*\n/, '') // 去除行尾空格
  a = msg.replace(/&npsp;/gi, '') // 去掉npsp
  return a
}

export function delCookie(dom) {
  var keys = dom.cookie.match(/[^ =;]+(?==)/g)
  if (keys) {
    for (var i = keys.length; i--;) {
      // dom.cookie = keys[i] + '=0;path=/;domain=casicloud.com;expires=' + new Date(0).toUTCString() // 清除当前域名下的,例如：m.ratingdog.cn
      // dom.cookie = keys[i] + '=0;path=/;domain=developer2019.casicloud.com;expires=' + new Date(0).toUTCString() // 清除当前域名下的,例如：m.ratingdog.cn
      dom.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString() // 清除当前域名下的,例如：m.kevis.com
      dom.cookie =
        keys[i] +
        '=0;path=/;domain=' +
        dom.domain +
        ';expires=' +
        new Date(0).toUTCString() // 清除当前域名下的，例如 .m.kevis.com
      dom.cookie =
        keys[i] +
        '=0;path=/;domain=casicloud.com;expires=' +
        new Date(0).toUTCString() // 清除一级域名下的或指定的，例如 .kevis.com
      dom.cookie =
        keys[i] +
        '=0;path=/;domain=developer2019.casicloud.com;expires=' +
        new Date(0).toUTCString()
      dom.cookie = 'JSESSIONID=0;path=/;expires=' + new Date(0).toUTCString()
    }
  }
}

export function getImgFormJson(img, type) {
  if (img && isJSON(img)) {
    if (type) {
      if (JSON.parse(img).length > 0) {
        return JSON.parse(img)[0][type]
      } else {
        return ''
      }
    } else {
      return JSON.parse(img)
    }
  } else {
    return img || ''
  }
}

export function setObjKey(data, keyMap) {
  const objs = Object.keys(data).reduce((newData, key) => {
    const newKey = keyMap[key] || key
    newData[newKey] = data[key]
    return newData
  }, {})
  return objs
}
export function setArrayObjKey(data, name, keyName) {
  const newData = []
  let obj = {}
  data.map(item => {
    obj = item
    obj[name] = item[keyName]
    delete obj[keyName]
    newData.push(obj)
  })
  return newData
}

export function getParentCode(code, backType = 'all') {
  if (!code) {
    return
  }
  code = code + ''
  // debugger
  if (code.substring(2, 6) === '0000') {
    return backType === 'parent' ? null : backType === '1' ? code : (backType === '2' || backType === '3') ? null : [code]
  } else if (code.substring(4, 6) === '00') {
    return backType === 'parent' ? (code.substring(0, 2) + '0000') : backType === '1' ? (code.substring(0, 2) + '0000') : backType === '2' ? code : backType === '3' ? null : [code.substring(0, 2) + '0000', code]
  } else {
    return backType === 'parent' ? (code.substring(0, 4) + '00') : backType === '1' ? (code.substring(0, 2) + '0000') : backType === '2' ? (code.substring(0, 4) + '00') : backType === '3' ? code : [code.substring(0, 2) + '0000', code.substring(0, 4) + '00', code]
  }
}

export function hasPermission(key) {
  const roles = store.getters.roles
  if (roles.indexOf(-1) >= 0) return true
  return (roles.indexOf(key) !== -1)
}

export function floatObj() {
  /*
   * 判断obj是否为一个整数
   */
  function isInteger(obj) {
    return Math.floor(obj) === obj
  }

  /*
   * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
   * @param floatNum {number} 小数
   * @return {object}
   *   {times:100, num: 314}
   */
  function toInteger(floatNum) {
    var ret = { times: 1, num: 0 }
    if (isInteger(floatNum)) {
      ret.num = floatNum
      return ret
    }
    var strfi = floatNum + ''
    var dotPos = strfi.indexOf('.')
    var len = strfi.substr(dotPos + 1).length
    var times = Math.pow(10, len)
    var intNum = parseInt(floatNum * times + 0.5, 10)
    ret.times = times
    ret.num = intNum
    return ret
  }

  /*
   * 核心方法，实现加减乘除运算，确保不丢失精度
   * 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
   *
   * @param a {number} 运算数1
   * @param b {number} 运算数2
   * @param op {string} 运算类型，有加减乘除（add/subtract/multiply/divide）
   *
   */
  function operation(a, b, op) {
    var o1 = toInteger(a)
    var o2 = toInteger(b)
    var n1 = o1.num
    var n2 = o2.num
    var t1 = o1.times
    var t2 = o2.times
    var max = t1 > t2 ? t1 : t2
    var result = null
    switch (op) {
      case 'add':
        if (t1 === t2) {
          // 两个小数位数相同
          result = n1 + n2
        } else if (t1 > t2) {
          // o1 小数位 大于 o2
          result = n1 + n2 * (t1 / t2)
        } else {
          // o1 小数位 小于 o2
          result = n1 * (t2 / t1) + n2
        }
        return result / max
      case 'subtract':
        if (t1 === t2) {
          result = n1 - n2
        } else if (t1 > t2) {
          result = n1 - n2 * (t1 / t2)
        } else {
          result = n1 * (t2 / t1) - n2
        }
        return result / max
      case 'multiply':
        result = (n1 * n2) / (t1 * t2)
        return result
      case 'divide':
        if (a === '暂无') {
          return a
        } else {
          result = floatObj().multiply(n1 / n2, t2 / t1)
        }
        return result
    }
  }

  // 加减乘除的四个接口
  function add(a, b) {
    return operation(a, b, 'add')
  }

  function subtract(a, b) {
    return operation(a, b, 'subtract')
  }

  function multiply(a, b) {
    return operation(a, b, 'multiply')
  }

  function divide(a, b) {
    return operation(a, b, 'divide')
  }

  // exports
  return {
    add: add,
    subtract: subtract,
    multiply: multiply,
    divide: divide
  }
}
export function toFixed(num, s) {
  var times = Math.pow(10, s)
  var des = num * times + 0.5
  des = parseInt(des, 10) / times
  return des + ''
}

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的交集, 两个数组的元素为数值或字符串
 */
export const getIntersection = (arr1, arr2) => {
  let len = Math.min(arr1.length, arr2.length)
  let i = -1
  let res = []
  while (++i < len) {
    const item = arr2[i]
    if (arr1.indexOf(item) > -1) res.push(item)
  }
  return res
}

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的并集, 两个数组的元素为数值或字符串
 */
export const getUnion = (arr1, arr2) => {
  return Array.from(new Set([...arr1, ...arr2]))
}

/**
 * @param {Array} target 目标数组
 * @param {Array} arr 需要查询的数组
 * @description 判断要查询的数组是否至少有一个元素包含在目标数组中
 */
export const hasOneOf = (targetarr, arr) => {
  return targetarr.some(_ => arr.indexOf(_) > -1)
}

/**
 * @param {String|Number} value 要验证的字符串或数值
 * @param {*} validList 用来验证的列表
 */
export function oneOf (value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true
    }
  }
  return false
}

/**
 * @param {Number} timeStamp 判断时间戳格式是否是毫秒
 * @returns {Boolean}
 */
export const isMillisecond =( timeStamp) => {
  const timeStr = String(timeStamp)
  return timeStr.length > 10
}

/**
 * @param {Number} timeStamp 传入的时间戳
 * @param {Number} currentTime 当前时间时间戳
 * @returns {Boolean} 传入的时间戳是否早于当前时间戳
 */
export const isEarly = (timeStamp, currentTime) => {
  return timeStamp < currentTime
}

/**
 * @param {Number} num 数值
 * @returns {String} 处理后的字符串
 * @description 如果传入的数值小于10，即位数只有1位，则在前面补充0
 */
export const getHandledValue = num => {
  return num < 10 ? '0' + num : num
}

/**
 * @returns {String} 当前浏览器名称
 */
export const getExplorer = () => {
  const ua = window.navigator.userAgent
  const isExplorer = (exp) => {
    return ua.indexOf(exp) > -1
  }
  if (isExplorer('MSIE')) return 'IE'
  else if (isExplorer('Firefox')) return 'Firefox'
  else if (isExplorer('Chrome')) return 'Chrome'
  else if (isExplorer('Opera')) return 'Opera'
  else if (isExplorer('Safari')) return 'Safari'
}

/**
 * @description 绑定事件 on(element, event, handler)
 */
export const on = (function () {
  if (document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()

/**
 * @description 解绑事件 off(element, event, handler)
 */
export const off = (function () {
  if (document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
})()

/**
 * 判断一个对象是否存在key，如果传入第二个参数key，则是判断这个obj对象是否存在key这个属性
 * 如果没有传入key这个参数，则判断obj对象是否有键值对
 */
export const hasKey = (obj, key) => {
  if (key) return key in obj
  else {
    let keysArr = Object.keys(obj)
    return keysArr.length
  }
}

/**
 * @param {*} obj1 对象
 * @param {*} obj2 对象
 * @description 判断两个对象是否相等，这两个对象的值只能是数字或字符串
 */
export const objEqual = (obj1, obj2) => {
  const keysArr1 = Object.keys(obj1)
  const keysArr2 = Object.keys(obj2)
  if (keysArr1.length !== keysArr2.length) return false
  else if (keysArr1.length === 0 && keysArr2.length === 0) return true
  /* eslint-disable-next-line */
  else return !keysArr1.some(key => obj1[key] != obj2[key])
}
/**
 * @param {Array} array 表格数据二维数组
 * @returns {Object} { columns, tableData }
 * @description 从二维数组中获取表头和表格数据，将第一行作为表头，用于在iView的表格中展示数据
 */
export const getTableDataFromArray = (array) => {
  let columns = []
  let tableData = []
  if (array.length > 1) {
    let titles = array.shift()
    columns = titles.map(item => {
      return {
        title: item,
        key: item
      }
    })
    tableData = array.map(item => {
      let res = {}
      item.forEach((col, i) => {
        res[titles[i]] = col
      })
      return res
    })
  }
  return {
    columns,
    tableData
  }
}
export const forEach = (arr, fn) => {
  if (!arr.length || !fn) return
  let i = -1
  let len = arr.length
  while (++i < len) {
    let item = arr[i]
    fn(item, i, arr)
  }
}