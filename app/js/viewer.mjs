import { SketchPad } from './sketchPad.mjs'
import { createRow, handleClick, toggleInput } from "./display.mjs";

import { utils } from "../../common/utils.mjs";
import { KNN } from '../../common/classifiers/knn.mjs'
import features from "../../common/js_objects/features.mjs";
import minMax from "../../common/js_objects/minMax.mjs";
import testing from "../../common/js_objects/testing.mjs";
import training from "../../common/js_objects/training.mjs";
import { featuresFunctions } from '../../common/featuresFunctions.mjs'

import { Chart } from "../libs/chart/chart.mjs";
import { graphics } from "../libs/chart/graphics.mjs";
import { constants } from '../../common/constants.mjs';

// function assertRateTest() {
let { featureNames } = features;

const trainingSamples = training.samples
const testingSamples = testing.samples

const K = 50
const kNN = new KNN(trainingSamples, K)

let correctCount = 0
let totalCount = 0
for (const testSample of testingSamples) {
    testSample.truth = testSample.label
    testSample.label = "?"
    const { label } = kNN.predict(testSample.point)
    testSample.label = label
    testSample.correct = testSample.label == testSample.truth
    totalCount++
    correctCount += testSample.correct ? 1 : 0
}

statisticsField.innerHTML = `<b>ACCURACY</b><br/>
                            ${correctCount}/${totalCount} (${utils.formatPercent(correctCount / totalCount)})
`

const trainingGroups = utils.groupBy(trainingSamples.slice(0, 504), "student_id");
for (let student_id in trainingGroups) {
    const samples = trainingGroups[student_id];
    const studentName = samples[0].student_name;

    createRow(container, studentName, samples);
}

const subtitle = document.createElement("h2")
subtitle.innerHTML = "TESTING"
container.appendChild(subtitle)

const testingGroups = utils.groupBy(testingSamples.slice(0, 504), "student_id");
for (let student_id in testingGroups) {
    const samples = testingGroups[student_id];
    const studentName = samples[0].student_name;

    createRow(container, studentName, samples);
}

const options = {
    size: 500,
    axesLabels: featureNames,
    styles: utils.styles,
    transparency: 0.7,
    icon: "image",
    bg: new Image()
};
options.bg.src = constants.DECISION_BOUNDARY
graphics.generateImages(utils.styles);

export const chart = new Chart(
    chartContainer,
    trainingSamples,
    options,
    handleClick
);

export const sketchPad = new SketchPad(inputContainer, onDrawingUpdate)

sketchPad.canvas.style.cssText += 'outline: 10000px solid rgba(0, 0, 0, 0.7);'
toggleInput()

function onDrawingUpdate(paths) {
    const functions = featuresFunctions.inUse.map((f) => f.function)
    const point = functions.map(f => f(paths))
    utils.normalizePoints([point], minMax)
    const { label, nearestSamples } = kNN.predict(point)
    predictedLabelContainer.innerHTML = `Is it a ${label} ?`
    chart.showDynamicPoint(point, label, nearestSamples)
}

// return {
//     chart, sketchPad, onDrawingUpdate, classify
// }
// }
// export const { chart, sketchPad, onDrawingUpdate, classify } = assertRateTest()


function displayData() {
    let { samples, featureNames } = features;

    const groups = utils.groupBy(samples.slice(0, 504), "student_id");
    for (let student_id in groups) {
        const samples = groups[student_id];
        const studentName = samples[0].student_name;

        createRow(container, studentName, samples);
    }

    const options = {
        size: 500,
        axesLabels: featureNames,
        styles: utils.styles,
        transparency: 0.7,
        icon: "image",
    };
    graphics.generateImages(utils.styles);

    const chart = new Chart(
        chartContainer,
        samples,
        options,
        handleClick
    );

    const sketchPad = new SketchPad(inputContainer, onDrawingUpdate)

    sketchPad.canvas.style.cssText += 'outline: 10000px solid rgba(0, 0, 0, 0.7);'

    function onDrawingUpdate(paths) {
        const functions = featuresFunctions.inUse.map((f) => f.function)
        const point = functions.map(f => f(paths))
        utils.normalizePoints([point], minMax)
        const { label, nearestSamples } = kNN.predict(point)
        predictedLabelContainer.innerHTML = `Is it a ${label} ?`
        chart.showDynamicPoint(point, label, nearestSamples)
    }
    return {
        chart, sketchPad, onDrawingUpdate
    }
}

// export const { chart, sketchPad, onDrawingUpdate, classify } = displayData()
