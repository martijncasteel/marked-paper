var fs = require('fs');
var marked = require('marked');
var chokidar = require('chokidar');

// Constructor
function post( markdown ) {
  var file = markdown.match(/\/([a-z\-]+).md/)

  if(file == null)
    return

  fs.readFile( markdown, 'utf8', function(err, data) {
    var object = data.split(/\-{3}[\r|\n]/)

    if(object[0] === undefined || object[1] === undefined)
      return false;

    var json = post._json( file[1], object[0] )
    if( post._html( file[1], object[1] )){

      // update json file
      var list = JSON.parse(process.env.posts)
      list.push(json)

      process.env.posts = JSON.stringify(list)
      fs.writeFile('./.cache/.posts', process.env.posts, function(err) {
        if (err)
          console.log(err)
      });
    }
  })
}

// static methods
post.update = function( markdown ) {
  var file = markdown.match(/\/([a-z\-]+).md/)

  if(file == null)
    return

  fs.readFile( markdown, 'utf8', function(err, data) {
    var object = data.split(/\-{3}[\r|\n]/)

    if(object[0] === undefined || object[1] === undefined)
      return false;

    var json = post._json( file[1], object[0] )
    if( post._html( file[1], object[1] )){

      // update json file
      var list = JSON.parse(process.env.posts)
      var index = list.findIndex(function( item ) {
        if( item.file == file[1] + '.html' )
          return true;
        return false;
      })

      if(index >= 0)
        list[index] = json
      else
        list.push(json)

      process.env.posts = JSON.stringify(list)
      fs.writeFile('./.cache/.posts', process.env.posts, function(err) {
        if (err)
          console.log(err)
      })
    }
  })
};

post.delete = function( markdown ) {
  var file = markdown.match(/\/([a-z\-]+).md/)

  if(file == null)
    return

  // update json file
  var list = JSON.parse(process.env.posts)
  var index = list.findIndex(function( item ) {
    if( item.file == file[1] + '.html' )
      return true;
    return false;
  })

  if(index < 0)
    return

  fs.unlink('./.cache/' + file + '.html', function( err ) {
    list.splice(index, 1)

    process.env.posts = JSON.stringify(list)
    fs.writeFile('./.cache/.posts', process.env.posts, function(err) {
      if (err)
        console.log(err)
    })
  })
};


/* function for parsing the markdown file */
post._json = function( file, text ) {
  var obj = {
    'file': file + '.html'
  }

  text.split(/\r|\n/).forEach(function(item) {

    if( item == '' )
      return;

    // match key and value
    var array = item.match(/([a-z]+)\: ?(.+)/)
    obj[array[1]] = array[2]
  });

  return obj;
};

post._html = function( file, text ) {
  fs.writeFile('./.cache/' + file + '.html', marked(text), function(err) {
    if (err){
      console.log(err)
      return false;
    }
  });

  return true;
};

/* watch file changes in the post directory */
var watcher = chokidar.watch('./posts/', {
  ignoreInitial: true,
  depth: 0
});

watcher
  .on('add', path => new post( path ))
  .on('change', path => post.update( path ))
  .on('unlink', path => post.delete( path ));

// export the class
module.exports = post;
