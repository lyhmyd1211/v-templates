import Mock from 'mockjs'
import { parseTime } from '../src/utils/index'
// 环境
const data1 = Mock.mock({
  'items|30': [{
    id: '@id',
    display_time: Mock.Random.now(),
    wendu: '@float(1, 30)',
    shidu: '@integer(50, 100)',
    twendu: '@integer(0, 20)',
    tshidu: '@integer(20, 30)',
    tph: '@float(5, 8, 1)',
    lx: '@integer(100, 60000)',
    fengsu: '@float(4, 8, 1)',
    fx: '@integer(160, 200)',
    ppm: '@integer(300, 990)',
    jiangyu: '@integer(0, 100)',
    daqi: '@float(10, 300, 1, 9)',
    pm: '@integer(20, 70)',
    us: '@integer(30, 5000)',
    'status|1': ['published', 'draft', 'deleted']
  }]
})
// 灾害
const data2 = Mock.mock({
  'items|30': [{
    id: '@id',
    'name|1': ['冰雹灾害', '地质灾害'],
    'garden|1': ['园区A', '园区B'],
    display_time: Mock.Random.now(),
    area: '@integer(10, 200)亩',
    count: '@integer(1, 6)张',
    reduct: '@integer(50, 99)%',
    'remark|1': ['受灾严重', '受灾重']
  }]
})
// 设备
const data3 = {
  items: [{
    id: 1,
    number: 'NB-IOT001',
    name: '土壤传感器',
    type: '土壤盐分',
    inter: 'TJGZNYSQ02',
    online: 1,
    remark: '合理异常',
    status: '1'
  }, {
    id: 2,
    number: 'NB-IOT002',
    name: '土壤传感器',
    type: '土壤PH',
    inter: 'TJGZNYSQ02',
    online: 1,
    remark: '合理异常',
    status: '1'
  }, {
    id: 3,
    number: 'NB-IOT003',
    name: '温湿度传感器',
    type: '空气湿度',
    inter: 'TJGZNYSQ02',
    online: 1,
    remark: '合理异常',
    status: '1'
  }, {
    id: 4,
    number: 'NB-IOT004',
    name: '传感器模组&探头',
    type: '光照度',
    inter: 'TJGZNYSQ02',
    online: 1,
    remark: '合理异常',
    status: '1'
  }, {
    id: 5,
    number: 'NB-IOT005',
    name: '气体类传感器',
    type: '二氧化碳浓度',
    inter: 'TJGZNYSQ02',
    online: 1,
    remark: '合理异常',
    status: '1'
  }, {
    id: 6,
    number: 'NB-IOT006',
    name: '气象类传感器',
    type: '降雨量',
    inter: 'TJGZNYSQ02',
    online: 1,
    remark: '合理异常',
    status: '1'
  }, {
    id: 7,
    number: 'NB-IOT007',
    name: '气象类传感器',
    type: '风速',
    inter: 'TJGZNYSQ02',
    online: 1,
    remark: '合理异常',
    status: '1'
  }, {
    id: 8,
    number: 'NB-IOT008',
    name: '气象类传感器',
    type: '风向',
    inter: 'TJGZNYSQ02',
    online: 1,
    remark: '合理异常',
    status: '1'
  }, {
    id: 9,
    number: 'NB-IOT009',
    name: '气体类传感器',
    type: '大气压力',
    inter: 'TJGZNYSQ02',
    online: 1,
    remark: '异常明显，请及时解决',
    status: '1'
  }, {
    id: 10,
    number: 'NB-IOT010',
    name: '水质类传感器',
    type: '水质',
    inter: 'TJGZNYSQ02',
    online: 1,
    remark: '异常明显，请及时解决',
    status: '1'
  }, {
    id: 11,
    number: 'NB-IOT011',
    name: '噪声扬尘监测',
    type: 'PM2.5',
    inter: 'TJGZNYSQ02',
    online: 1,
    remark: '合理异常',
    status: '1'
  }, {
    id: 12,
    number: 'NB-IOT012',
    name: '噪声扬尘监测',
    type: '环境噪音',
    inter: 'TJGZNYSQ02',
    online: 1,
    remark: '异常明显，请及时解决',
    status: '1'
  }]
}
// 产品
const data4 = Mock.mock({
  'items|30': [{
    id: '@id',
    'name|1': ['黄桃', '猕猴桃'],
    'level|1': ['一级', '二级'],
    display_time: Mock.Random.now(),
    chuhuo: '@integer(10, 2000)',
    ma: '@integer(1, 6)次',
    ping: '@integer(50, 999)条',
    'garden|1': ['园区A', '园区B'],
    'status|1': ['启用', '未启用']
  }]
})
function getTemp(hour) {
  if (hour >= 0 && hour <= 8) {
    return Mock.Random.float(15, 20)
  } else if (hour > 9 && hour <= 16) {
    return Mock.Random.float(25, 30)
  } else {
    return Mock.Random.float(20, 25)
  }
}
export default [{
  url: '/table/list1',
  type: 'get',
  response: config => {
    const items = data1.items
    return {
      code: 20000,
      data: {
        total: items.length,
        items: items.map((r, idx) => {
          const time = new Date(r.display_time) - idx * Mock.Random.integer(9000000, 100000000)
          const wendu = getTemp(new Date(time).getHours())
          const twendu = wendu - Mock.Random.float(0.1, 2)
          return Object.assign({}, r, {
            time,
            wendu,
            twendu
          })
        })
      }
    }
  }
}, {
  url: '/table/list2',
  type: 'get',
  response: config => {
    const items = data2.items
    return {
      code: 20000,
      data: {
        total: items.length,
        items: items.map((r, idx) => {
          return Object.assign({}, r, {
            type: r.name.slice(0, 2),
            time1: new Date('2020-04-12') - idx * Mock.Random.integer(9000000, 10000000),
            time2: new Date('2020-04-13') - idx * Mock.Random.integer(9000000, 100000000)
          })
        })
      }
    }
  }
}, {
  url: '/table/list3',
  type: 'get',
  response: config => {
    const items = data3.items
    return {
      code: 20000,
      data: {
        total: items.length,
        items: items.map((r, idx) => {
          return Object.assign({}, r, {
            time: new Date().getTime() - idx * Mock.Random.integer(9000000, 10000000)
          })
        })
      }
    }
  }
}, {
  url: '/table/list4',
  type: 'get',
  response: config => {
    const items = data4.items
    return {
      code: 20000,
      data: {
        total: items.length,
        items: items.map((r, idx) => {
          const time = new Date().getTime() - idx * Mock.Random.integer(9000000, 10000000)
          const display_time = parseTime(time)
          return Object.assign({}, r, {
            time,
            display_time
          })
        })
      }
    }
  }
}]

