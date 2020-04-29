// Parses "optimization_paramters," expression data sheets, and 2-column sheets
// from GRNmap input or output workbook

const EXPRESSION_SHEET_SUFFIXES = ["_expression", "_optimized_expression", "_sigmas"];

const errorsList = {
    idLabelError: function () {
        return {
            errorCode: "MISLABELED_ID_CELL",
            possibleCause: "The top left cell of the expression sheet is mislabeled.",
            suggestedFix: "Replace the incorrect label with \'id\' exactly."
        };
    },
    missingColumnHeaderError: function () {
        return {
            errorCode: "MISSING_COLUMN_HEADER",
            possibleCause: "A column in the expression sheet is missing a header.",
            suggestedFix: "Add headers to all columns."
        };
    },
    emptyExpressionRowError: function () {
        return {
            errorCode: "EMPTY_ROW",
            possibleCause: "There is an empty row in the input sheet.",
            suggestedFix: "Delete empty row, or populate with data."
        };
    },
};

const warningsList = {
    missingExpressionWarning: function () {
        return {
            warningCode: "MISSING_EXPRESSION_SHEET",
            errorDescription: "_log2_expression or _log2_optimized_expression worksheet was \
            not detected. The network graph will display without node coloring. If you want \
            the nodes to be colored with expression data, you can upload your own expression \
            data by adding one or more of those worksheets to your Excel workbook or select \
            from data in GRNsight's Expression Database, found in the Node menu or panel."
        };
    },
    extraneousDataWarning: function () {
        return {
            warningCode: "EXTRANEOUS_DATA",
            errorDescription: "There is extraneous data outside of the set rows and columns of the expression sheet."
        };
    }
};

const addExpWarning = (network, message) => {
    let warningsCount;
    if (!Object.keys(network).includes("warnings")) {
        warningsCount = 0;
        network.warnings = [];
    } else {
        warningsCount = network.warnings.length;
    }
    const MAX_WARNINGS = 75;
    if (warningsCount < MAX_WARNINGS) {
        network.warnings.push(message);
    } else {
        network.errors.push(errorsList.warningsCountError);
        return false;
    }
};

const addExpError = (network, message) => {
    const errorsCount = network.errors.length;
    const MAX_ERRORS = 20;
    if (errorsCount < MAX_ERRORS) {
        network.errors.push(message);
    } else {
        network.errors.push(errorsList.errorsCountError);
        return false;
    }
};

const fillArray = (value, array, length) => { // mutator
    while (array.length < length) {
        array.push(value);
    }
    return array;
};

const isExpressionSheet = (sheetName) => {
    return EXPRESSION_SHEET_SUFFIXES.some(function (suffix) {
        return sheetName.includes(suffix);
    });
};

// Going to continue basing this section off of the parseNetworkSheet function in spreadsheet-controller.js
var parseExpressionSheet = function (sheet) {
    var geneData = {};
    var expressionData = {
        errors: [],
        warnings: [],
        timePoints: []
    };

    // Check that id label is correct. Throw error if not.
    const idLabel = sheet.data[0][0];
    if (idLabel !== "id") {
        addExpError(expressionData, errorsList.idLabelError());
    }

    expressionData.timePoints = sheet.data[0].slice(1);
    const numberOfDataPoints = expressionData.timePoints.length;
    let geneNames = [];
    sheet.data.forEach(function (sheet) {
        const geneName = sheet[0];
        if (geneName) {
            geneNames.push(geneName);
            const rowData = sheet.slice(1);
            // Sometimes, missing data is at the end of the row. In this case, pad the
            // array with nulls
            if (rowData.length < numberOfDataPoints) {
                fillArray(null, rowData, numberOfDataPoints);
            }
            geneData[geneName] = rowData;
        }
    });
    geneNames = geneNames.slice(1);
    expressionData.data = geneData;
    if (expressionData.data.id) {
        // Throw warning in case of extraneous data
        // Need to add a case where it checks the depth of the columns, as well
        const rowLength = expressionData.data.id.length;
        Object.values(expressionData.data).forEach(function (row) {
            if (row.length !== rowLength) {
                addExpWarning(expressionData, warningsList.extraneousDataWarning());
            }

            // Throw error in case of empty row
            let nonnullCount = 0;
            for (let i = 0; i <= rowLength; i++) {
                if (i === rowLength) {
                    if (nonnullCount === 0) {
                        addExpError(expressionData, errorsList.emptyExpressionRowError());
                        break;
                    }
                } else {
                    if (row[i]) {
                        nonnullCount++;
                    }
                }
            }
        });

        // Throw error in case of missing column header
        let nonemptyValues = 0;
        expressionData.data.id.forEach(function () {
            nonemptyValues++;
        });
        if (rowLength !== nonemptyValues) {
            addExpError(expressionData, errorsList.missingColumnHeaderError());
        }

    }

    return expressionData;
};

module.exports = function (workbook) {
    const output = {
        expression: {}
    };
    workbook.forEach(function (sheet) {
        if (isExpressionSheet(sheet.name)) {
            output["expression"][sheet.name] = parseExpressionSheet(sheet);
        }
    });
    return output;
};
