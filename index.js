const express = require('express')
const app = express()
const port = 3000

// app.get('/', (req, res) => {
//     res.send('Halo decks')
// })

const bodyPs = require('body-parser');
app.use(bodyPs.urlencoded({ extended: false}));
app.use(bodyPs.json());

const stdrRouter = require('./routes/sutradara.js');
app.use('/api/sutradara', stdrRouter);

const genreRouter = require('./routes/genres.js');
app.use('/api/genre', genreRouter);

const actorRouter = require('./routes/actor.js');
app.use('/api/actor', actorRouter);

const moviesRouter = require('./routes/movies.js');
app.use('/api/movies', moviesRouter);

const reviewRouter = require('./routes/review.js');
app.use('/api/review', reviewRouter);

const bookingRouter = require('./routes/booking.js');
app.use('/api/booking', bookingRouter);

const roleRouter = require('./routes/role.js');
app.use('/api/role', roleRouter);


app.listen(port, () => {
    console.log(`aplikasi berjalan di http:://localhost:${port}`)
})