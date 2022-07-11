var http = require('http');
var fs = require('fs');
var url = require('url'); // 모듈 url

var app = http.createServer(function(request,response){
    var _url = request.url; // query
    var queryData = url.parse(_url, true).query; // 객체 -> { id : 값 }
    if(_url == '/'){
      _url = '/index.html';
    }
    if(_url == '/favicon.ico'){
      return response.writeHead(404);
    }
    response.writeHead(200);
    response.end(queryData.id);

});
app.listen(3000);
