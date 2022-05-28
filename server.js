const { response } = require('express');
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');



const knex = require('knex')({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        port: 5432,
        user: 'samjoos',
        password: '',
        database: 'smart-brain'
    }
});


// knex.select('*').from('users').then(data => console.log(data));

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.send('success'))

app.post('/signin', (req, res) => { signin.handleSignin(req, res, knex, bcrypt) })

app.post('/register', register.handleRegister(knex, bcrypt))
//functioning returing a fucntion above, check the register.js file

app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, knex) })

app.put('/image', (req, res) => { image.handleImage(req, res, knex) })

app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })




app.listen(3000, () => {
    console.log(`app is running on port 3000`)
})
// console.log(process.env)

//  res with this is woprking
//  signin -- > post req and res with success or fail
//  register -- > post req return user created 
//  profile --- > userID ----> get req user
//  counter goes up each photo submitted and ranking ---> put req to update
