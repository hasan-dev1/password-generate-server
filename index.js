const express = require('express');
const cors = require('cors');
const app = express()
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;
require('dotenv').config()
var ObjectId = require("mongodb").ObjectId;

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.REACT_APP_USERNAME}:${process.env.REACT_APP_USERNAME}@cluster0.v48zzim.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});



const categoryCollection = client.db("passwordGenerator").collection('categoryCollention')

async function run(){
    try{

        app.get('/category',async(req, res)=>{
            const query = {}
            const result = await categoryCollection.find(query).toArray()
            res.send(result)
        })
        app.post('/category',async(req, res)=>{
            const query = req.body
            console.log(query)
            const result = await categoryCollection.insertOne(query)
            res.send(result)
        })
        app.get('/category/:id',async(req, res)=>{
            const id = req.params.id
            const query = {_id:ObjectId(id)}
            const result = await categoryCollection.findOne(query)
            res.send(result)
        })

        app.put('/category',async(req, res)=>{
          const id = req.query.id;
          const query = { _id: ObjectId(id) };
          const newpass = req.body;
          const updatedoc = { $push: { password: newpass } };
          const result = await categoryCollection.updateOne(query,updatedoc,{upsert:true})
          res.send(result)
        })


        app.put('/category/pass',async(req, res)=>{
            const id = req.query.id;
            const categoryid = req.body.categoryid;
            const query = {_id:ObjectId(id)}
            const updatedoc = { $pull: { password: { id: categoryid } } };
            const result = await categoryCollection.updateOne(query,updatedoc)

            console.log(categoryid)
            res.send(result)
        })

        app.get('/',(req, res)=>{
            res.send('Your server is running on 5000')
        })
        app.listen(port,()=>{
            console.log('Your server is running on ',port)
        })
    }finally{

    }
}

run().catch(err => console.log(err.message))

