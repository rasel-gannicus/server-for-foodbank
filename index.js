const express = require('express');
const app = express();
const port = 4000;
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.USERNAME}:${process.env.USER_PASSWORD}@cluster0.lnoc98n.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true, 
    }
});

async function run() {
    try {

        // Connect the client to the server	(optional starting in v4.7)
        client.connect();

        const countryDB = client.db('country&city').collection('country');
        const stateDB = client.db('country&city').collection('state');
        const cityDB = client.db('country&city').collection('city');

        // --- db for adding food review or getting food review data
        const foodReviewDB = client.db('food').collection('review')

        // --- getting all the country data 
        app.get('/getCountry', async(req, res)=>{
            const query = {} ;
            const cursor = countryDB.find(query) ; 
            const result = await cursor.toArray() ; 
            res.send(result) ; 
        })

        // --- getting state lists according to the country 
        app.get('/getCountryState/:countryId', async(req, res)=>{
            const {countryId} = req.params ; 
            const query = {country_id : countryId} ;
            const cursor = stateDB.find(query) ; 
            const result = await cursor.toArray();
            res.send(result); 
        })

        // --- getting city lists according to the state
        app.get('/getCityList/:stateId', async(req, res)=>{
            const {stateId} = req.params ; 
            const query = {state_id : stateId} ; 
            const cursor = cityDB.find(query);
            const result = await cursor.toArray();
            res.send(result)
            
        }) 
 
        // --- get single city data
        app.get(`/getSingleCity/:cityId`, async(req, res)=>{
            const query = {city_id : req.params.cityId} ;
            const result = await cityDB.findOne(query) ;
            res.send(result)
        })
         
        // --- get single country data
        app.get(`/getSingleCountry/:countryId`, async(req, res)=>{
            const query = {country_id : req.params.countryId} ;
            const result = await countryDB.findOne(query) ;
            res.send(result)
        })
 
        // --- get single state data
        app.get(`/getSingleState/:stateId`, async(req, res)=>{
            const query = {state_id : req.params.stateId} ;
            const result = await stateDB.findOne(query) ;
            res.send(result)
        })

        // --- getting all the reviewed food items
        app.get('/review/getAllfoods', async(req,res)=>{
            const query = {};
            const cursor = foodReviewDB.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        // --- Get food item's data by country
        app.get('/review/getFoodByCountry/:countryCode', async(req,res)=>{
            // console.log(req.params);
            const query = {'data.countryId' : req.params.countryCode} ;
            const cursor = foodReviewDB.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
        // --- Get food item's data by states
        app.get('/review/getFoodByState/:stateCode', async(req,res)=>{
            // console.log(req.params);
            const query = {'data.stateId' : req.params.stateCode} ;
            const cursor = foodReviewDB.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
        // --- Get food item's data by city
        app.get('/review/getFoodByCity/:cityCode', async(req,res)=>{
            // console.log(req.params);
            const query = {'data.cityId' : req.params.cityCode} ;
            const cursor = foodReviewDB.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        // --- adding a food review
        app.post('/review/addNewFood', async(req,res)=>{
            const data = req.body ; 
            const result = await foodReviewDB.insertOne(data);
            res.send(result) ; 
        })

       

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Server Ran Successfully');
})

app.listen(port, () => {
    console.log('Listening to port ', port);
})