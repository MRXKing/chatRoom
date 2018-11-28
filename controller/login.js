const router = require('koa-router')()
const mongodb = require('../model/mongodb').getInstance();
const rules = require('../commonJs/rules');


router.get('/', async (ctx, next) => {
  await ctx.render('login')
})
router.post('/login', async (ctx, next) => {
  const user_id = ctx.request.body.user_id;
  const pwd = ctx.request.body.pwd;
  const data = {
     user_id,
     pwd
  }
  let findUser_id = await mongodb.find('user',{user_id});
  if (findUser_id.length == 0 ) {
    ctx.status = 404;
    ctx.body = rules.json(1,'该账号不存在')
    return
  }
  let findUser = await mongodb.find('user',data);
  if (findUser.length == 0) {
     ctx.status = 404
     ctx.body = rules.json(1,"账号或密码错误");
     return
  }
  if (userList.indexOf(findUser[0]._id.toString()) != -1) {
    ctx.status = 404
    ctx.body = rules.json(1,"账号已经登录");
    return
  }
  const json = rules.json(0,"登陆成功");
  json.user_id = findUser[0]._id;
  ctx.body = json;
})

module.exports = router
