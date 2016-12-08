## 谈谈bigpipe

### 老生常谈：什么是bigpipe

+ 存在很久的一种技术
+ Facebook首创
+ 首屏快速加载的的异步加载页面方案
+ 前端性能优化的一个方向
+ 适合比较大型的，需要大量服务器运算的站点
+ 有效减少HTTP请求
+ 兼容多浏览器

### 能解决的问题
+ 下载阻塞
+ 服务器与浏览器算力浪费

一句话：`分块加载技术`

### 缺点
+ 不利于SEO搜索引擎

### 实现方式
> 一个重新设计的基础动态网页服务体系。

> 大体思路是，分解网页成叫做Pagelets的小块，然后通过Web服务器和浏览器建立管道并管理他们在不同阶段的运行。

> 不需要改变现有的网络浏览器或服务器，它完全使用PHP和JavaScript来实现。

### 关键技术点
HTTP 1.1引入分块传输编码
> ##### 注：HTTP分块传输编码允许服务器为动态生成的内容维持HTTP持久链接。

HTTP分块传输编码格式
> Transfer-Encoding: chunked
如果一个HTTP消息（请求消息或应答消息）的Transfer-Encoding消息头的值为chunked，那么，消息体由数量未定的块组成，并以最后一个大小为0的块为结束。

Nodejs自动开启 chunked encoding
>除非通过sendHeader()设置Content-Length头。



[demo]

### 怎么实现(这里只针对nodejs)
#### 1. 不使用任何框架的实现方式
    
    var http = require('http');
    var app = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html', 'charset': 'utf-8' });
    
        res.write('<br>loading...');
        timer(5, res);
    });

    app.listen(9090);
    
    console.log('server on 9090');
    
    var isEnd = false;
    /** 生成倒计时渲染 */
    function timer(num, res) {
        isEnd = false;
        var t = Math.floor(Math.random() * 10) * 3000;
    
        setTimeout(function () {
            if (isEnd) {
                return;
            }
            if (num == 1) {
                isEnd = true;
                res.end(`<div>last timer: ${t}ms</div>`);
            } else {
                res.write(`<div>timer${num} : ${t}ms</div>`);
            }
        }, t);
        if (num > 1) {
            timer(num - 1, res);
        }
    }
    
    /** 异常处理 */
    process.on('uncaughtException', function (err) {
        console.log(err);
    });
    
[demo]

##### 关键字
    res.write('xxxx');
    res.write('xxxx');
    res.write('xxxx');
    res.end('xxxx');
#### 2. express写法
    var express = require('express');
    var app = express();

    app.get('/', function(req, res){
    //   res.send('hello ');
    //   res.send(' world');
      res.write('hello');
      res.write('<br>dodo');
      res.end();
    });
    
    app.listen(9091);
    
    console.log('server on 9091');
    
[demo]
##### 关键字
> 为什么不用res.send?

因为res.send包括了res.write()和res.end()

#### 3. koa写法
    var koa = require('koa');
    var app = koa();
    var co = require('co');
    const Readable = require('stream').Readable;
    
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    
    app.use(function* () {
        /** 必须 */
        const view = new Readable();
        view._read = () => { };
    
        this.body = view;
        this.type = 'html';
        this.status = 200;
    
        view.push('loading...<br>')
    
        co(function* () {
            yield sleep(2000);
            view.push(`timer: 2000ms<br>`);
            yield sleep(5000);
            view.push(`timer: 5000ms<br>`);
            
            /** 结束传送 */
            view.push(null);
        }).catch(e => { });
    
    });
    
    app.listen(9092);
    
    console.log('server on 9092');
[demo]

##### 问题
> 为什么是按照顺序加载的,怎么能并发加载呢?

+ 这就需要用到promise了 `自行领悟`

参考资料
> [BigPipe：高性能的“流水线技术”网页](https://isux.tencent.com/bigpipe-pipelining-web-pages-for-high-performance.html)

> [nodejs实现bigpipe](https://yuguo.us/weblog/bigpipe-in-nodejs/)

> [nodejs 创建http server](http://blog.csdn.net/swingboard/article/details/43229895)

> [koa 和 bigpipe](http://tech.dianwoda.com/2016/10/26/big-pipe-web-page-rendering-acceleration/)
