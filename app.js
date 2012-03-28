
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , db = require('./config').db;

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.get('/insert/:contentId/:contentTitle/:contentDescription', function(req,res){
  res.send(req.params.contentTitle)

    db.collection('test').insert({contentId: req.params.contentId, contentTitle: req.params.contentTitle, contentDescription: req.params.contentDescription}, function(err, result) {
        console.log(result);
        // db.close(function() {
        //     console.log('connection closed');
        // });
    });

})

app.get('/admin/find/:contentId', function(req,res){

      db.collection('test').find({contentId:req.params.contentId}).toArray(function(err, result) {
            // console.log(result[0].contentTitle);
            res.render('test-output-editable.jade', { docId: result[0].contentId, title: result[0].contentTitle, content: result[0].contentDescription });

      });
})


app.get('/find/:contentId', function(req,res){

      db.collection('test').find({contentId:req.params.contentId}).toArray(function(err, result) {
            // console.log(result[0].contentTitle);
            res.render('test-output.jade', { docId: result[0].contentId, title: result[0].contentTitle, content: result[0].contentDescription });

      });
})



app.get('/view', function(req, res){
    res.render('test-output.jade', { title: 'My Site', info: 'site info' });
});

app.listen(process.env.PORT || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
