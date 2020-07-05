const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next()
})
.get((req, res, next) => {
    res.end('This will view all dishes');
})
.post((req, res, next) => {
    res.end('This will add dish: ' + req.body.name + " with details: " + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('Cannot perform put operation on /dishes');
})
.delete((req, res, next) => {
    res.end('This will delete all dishes');
});

dishRouter.route('/:dishId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end('This will view the details of dish with id: ' + req.params.dishId);
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST Operation is not supported for: /dishes/' + req.params.dishId);
})
.put((req, res, next) => {
    res.write('Updating dish with id: ' + req.params.dishId + '\n');
    res.end("This will update the dish: " + req.body.name + " with the details: " + req.body.description);
})
.delete((req, res, next) => {
    res.end("This will delete the dish with id: " + req.params.dishId);
});

module.exports = dishRouter;