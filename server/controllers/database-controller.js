const Sequelize = require("sequelize");
require("dotenv").config();

var sequelize = new Sequelize("grnsight_database", process.env.EXPRESSION_DB_USERNAME,
process.env.EXPRESSION_DB_PASSWORD, {
    host: "localhost",
    dialect: "postgres",

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },

});

let buildTimepointsQuery = function (selection) {
    let timepoints = "";
    selection.forEach(x => timepoints += ("timepoints=\'" + x + "\' OR "));
    return timepoints.substring(0, timepoints.length - 4);
};

let buildQuery = function (dataset, timepoints) {
    return timepoints ? ("SELECT * FROM expressiondata WHERE dataset=\'" + dataset
    + "\' AND (" + buildTimepointsQuery(timepoints) + ") ORDER BY sortindex;")
    : "SELECT * FROM expressiondata WHERE dataset=\'" + dataset + "\' ORDER BY sortindex;";
};

let listUniqueGenes = function (arrayOfObjects) {
    let uniqueGenes = [];
    arrayOfObjects.forEach(function (x) {
        if (!uniqueGenes.includes(x.standardname)) {
            uniqueGenes.push(x.standardname);
        }
    });
    return uniqueGenes;
};

let listGeneData = function (gene, totalOutput) {
    let listOfData = [];
    totalOutput.forEach(function (x) {
        if (x.standardname === gene) {
            listOfData.push(Number(x.expression));
        }
    });
    return listOfData;
};

let convertToJSON = function (totalOutput, dataset, timePoints, allGenes) {
    let JSONOutput = {};
    JSONOutput[dataset] = {};
    JSONOutput[dataset].timePoints = timePoints;
    JSONOutput[dataset].data = {};
    JSONOutput[dataset].data.id = timePoints;
    allGenes.forEach(x => JSONOutput[dataset].data[x.toString()] = listGeneData(x, totalOutput));
    return JSONOutput;
};

module.exports = function (app) {
    app.get("/hello-world", function (req, res) {
        try {
            return res.send("hello world");
        } catch (e) {
            res.json({error: e.message});
        }


    });

    app.get("/first-query", function (req, res) {
        try {
            return sequelize.query("SELECT standardname FROM expressiondata", { type: sequelize.QueryTypes.SELECT })
            .then(function (stdname) {
                return res.send(stdname);
            });
        } catch (e) {
            res.json({error: e.message});
        }
    });

    app.get("/expressiondb", function (req, res) {
        try {
            return sequelize.query(buildQuery(req.query.dataset, req.query.timepoints), { type: sequelize.QueryTypes.SELECT })
                .then(function (stdname) {
                    let possibleExpressionSheet = req.query.dataset;
                    // probably need to make an "if" statement based on which data set it is. Seems easier that way.
                    // let possibleTimePoints = [10, 10, 60, 60, 60, 60]
                    // In this case,
                    let possibleTimePoints = [10, 10, 60, 60, 60, 60];
                    let genes = listUniqueGenes(stdname);
                    let response = convertToJSON(stdname, possibleExpressionSheet, possibleTimePoints, genes);
                    return res.send(response);
                });
        } catch (e) {
            res.json({error: e.stack});
            res.json({error: e.name});
            res.json({error: e.message});

        }
    });

};
