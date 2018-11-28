const router = require('koa-router')()
const mongodb = require('../model/mongodb').getInstance()
const rules = require('../commonJs/rules');

router.prefix('/register')
router.get('/index',async (ctx,next) => {
   await ctx.render('register')
})
router.post('/', async (ctx, next) => {
  const user_id = ctx.request.body.user_id;
  const pwd = ctx.request.body.pwd;
  if (!rules.check_user_id(user_id.length)) {
       ctx.status = 404;
       ctx.body = rules.json(1,'账号长度应为6-16');
       return
  }else if (pwd.length < 6) {
       ctx.status = 404;
       ctx.body = rules.json(1,'密码长度应大于6');
       return
  }else if (!rules.test(user_id) || !rules.test(pwd) || !rules.test2(user_id)) {
       ctx.status = 404;
       ctx.body = rules.json(1,'账号密码应为英文数字账号不能是纯数字');
       return
  }
  let find = await mongodb.find('user',{user_id});
  if (find.length != 0) {
     ctx.status = 404;
     ctx.body = rules.json(1,'该账号已经存在');
     return
  }
  const data = {
    user_id,
    pwd
  }
  await mongodb.insert('user',data);
  ctx.body = rules.json(0,'注册成功');
})



module.exports = router
