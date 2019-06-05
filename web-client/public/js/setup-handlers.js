import { updateApp } from "./update-app";

import {
    SET_NORMALIZATION_SIDEBAR,
    SET_NORMALIZATION_MENU,
    RESET_NORMALIZATION_SIDEBAR,
    RESET_NORMALIZATION_MENU,
    GREY_EDGES_DASHED_MENU,
    GREY_EDGES_DASHED_SIDEBAR,
    GREY_EDGE_THRESHOLD_MENU,
    GREY_EDGE_THRESHOLD_SLIDER_SIDEBAR,
    WEIGHTS_SHOW_MOUSE_OVER_CLASS,
    WEIGHTS_SHOW_ALWAYS_CLASS,
    WEIGHTS_HIDE_CLASS,
    SHOW_WEIGHTS_MOUSEOVER,
    SHOW_ALL_WEIGHTS,
    HIDE_ALL_WEIGHTS,
    COLOR_EDGES,
    BLACK_EDGES,
    LINK_DIST_SLIDER_ID,
    LINK_DIST_MENU,
    CHARGE_SLIDER_ID,
    CHARGE_MENU,
    CHARGE_DEFAULT_VALUE,
    LINK_DIST_DEFAULT_VALUE,
    LOCK_SLIDERS_BUTTON,
    LOCK_SLIDERS_MENU_OPTION,
    UNDO_SLIDERS_RESET_CLASS,
    RESET_SLIDERS_CLASS,
    RESET_SLIDERS_MENU_OPTION,
    UNDO_SLIDERS_RESET_MENU,
    GRID_LAYOUT_BUTTON,
    GRID_LAYOUT_CLASS,
    FORCE_GRAPH_CLASS,
    NODE_COLORING_TOGGLE_CLASS,
    AVG_REPLICATE_VALS_TOP_MENU,
    AVG_REPLICATE_VALS_TOP_SIDEBAR,
    AVG_REPLICATE_VALS_BOTTOM_MENU,
    AVG_REPLICATE_VALS_BOTTOM_SIDEBAR,
    LOG_FOLD_CHANGE_MAX_VALUE_SIDEBAR_BUTTON,
    LOG_FOLD_CHANGE_MAX_VALUE_MENU,
    LOG_FOLD_CHANGE_MAX_VALUE_SIDEBAR_INPUT,
    TOP_DATASET_SELECTION_SIDEBAR,
    BOTTOM_DATASET_SELECTION_SIDEBAR,
    TOP_DATASET_SELECTION_MENU,
    BOTTOM_DATASET_SELECTION_MENU,
} from "./constants";

import { setupLoadAndImportHandlers } from "./setup-load-and-import-handlers";

