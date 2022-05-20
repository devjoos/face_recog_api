const { response } = require('express');
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors')

const app = express();

app.use(express.json());
app.use(cors());

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sam',
            email: 'sam@gmail.com',
            password: 'secret',
            entries: 0,
            joined: new Date()
        }

    ]
}

app.get('/', (req, res) => {
    res.send(database.users)
})

app.post('/signin', (req, res) => {
    bcrypt.compare("qwerty", "$2a$10$uRpZT2gdAJSyyzAX6q1TieMTQ.Zz4t8a2bKYFdaPC6pE75ysN1HqW", function (err, res) {
        console.log('1', res)
        // res == true
    });
    bcrypt.compare("veggies", "$2a$10$uRpZT2gdAJSyyzAX6q1TieMTQ.Zz4t8a2bKYFdaPC6pE75ysN1HqW", function (err, res) {
        console.log('2', res)
        // res = false
    });
    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.status(400).json('error logging')
    }

})

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    bcrypt.hash(password, null, null, function (err, hash) {
        console.log(hash)
        // Store hash in your password DB.
    });
    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length - 1])
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    })
    if (found === false) {
        res.status(404).json('not found')

    }
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++
            return res.json(user.entries);
        }
    })
    if (found === false) {
        res.status(404).json('not found')

    }
})



// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function (err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function (err, res) {
//     // res = false
// });


app.listen(3000, () => {
    console.log('app is running on port 3000')
})

//  res with this is woprking
//  signin -- > post req and res with success or fail
//  register -- > post req return user created 
//  profile --- > userID ----> get req user
//  counter goes up each photo submitted and ranking ---> put req to update
