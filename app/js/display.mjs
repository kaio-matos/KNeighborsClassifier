import { constants } from '../../common/constants.mjs'
import { utils } from '../../common/utils.mjs'
import { chart } from './viewer.mjs'
import { sketchPad } from './viewer.mjs'

export function createRow(container, studentName, samples) {
    const row = document.createElement('div')

    row.classList.add("row")
    container.appendChild(row)

    const rowLabel = document.createElement("div")
    rowLabel.innerHTML = studentName
    rowLabel.classList.add("rowLabel")
    row.appendChild(rowLabel)

    for (let sample of samples) {
        const { id, label, student_id, correct } = sample

        const sampleContainer = document.createElement('div')
        sampleContainer.id = "sample_" + id
        sampleContainer.onclick = () => {
            handleClick(sample, false)
        }
        sampleContainer.classList.add("sampleContainer")
        if (correct) {
            sampleContainer.style.backgroundColor = "lightgreen"
        }

        const sampleLabel = document.createElement("div")
        sampleLabel.innerHTML = label
        sampleContainer.appendChild(sampleLabel)

        const img = document.createElement("img")
        img.src = `${constants.IMG_DIR}/${id}.png`
        img.classList.add("thumb")

        if (utils.flaggedUsers.includes(student_id)) {
            img.classList.add("blur")
        }

        sampleContainer.appendChild(img)
        row.appendChild(sampleContainer)
    }
}

export function handleClick(sample, doScroll = true) {
    const deemphasize = () => [...document.querySelectorAll('.emphasize')].forEach(e => e.classList.remove('emphasize'))
    deemphasize()

    if (!sample) {
        return
    }

    const el = document.getElementById(`sample_${sample.id}`)

    if (el.classList.contains('emphasize')) {
        el.classList.remove("emphasize")
        chart.selectSample(null)
        return
    }

    el.classList.add("emphasize")
    if (doScroll) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    chart.selectSample(sample)
}

export function toggleInput() {
    if (inputContainer.style.display == 'none') {
        inputContainer.style.display = 'block'
        sketchPad.triggerUpdate()
    } else {
        inputContainer.style.display = 'none'
        chart?.hideDynamicPoint()
    }
}

window.toggleInput = toggleInput
