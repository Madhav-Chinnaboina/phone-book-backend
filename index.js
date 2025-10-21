const express=require('express');
var morgan = require('morgan');
const cors=require('cors');
const app=express();
app.use(cors());
app.use(express.json());
app.use(express.static('dist'))
morgan.token('person',(req)=>{
    if(req.method === 'POST' && req.body.name && req.body.number){
        return JSON.stringify({name:req.body.name,number:req.body.number})
    }
    return ''
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'));
let persons=[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];
app.get('/api/persons',(req,res)=>{
    res.json(persons)
})
app.get('/info',(req,res)=>{
    const len=persons.length;
    const time=new Date();
   res.send(`<div><p>phonebook has info for ${len} </p>
    <p>${time}</p>
    </div>`)
})
app.get('/api/persons/:id',(req,res)=>{
    const id = req.params.id;
    const note = persons.find(person=>person.id===id);
    if(note) res.json(note);
    else res.status(404).end()
})
app.delete('/api/persons/:id',(req,res)=>{
    const id=req.params.id;
    persons=persons.filter(note=>note.id!==id);
    res.status(204).end();
})
app.post('/api/persons',(req,res)=>{
    const person = req.body;
    const id=Math.floor(Math.random()*999)
    person.id=id.toString();
     if(!person.name || !person.number){
        return res.status(400).json({ 
            error: 'name or number is missing' 
          })
     }
        const duplicate=persons.find(p=>p.name===person.name);
        if(duplicate){
            return res.status(400).json({
                error:'name must be unique'
            })
        }
    persons=persons.concat(person);
     res.json(person);
})
const PORT=process.env.PORT || 3001;
app.listen(PORT,()=>{
    console.log("running on port 3001");
})
