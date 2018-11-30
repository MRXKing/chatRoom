# chatRoom
Chat room based on node framework koa2 + WS + PM2



#### Build Setup

``` bash
# install dependencies
npm install

# install pm2
npm install pm2 -g

# start
pm2 start bin/www --name chatRoom --watch

#Boot self starting from windows
npm install pm2-windows-startup -g
pm2-startup install
pm2 start bin/www --name chatRoom --watch
pm2 save

#browser rum at localhost:3000
```
