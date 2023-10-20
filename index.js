const express = require('express') ; 
const app = express() ; 
const port = process.env.PORT || 4000 ; 
const cors = require('cors') ;

app.use(express.json()) ; 
app.use(cors()) ; 

app.get('/', (req, res)=>{
    res.send('Server Ran Successfully');
})

app.listen(port, ()=>{
    console.log('Listening to port ', port) ;
})