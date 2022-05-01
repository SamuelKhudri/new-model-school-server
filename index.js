const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
// stripe secret key get
const stripe = require('stripe')(process.env.STRIPE_SECRET);
// require id for delete
const ObjectId = require('mongodb').ObjectId;
//----app use----- 
const app = express();
const port = process.env.PORT || 5000;

// middle ware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gqter.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri);
async function run() {
    try {
        await client.connect();
        const database = client.db('new_model_school');
        const facultiesCollection = database.collection('faculties');
        // const categoriesCollection = database.collection('categories');
        const studentsCollection = database.collection('students');
        const noticeCollection = database.collection('notice');
        const routineCollection = database.collection('routine');
        const usersCollection = database.collection('users');


        // ----------------Get all Categoris-------------------
        // app.get('/categories', async (req, res) => {
        //     const cursor = categoriesCollection.find({});
        //     const result = await cursor.toArray();
        //     res.json(result);
        // });

        // ------------------------faculties section section-----------------
        app.get('/faculties', async (req, res) => {
            const cursor = facultiesCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        });
        // ---single faculty for place admit page------
        app.get("/faculties/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await facultiesCollection.findOne(query);
            res.send(result);
        });
        // post product
        app.post('/faculties', async (req, res) => {
            const service = req.body;
            const result = await facultiesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });
        /////delete faculties
        app.delete('/faculties/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await facultiesCollection.deleteOne(query);
            console.log('deleted id', result);
            res.json(result);
        });

        // ----------------------Students section-----------------------

        //get users orders email based from database
        app.get('/students', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const cursor = studentsCollection.find(query);
            const orders = await cursor.toArray();
            res.json(orders);
        });

        // dleted user for my order review page btn

        app.delete('/students/:email', async (req, res) => {
            const id = req.params.email;
            const query = { _id: ObjectId(id) };
            const result = await studentsCollection.deleteOne(query);
            console.log('deleted id', result);
            res.json(result);
        });

        // get data for nav bar cart
        // app.get('/orders/cart', async (req, res) => {
        //     const email = req.query.email;
        //     const query = { email: email }
        //     const cursor = ordersCollection.find(query);
        //     const orders = await cursor.toArray();
        //     res.json(orders);
        // });

        // show updated student data after update by put
        app.put('/students/update/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                },
            };
            const result = await studentsCollection.updateOne(filter, updateDoc, options)
            console.log('updating', id)
            res.json(result)
        });


        // post students info to students collection
        app.post('/students', async (req, res) => {
            const order = req.body;
            const result = await studentsCollection.insertOne(order);
            console.log('post succ', result)
            res.json(result);
        });

        // ---------manage All students section------

        // get customers order in the my review page
        app.get('/students/all', async (req, res) => {
            const cursor = studentsCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        });

        // dleted users order from manage all order page
        app.delete('/students/all/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await studentsCollection.deleteOne(query);
            console.log('deleted id', result);
            res.json(result);
        });

        // user update from server to show 
        // ai part er pore data ta /5000/users/id te pabo
        app.get('/students/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await studentsCollection.findOne(query);
            res.send(result);
        });

        // -----------------Notice section-------------------

        // add single notice post to database
        app.post('/notice', async (req, res) => {
            const service = req.body;
            // console.log('hit the post api', service);
            const result = await noticeCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });

        // set delete state jfor notice 
        app.delete('/notice/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await noticeCollection.deleteOne(query);
            console.log('deleted id', result);
            res.json(result);
        })

        // get all review data
        app.get('/notice', async (req, res) => {
            const cursor = noticeCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        });
        // -----------------Routine section start-------------------

        // add single routine post to database
        app.post('/routine', async (req, res) => {
            const service = req.body;
            // console.log('hit the post api', service);
            const result = await routineCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });

        // set delete state jfor routine
        app.delete('/routine/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await routineCollection.deleteOne(query);
            console.log('deleted id', result);
            res.json(result);
        })

        // get all routine data
        app.get('/routine', async (req, res) => {
            const cursor = routineCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        });

        //  -----------------users get post and admin section--------------------

        //register users data post to the new data collection
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });

        //get google user data
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        // post admin data in users database
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        });

        // get special admin from users database
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        });

        //    ---------------Payment Section started---------------
        // define payment data get for stripe payments
        app.post('/create-payment-intent', async (req, res) => {
            const paymentInfo = req.body;
            const paymentAmount = parseInt(paymentInfo?.cost)
            const amount = paymentAmount * 100;
            const paymentIntent = await stripe.paymentIntents.create({
                currency: 'usd',
                amount: amount,
                payment_method_types: ['card']
            });
            res.json({ clientSecret: paymentIntent.client_secret })
        });

        //----put students info after update and set payment
        app.put('/students/:id', async (req, res) => {
            const id = req.params.id;
            const payment = req.body;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    payment: payment
                }
            }
            const result = await studentsCollection.updateOne(filter, updateDoc);
            res.json(result)
        });


    }
    finally {
        //-- await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Model school connected')
});

app.listen(port, () => {
    console.log('server is running at the port', port);
})