export const setupHandlers = grnState => {
    setupLoadAndImportHandlers(grnState);

    $(SET_NORMALIZATION_SIDEBAR).click(() => {
        grnState.normalizationMax = $("#normalization-max").val();
        updateApp(grnState);
    });

    $(SET_NORMALIZATION_MENU).change(() => {
        grnState.normalizationMax = $(SET_NORMALIZATION_MENU).val();
        updateApp(grnState);
    });

    $(RESET_NORMALIZATION_SIDEBAR).click(() => {
        grnState.normalizationMax = grnState.resetNormalizationMax;
        updateApp(grnState);
    });

    $(RESET_NORMALIZATION_MENU).click(() => {
        grnState.normalizationMax = grnState.resetNormalizationMax;
        updateApp(grnState);
    });

    $(GREY_EDGES_DASHED_SIDEBAR).change(() => {
        grnState.dashedLine = $(GREY_EDGES_DASHED_SIDEBAR).prop("checked");
        updateApp(grnState);
    });

    $(GREY_EDGES_DASHED_MENU).click(() => {
        grnState.dashedLine = !$(GREY_EDGES_DASHED_MENU).prop("checked");
        updateApp(grnState);
    });

    $(GREY_EDGE_THRESHOLD_MENU).change(() => {
        grnState.grayEdgeThreshold = Math.round($(GREY_EDGE_THRESHOLD_MENU).val());
        updateApp(grnState);
    });

    $(GREY_EDGE_THRESHOLD_SLIDER_SIDEBAR).change(() => {
        grnState.grayEdgeThreshold = Math.round($(GREY_EDGE_THRESHOLD_SLIDER_SIDEBAR).val() * 100);
        updateApp(grnState);
    });

    $(WEIGHTS_SHOW_MOUSE_OVER_CLASS).click(() => {
        grnState.edgeWeightDisplayOption = SHOW_WEIGHTS_MOUSEOVER;
        updateApp(grnState);
    });


    $(WEIGHTS_SHOW_ALWAYS_CLASS).click(() => {
        grnState.edgeWeightDisplayOption = SHOW_ALL_WEIGHTS;
        updateApp(grnState);
    });

    $(WEIGHTS_HIDE_CLASS).click(() => {
        grnState.edgeWeightDisplayOption = HIDE_ALL_WEIGHTS;
        updateApp(grnState);
    });

    $(COLOR_EDGES).click(() => {
        grnState.colorOptimal = true;
        updateApp(grnState);
    });

    $(BLACK_EDGES).click(() => {
        grnState.colorOptimal = false;
        updateApp(grnState);
    });

// Sliders Code
    var valueValidator = (min, max, value) => {
        return Math.min(max, Math.max(min, value));
    };

    var linkDistValidator = value => {
        return valueValidator(1, 1000, value);
    };

    var chargeValidator = value => {
        return valueValidator(-2000, 0, value);
    };

    $(LINK_DIST_MENU).change(() => {
        var value = linkDistValidator($(LINK_DIST_MENU).val());
        grnState.linkDistanceSlider.currentVal = value;
        updateApp(grnState);
    });

    $(LINK_DIST_SLIDER_ID).change(() => {
        var value = linkDistValidator($(LINK_DIST_SLIDER_ID).val());
        grnState.linkDistanceSlider.currentVal = value;
        updateApp(grnState);
    });

    $(CHARGE_MENU).change(() => {
        var value = chargeValidator($(CHARGE_MENU).val());
        grnState.chargeSlider.currentVal = value;
        updateApp(grnState);
    });

    $(CHARGE_SLIDER_ID).change(() => {
        var value = chargeValidator($(CHARGE_SLIDER_ID).val());
        grnState.chargeSlider.currentVal = value;
        updateApp(grnState);
    });

    $(LOCK_SLIDERS_MENU_OPTION).click(() => {
        grnState.slidersLocked = !grnState.slidersLocked;
        updateApp(grnState);
    });

    $(LOCK_SLIDERS_BUTTON).click(() => {
        grnState.slidersLocked = !grnState.slidersLocked;
        updateApp(grnState);
    });

    $(RESET_SLIDERS_CLASS).click(() => {
        grnState.chargeSlider.backup = grnState.chargeSlider.currentVal;
        grnState.linkDistanceSlider.backup = grnState.linkDistanceSlider.currentVal;
        grnState.chargeSlider.currentVal = CHARGE_DEFAULT_VALUE;
        grnState.linkDistanceSlider.currentVal = LINK_DIST_DEFAULT_VALUE;
        grnState.showUndoReset = true;
        updateApp(grnState);
    });

    $(RESET_SLIDERS_MENU_OPTION).click(() => {
        grnState.chargeSlider.backup = grnState.chargeSlider.currentVal;
        grnState.linkDistanceSlider.backup = grnState.linkDistanceSlider.currentVal;
        grnState.chargeSlider.currentVal = CHARGE_DEFAULT_VALUE;
        grnState.linkDistanceSlider.currentVal = LINK_DIST_DEFAULT_VALUE;
        grnState.showUndoReset = true;
        updateApp(grnState);
    });

    $(UNDO_SLIDERS_RESET_CLASS).click(() => {
        grnState.chargeSlider.currentVal = grnState.chargeSlider.backup;
        grnState.linkDistanceSlider.currentVal = grnState.linkDistanceSlider.backup ;
        grnState.showUndoReset = false;
        updateApp(grnState);
    });

    $(UNDO_SLIDERS_RESET_MENU).click(() => {
        grnState.chargeSlider.currentVal = grnState.chargeSlider.backup;
        grnState.linkDistanceSlider.currentVal = grnState.linkDistanceSlider.backup ;
        grnState.showUndoReset = false;
        updateApp(grnState);
    });

// Grid buttons
    $(GRID_LAYOUT_BUTTON).click(() => {
        if (grnState.graphLayout === "FORCE_GRAPH") {
            grnState.graphLayout = "GRID_LAYOUT";
            grnState.slidersLocked = true;
        } else if (grnState.graphLayout === "GRID_LAYOUT") {
            grnState.graphLayout = "FORCE_GRAPH";
            grnState.slidersLocked = false;
        }
        updateApp(grnState);
    });

    $(FORCE_GRAPH_CLASS).click(() => {
        grnState.graphLayout = "FORCE_GRAPH";
        grnState.slidersLocked = false;
        updateApp(grnState);

    });

    $(GRID_LAYOUT_CLASS).click(() => {
        grnState.graphLayout = "GRID_LAYOUT";
        grnState.slidersLocked = true;
        updateApp(grnState);
    });

// Node Coloring
    $(NODE_COLORING_TOGGLE_CLASS).click(() => {
        grnState.nodeColoring.nodeColoringEnabled = !grnState.nodeColoring.nodeColoringEnabled;
        updateApp(grnState);
    });

    $(AVG_REPLICATE_VALS_TOP_SIDEBAR).change(() => {
        grnState.nodeColoring.averageTopDataset = !grnState.nodeColoring.averageTopDataset;
        updateApp(grnState);
    });

    $(AVG_REPLICATE_VALS_TOP_MENU).click(() => {
        grnState.nodeColoring.averageTopDataset = !grnState.nodeColoring.averageTopDataset;
        updateApp(grnState);
    });

    $(AVG_REPLICATE_VALS_BOTTOM_SIDEBAR).change(() => {
        grnState.nodeColoring.averageBottomDataset = !grnState.nodeColoring.averageBottomDataset;
        updateApp(grnState);
    });

    $(AVG_REPLICATE_VALS_BOTTOM_MENU).click(() => {
        grnState.nodeColoring.averageBottomDataset = !grnState.nodeColoring.averageBottomDataset;
        updateApp(grnState);
    });

    $(LOG_FOLD_CHANGE_MAX_VALUE_SIDEBAR_BUTTON).click(() => {
        var value = $(LOG_FOLD_CHANGE_MAX_VALUE_SIDEBAR_INPUT).val();
        grnState.nodeColoring.logFoldChangeMaxValue = value;
        updateApp(grnState);
    });

    $(LOG_FOLD_CHANGE_MAX_VALUE_MENU).change(() => {
        var value = $(LOG_FOLD_CHANGE_MAX_VALUE_MENU).val();
        grnState.nodeColoring.logFoldChangeMaxValue = value;
        updateApp(grnState);
    });

    $(TOP_DATASET_SELECTION_SIDEBAR).change(() => {
        var selection = $(TOP_DATASET_SELECTION_SIDEBAR).find(":selected").attr("value");
        grnState.nodeColoring.topDataset = selection;
        if (grnState.nodeColoring.bottomDataSameAsTop) {
            grnState.nodeColoring.bottomDataset = selection;
        }
        updateApp(grnState);
    });

    $(TOP_DATASET_SELECTION_MENU).click(() => {
        var selection = $(this).attr("value");
        grnState.nodeColoring.topDataset = selection;
        if (grnState.nodeColoring.bottomDataSameAsTop) {
            grnState.nodeColoring.bottomDataset = selection;
        }
        updateApp(grnState);
    });

    $(BOTTOM_DATASET_SELECTION_SIDEBAR).change(() => {
        var selection = $(BOTTOM_DATASET_SELECTION_SIDEBAR).find(":selected").attr("value");
        grnState.nodeColoring.bottomDataset = selection;
        if (grnState.nodeColoring.bottomDataset === "Same as Top Dataset") {
            grnState.nodeColoring.bottomDataset = grnState.nodeColoring.topDataset;
            grnState.nodeColoring.bottomDataSameAsTop = true;
        } else {
            grnState.nodeColoring.bottomDataSameAsTop = false;
        }
        updateApp(grnState);
    });

    $(BOTTOM_DATASET_SELECTION_MENU).click(() => {
        var selection = $(this).attr("value");
        grnState.nodeColoring.bottomDataset = selection;
        if (selection === "Same as Top Dataset") {
            grnState.nodeColoring.bottomDataset = grnState.nodeColoring.topDataset;
            grnState.nodeColoring.bottomDataSameAsTop = true;
        } else {
            grnState.nodeColoring.bottomDataSameAsTop = false;
            grnState.nodeColoring.bottomDataset = selection;
        }
        updateApp(grnState);
    });
};
