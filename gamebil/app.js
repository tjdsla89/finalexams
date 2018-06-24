// import modules
var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// connect mongodb
mongoose.connect('mongodb://localhost/games');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected");
});
db.on("error",function (err) {
  console.log("DB ERROR :", err);
});

// model 스키마 정의
var postSchema = mongoose.Schema({
  title: {type:String, required:true},
  Releasedate: {type:Date, default:Date.now},
  production : {type:String, required:true},
  developer : {type:String, required:true},
  body: {type:String, required:true},
  createdAt: {type:Date, default:Date.now},
  updatedAt: Date
});

var Post = mongoose.model('games',postSchema);

// view setting
app.set("view engine", 'ejs');

// set middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'assets')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

// set routes
app.get('/games', function(req,res){
  Post.find({}).sort('-createdAt').exec(function (err, games) {
    if(err) return res.json({success:false, message:err});
    res.render("games/index", {data:games});
  });
}); // index

app.get('/games/new', function(req, res){
  res.render("games/new");
}); //새글 쓰기 화면

app.post('/games', function(req, res){
  console.log(req.body); 
  if (!req.body.post) {
    return fail = 'alert';
  }
  Post.create(req.body.post, function (err, post) {
    if(err) return res.json({success:false, message:err});
    res.redirect('/games');
  });
}); // 글 추가

app.get('/games/:id', function(req,res){
  Post.findById(req.params.id, function (err, post) {
    if(err) return res.json({success:false, message:err});
    res.render("games/show", {data:post});
  });
}); // 글 상세보기

app.get('/games/:id/edit', function(req,res){
  Post.findById(req.params.id, function (err, post) {
    if(err) return res.json({success:false, message:err});
    res.render("games/edit", {data:post});
  });
}); // 글 수정하기

app.put('/games/:id', function(req, res){
  req.body.post.updatedAt = Date.now();
  Post.findByIdAndUpdate(req.params.id, req.body.post, function (err, post) {
    if(err) return res.json({success:false, message:err});
    res.redirect('/games/' + req.params.id);
  });
}); //글 업데이트

app.delete('/games/:id', function(req, res){
  Post.findByIdAndRemove(req.params.id, function (err, post) {
    if(err) return res.json({success:false, message:err});
    res.redirect('/games');
  });
}); //글 삭제

// start server
app.listen(3000, function() {
  console.log('Server Start');
});
 