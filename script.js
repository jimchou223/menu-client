const dangerFilterNewRow = document.getElementById('danger-filter-new-row')
const dangerFilterDeleteRow = document.getElementById('danger-filter-remove-row')
const dangerFilterInput = document.getElementById('danger-filter-input')

const warningFilterNewRow = document.getElementById('warning-filter-new-row')
const warningFilterDeleteRow = document.getElementById('warning-filter-remove-row')
const warningFilterInput = document.getElementById('warning-filter-input')

const filterInput = document.getElementById('filter-input')

const clear = document.getElementById('clear')

const dangerFilterNode = document.getElementById('danger-filter-node')
const warningFilterNode = document.getElementById('warning-filter-node')

const resultArea = document.getElementById('result-area')

dangerFilterNewRow.addEventListener('click', function (e) {
    e.preventDefault()
    let newInput = document.createElement('input')
    newInput.setAttribute('class', 'danger-filter-input form-control')
    newInput.required = true
    if (dangerFilterNode.childNodes.length <= 13) {
        dangerFilterNode.appendChild(newInput)
    }

})

dangerFilterDeleteRow.addEventListener('click', function (e) {
    e.preventDefault()
    if (dangerFilterNode.childNodes.length > 3) {
        dangerFilterNode.removeChild(dangerFilterNode.lastChild)
    }
})

warningFilterNewRow.addEventListener('click', function (e) {
    e.preventDefault()
    let newInput = document.createElement('input')
    newInput.setAttribute('class', 'warning-filter-input form-control')
    newInput.required = true
    if (warningFilterNode.childNodes.length <= 13) {
        warningFilterNode.appendChild(newInput)
    }

})

warningFilterDeleteRow.addEventListener('click', function (e) {
    e.preventDefault()
    if (warningFilterNode.childNodes.length > 3) {
        warningFilterNode.removeChild(warningFilterNode.lastChild)
    }
})

function Package(set) {
    this.set = set,
        // this.content = []
        this.score = 0
}

function findUnique(arr) {
    let setList = []
    arr.forEach(el => {
        if (!setList.includes(el.set)) {
            setList.push(el.set)
        }
    })
    return setList
}

function createUniqueArr(arr) {
    let uniqueArr = []
    arr.forEach((el) => {
        let newEl = new Package(el)
        uniqueArr.push(newEl)
    })
    return uniqueArr
}

function categorize(arr, data) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < data.length; j++) {
            if (arr[i].set == data[j].set) {
                arr[i].content.push(data[j])
            }
        }
    }
    return arr

}


function checkIngredientDanger(arr, filterArr) {
    arr.forEach((el) => {
        for (let i = 0; i < el.ingredients.length; i++) {
            for (let j = 0; j < filterArr.danger.length; j++) {
                if (el.ingredients[i].includes(filterArr.danger[j])) {
                    el.danger = true;
                    return
                }
            }

        }
    })
    console.log(arr)
    return arr
}

function checkIngredientWarning(arr, filterArr) {
    arr.forEach((el) => {
        for (let i = 0; i < el.ingredients.length; i++) {
            for (let j = 0; j < filterArr.warning.length; j++) {
                if (el.ingredients[i].includes(filterArr.warning[j])) {
                    el.warning = true;
                    return
                }
            }

        }
    })
    console.log(arr)
    return arr
}

// sort the array by score
function sortArr(arr) {
    arr.sort(function (a, b) {
        a = a.score
        b = b.score
        return b - a
    })
}



// count the score for each set
function countRank(arr, uniqueArr) {
    arr.forEach((el) => {
        for (let i = 0; i < uniqueArr.length; i++) {
            if (el.ok && el.set === uniqueArr[i].set) {
                uniqueArr[i].score++
            }
        }
    })
}

// render the arr according to the chosenSet
function pickTheChosen(arr, uniqueArr) {
    if (uniqueArr.length === 1) {
        let newArr = arr.filter((el) => {
            return el.set == uniqueArr[0].set
        })
        return newArr
    } else {
        return arr
    }
}

function showResult(arr, chosenSet, uniqueArr) {
    resultArea.innerHTML = ''
    if (chosenSet !== '') {
        uniqueArr = uniqueArr.filter((el) => {
            return el.set === chosenSet
        })
    }
    uniqueArr.forEach((el) => {
        let resultEl = document.createElement('div')
        let title = document.createElement('h3')
        title.innerHTML = `Set: ${el.set}`
        resultEl.appendChild(title)
        resultEl.setAttribute('class', `result-${el.set} card`)
        resultEl.setAttribute('style', `background-color: #f0f9ff; padding: 1em; margin: 1em 0;`)
        resultArea.appendChild(resultEl)
    })

    arr = pickTheChosen(arr, uniqueArr)

    arr.forEach((el) => {
        targetArea = document.querySelector(`.result-${el.set}`)
        if (el.danger) {
            targetArea.innerHTML += `<div><div style="display: flex;"><i class="fas fa-skull-crossbones icon-danger"></i><p class="card-text dishname">${el.category}. ${el.name}</p></div> <p class="detail">${el.ingredients}<p></div>`
        } else if (el.warning) {
            targetArea.innerHTML += `<div><div style="display: flex;"><i class="fas fa-exclamation-triangle icon-warning"></i><p class="card-text dishname">${el.category}. ${el.name}</p></div> <p class="detail">${el.ingredients}<p></div>`
        } else {
            targetArea.innerHTML += `<div><div><p class="card-text dishname-no-i">${el.category}. ${el.name}</p></div> <p class="detail">${el.ingredients}</p></div>`
        }
    })
}



filterInput.addEventListener('submit', (e) => {
    e.preventDefault()
    console.log('click')
    const dangerFiltersInput = document.querySelectorAll('.danger-filter-input')

    const warningFiltersInput = document.querySelectorAll('.warning-filter-input')
    console.log(warningFiltersInput)
    const chosenSet = document.getElementById('chosen-set').value
    let filters = {
        set: '',
        danger: [],
        warning: []

    }
    filters.set = chosenSet
    dangerFiltersInput.forEach(el => {
        if (el.value != '') {
            filters.danger.push(el.value)
        }

    })
    warningFiltersInput.forEach(el => {
        if (el.value != '') {
            filters.warning.push(el.value)
        }

    })
    console.log(filters)
    if (filters.danger.length !== 0) {
        // e.preventDefault()
        $.ajax({
            // url: 'http://localhost:3000/search',
            url: 'https://menu-server-jim.herokuapp.com/search',
            type: 'POST',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(filters),
            success: async function (data, textStatus, jqXHR) {
                let uniqueSetList = findUnique(data)
                let uniqueArr = createUniqueArr(uniqueSetList)
                console.log(data)
                checkIngredientDanger(data, filters)
                checkIngredientWarning(data, filters)
                countRank(data, uniqueArr)
                sortArr(uniqueArr)
                showResult(data, chosenSet, uniqueArr)


            }
        })
    }

})


clear.addEventListener('click', function () {
    location.reload();
})

