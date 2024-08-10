// require -> commonJS
const express = require('express');
const crypto = require('crypto');
const movies = require('./movies/movies.json');

const { validateMovie, validatePartialMovie } = require('./schemas/movies.js');
const { error } = require('console');

const app = express();

app.use( express.json() );
// Deshabilitar el header X-Powered-By: Express
app.disable('x-powered-by');


// Todos los recursos que sean MOVIES se identifica con /movies
/*app.get('/movies', ( req, res ) => {
    res.json( movies );
});*/

const ACCEPTED_ORIGINS = [
    'http://localhost:8080',
    'http://localhost:1234',
    'http://movies.com'
];

app.get('/movies', ( req, res ) => {

    const origin = req.header('origin');

    if ( ACCEPTED_ORIGINS.includes( origin ) || !origin ) {
        res.header('Access-Control-Allow-Origin', origin );
    }

    const { genre } = req.query;
    if ( genre ) {
        const filteredMovies = movies.filter( movie => movie.genre.some( g => g.toLowerCase() == genre.toLowerCase()));
        return res.json( filteredMovies );
    }

    res.json( movies );

});

app.get('/movies/:id', ( req, res ) => {
    const { id }  = req.params;
    const movie = movies.find( movie => movie.id == id );

    if ( movie ) return res.json( movie );

    res.status(404).json({ message: "Movie not found" });
})


app.post('/movies', ( req, res ) => {
    
    const result = validateMovie( req.body );

    // Se podria utilizar el error 422 
    if ( !result.success ) {
        return res.status(400).json({ error: JSON.parse( result.error.message ) });
    }

    const newMovie = {
        id: crypto.randomUUID(),
        ...result.data
    };

    // Esto no seria REST, porque estamos guardando
    // el estado de la aplicación en memoria
    movies.push( newMovie );

    res.status( 201 ).json( newMovie );

})


app.patch('/movies/:id', ( req, res ) => {

    const result = validatePartialMovie( req.body );

    if ( !result ) {
        return res.status(404).json({ error: JSON.parse( result.error.message ) });
    }

    const { id }= req.params;
    const moviesIndex = movies.findIndex( movie => movie.id === id );

    if ( moviesIndex === -1 ) {
        return res.status(404).json({ error: 'Movie not found'});
    }

    const updateMovie = {
        ...movies[moviesIndex],
        ...result.data
    }

    movies[moviesIndex] = updateMovie;

    return res.json(updateMovie);

});

app.delete('/movies/:id', ( req, res ) => {

    const origin = req.header('origin');
    if ( ACCEPTED_ORIGINS.includes(origin) || !origin ) {
        res.header('Access-Control-Allow-Origin', origin );
    }

    const { id } = req.params;
    const movieIndex = movies.findIndex( movie => movie.id === id );

    if ( movieIndex === -1 ) {
        return res.status(404).json( { message: 'Movie not found' } );
    }

    movies.splice( movieIndex, 1 );

    return res.json( { message: 'Movie deleted' } );
});


app.options('/movies/:id', ( req, res ) => {
    const origin = req.header('origin');

    if ( ACCEPTED_ORIGINS.includes(origin) || !origin ) {
        res.header('Access-Control-Allow-Origin', origin );
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    }

    res.send(200);
});

const PORT = process.env.PORT ?? 1234;

app.listen( PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});

