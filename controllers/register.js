


const handleRegister = (knex, bcrypt) => (req, res) => {
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
}

// exports.handleRegister = handleRegister;
module.exports.handleRegister = handleRegister;
// module.exports = {
//     handleRegister : handleRegister };