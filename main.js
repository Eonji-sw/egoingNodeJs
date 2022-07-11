var http = require('http');
var fs = require('fs'); // 모듈 fs : nodejs의 모듈인 파일 시스템
var url = require('url'); // 모듈 url
var qs = require('querystring'); // 모듈 querystring
var template = require('./lib/template.js');
var path = require('path');

var app = http.createServer(function(request, response){ // nodejs로 웹 브라우저 접속이 들어올 때마다 createServer의 콜백함수 호출, request는 웹 브라우저가 요청할 때 보낸 정보, response는 응답할 때 웹 브라우저에게 전송할 정보
    var _url = request.url; // query
    // url.parse(_url, true) : 주어진 url 정보를 분석
    var queryData = url.parse(_url, true).query; // query 객체 -> { id : 값 }
    var pathname = url.parse(_url, true).pathname;

    if(pathname === '/'){
      if(queryData.id === undefined) { // home일 경우
        fs.readdir('./data', (err, filelist)=>{
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = template.list(filelist);
          var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
          );
          response.writeHead(200); // 파일을 성공적으로 전송
          response.end(html);
        })
      } else {
        fs.readdir('./data', (err, filelist)=>{
          var filteredId = path.parse(queryData.id).base;
          fs.readFile(`data/${filteredId}`, 'utf8', (err, description)=>{
            var title = queryData.id;
            var list = template.list(filelist);
            var html = template.HTML(title, list,
              `<h2>${title}</h2>${description}`,
              `<a href="/create">create</a>
               <a href="/update?id=${title}">update</a>
               <form action="/delete_process" method="post">
                <input type="hidden" name="id" value="${title}">
                <input type="submit" value="delete">
               </form>`
            );
            response.writeHead(200);
            response.end(html);
          });
        });
      }
    } else if(pathname === '/create') { // create 버튼 눌렀을 경우
      fs.readdir('./data', (err, filelist)=>{
        var title = 'WEB - create';
        var list = template.list(filelist);
        var html = template.HTML(title, list, `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `, '');
        response.writeHead(200);
        response.end(html);
      });
    } else if(pathname === '/create_process') { // create 페이지 submit 버튼 눌렀을 경우
      var body = '';
      request.on('data', function(data){
        body += data; // 콜백 함수가 실행될 때마다 데이터를 추가(정보가 조각조각 들어옴)
      });
      request.on('end', function(){
        var post = qs.parse(body); // post 전체 정보 -> 정보 객체화
        var title = post.title;
        var description = post.description;
        fs.writeFile(`data/${title}`, description, 'utf8', (err)=>{
          response.writeHead(302, {Location: `/?id=${title}`}); // 페이지를 해당 주소로 리다이렉션
          response.end();
        })
      });
    } else if(pathname === '/update') { // update 버튼 눌렀을 경우
      fs.readdir('./data', (err, filelist)=>{
        var filteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredId}`, 'utf8', (err, description)=>{
          var title = queryData.id;
          var list = template.list(filelist);
          var html = template.HTML(title, list,
            `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
          );
          response.writeHead(200);
          response.end(html);
        });
      });
    } else if(pathname === '/update_process') { // update 페이지 submit 버튼 눌렀을 경우
      var body = '';
      request.on('data', function(data){
        body += data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var description = post.description;
        fs.rename(`data/${id}`, `data/${title}`, (err)=>{
          fs.writeFile(`data/${title}`, description, 'utf8', (err)=>{
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
          })
        });
      });
    } else if(pathname === '/delete_process') { // delete 버튼 눌렀을 경우
      var body = '';
      request.on('data', function(data){
        body += data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var filteredId = path.parse(id).base;
        fs.unlink(`data/${filteredId}`, (err)=>{
          response.writeHead(302, {Location: `/`}); // home으로 보내기
          response.end();
        })
      });
    } else {
      response.writeHead(404); // 파일을 찾을 수 없는 경우
      response.end('Not found');
    }
});
app.listen(3000);
