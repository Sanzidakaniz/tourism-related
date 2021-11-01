const express=require('express');
const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId;
require('dotenv').config();
const cors=require('cors');
const { application } = require('express');
const app=express();
const port=process.env.PORT ||5000;

//middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lo869.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
app.get('/', (req, res) => {
    res.send('hello server')
});

async function run(){
try{
    await client.connect();
    console.log('database connected');
    const database=client.db('tourism_site');
    const servicesCollection=database.collection('services');  
    const ordersCollection=database.collection('orders');  
    
    //get api 
    app.get('/services',async(req,res)=>{
        const cursor=servicesCollection.find({});
        const services=await cursor.toArray();
        res.send(services);
    })
    //Orders get api 
    app.get('/orders',async(req,res)=>{
        const cursor=ordersCollection.find({});
        const orders=await cursor.toArray();
        res.send(orders);
    })
    
    //get single service
    app.get('/services/:id',async(req,res)=>{
        const id=req.params.id;
        console.log('get single service',id);
        const query={ _id: ObjectId(id)};
        const service=await servicesCollection.findOne(query);
        res.json(service);
    })
    //post api 
    app.post('/services',async(req,res)=>{
   const service = req.body;
       console.log('hit the api',service);
        const result=await servicesCollection.insertOne(service); 
        console.log(result);
       res.json(result)
    });
    // orders post api 
    app.post('/orders',async(req,res)=>{
   const order = req.body;
       console.log('hit the api',order);
        const result=await ordersCollection.insertOne(order); 
        console.log(result);
       res.json(result)
    });
   
}

finally{
    // await client.close();
}
}
run().catch(console.dir);




app.listen(port,()=>{
    console.log('listening on port',port);
});

//username: user11 password: Gat9sOFi6R5VgCUX