const router = require('koa-router')()
const mongodb = require('../model/mongodb').getInstance();
const rules = require('../commonJs/rules');


router.prefix('/checkSession')
router.get('/',async (ctx,next) => {
  if (!ctx.query['user_id']) {
    ctx.status = 404;
    ctx.body = rules.json(1,'user_id not found')
    return
  }
  const _id = mongodb.getObjectID(ctx.query['user_id']);
    let find =  await mongodb.find('user',{_id});
    if (userList.indexOf(find[0]._id.toString()) != -1 ) {
      ctx.status = 404;
      ctx.body = rules.json(1,'user is logining')
      return
    }
    if (find.length == 0) {
      ctx.status = 404;
      ctx.body = rules.json(1,'user_id not found')
      return
    }
    ctx.body = rules.json(0,'session is valid')
})

module.exports = router
