const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end('This will view all leaders for you');
})
.post((req, res, next) => {
    res.end('This will add a new leader: ' + req.body.name + 'with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operations are not supported for /leaders');
})
.delete((req, res, next) => {
    res.end('This will delete all leaders');
});

leaderRouter.route('/:leaderId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end('This will view leader with id: ' + req.params.leaderId);
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operations are not supported for /leaders/' + req.params.leaderId);
})
.put((req, res, next) => {
    res.write('Updating leader with id: ' + req.params.leaderId + '\n');
    res.end('This will update leader: ' + req.body.name + ' with details: ' + req.body.description);
})
.delete((req, res, next) => {
    res.end('This will delete leader with id: ' + req.params.leaderId);
});

module.exports = leaderRouter;