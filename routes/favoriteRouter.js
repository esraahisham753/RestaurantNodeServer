const express = require('express');
const bodyParser = require('body-parser');
const Favorites = require('../models/favorite');
const Dishes = require('../models/dishes');
const authenticate = require('../authenticate');
const cors = require('./cors');
const {ObjectId} = require('mongodb');

const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());


favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res, next) => {
    res.sendStatus(200);
})
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({user: ObjectId(req.user._id)})
    .populate('user')
    .populate('dishes')
    .then((docs) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(docs)
    }, (err) => next(err))
    .catch((err) => next(err));
    
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: ObjectId(req.user._id)})
    .then((fav) => {
        if(fav == null){
            Favorites.create({user: ObjectId(req.user._id), dishes: []})
            .then((doc) => {
                req.body.forEach(dish => {
                    return Dishes.findById(dish._id)
                    .then((dish) => {
                        if(dish){
                            doc.dishes.push(ObjectId(dish._id));
                            doc.save()
                            .then((doc) => {
                                res.statusCode = 200;
                                res.setHeader("Content-Type", "application/json");
                                res.json(doc);
                            })
                            .catch((err) => next(err));
                        }
                        else{
                            var err = new Error("Trying to add a non-existing dish");
                            err.status = 403;
                            return next(err);
                        }
                    });
                });
            });
        }
        else{
            req.body.forEach(dish => {
                return Dishes.findById(dish._id)
                .then((dish) => {
                    if(dish){
                        if(fav.dishes.indexOf(dish._id) > -1){
                            console.log('fav exists');
                        }
                        else{
                            fav.dishes.push(ObjectId(dish._id));
                        }
                        fav.save()
                        .then((doc) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(doc);
                        })
                        .catch((err) => next(err));
                    }
                    else{
                        var err = new Error("Trying to add a non-existing dish");
                        err.status = 403;
                        return next(err);
                    }
                });
            });
        }
    })
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Cannot perform PUT operations on /favorite');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.deleteOne({user: ObjectId(req.user._id)})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp)
    }, (err) => next(err))
    .catch((err) => next(err));
});

favoriteRouter.route('/:dishId')
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: ObjectId(req.user._id)})
    .then((doc) => {
        if(doc == null){
            Favorites.create({user: ObjectId(req.user._id), dishes: []})
            .then((createdDoc) => {
                Dishes.findById(req.params.dishId)
                .then((dish) => {
                    if(dish){
                        createdDoc.dishes.push(ObjectId(dish._id));
                        createdDoc.save()
                        .then((savedDoc) => {
                            res.statusCode = 200;
                            res.setHeader('Contnet-Type', 'application/json');
                            res.json(savedDoc)
                        })
                        .catch((err) => next(err));
                    }
                    else{
                        var err = new Error('Trying to add a non-existing dish');
                        err.status = 403;
                        return next(err);
                    }
                })
                .catch((err) => next(err));
            })
            .catch((err) => next(err));
        }
        else{
            Dishes.findById(req.params.dishId)
            .then((dish) => {
                if(dish){
                    console.log(doc.dishes.indexOf(dish._id));
                    if(doc.dishes.indexOf(dish._id) > -1){
                        console.log('Dish exists');
                    }
                    else{
                        doc.dishes.push(ObjectId(dish._id));
                    }
                    doc.save()
                    .then((savedDoc) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(savedDoc);
                    })
                    .catch((err) => next(err));
                }
                else{
                    var err = new Error('Trying to add a non-existing dish');
                    err.status = 403;
                    return next(err);
                }
            })
            .catch((err) => next(err))
        }
    })
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: ObjectId(req.user._id)})
    .then((fav) => {
        if(fav){
            const index = fav.dishes.indexOf(req.params.dishId);
            if(index > -1){
                fav.dishes.splice(index, 1);
                fav.save()
                .then((savedFav) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(savedFav);
                })
                .catch((err) => next(err));
            }
            else{
                var err = new Error('Trying to delete a non-existing dish');
                err.status = 403;
                return next(err);
            }
        }
        else{
            var err = new Error('You do not have any favorite to delete');
            err.status = 403;
            return next(err);
        }
    })
    .catch((err) => next(err));
});

module.exports = favoriteRouter