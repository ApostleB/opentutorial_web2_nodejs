module.exports = {
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
      list =
        list +
        `<li style="font-color:000"><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
      i = i + 1;
    }
    list = list + "</ul>";
    return list;
  },
};

