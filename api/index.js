const http = require("http");
const qstring = require("querystring");
const dns = require("dns");
dns.setServers(["127.0.0.11"]);

async function fetch(url, { json, query, form, method, headers }) {
  return new Promise((resolve, reject) => {
    const data = json
      ? JSON.stringify(json)
      : form
      ? qstring.stringify(form)
      : undefined;
    const dataheader = data
      ? {
          "Content-Length": Buffer.from(data).length,
          "Content-Type": json
            ? "application/json"
            : "application/x-www-form-urlencoded"
        }
      : {};
    const querystring = query ? qstring.stringify(query) : "";
    const req = http.request(
      url + querystring,
      { method, headers: { ...headers, dataheader } },
      r => {
        r.setEncoding("UTF-8");
        let body = "";
        r.on("data", d => {
          body += d;
        });
        r.on("error", err => reject(err));
        r.on("end", () => {
          resolve(body);
        });
      }
    );
    req.end(data);
  });
}

http
  .createServer(async (req, res) => {
    switch (req.url.substring(5)) {
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
        const token = JSON.parse(
          await fetch(
            "http://keycloak:8080/auth/realms/master/protocol/openid-connect/token",
            {
              method: "POST",
              form: {
                client_id: "admin-cli",
                username: "admin",
                password: "admin",
                grant_type: "password"
              }
            }
          )
        );
        console.log(token);
        const user = JSON.parse(
          await fetch(
            `http://keycloak:8080/auth/admin/realms/demo/users/${
              req.headers["x-user"]
            }`,
            { headers: { Authorization: `Bearer ${token.access_token}` } }
          )
        );
        console.log(JSON.stringify(user));
        res.write(`Private ressource of ${user.username}`);
        break;
      }
      default: {
        res.statusCode = 404;
        res.write(`Do not know resource ${req.url.substring(5)}`);
        break;
      }
    }
    res.end();
  })
  .listen(3000);
