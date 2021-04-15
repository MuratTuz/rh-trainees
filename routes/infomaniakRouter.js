

var express = require('express');
var infomaniakRouter = express.Router();

var createObjectTree = require('../services/createObjectTree');

//body-parser.json() has been depreciated
infomaniakRouter.use(express.json());


infomaniakRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end('Not supported yet!');
    })
    .post((req, res, next) => {
        /*         console.log(req.body);
                Object.entries(req.body).map(([key, value]) => {
                    objectTree = createObjectTree(objectTree, key, value);
                }) */
        const objectTree = createObjectTree(req.body)
        res.end(JSON.stringify(objectTree));
    });


module.exports = infomaniakRouter;



