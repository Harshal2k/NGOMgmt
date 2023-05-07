// const mysql = require('mysql');
// const express = require('express');
// const bodyparser = require('body-parser');
// var app = express();

// app.use(bodyparser.json());

// var urlencodedParser = bodyparser.urlencoded({ extended: false }) ;

// //MySQL config
// var mysqlConnection = mysql.createConnection({
//   host: '127.0.0.1',
//   user: 'root',
//   password: '',
//   database: 'og_ngo',
//   multipleStatements: true
//   });

//   //MySQL connection
//   mysqlConnection.connect((err)=> {
//     if(!err)
//     console.log('Connection Established Successfully');
//     else
//     console.log('Connection Failed!'+ JSON.stringify(err,undefined,2));
//     });

//     //Est. Port conn.
//     const port = 5001;
//     app.listen(port, () => console.log(`Server started on port ${port}`));

//     //Get event list

//     const getQuery="SELECT id,name,details,DATE_FORMAT(date,'%Y-%m-%d') AS date FROM `events`";
//     app.get('/events',(req,res)=>{
//         mysqlConnection.query(getQuery,(err,results,fields) =>{
//             if(!err) 
//             res.send(JSON.stringify(results));
//             else
//             console.log(err);
//         })
//     });

//     //editing
//     app.put('/edit',(req,res)=>{
//         mysqlConnection.query("UPDATE events SET name='"+req.body.name+"',details='"+req.body.details+"',date='"+req.body.date+"' WHERE id='"+req.body.id+"'",(err,results)=>{
//             if(!err)
//             res.send({msg:"edited"});
//             else
//             console.log(err)
//         })
//     })

//     //deleting
//     app.delete('/delete',(req,res)=>{
//         mysqlConnection.query("DELETE FROM users WHERE eventid='"+req.body.id+"'",(err,results)=>{
//             if(!err){
//                 mysqlConnection.query("DELETE FROM events WHERE id='"+req.body.id+"'",(err,results)=>{
//                     if(!err)
//                     res.send({msg:"deleted"});
//                 })   
//             }else
//             console.log(err);
//         });
//     })

//     //posting data
//     app.post('/add',urlencodedParser,(req,res)=>{
//         mysqlConnection.query("INSERT INTO events (id,name,details,date) VALUES(null,'"+req.body.name+"','"+req.body.details+"','"+req.body.date+"')",(err,results)=>{
//             if(!err)
//             res.send({msg:"added"});
//             else
//             console.log(err);
//         });
//     })

//     //get volunteer data
//     app.get('/volunteers',(req,res)=>{
//         mysqlConnection.query("SELECT * FROM `users`",(err,results)=>{
//             if(!err){
//                 res.send(JSON.stringify(results));
//             }else{
//                 console.log(err);
//             }
//         });
//     })

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(`mongodb+srv://harshalgosawi:mongodbHarshal2k@bookslist.co15j1q.mongodb.net/`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.log('MongoDB connection failed! ' + err);
});

// Define MongoDB schema
const eventSchema = new mongoose.Schema({
  name: String,
  details: String,
  date: Date
});

const Event = mongoose.model('Event', eventSchema);

// Create Express application
const app = express();

app.use(bodyParser.json());

// Set up port
const port = 5001;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

// Get event list
app.get('/events', async (req, res) => {
  try {
    const events = await Event.find({});
    res.send(JSON.stringify(events));
  } catch (err) {
    console.log(err);
  }
});

// Edit event
app.put('/edit', async (req, res) => {
  try {
    const { id, name, details, date } = req.body;
    await Event.findByIdAndUpdate(id, { name, details, date });
    res.send({ msg: 'edited' });
  } catch (err) {
    console.log(err);
  }
});

// Delete event
app.delete('/delete', async (req, res) => {
  try {
    const { id } = req.body;
    await Event.findByIdAndDelete(id);
    res.send({ msg: 'deleted' });
  } catch (err) {
    console.log(err);
  }
});

// Add event
app.post('/add', async (req, res) => {
  try {
    const { name, details, date } = req.body;
    const newEvent = new Event({ name, details, date });
    await newEvent.save();
    res.send({ msg: 'added' });
  } catch (err) {
    console.log(err);
  }
});

// Get volunteer data
app.get('/volunteers', async (req, res) => {
  try {
    const volunteers = await Event.find({});
    res.send(JSON.stringify(volunteers));
  } catch (err) {
    console.log(err);
  }
});
