const express = require('express');
const bodyParser = require('body-parser');

const promotionRouter = express.Router();
promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end('This will view all promotions to you');
})
.post((req, res, next) => {
    res.end('This will add a new promotion: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operations are not supported for /promotions');
})
.delete((req, res, next) => {
    res.end('This will delete all promotions');
});

promotionRouter.route('/:promoId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end('This will view details of promotion with id: ' + req.params.promoId);
})
.post((req, res, next) => {
    res.statusCode = 403
    res.end('POST operations are not supported for /promotions/' + req.params.promoId);
})
.put((req, res, next) => {
    res.write('Updating promotion with id: ' + req.params.promoId + '\n');
    res.end('This will update promotion: ' + req.body.name + ' with details: ' + req.body.description);
})
.delete((req, res, next) => {
    res.end('This will delete promotion with id: ' + req.params.promoId);
});

module.exports = promotionRouter;