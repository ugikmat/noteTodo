const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');


mongoose.connect('mongodb://localhost/nodekb',{
    user:'mat',
    pass:'password'
});
let db = mongoose.connection;

//check connection
db.once('open',function(){
    console.log('Connected to MongoDB');
});

//check for db error
db.on('error',function(err){
    console.log(err);
});
//init app
const app = express();

app.use('/js',express.static(__dirname+'/js'));

//parser app/x-www-form-urlencode
app.use(bodyParser.urlencoded({extended: false}));

//parse application/json
app.use(bodyParser.json());


//setup bootstrap
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/js', express.static(__dirname + '/node_modules/popper.js/dist')); // redirect JS popper.js

//Express Session Middleware
app.use(session({
    secret:'keyboard cat',
    resave:true,
    saveUninitialized:true
}));

//Express Messages
app.use(require('connect-flash')());
app.use(function(req,res,next){
    res.locals.messages = require('express-messages')(req,res);
    next();
});

//Express Validator
app.use(expressValidator({
    errorFormatter: function (param,msg,value){
        var namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;

        while(namespace.length){
            formParam+='[' + namespace.shift()+']';
        }
        return{
            param:formParam,
            msg:msg,
            value:value
        };
    }
}));

//bring model
let Todo = require('./models/todo');

//load view engine
app.set('views', path.join(__dirname,'views'));
app.set('view engine','pug');

//home route
app.get('/',function(req,res){
    Todo.find({},function(err,todo){
        if(err){
            console.log(err);
        }else{
            res.render('index',{
                title:'Todo List',
                finish:'Finished',
                todos:todo
            });
            // console.log(todo);
        }
    });
});

// Route Files
let todos = require('./routers/todos');
app.use('/todos',todos);

//start server
app.listen(3000,function(){
    console.log('App Started at port 3000...');
});