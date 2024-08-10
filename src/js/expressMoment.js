// Importaciones 
const express = require('express');
const ditto = require('./pokemon/poke.json');


const app = express();
app.use(express.json());

// Deshabilitar el header X-Powered-By: Express
app.disable('x-powered-by');


const PORT = process.env.STIWAR ?? 1234;

app.use(( req, res, next ) => {

    if ( req.method !== 'POST' ) return next()
    if ( req.headers['content-type'] !== 'application/json' ) return next();

    // Solo llegan request que son POST y que tienen el header Content-Type: application/json
    let body = '';

    // Escuchar el evento
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('data', () => {
        const data = JSON.parse( body );
        data.timestamp = Date.now();
        req.body = data;
        next();
    });
})

app.get('/pokemon/ditto', ( req, res ) => {
    res.json( ditto );
    //res.send('<h1>Mi página</h1>');
    //res.json( { message: 'hola que tal' } );
});

app.post('/pokemon', ( req, res ) => {
    // req.body deberiamos guardar en base de datos
    res.status(201).json(req.body);
});

app.use(( req, res ) => {
    res.status(404).send('<h1>404</h1>');
});

app.listen( PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});