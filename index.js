const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors())
const port = 5000
require('dotenv').config()


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sjfoa.mongodb.net/${process.env.DB_NAME}retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology : true });

app.get('/', (req, res) => {
  res.send('Hello World!')
})



client.connect(err => {
  const appointmentCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION}`);
    app.post('/addAppointment',(req,res) =>{
        const appointment = req.body;
        appointmentCollection.insertOne(appointment)
        .then(result =>{
            res.send(result.insertedCount > 0)
        })
    });
    app.post('/appointmentsByDate',(req,res) =>{
      const date = req.body;
      appointmentCollection.find({date : date.date})
      .toArray((err,document) =>{
        res.send(document)
      })
  })

    app.get('/appointments', (req, res) => {
      appointmentCollection.find({})
          .toArray((err, documents) => {
              res.send(documents);
          })
  })
});


app.listen(process.env.PORT || port)