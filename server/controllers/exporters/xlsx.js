// const { meta } = require("eslint/lib/rules/*");
const xlsx = require("node-xlsx");

const buildGeneNameArray = function (genes) {
    const geneNameArray = genes.map(gene => gene["name"]);
    return geneNameArray;
};

const createArrayWithZeroes = function (length) {
    return Array.apply(null, Array(length)).map(() => 0);
};

const buildNetworkSheet = function (genes, links) {
    const geneNameArray = buildGeneNameArray(genes);
    // The +1 to length is because we ALSO add the gene name to each of the network sheet arrays.
    const networkSheet = genes.map(() => createArrayWithZeroes(genes.length + 1));

    // Place the gene name in the beginning of the network sheet array.
    // EX: ["CIN5", 0, 0, 1]
    Object.keys(geneNameArray).forEach(index => networkSheet[index][0] = geneNameArray[index]);
    geneNameArray.unshift("cols regulators/rows targets");

    links.forEach((link) => {
        networkSheet[link.target][link.source + 1] = link.value;
    });

    networkSheet.unshift(geneNameArray);
    return networkSheet;
};


const convertToSheet = function (name, testSheet) {
    const singularName = name.toLowerCase().endsWith("s") ? name.substring(0, name.length - 1) : name;
    const header = singularName.includes("optimized_") ? singularName.substring(10) : singularName;
    return {
        name: name,
        data: [["id", header], ...Object.keys(testSheet).map(key => [key, testSheet[key]])]
    };
};

const buildTestSheets = testSheet => ["production_rates",
    "degradation_rates",
    "threshold_b",
    "optimized_production_rates",
    "optimized_threshold_b"
]
    .filter(name => testSheet[name])
    .map(name => convertToSheet(name, testSheet[name].data));

const buildMeta2Sheet = function (meta2DataContainer) {
    const meta2 = [];
    meta2.push(["Parameter", "Value"]);
    for (let parameter in meta2DataContainer.data.Parameters) {
        const meta2Data = meta2DataContainer.data.Parameters[parameter];
        meta2.push([parameter, meta2Data]);
    }
    meta2.push([]);
    meta2.push(["Gene", ...meta2DataContainer.data.MSE["column-headers"]]);
    for (let gene in meta2DataContainer.data.MSE.Genes) {
        const meta2GeneData = meta2DataContainer.data.MSE.Genes[gene];
        meta2.push([gene, ...meta2GeneData]);
    }
    return meta2;
};

const buildMetaSheet = function (metaDataContainer) {
    const meta = [];
    meta.push(["optimization_parameter", "value"]);
    for (let parameter in metaDataContainer.data) {
        const metaData = metaDataContainer.data[parameter];
        const cleanedUpData = Array.isArray(metaData)
            ? [parameter, ...metaData]
            : [parameter, metaData];
        meta.push(cleanedUpData);
    }
    return meta;
};

const buildExpressionSheets = function (expressions) {
    const builtExpressionSheets = [];
    Object.keys(expressions).forEach((expression) => {
        const builtSheet = { name: expression, data: []};
        Object.keys(expressions[expression]["data"]).forEach((key) => {
            const expressionData = expressions[expression]["data"][key];
            builtSheet["data"].push([key, ...expressionData]);
        });
        builtExpressionSheets.push(builtSheet);
    });
    return builtExpressionSheets;
};

const buildXlsxSheet = function (workbook) {
    const resultSheet = [];

    Object.keys(workbook).forEach((key) => {
        switch (key) {
        case "network":
            if (Object.keys(workbook.network).length > 0) {
                resultSheet.push(
                    {
                        "name": "network",
                        "data": buildNetworkSheet(workbook.network.genes, workbook.network.links)
                    }
                );
            }
            break;
        case "networkOptimizedWeights":
            if (Object.keys(workbook.networkOptimizedWeights).length > 0) {
                resultSheet.push(
                    {
                        "name": "network_optimized_weights",
                        "data": buildNetworkSheet(workbook.networkOptimizedWeights.genes,
                            workbook.networkOptimizedWeights.links)
                    }
                );
            }
            break;
        case "networkWeights":
            if (Object.keys(workbook.networkWeights).length > 0) {
                resultSheet.push(
                    {
                        "name": "network_weights",
                        "data": buildNetworkSheet(workbook.networkWeights.genes, workbook.networkWeights.links)
                    }
                );
            }
            break;
        case "meta":
            if (Object.keys(workbook.meta).length > 0) {
                resultSheet.push(
                    {
                        "name": "optimization_parameters",
                        "data": buildMetaSheet(workbook.meta)
                    }
                );
            }
            break;
        case "meta2":
            // Optimization Diagnostics sheet not properly  implemented yet.
            if (Object.keys(workbook.meta2).length > 0) {
                resultSheet.push(
                    {
                        "name": "optimization_diagnostics",
                        "data": buildMeta2Sheet(workbook.meta2)
                    }
                );
            }
            break;
        case "test":
            resultSheet.push(...buildTestSheets(workbook[key]));
            break;
        case "expression":
            resultSheet.push(...buildExpressionSheets(workbook[key]));
            break;
        default:
            break;
        }
    });

    return resultSheet;
};

module.exports = function (workbook) {
    return xlsx.build(buildXlsxSheet(workbook));
};
