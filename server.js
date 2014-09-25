var express = require( "express" );
var http    = require( "http" );
var app     = express();

app.use( express.static( __dirname ) );
app.set( "view engine", "ejs" );
app.set( "views", __dirname );

var serveIndex = function ( req, res, next )
{
	res.render( "index", { STATIC_PATH: process.env.STATIC_PATH || "/" } );
};

app.route( "*" ).get( serveIndex );

http.createServer( app ).listen( process.env.PORT || 3000 );
