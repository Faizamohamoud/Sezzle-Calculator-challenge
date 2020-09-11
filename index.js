const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const DbManager = require('node-json-db');
const DBConfiguration = require('node-json-db/dist/lib/JsonDBConfig');

let db = new DbManager.JsonDB(new DBConfiguration.Config("myDb", true, false, '/'));

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/index.html'));
    //res.sendFile(path.join(__dirname + '/index.html'));
});

router.get('/add/:number', function (req, res) {
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
app.listen(process.env.PORT || 3000);

console.log('Running at Port 3000');
