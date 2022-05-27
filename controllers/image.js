const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: '26f2017e6bb646bba462e7695df3741c'
});

const handleApiCall = (req, res) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => {
            res.json(data);
        })
        .catch(err => res.json(err))

}
const handleImage = (req, res, knex) => {
    const { id } = req.body;
    knex('users').where('id', '=', id).increment('entries', 1)
        .returning('entries').then(data => res.json(data[0].entries))
        .catch(err => res.status(400).json('Error grabing entries'))
}

module.exports = {
    handleImage,
    handleApiCall
}

// const handleImage = (req, res, knex) => {
//     const { id } = req.body;
//     knex('users').where('id', '=', id).increment('entries', 1)
//     .returning('entries').then(data => res.json(data[0].entries))
//         .catch(err => res.status(400).json('Error grabing entries'))


// }