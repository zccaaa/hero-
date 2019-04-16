// 导入 http 模块
const http = require('http')
// 导入 fs 模块
const fs = require('fs')
// 导入 path 模块
const path = require('path')
// 导入 url 模块
const url = require('url')
// 导入 querystring 模块
const querystring = require('querystring')
// 导入mysql模块
const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'test'
})

// 创建服务器
const server = http.createServer((request, response) => {
  // 获取请求的url
  let reqUrl = request.url
  // 请求方法
  const reqMethods = request.method
  // 接口1 url:/list method:GET
  if (reqUrl === '/list' && reqMethods === 'GET') {
    // 查询数据
    const sql = 'select * from cq'
    // 执行sql
    connection.query(sql, (error, results, fields) => {
      if (error) throw error
      // 转换为JSON并返回
      response.end(JSON.stringify(results))
    })
  }
  // 接口2 详情 url:/detail method:GET 参数:id
  // 这里修改判断的原因是 静态页中的 detail.html 也是这个名字
  else if (reqUrl.indexOf('/detail?id=') != -1 && reqMethods === 'GET') {
    // 获取url中的数据
    const sendData = url.parse(reqUrl, true)
    // console.log(sendData)
    // 获取id
    const id = sendData.query.id
    // 生成sql语句
    const sql = `select * from cq where id =${id} `
    connection.query(sql, (error, results, fields) => {
      if (error) throw error
      // 转换为JSON并返回 直接返回对象即可 不需要返回数组 节约用户使用代码
      response.end(JSON.stringify(results[0]))
    })
  }
  // 接口3 新增 url:/addhero method:POST 参数:heroName,heroIcon
  else if (reqUrl === '/addhero' && reqMethods === 'POST') {
    // 字符串
    let str = ''
    // 接收数据
    request.on('data', data => {
      str += data
    })
    // 数据接收完毕
    request.on('end', () => {
      // 解析数据 querystring
      let postData = querystring.parse(str)
      // console.log(postData);
      // sql语句
      let sql = `insert into cq (heroName,heroIcon) values('${
        postData.heroName
      }','${postData.heroIcon}')`
      // 保存到数据库
      connection.query(sql, (error, results, fields) => {
        if (error) throw error
        // 转换为JSON并返回 直接返回对象即可 不需要返回数组 节约用户使用代码
        // response.end(JSON.stringify(results[0]))
        // console.log(results)
        let backData = {
          msg: '数据插入成功',
          code: '200'
        }
        // obj ->json
        response.end(JSON.stringify(backData))
      })
    })
  }
  // 接收4 删除 url:/deletehero method:GET 参数:id
  else if (reqUrl.indexOf('/deletehero') != -1 && reqMethods === 'GET') {
    // 获取id
    // console.log(url.parse(reqUrl,true))
    let id = url.parse(reqUrl, true).query.id
    // sql
    let sql = `delete from cq where id = ${id}`
    connection.query(sql, (error, results, fields) => {
      if (error) throw error
      // 转换为JSON并返回 直接返回对象即可 不需要返回数组 节约用户使用代码
      console.log(results)
      let backData = {
        msg: '数据删除成功',
        code: '200'
      }
      // // obj ->json
      response.end(JSON.stringify(backData))
    })


  }
  // 如果不是请求接口
  else {
    if (reqUrl.indexOf('/detail.html') != -1) {
      reqUrl = '/detail.html'
    }

    // 根据url读取文件
    fs.readFile(path.join(__dirname, 'views', reqUrl), (err, data) => {
      if (!err) {
        // 存在 返回
        response.end(data)
      } else {
        // 不存在 404
        response.end('404 not found')
      }
    })
  }
})

// 开启监听
server.listen('4399', () => {
  console.log('success')
})