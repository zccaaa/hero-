// 导入 爬虫模块
var Crawler = require('crawler')
// 导入mysql模块
var mysql = require('mysql')
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'test'
})

// 获取数据
var c = new Crawler({
  maxConnections: 10,
  // 数据获取之后的回调函数
  callback: function(error, res, done) {
    if (error) {
      console.log(error)
    } else {
      var $ = res.$
      // 入库
      $('tr').each((index, ele) => {
        // 获取名字
        const heroName = $(ele)
          .find('td>a')
          .text()
        // 获取图片地址
        const heroIcon = $(ele)
          .find('.hero-icon>a>img')
          .attr('src')
        // 非空判断
        if (heroName) {
          // 生成sql语句
          let insertSql = `insert into cq (heroName,heroIcon) values('${heroName}','${heroIcon}')`
          // 入库
          connection.query(insertSql, function(error, results, fields) {
            if (error) throw error
            console.log(results)
          })
        }
      })
    }
    done()
  }
})
// 请求数据
c.queue('http://wiki.joyme.com/cq/%E5%BC%93%E6%89%8B')

