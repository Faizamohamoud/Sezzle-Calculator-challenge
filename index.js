const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const DbManager = require('node-json-db');
const DBConfiguration = require('node-json-db/dist/lib/JsonDBConfig');
let io = null;

let db = new DbManager.JsonDB(new DBConfiguration.Config("myDb", true, false, '/'));

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/index.html'));
    //res.sendFile(path.join(__dirname + '/index.html'));
});

router.get('/add/:number', function (req, res) {
    io.emit('calc', req.params.number);
    try {
        let records = db.getData("/list");
        let arr = records.results;
        arr.push(req.params.number);
        db.push("/list", { arr: arr }, false);
    }
    catch (ex) {
        let arr = [];
        arr.push(req.params.number);
        db.push("/list", { arr: arr }, false);
    }

    res.json({ status: 'success' });
});

router.get('/view', function (req, res) {
    res.json(db.getData("/list"));
});

router.get('/refresh', function (req, res) {
    db.delete('/list');
    res.json({ status: 'success' });
});

app.use('/', router);
app.use('/', express.static(__dirname + '/src/static'));
const port = process.env.PORT || 3000
const server = app.listen(port);

//const server = require('http').createServer(app);
io = require('socket.io')(server);
io.on('connection', () => {
    console.log("client connected :)")
});

console.log('Running at Port ', port);
