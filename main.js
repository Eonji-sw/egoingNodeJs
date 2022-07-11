var http = require('http');
var fs = require('fs'); // 모듈 fs : nodejs의 모듈인 파일 시스템
var url = require('url'); // 모듈 url

var app = http.createServer(function(request,response){
    var _url = request.url; // query
    // url.parse(_url, true) : 주어진 url 정보를 분석
    var queryData = url.parse(_url, true).query; // query 객체 -> { id : 값 }
    var pathname = url.parse(_url, true).pathname;

    if(pathname === '/'){
      if(queryData.id === undefined) { // home일 경우
        fs.readFile(`data/${queryData.id}`, 'utf8', (err, description)=>{
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var template = `
          <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            <ul>
              <li><a href="/?id=HTML">HTML</a></li>
              <li><a href="/?id=CSS">CSS</a></li>
              <li><a href="/?id=JavaScript">JavaScript</a></li>
            </ul>
            <h2>${title}</h2>
            <p>${description}</p>
          </body>
          </html>
          `;
          response.writeHead(200); // 파일을 성공적으로 전송
          response.end(template);
        });
      } else {
        fs.readFile(`data/${queryData.id}`, 'utf8', (err, description)=>{
          var title = queryData.id;
          var template = `
          <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            <ul>
              <li><a href="/?id=HTML">HTML</a></li>
              <li><a href="/?id=CSS">CSS</a></li>
              <li><a href="/?id=JavaScript">JavaScript</a></li>
            </ul>
            <h2>${title}</h2>
            <p>${description}</p>
          </body>
          </html>
          `;
          response.writeHead(200); // 파일을 성공적으로 전송
          response.end(template);
        });
      }
    } else {
      response.writeHead(404); // 파일을 찾을 수 없는 경우
      response.end('Not found');
    }


});
app.listen(3000);
