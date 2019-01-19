//EXPRESS.JS WEB SERVER

const express = require('express')
const app = express()
const port = 1337

const { ConnectionManager } = require('node-maprdb');
const http = require('http');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //res.setHeader('Content-Type', 'application/json');
    next();
  });

app.listen(port, () => console.log(`Web Server to post ADT Counts to D3.JS app listening on port ${port}!`))

app.get('/', (req, res) => {
    //res.writeHead(200, { 'Content-type': 'text/html'});  //cannot have res.writeHead and res.json

    const connectionString = 'mapr02.wired.carnoustie:5678?' +
    'auth=basic;' +
    'user=mapr;' +
    'password=maprmapr18;' +
    'ssl=true;' +
    'sslCA=/opt/mapr/conf/ssl_truststore.pem;' +
    'sslTargetNameOverride=mapr02.wired.carnoustie';

    let connection;

    ConnectionManager.getConnection(connectionString)
    .then((conn) => {
        connection = conn;
        // Get a store
        return connection.getStore('/demos/hl7demo/d3/barChartCount');
    })
    .then((store) => {
        // fetch the OJAI Document by its '_id' field
        //return store.findById('BgCtyChldrnUrgntCar');
        
        // fetch all documents
        return store.find({});
    })
    .then((queryResult) => {
        // Print the OJAI Document
        // Must change .then to pass "doc" instead of "queryResult"
        //res.end(JSON.stringify(doc));
        let docArray = [];

        queryResult.on('data', (jsObject) => {
            docArray.push(jsObject);
        });
        
        queryResult.on('end', () => {
            
            // close the OJAI connection
            res.json({returnElements: docArray});

            res.end();
            connection.close();
        });
    });
});

app.get('/liveStream', (req, res) => {
    //res.writeHead(200, { 'Content-type': 'text/html'});  //cannot have res.writeHead and res.json
    //res.header('Content-Type', 'application/json');

    var fs = require('fs');
    var obj;
    fs.readFile('../package.json', 'utf8', function (err, data) {
        if (err) throw err;
        obj = JSON.parse(data);
        //res.json(obj);
        res.end(JSON.stringify(obj));
    });

    // Print the OJAI Document
    // Must change .then to pass "doc" instead of "queryResult"
    //res.end(JSON.stringify(doc));

});