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

const minMax = utils.normalizePoints(samples.map(s => s.point))

const featureNames = featuresFunctions.inUse.map(f => f.name)

fs.writeFileSync(constants.FEATURES, JSON.stringify({
    featureNames,
    samples: samples.map(s => ({ point: s.point, label: s.label }))
}))


fs.writeFileSync(constants.FEATURES_JS, `export default ${JSON.stringify({
    featureNames,
    samples
})};`)


fs.writeFileSync(constants.MIN_MAX_JS, `export default ${JSON.stringify(minMax)}`)



console.log("DONE")
