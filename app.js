const uri = process.env.MONGODB_URI;


const { MongoClient, ServerApiVersion } = require('mongodb');
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

// WebSocketのサーバの生成
const ws = require('ws')
const server = new ws.Server({port:5001});

// 接続時に呼ばれる
server.on('connection', ws => {
    // クライアントからのデータ受信時に呼ばれる
    ws.on('message', message => {
        message=message.split(";");
        let correct=verifyAns(message[1]);
        // クライアントにデータを返信
        server.clients.forEach(client => {
            client.send(message[0]+"; "+correct);
        });
    });

    // 切断時に呼ばれる
    ws.on('close', () => {
        console.log('close');
    });
});

const express = require('express');
const app = express();

app.use(express.static('public'));

app.listen(80);
