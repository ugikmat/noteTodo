let mongoose = require('mongoose');

let detailSchema= mongoose.Schema({

    title:{
        type:String,
        required: true
    },
    desc:{
        type:String,
        required:true
    },
    finish:{
        type:Boolean,
        required:true
    }
});

let todoSchema = mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    desc:{
        type:String,
        required:true
    },
    finish:{
        type:Boolean,
        required:true
    },
    detail: [detailSchema]
});

let Todo = module.exports = mongoose.model('Todo',todoSchema);