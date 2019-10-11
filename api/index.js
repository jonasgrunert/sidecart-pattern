const http = require("http");

http.createServer((req, res) => {
    switch(req.url.substring(5)){
        case "protected": {
            res.statusCode = 200;
            res.write("Protected ressource");
            break;
        }
        case "unprotected": {
            res.statusCode = 200;
            res.write("Unprotected ressource");
            break;
        }
        case "private": {
            res.statusCode = 200;
            res.write(`Private ressource of ${req.headers["x-user"]}`);
            break;
        }
        default: {
            res.statusCode = 404;
            res.write(`Do not know resource ${req.url.substring(5)}`)
            break;
        } 
    }
    res.end()
}).listen(3000);