var http = require('http');

var app = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html', 'charset': 'utf-8' });

    res.write('<br>loading...');
    timer(5, res);
});



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

module.exports = function () {
    app.listen(9090);

    console.log('server on 9090');
};