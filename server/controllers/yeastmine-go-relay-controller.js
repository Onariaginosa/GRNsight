module.exports = function (app) {
    var request = require("request");

    var API_HOST = "https://www.yeastgenome.org";

    app.use("/yeastmine/", function (req, res) {
        var url = API_HOST + req.url;

        console.log("Connecting to service:", url);
        console.log("Using parameters:", req.query);

        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        req.pipe(request(url)).pipe(res);
    });
};
