var http = require('http');
var fs = require('fs'); // 모듈 fs : nodejs의 모듈인 파일 시스템
var url = require('url'); // 모듈 url

function templateHTML(title, list, body){
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    <a href="/create">create</a>
    ${body}
  </body>
  </html>
  `;
}

function templateList(filelist){ // 글 목록
  var list = '<ul>';
  var i = 0;
  while(i < filelist.length) {
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i += 1;
  }
  list = list + '</ul>';
  return list;
}

var app = http.createServer(function(request,response){
    var _url = request.url; // query
    // url.parse(_url, true) : 주어진 url 정보를 분석
    var queryData = url.parse(_url, true).query; // query 객체 -> { id : 값 }
    var pathname = url.parse(_url, true).pathname;

    if(pathname === '/'){
      if(queryData.id === undefined) { // home일 경우
        fs.readdir('./data', (err, filelist)=>{
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = templateList(filelist);
          var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
          response.writeHead(200); // 파일을 성공적으로 전송
          response.end(template);
        })
      } else {
        fs.readdir('./data', (err, filelist)=>{
          fs.readFile(`data/${queryData.id}`, 'utf8', (err, description)=>{
            var title = queryData.id;
            var list = templateList(filelist);
            var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
            response.writeHead(200); // 파일을 성공적으로 전송
            response.end(template);
          });
        });
      }
    } else if(pathname === '/create') {
      fs.readdir('./data', (err, filelist)=>{
        var title = 'WEB - create';
        var list = templateList(filelist);
        var template = templateHTML(title, list, `
          <form action="http://localhost:3000/process_create" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `);
        response.writeHead(200); // 파일을 성공적으로 전송
        response.end(template);
      })
    } else {
      response.writeHead(404); // 파일을 찾을 수 없는 경우
      response.end('Not found');
    }
});
app.listen(3000);
