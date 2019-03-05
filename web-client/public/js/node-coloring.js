import {
  DEFAULT_MAX_LOG_FOLD_CHANGE,
  MAX_NUM_CHARACTERS_DROPDOWN,
  NODE_COLORING_MENU,
  BOTTOM_DATASET_SELECTION_SIDEBAR,
  TOP_DATASET_SELECTION_SIDEBAR,
  NODE_COLORING_TOGGLE_SIDEBAR,
  AVG_REPLICATE_VALS_BOTTOM_SIDEBAR,
  AVG_REPLICATE_VALS_TOP_SIDEBAR,
  AVG_REPLICATE_VALS_TOP_MENU,
  AVG_REPLICATE_VALS_BOTTOM_MENU,
  NODE_COLORING_TOGGLE_MENU,
  TOP_DATASET_SELECTION_MENU,
  BOTTOM_DATASET_SELECTION_MENU,
  LOG_FOLD_CHANGE_MAX_VALUE_CLASS,
  ENDS_IN_EXPRESSION_REGEXP,
} from "./constants";

import { grnState } from "./grnstate";

var shortenExpressionSheetName = function (name) {
    return (name.length > MAX_NUM_CHARACTERS_DROPDOWN) ?
      (name.slice(0, MAX_NUM_CHARACTERS_DROPDOWN) + "...") : name;
};

export var hasExpressionData = function (sheets) {
    for (var property in sheets) {
        if (property.match(ENDS_IN_EXPRESSION_REGEXP)) {
            return true;
        }
    }
    return false;
};

export var nodeColoringController = {

    // renderNodeColoring: function () { }, // defined in graph.js

    initialize: function () {
        $(NODE_COLORING_TOGGLE_SIDEBAR).val("Enable Node Coloring");
        $(AVG_REPLICATE_VALS_TOP_SIDEBAR).prop("checked", true);
        $(AVG_REPLICATE_VALS_BOTTOM_SIDEBAR).prop("checked", true);
        $(NODE_COLORING_TOGGLE_SIDEBAR).val("Disable Node Coloring");

        // Initialize Menu Bar
        $(AVG_REPLICATE_VALS_TOP_MENU + " span").addClass("glyphicon-ok");
        $(AVG_REPLICATE_VALS_TOP_MENU).prop("checked", true);

        $(AVG_REPLICATE_VALS_BOTTOM_MENU + " span").addClass("glyphicon-ok");
        $(AVG_REPLICATE_VALS_BOTTOM_MENU).prop("checked", true);

        $(NODE_COLORING_TOGGLE_MENU + " span").removeClass("glyphicon-ok");
        $(LOG_FOLD_CHANGE_MAX_VALUE_CLASS).val(DEFAULT_MAX_LOG_FOLD_CHANGE);
    },

    resetDatasetDropdownMenus: function (network) {

        var createHTMLforDataset = function (name) {
            return `
            <li class=\"dataset-option node-coloring-menu\" value=\"${name}\">
              <a>
                <span class=\"glyphicon\"></span>
                &nbsp;${name}
              </a>
            </li>`;
        };

        var nodeColoringOptions = [];
        for (var property in network.expression) {
            if (property.match(ENDS_IN_EXPRESSION_REGEXP)) {
                nodeColoringOptions.push({value: property});
            }
        }
        $(BOTTOM_DATASET_SELECTION_SIDEBAR).empty();
        $(TOP_DATASET_SELECTION_SIDEBAR).empty();

        $(".dataset-option").remove(); // clear all menu dataset options

        $(BOTTOM_DATASET_SELECTION_SIDEBAR).append($("<option>")
            .attr("value", "Same as Top Dataset").text("Same as Top Dataset"));

        $(BOTTOM_DATASET_SELECTION_MENU).append(createHTMLforDataset("Same as Top Dataset"));

        nodeColoringOptions.forEach(function (option) {
            var shortenedSheetName = shortenExpressionSheetName(option.value);
            $(TOP_DATASET_SELECTION_SIDEBAR).append($("<option>")
              .attr("value", option.value).text(shortenedSheetName));
            $(TOP_DATASET_SELECTION_MENU)
              .append(createHTMLforDataset(option.value));
            $(BOTTOM_DATASET_SELECTION_SIDEBAR).append($("<option>")
              .attr("value", option.value).text(shortenedSheetName));
            $(BOTTOM_DATASET_SELECTION_MENU)
              .append(createHTMLforDataset(option.value));
        });

        $("#topDatasetDropdownMenu li a span").first().addClass("glyphicon-ok");
        $("#bottomDatasetDropdownMenu li a span").first().addClass("glyphicon-ok");
    },

    isNewWorkbook: function (name) {
        return grnState.nodeColoring.lastDataset === null || grnState.nodeColoring.lastDataset !== name;
    },

    showNodeColoringMenus: function () {
        if ($(NODE_COLORING_MENU).hasClass("hidden")) {
            $(NODE_COLORING_MENU).removeClass("hidden");
        }
        if ($(".node-coloring-menu").hasClass("disabled")) {
            $(".node-coloring-menu").removeClass("disabled");
        }
    },

    disableNodeColoringMenus: function () {
        if (!$(NODE_COLORING_MENU).hasClass("hidden")) {
            $(NODE_COLORING_MENU).addClass("hidden");
        }
        if (!$(".node-coloring-menu").hasClass("disabled")) {
            $(".node-coloring-menu").addClass("disabled");
        }
    },

    reload: function (network, name) {
        if (hasExpressionData(network.expression)) {
            this.showNodeColoringMenus();
            if (this.isNewWorkbook(name)) {
                this.initialize();
                grnState.nodeColoring.lastDataset = name;
                this.resetDatasetDropdownMenus(network);
            }
            grnState.nodeColoring.topDataset = $(TOP_DATASET_SELECTION_SIDEBAR).find(":selected").attr("value");
            if ($(BOTTOM_DATASET_SELECTION_SIDEBAR).find(":selected").attr("value") === "Same as Top Dataset") {
                grnState.nodeColoring.bottomDataset = grnState.nodeColoring.topDataset;
                grnState.nodeColoring.bottomDataSameAsTop = true;
            } else {
                grnState.nodeColoring.bottomDataset =
                        $(BOTTOM_DATASET_SELECTION_SIDEBAR).find(":selected").attr("value");
                grnState.nodeColoring.bottomDataSameAsTop = false;
            }
        } else {
            this.disableNodeColoringMenus();
        }
    },
};
