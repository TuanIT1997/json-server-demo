const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const queryString = require("querystring");

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Handle CORS origin issues
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// Add custom routes before JSON Server router
server.get("/echo", (req, res) => {
  res.jsonp(req.query);
});

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  if (req.method === "POST") {
    req.body.createdAt = Date.now().valueOf();
    req.body.updatedAt = Date.now().valueOf();
  } else if (req.method === "PUT" || req.method === "PATCH") {
    req.body.updatedAt = Date.now().valueOf();
  }
  // Continue to JSON Server router
  next();
});

router.render = (req, res) => {
  const header = res.getHeaders();
  const totalCountHeader = header["x-total-count"];
  if (req.method === "GET" && totalCountHeader) {
    const queryParams = queryString.parse(req._parsedUrl.query);
    const result = {
      data: [],
      pagination: {
        total: 0,
        page: 0,
        limit: 0,
      },
    };
    return res.jsonp({
      ...result,
      data: res.locals.data,
      pagination: {
        total_page: Math.ceil(totalCountHeader / (queryParams?._limit || 10)),
        total_count: totalCountHeader,
        page: Number(queryParams?._page || 1),
        limit: Number(queryParams?._limit || 10),
      },
    });
  }
  res.jsonp(res.locals.data);
};

// Use default router
server.use("/api", router);
server.listen(3000, () => {
  console.log("JSON Server is running");
});
