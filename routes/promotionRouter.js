const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const promotions = require('../models/promotions');
const promotionRouter = express.Router();
promotionRouter.use(bodyParser.json());
const authenticate = require('../authenticate');

promotionRouter.route('/')
.get((req, res, next) => {
    promotions.find({})
    .then((promos) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promos);
    }, (err) => {
        next(err);
    })
    .catch((err) => {
        next(err);
    });
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    promotions.create(req.body)
    .then((promo) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo);
    }, (err) => {
        next(err);
    }) 
    .catch((err) => {
        next(err);
    });
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain')
    res.end('PUT operations are not supported for /promotions');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    promotions.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(resp);
    }, (err) => {
        next(err);
    })
    .catch((err) => {
        next(err);
    });
});

promotionRouter.route('/:promoId')
.get((req, res, next) => {
    promotions.findById(req.params.promoId)
    .then((promo) => {
        if(promo != null){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promo);
        }
        else{
            err = new Error('Promo ' + req.params.promoId + ' is not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => {
        next(err);
    })
    .catch((err) => {
        next(err);
    });
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain');
    res.end('POST operations are not supported for /promotions/' + req.params.promoId);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    promotions.findByIdAndUpdate(req.params.promoId, {
        $set: req.body
    }, {
        new: true
    })
    .then((promo) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo);
    }, (err) => {
        next(err);
    })
    .catch((err) => {
        next(err);
    });
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    promotions.findByIdAndRemove(req.params.promoId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => {
        next(err);
    })
    .catch((err) => {
        next(err);
    });
});

module.exports = promotionRouter;