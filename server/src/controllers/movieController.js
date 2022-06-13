const mongoose = require('mongoose');
const movieModel = require('../models/dbModel')(mongoose)

exports.list_movies =  (req,res)=>{
    movieModel.find().exec((err,doc)=>{
        if(err){
            res.send(err);
        }
        res.json(doc);
    })
}

exports.read_movie = (req,res)=>{
    movieModel.findById(req.params.id).exec((err,doc)=>{
        if(err){
            res.send(err);
        }
        res.json(doc);
    })
}

exports.create_movie =  (req,res)=>{
    const Movie = new movieModel(req.body);
    Movie.save((err,doc)=>{
        if(err){
            res.send(err);
        }
        res.json(doc);
    })
}

exports.update_movie = (req,res)=>{
    movieModel.findByIdAndUpdate(req.params.id,req.body,{new: true},(err,doc)=>{
        if(err){
            res.send(err);
        }
        res.json(doc);
    })
}

exports.delete_movie = (req,res)=>{
    movieModel.findByIdAndDelete(req.params.id,(err,doc)=>{
        if(err){
            res.send(err);
        }
        res.json("movie deleted");
    })
}

//Debu Bose
exports.querydb = (req,res)=>{
    movieModel.find((err,doc)=>{
        if(err){
            res.send(err);
        }
        res.json(doc);
    }).
        where('actors').in(req.query.actor).
        where('year').gte(req.query.fromyear).lte(req.query.toyear)
        /*.exec((err,doc)=>{
        if(err){
            res.send(err);
        }
        res.json(doc);
    })*/
}

//movieModel.find().where("year").gte().exec(function)