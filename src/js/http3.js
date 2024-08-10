const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const desiredPort = process.env.PORT ?? 1234;

const processRequest = (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    if ( req.url === '/' ) {
        res.end('<h1>Bienvenido a mi página de inicio</h1>');        
    } else if( req.url === '/contacto' ) {
        res.end('<h1>Contacto</h1>');
    } else if ( req.url === '/image-goku') {
        const imagePath = path.resolve('C:/xampp/htdocs/CreacionApiNodeJs/src/img/goku.png');
        fs.readFile(imagePath,( err, data ) => {
            if ( err ) {
                res.statusCode = 500;
                res.end('<h1>500 Internal Server Error</h1>');
            } else {
                res.setHeader('Content-Type', 'image/png');
                res.end( data );
            }
        });
    }  else {
        res.statusCode = 404;
        res.end('<h1>404</h1>')
    }
}

const server = http.createServer( processRequest ); 

server.listen( desiredPort, () => {
    console.log(`server listening on port http://localhost:${ desiredPort  }`);
});