// import parseTime, formatTime and set to filter
export {
  parseTime,
  formatTime
}
  from '@/utils'
import {
  getTime,
  getStrLength,
  cutStrByWord,
  distanceDate,
  isJSON
} from '@/utils/tools'
/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [{
    value: 1E18,
    symbol: 'E'
  },
  {
    value: 1E15,
    symbol: 'P'
  },
  {
    value: 1E12,
    symbol: 'T'
  },
  {
    value: 1E9,
    symbol: 'G'
  },
  {
    value: 1E6,
    symbol: 'M'
  },
  {
    value: 1E3,
    symbol: 'k'
  }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num, fixed = 0) {
  return (+num || 0).toFixed(fixed).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

/** 时间格式化过滤器 */
const timeFormatter = (value, model) => {
  return getTime(value, model)
}
/**
 * lookup下拉框过滤器
 * @param {*} value 返回的原始的值
 * @param {*} lookup 请求的lookup的数组
 * @param {*} field 对应的字段映射{key:'',label:''}形式
 */
const lookupFormatter = (value, lookup, field = {
  key: 'key',
  label: 'value'
}, splitCode = '，') => {
  if (Array.isArray(value)) {
    const tmpData = []
    value.map(el => {
      const filterData = lookup && lookup.filter(item => {
        // eslint-disable-next-line eqeqeq
        return item[field.key] == el
      })[0]
      if (filterData) {
        tmpData.push(filterData[field.label])
      }
    })
    return tmpData.join(splitCode)
  } else {
    const filterData = lookup && lookup.filter(item => {
      // eslint-disable-next-line eqeqeq
      return item[field.key] == value
    })[0]
    return filterData ? filterData[field.label] : ''
  }
}
const noDataFormatter = value => {
  // eslint-disable-next-line eqeqeq
  return value && value != '' ? value : '暂无'
}
/**
 * 多行文本省略过滤器 规则：中文及中文标点4个字符 英文两个字符 英文标点1个字符
 * @param {*} value
 * @param {*} word 字符数
 */
const multLineEllFormatter = (value, word) => {
  if (!value) {
    return ''
  }
  if (getStrLength(value) > word) {
    return cutStrByWord(value, word) + '...'
  } else {
    return value
  }
}
/**
 * 距离目标日期的差值过滤器
 * @param {*} date 目标时间 时间戳
 * @param {*} type +：距离还有多少天 ，-：多少天之前，默认+
 * @param {*} mode detailed:详细模式，具体到时分秒的距离，normal:普通模式，只显示天数
 */
const deadLineFormatter = (value, type, mode) => {
  if (!value) {
    return ''
  }
  return distanceDate(value, type, mode)
}

/**
 * 数字对应数组转换字符串
 * @param {*} value 返回的数值
 * @param {*} list 请求的数组
 * 支持key，value形式
 */
const valueForSting = (value, list) => {
  if (value && list) {
    let str = ''
    list.forEach(r => {
      // eslint-disable-next-line eqeqeq
      if (r.key == value) return (str = r.value)
    })
    return str
  } else {
    return ''
  }
}
/**
 * 指定对应的值显示对应文本
 * @param {*} value
 * @param {*} target 对应的值
 * @param {*} text 要显示的文本
 */
const customerText = (value, target, text) => {
  // eslint-disable-next-line eqeqeq
  if (value == target) {
    return text
  } else {
    return value
  }
}

// JSON转换
const parseToFormatter = value => {
  if (value && isJSON(value)) {
    return JSON.parse(value)
  } else {
    if (value) {
      return value
    } else {
      return ''
    }
  }
}
// 转换为万单位
const parseToWan = (value, accuracy) => {
  if (!value) {
    return 0
  } else if (accuracy) {
    return (value / 10000).toFixed(accuracy)
  } else {
    return value / 10000
  }
}

export {
  timeFormatter,
  lookupFormatter,
  noDataFormatter,
  multLineEllFormatter,
  deadLineFormatter,
  valueForSting,
  customerText,
  parseToFormatter,
  parseToWan
}
