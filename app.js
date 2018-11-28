const Koa = require('koa')
const WebSocket = require('ws');
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors')
const session = require('koa-session')
const compress = require('koa-compress')
const convert = require('koa-convert');
const staticCache = require('koa-static-cache')
const http = require('http');
const utils = require('./commonJs/util.js');
const util = new utils();
const path = require('path');
const mongodb = require('./model/mongodb').getInstance();

//router
const index = require('./controller/index')
const login = require('./controller/login')
const register = require('./controller/register')
const checkSession = require('./controller/checkSession')


// error handler
onerror(app)

// middlewares
app.use(compress({
  threshold: 1024,
  flush: require('zlib').Z_SYNC_FLUSH
}))
// app.use(convert(staticCache(path.join(__dirname, 'public'), {
//     maxAge: 365 * 24 * 60 * 60
// })))
app.use(cors({
  origin: function(ctx) {
    if (ctx.method == 'OPTION') {
      ctx.body = '';
    }
    return '*';
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 86400,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE','OPTION'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.keys = ['mrxkin'];
const CONFIG = {
  key:'koa-session',
  maxAge:86400000,
  renew:true //session 快过期时请求会重新设置session
  // rolling:true   每次请求都重新设置session
  //httpOnly:true 只有服务器端可以获取cookie
};
app.use(session(CONFIG,app))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(login.routes(), login.allowedMethods())
app.use(register.routes(), register.allowedMethods())
app.use(checkSession.routes(),checkSession.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});
const server = http.createServer(app.callback())
const wss = new WebSocket.Server({server})
global.userList = [];
wss.on('connection',(ws)=>{
    ws.on('message',async (msg) => {
         const data = JSON.parse(msg);

        if (util.search(userList,data.user_id)) {
          userList.push(data.user_id)
        }
        let  _id = mongodb.getObjectID(data.user_id);
        let find = await mongodb.find('user',{_id})
          if (data.check == 0) { //有人进入,就给所有人发送进来的信息(包括本人)
            let id = userList.indexOf(data.user_id)
            Array.from(wss.clients).forEach((value,index) => {
              if (id == index) {
                userList.map(async(value,index) => {
                    let  _id = mongodb.getObjectID(value);
                  let finds = await mongodb.find('user',{_id})
                  Array.from(wss.clients)[id].send(JSON.stringify({
                    "user_id": `${finds[0].user_id}`,
                    "check":`${data.check}`,
                    "user_num":`${userList.length}`
                  }))
                })

              }else {
                Array.from(wss.clients)[index].send(JSON.stringify({
                  "user_id": `${find[0].user_id}`,
                  "check":`${data.check}`,
                  "user_num":`${userList.length}`
                }))
              }
            })
          }else if (data.check == 2 ) {  //发送用户评论
              let id = userList.indexOf(data.user_id);

              Array.from(wss.clients).forEach((value,index) => { //自己发的
                if (id == index) {
                  Array.from(wss.clients)[index].send(JSON.stringify({  //<script>alert("1")</script>
                    "user_id": `${find[0].user_id}`,
                    "data":`${data.msg.replace(/[<">']/g, (a) => {
                        return {
                            '<': '&lt;',
                            '"': '&quot;',
                            '>': '&gt;',
                            "'": '&#39;'
                        }[a]
                })}`, //<div style = "list-style-image:url(javascript:alert(‘xSS‘))">
                    "check":`${data.check}`,
                    "who":'1'
                  }))
                }else { //别人发的
                  Array.from(wss.clients)[index].send(JSON.stringify({
                    "user_id": `${find[0].user_id}`,
                    "data":`${data.msg.replace(/[<">']/g, (a) => {
                        return {
                            '<': '&lt;',
                            '"': '&quot;',
                            '>': '&gt;',
                            "'": '&#39;'
                        }[a]
                      })}`,
                    "check":`${data.check}`,
                    "who":'2'
                  }))
                }
              })
          }
        ws.on('close',() => {
          util.remove(userList,data.user_id) //退出从列表中删除
          wss.clients.forEach(function each(client){
            client.send(JSON.stringify({
              "user_id": `${find[0].user_id}`,
              "check":"1",
              "user_num":`${userList.length}`
            }))
          })
        })
    })
})
module.exports = server
