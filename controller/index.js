const router = require('koa-router')()
const mongodb = require('../model/mongodb').getInstance();

router.prefix('/homepage')

router.get('/', async (ctx, next) => {
  await ctx.render('index')
})


module.exports = router
