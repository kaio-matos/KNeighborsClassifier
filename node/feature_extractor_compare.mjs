import * as fs from 'node:fs';

import { constants } from "../common/constants.mjs";
import { featuresFunctions } from "../common/featuresFunctions.mjs";
import { utils } from "../common/utils.mjs";

console.log("EXTRACTING FEATURES...")

const samples = JSON.parse(fs.readFileSync(constants.SAMPLES))


for (const sample of samples) {
    const paths = JSON.parse(
        fs.readFileSync(`${constants.JSON_DIR}/${sample.id}.json`)
    )

    const functions = featuresFunctions.inUse.map((f) => f.function)
    sample.point = functions.map(f => f(paths))
}

const featureNames = featuresFunctions.inUse.map(f => f.name)

// -----------------------------------------------------

console.log("\t\tGENERATING SPLITS...")

const trainingAmount = samples.length * 0.5

const training = []
const testing = []

for (let i = 0; i < samples.length; i++) {
    if (i < trainingAmount) {
        training.push(samples[i])
    } else {
        testing.push(samples[i])
    }
}

const minMax = utils.normalizePoints(training.map(s => s.point))
utils.normalizePoints(testing.map(s => s.point), minMax)

console.log("\t\tDONE WITH SPLITS...")

// -----------------------------------------------------

fs.writeFileSync(constants.FEATURES, JSON.stringify({
    featureNames,
    samples: samples.map(s => ({ point: s.point, label: s.label }))
}))


fs.writeFileSync(constants.FEATURES_JS, `export default ${JSON.stringify({
    featureNames,
    samples
})};`)


// -------------------

fs.writeFileSync(constants.TRAINING_CSV, utils.toCSV([...featureNames, "Label"], training.map(a => [...a.point, a.label])))

fs.writeFileSync(constants.TRAINING, JSON.stringify({
    featureNames,
    samples: training.map(s => ({ point: s.point, label: s.label }))
}))

fs.writeFileSync(constants.TRAINING_JS, `export default ${JSON.stringify({
    featureNames,
    samples: training
})}`)

// -------------------

fs.writeFileSync(constants.TESTING_CSV, utils.toCSV([...featureNames, "Label"], testing.map(a => [...a.point, a.label])))

fs.writeFileSync(constants.TESTING, JSON.stringify({
    featureNames,
    samples: testing.map(s => ({ point: s.point, label: s.label }))
}))

fs.writeFileSync(constants.TESTING_JS, `export default ${JSON.stringify({
    featureNames,
    samples: testing
})}`)

// -------------------

fs.writeFileSync(constants.MIN_MAX_JS, `export default ${JSON.stringify(minMax)}`)



console.log("DONE")
