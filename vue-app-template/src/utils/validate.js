
/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 手机号码*/
export function validatePhone(rule, value, callback) {
  if (value !== '' && value != null) {
    const isPhone = /^1(3|4|5|7|8)\d{9}$/
    const isMob = /^(0\d{2,3}\-)?([2-9]\d{6,7})+(\-\d{1,6})?$/ // 座机格式  区号之后用'-'隔开
    if (!isPhone.test(value) && !isMob.test(value)) {
      callback(new Error('请输入正确的手机号码'))
    } else {
      callback()
    }
  } else {
    callback(new Error('请输入手机号码'))
  }
} // 仅支持1-20

/* 手机号码 + 座机号*/
export function validatePhoneHome(rule, value, callback) {
  if (value !== '' && value != null) {
    const reg = /^1(3|4|5|7|8)\d{9}$/
    const reg1 = /^0\d{2,3}-?\d{7,8}$/
    if (!reg.test(value) && !reg1.test(value)) {
      callback(new Error('请输入正确手机号或座机号'))
    } else {
      callback()
    }
  } else {
    if (rule.required) {
      callback(new Error(rule.message))
    } else {
      callback()
    }
  }
}

/**
 * 邮箱
 */
export function validateEmail(rule, value, callback) {
  if (value !== '' && value != null) {
    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!reg.test(value)) {
      callback(new Error('请输入正确的电子邮箱'))
    } else {
      callback()
    }
  } else {
    callback(new Error('请输入电子邮箱'))
  }
}
