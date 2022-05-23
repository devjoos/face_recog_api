const { response } = require('express');
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors')
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

// const database = {
//     users: [
//         {
//             id: '123',
//             name: 'John',
//             email: 'john@gmail.com',
//             password: 'cookies',
//             entries: 0,
//             joined: new Date()
//         },
//         {
//             id: '124',
//             name: 'Sam',
//             email: 'sam@gmail.com',
//             password: 'secret',
//             entries: 0,
//             joined: new Date()
//         }

//     ]
// }

app.get('/', (req, res) => {
    res.send('success')
})

app.post('/signin', (req, res) => {
    knex.select('email', 'hash').from('login').where('email', '=', req.body.email).then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        console.log(isValid)
        if (isValid) {
            knex.select('*').from('users').where('email', '=', req.body.email)
                .then(user => {
                    console.log(user)
                    res.json(user[0])
                })
        } else {
            res.status(400).json('no user found')
        }
    }).catch(error => {
        res.status(400).json('notfound')
    }
    )
})



app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const hash = bcrypt.hashSync(password)
    knex.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        }).into('login').returning('email')
            .then(loginEmail => {
                trx('users')
                    .returning('*')
                    .insert({
                        name: name,
                        email: loginEmail[0].email,
                        joined: new Date()
                    }).then(user => res.json(user[0]))
            }).then(trx.commit).catch(trx.rollback)
    })


        .catch(err => res.status(400).json(err))
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    knex.select('*').from('users').where({ id }).then(user => {
        if (user.length) {
            res.json(user[0])
        } else {
            res.status(400).json('not found')
        }
    }).catch(err => res.status(400).json(`error getting user`));

}
)

app.put('/image', (req, res) => {
    const { id } = req.body;
    knex('users').where('id', '=', id).increment('entries', 1).returning('entries').then(data => res.json(data[0].entries))
        .catch(err => res.status(400).json('Error grabing entries'))


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
