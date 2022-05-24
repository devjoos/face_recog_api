const handleSignin = (req, res, knex, bcrypt) => {
    knex.select('email', 'hash').from('login').where('email', '=', req.body.email).then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if (isValid) {
            knex.select('*').from('users').where('email', '=', req.body.email)
                .then(user => {
                    res.json(user[0])
                })
        } else {
            res.status(400).json('no user found')
        }
    }).catch(error => {
        res.status(400).json('notfound')
    }
    )
}

module.exports = {
    handleSignin: handleSignin
}