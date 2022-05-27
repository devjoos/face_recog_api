const handleSignin = (req, res, knex, bcrypt) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json('incorrect submission')
    }
    knex.select('email', 'hash').from('login').where('email', '=', email).then(data => {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if (isValid) {
            knex.select('*').from('users').where('email', '=', email)
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