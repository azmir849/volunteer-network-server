const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()


const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 5000
app.get('/',(req,res)=>{
  res.send("Database Working")
})


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pnuql.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
client.connect(err => {
  const users = client.db("volunteer-network").collection("registerUser");
  app.post('/register',(req,res) =>{
      const user = req.body;
      console.log(user)
    users.insertOne(user)
    .then(result =>{
        console.log(result);
    })
  })

  app.get('/registerUser',(req,res) =>{
    users.find({})
    .toArray((err, documents) =>{
        res.send(documents);
    })
})

app.delete('/registerUser/:id', (req,res)=>{
    users.deleteOne({_id: ObjectId(req.params.id)})
    .then((result) =>{
       res.send(result.deletedCount > 0);
    })
 })

});




app.listen(process.env.PORT || port)