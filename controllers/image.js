const handleImage = (req, res, knex) => {
    const { id } = req.body;
    knex('users').where('id', '=', id).increment('entries', 1)
        .returning('entries').then(data => res.json(data[0].entries))
        .catch(err => res.status(400).json('Error grabing entries'))
}

module.exports = {
    handleImage
}

// const handleImage = (req, res, knex) => {
//     const { id } = req.body;
//     knex('users').where('id', '=', id).increment('entries', 1)
//     .returning('entries').then(data => res.json(data[0].entries))
//         .catch(err => res.status(400).json('Error grabing entries'))


// }