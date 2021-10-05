var http = require("http");
var fs = require("fs");
var url = require("url");
let qs = require('querystring')

let template = {
	HTML: function (title, list, body, control) {
		return `
          <!doctype html>
          <html>
          <head>
            <title>WEB - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body style="background-color: black; color:white;">
            <h1><a href="/">WEB</a></h1>
            ${list}            
            ${control}
            ${body}
          </body>
          </html>
          `;
	},
	List: function (filelist) {
		var list = "<ul>";
		var i = 0;
		while (i < filelist.length) {
			list = list + `<li style="font-color:000"><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
			i = i + 1;
		}
		list = list + "</ul>";
		return list;
	}
}


//request = 요청시에 브라우저가 보낸 정보
//response = 응답시에 브라우저로 보낸 정보
var app = http.createServer(function (request, response) {
	var _url = request.url;
	var queryData = url.parse(_url, true).query;
	var pathname = url.parse(_url, true).pathname;
	console.log(`패스네임 : ${pathname}`);
	if (pathname === "/") {

		if (queryData.id === undefined) {
			fs.readdir("./data", function (error, filelist) {
				var title = "Welcome";
				var description = "Hello, Node.js";
				var List = template.List(filelist)
				var html = template.HTML(
					title,
					List,
					`<h2>${title}</h2>${description}`,
					`<a href="/create">create</a>`
				);
				response.writeHead(200);
				response.end(html);
			});
		} else {
			fs.readdir("./data", function (error, filelist) {
				var title = "Welcome";
				var description = "Hello, Node.js";
				let subTitle = "글 생성";

				fs.readFile(`data/${queryData.id}`, "utf8", function (err, description) {
					var title = queryData.id;

					var list = template.List(filelist);
					var html = template.HTML(
						title,
						list,
						`<h2>${title}</h2>${description}`,
						`<a href="/create">create</a> 
						<a href="/update?id=${title}">update</a>
						<form action="delete_process" method="post">
							<input type="hidden" name="id" value="${title}">
							<input type="submit" value="delete">
						</form> 
						`
					);
					response.writeHead(200);
					response.end(html);
				});
			});
		}
	}
	//create
	else if (pathname === "/create") {
		console.log("글 생성");
		fs.readdir("./data", function (error, filelist) {
			var title = "WEB - create";
			var list = template.List(filelist);
			var html = template.HTML(
				title,
				list,
				`<form action="/create_process" method="post">
                    <p><input type="text" name="title" placeholder="타이틀"></p>
                    <p><textarea name="description" placeholder="본문"></textarea></p>
                    <p><input type="submit"></p>
                </form>
                `, '');
			response.writeHead(200);
			response.end(html);
		});
	}
	//글 생성 프로세스
	else if (pathname === "/create_process") {
		//post 데이터가 담길 변수 선언
		let body = "";

		request.on("data", (data) => {
			//post로 전송받은 data를 넣는다.
			body = body + data;
		});

		//데이터가 끝나면?
		request.on("end", () => {
			let post = qs.parse(body);
			let title = post.title;
			let description = post.description;
			console.log(title, description);

			fs.writeFile(`data/${title}`, description, 'utf-8', (err) => {
				if (err) throw err;
				console.log('파일 에러');
				response.writeHead(302, {
					Location: `/?id=${title}`
				});
				response.end();
			});
		});
	}
	//업데이트
	else if (pathname === '/update') {
		fs.readdir("./data", function (error, filelist) {
			var title = "Welcome";
			var description = "Hello, Node.js";
			let subTitle = "글 생성";

			fs.readFile(`data/${queryData.id}`, "utf8", function (err, description) {
				var title = queryData.id;

				var list = template.List(filelist);
				var html = template.HTML(
					title,
					list,
					`
				<form action="/update_process" method="post">
					<input type="hidden" name="id" value="${title}">
					<p><input type="text" name="title" placeholder="타이틀" value="${title}"></p>
					<p><textarea name="description" placeholder="본문" >${description}</textarea></p>
					<p><input type="submit"></p>
				</form>	
				`,
					`<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
				);
				response.writeHead(200);
				response.end(html);
			});
		});
	}
	//업데이트 프로세스
	else if (pathname === '/update_process') {
		//post 데이터가 담길 변수 선언
		let body = "";
		request.on("data", (data) => {
			//post로 전송받은 data를 넣는다.
			body = body + data;
		});

		//데이터가 끝나면?
		request.on("end", () => {
			let post = qs.parse(body);
			let id = post.id
			let title = post.title;
			let description = post.description;
			console.log("POST is =  " + id, title);

			fs.rename(`data/${id}`, `data/${title}`, (err) => {
				if (err) {
					console.log('에러');
				} else {
					fs.writeFile(`data/${title}`, description, "utf-8", (err) => {
						if (err) throw err;
						console.log("파일 에러");
						response.writeHead(302, {
							Location: `/?id=${title}`,
						});
						response.end();
					});
				}
			})
		});
	}
	//delete process
	else if (pathname === '/delete_process') {
		let body = "";
		request.on("data", (data) => {
			body = body + data;
		});

		request.on("end", () => {
			let post = qs.parse(body);
			let id = post.id;
			fs.unlink(`data/${id}`, (err) => {
				if (err) {
					console.log('delete ERROR');
				}
				response.writeHead(302, {
					Location: `/`
				});
				response.end();
			})
		});
	} else {
		response.writeHead(404);
		response.end("Not found");
	}
});
app.listen(3000);