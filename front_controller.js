
var
    /**
     * Node built-in HTTP server module.
     */
    http = require('http'),

    /**
     * node-staticp: a simple, rfc 2616 compliant file streaming module for node, plus postscript.
     * @see https://github.com/pwfisher/node-staticp
     */
    static = require('node-staticp'),
    staticOptions = {
        'postscript': 'inc/postscript.html'
    },
    staticServer = new(static.Server)('../../public_html', staticOptions),

    /**
     * HTTP 301 redirect map.
     * No support for query param variations or other 3XX response codes.
     */
    redirectMap = {
        '/nucleus/index.php?itemid=45': '/2009/commandline-parseargs-php-cli-options-parser.html',
    },

    /**
     * Request listener - execution begins here. Master controller logic.
     *
     * @param {http.IncomingMessage} request
     * @param {http.ServerResponse} response
     */
    requestListener = function(request, response)
    {
        request.addListener('end', function ()
        {
            if (redirectMap[request.url])
            {
                // Redirect
                //
                response.writeHead(301, { 'Location': redirectMap[request.url] });
                console.log('> Redirect: ' + request.url + ' - ' + redirectMap[request.url]);
                response.end();
            }
            else
            {
                // Static File
                //
                staticServer.serve(request, response, function (err, res)
                {
                    if (err)
                    {
                        console.error('> Error serving ' + request.url + ' - ' + err.message);
                        response.writeHead(err.status, err.headers);
                        response.end();
                    }
                    else // success
                    {
                        console.log('> ' + request.url + ' - ' + res.message);
                    }
                });
            }
        });
    },

    /**
     * @var {http.Server}
     */
    httpServer = http.createServer(requestListener);

httpServer.listen(8081);
