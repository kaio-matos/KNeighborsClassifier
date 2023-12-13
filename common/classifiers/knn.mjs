import { utils } from '../utils.mjs'

export class KNN {
    constructor(samples, k) {
        this.samples = samples
        this.samplePoints = this.samples.map(s => s.point)
        this.k = k
    }

    predict(point) {
        const indices = utils.getNearest(point, this.samplePoints, this.k)
        const nearestSamples = indices.map(i => this.samples[i])
        const labels = nearestSamples.map(s => s.label)
        const counts = {}
        for (const label of labels) {
            counts[label] = counts[label] ? counts[label] + 1 : 1
        }
        const max = Math.max(...Object.values(counts))
        const label = labels.find(l => counts[l] === max)
        return { label, nearestSamples }
    }
}
