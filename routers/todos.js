const express = require('express');
const router = express.Router();

//Get Model
let Todo = require('../models/todo');

//add route
router.get('/add',function(req,res){
    res.render('add_todo',{
        title:'Add ToDo',
        act:'/todos/add'
    });
});

//Add Submit POST Route
router.post('/add',function(req,res){
    req.checkBody('title','Kenapa gk ada judul?').notEmpty();
    req.checkBody('desc','Isi sedikit saja untuk penjelasan').notEmpty();

    let errors = req.validationErrors();

    if(errors)
        res.render('add_todo',{
            title:'Add Todo',
            errors:errors
        });
    else{
        let todo = new Todo();
        todo.title = req.body.title;
        todo.desc = req.body.desc;
        todo.finish = false;
        console.log('Trying to submit '+req.body.title);
        todo.save(function(err){
            if(err){
                req.flash('failed',err);
                return;
            }else{
                req.flash('success','Todo Added');
                res.redirect('/');
            }
        });
    }
});


//add Detail route
router.get('/add/detail/:id',function(req,res){
    res.render('add_todo',{
        title:'Add Detail ToDo',
        act:'/todos/add/'+req.params.id
    });
});

//Add Detail Submit POST Route
router.post('/add/:id',function(req,res){
    req.checkBody('title','Kenapa gk ada judul?').notEmpty();
    req.checkBody('desc','Isi sedikit saja untuk penjelasan').notEmpty();
    console.log('Just Log');
    let errors = req.validationErrors();

    if(errors)
        res.render('add_todo',{
            title:'Add Todo',
            errors:errors
        });
    else{
        Todo.findById(req.params.id, function(err, todo){
            if(err){
                console.log(err);
            }else{
                todo.detail.push({ title:req.body.title,desc:req.body.desc,finish:false});
                todo.save(function (err) {
                    if (err){
                        req.flash('failed',err);
                        return;
                    }else{
                        console.log('Finish');
                        req.flash('success','Detail Todo Added');
                        res.redirect('/todos/'+req.params.id);
                    }
                  });
            }
        });
    }
});

//Search POST Route
router.post('/search',function(req,res){
    let regex = new RegExp(req.body.cari, "i");
    console.log('Searching for '+ regex);
    Todo.find({'title':regex},function(err,todo){
        if(err){
            console.log(err);
        }else{
            res.render('index',{
                title:'Todo',
                todos:todo
            });
            console.log(todo);
        }
    });
});



//Edit Todo Route
router.get('/edit/:id',function(req,res){
    console.log('Editing Todo with ID '+req.params.id);
    Todo.findById(req.params.id, function(err, todo){
        if(err){
            console.log(err);
        }else{
            res.render('edit_todo',{
                title:'Edit Todo',
                todo:todo,
                ref:'/todos/edit/'+todo._id
            });
        }
    });
});

//Edit Detail Todo Route
router.get('/edit/:id/:idd',function(req,res){
    console.log('Editing Todo with ID '+req.params.idd);
    Todo.findById(req.params.id, function(err, todo){
        let detail = todo.detail.id(req.params.idd);
        res.render('edit_todo',{
            title:'Edit Detail Todo',
            todo:detail,
            ref:'/todos/edit/'+todo._id+'/'+detail._id
        });
    });

});

//Todo Edit POST Route
router.post('/edit/:id',function(req,res){
    console.log('Updating');
    Todo.findByIdAndUpdate(req.params.id, {$set:req.body}, function(err, result){
        if(err){
            req.flash('failed',err);
            console.log(err);
        }
        req.flash('success','Todo Edited');
        res.redirect('/');
    });
});

//Todo Edit Detail POST Route
router.post('/edit/:id/:idd',function(req,res){
    console.log('Updating', req.params.id, req.params.idd);
    Todo.findById(req.params.id, function(err, todo){
        if(err){
            console.log(err);
        }else{
            todo.detail.id(req.params.idd).title=req.body.title;
            todo.detail.id(req.params.idd).desc=req.body.desc;
            todo.save(function (err) {
                if (err){
                    console.log('Error');
                    req.flash('failed',err);
                    return;
                }else{
                    console.log('Finish');
                    req.flash('success','Detail Todo Added');
                    res.redirect('/');
                }
              });
        }
    });
});

//Finish A Todo
router.get('/finish/:id',function(req,res){
    console.log('Updating');
    Todo.findByIdAndUpdate(req.params.id, {finish:true}, function(err, result){
        if(err){
            req.flash('failed',err);
            console.log(err);
        }
        req.flash('success','Todo Has Finished');
        res.redirect('/');
    });
});

//Finish/UnFinish Detail Todo
router.get('/finish/:id/:idd',function(req,res){
    console.log('Updating');
    Todo.findById(req.params.id, function(err, todo){
        if(err){
            console.log(err);
        }else{
            todo.detail.id(req.params.idd).finish=!todo.detail.id(req.params.idd).finish;
            todo.save(function (err) {
                if (err){
                    console.log('Error');
                    req.flash('failed',err);
                    return;
                }else{
                    console.log('Finish');
                    req.flash('success','Detail Todo Changed');
                    res.redirect('/todos/'+req.params.id);
                }
              });
        }
    });
});

//Unfinish A Todo
router.get('/unfinish/:id',function(req,res){
    console.log('Updating');
    Todo.findByIdAndUpdate(req.params.id, {finish:false}, function(err, result){
        if(err){
            req.flash('failed',err);
            console.log(err);
        }
        req.flash('success','Todo Has Unfinished');
        res.redirect('/');
    });
});

//Delete Function
router.delete('/:id',function(req,res){
    let query = {_id:req.params.id};
    Todo.remove(query, function(err){
        if(err) req.flash('failed',err);
    });
    req.flash('success','Todo Deleted');
    res.send('Success');
});

//Delete Detail Function
router.delete('/:id/:idd',function(req,res){
    Todo.findById(req.params.id, function(err, todo){
        if(err){
            console.log(err);
        }else{
            todo.detail.id(req.params.idd).remove();
            todo.save(function (err) {
                if (err){
                    console.log('Error');
                    req.flash('failed',err);
                    return;
                }else{
                    console.log('Finish');
                    req.flash('success','Detail Todo Deleted');
                    res.send('success');
                }
              });
        }
    });
});


//get Single Todo Route
router.get('/:id',function(req,res){
    Todo.findById(req.params.id, function(err, todo){
        if(err){
            console.log(err);
        }else{
            let refEdit = '/todos/edit/'+req.params.id;
            let ref = todo.finish?'/todos/unfinish/'+todo._id:'/todos/finish/'+todo._id;
            let stats = todo.finish?'Belum Selesai':'Selesai';
            res.render('todo',{
                title:todo.title,
                todo:todo,
                ref:ref,
                refEdit:refEdit,
                stats:stats
            });
            console.log(todo);
        }
    });
});

//get Single Detail Todo Route
router.get('/:id/:idd',function(req,res){
    Todo.findById(req.params.id, function(err, todo){
        if(err){
            console.log(err);
        }else{
            let detail = todo.detail.id(req.params.idd);
            let refEdit = '/todos/edit/'+req.params.id+'/'+req.params.idd;
            let ref ='/todos/finish/'+todo._id+'/'+detail._id;
            let stats = detail.finish?'Belum Selesai':'Selesai';
            res.render('todo',{
                title:todo.title,
                id:todo._id,
                todo:detail,
                ref:ref,
                refEdit:refEdit,
                stats:stats
            });
            console.log(detail);
        }
    });

});

module.exports = router;