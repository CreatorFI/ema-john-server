const express = require('express')
const cors = require('cors');
const app = express()
const port = 5000
require('dotenv').config();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cors());


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j1wjl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("ema-john").collection("products");
  const ordersCollection = client.db("ema-john").collection("orders");
    app.post('/addProduct',(req,res)=>{
        const product = req.body;
        productsCollection.insertMany(product)
        .then(result=>{
            console.log(result.insertedCount);
            res.send(result.insertedCount)
        })

    })
    app.get('/products',(req,res)=>{
      productsCollection.find({}).toArray((err,documents)=>{
        res.send(documents);
      })
    })
    app.get('/products/:key',(req,res)=>{
      productsCollection.find({key: req.params.key}).toArray((err,documents)=>{
        res.send(documents[0]);
      })
    }) 

    app.post('/productsByKeys',(req,res)=>{
      const productKeys = req.body;
      productsCollection.find({key:{$in: productKeys}})
      .toArray((err,documents)=>{
        res.send(documents);
      })
    })
    app.post('/addOrder',(req,res)=>{
      const order = req.body;
      ordersCollection.insertMany([order])
      .then(result=>{
          console.log(result.insertedCount);
          res.send(result.insertedCount>0)
      })

  })



  console.log("Database Connected");
});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})