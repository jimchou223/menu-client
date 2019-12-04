const filterNewRow = document.getElementById('filter-new-row')
const filterDeleteRow = document.getElementById('filter-remove-row')
const filterInput = document.getElementById('filter-input')

const clear = document.getElementById('clear')

const filterNode = document.getElementById('filter-node')
const resultArea = document.getElementById('result-area')

filterNewRow.addEventListener('click', function (e) {
    e.preventDefault()
    let newInput = document.createElement('input')
    newInput.setAttribute('class', 'filter-input form-control')
    newInput.required = true
    if (filterNode.childNodes.length <= 13) {
        filterNode.appendChild(newInput)
    }

})

filterDeleteRow.addEventListener('click', function (e) {
    e.preventDefault()
    if (filterNode.childNodes.length > 3) {
        filterNode.removeChild(filterNode.lastChild)
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


function checkIngredient(arr, filterArr) {
    arr.forEach((el) => {
        for (let i = 0; i < el.ingredients.length; i++) {
            for (let j = 0; j < filterArr.length; j++) {
                if (el.ingredients[i].includes(filterArr[j])) {
                    el.ok = false;
                    return
                } else {
                    el.ok = true
                }
            }

        }
    })
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
        if (el.ok) {
            targetArea.innerHTML += `<div><p style="margin-top: 1em; padding-left: 1em; font-size: 1.5em;" class="card-text">${el.index}. ${el.name}</p> <p style="font-size: 0.8em; margin-left: 2em;">Ingredient: ${el.ingredients}</p></div>`
        } else {
            targetArea.innerHTML += `<div><p style="margin-top: 1em; font-size: 1.5em;" class="card-text"><i style="color: red;" class="fas fa-skull-crossbones"></i> ${el.index}. ${el.name}</p> <p style="font-size: 0.8em; margin-left: 2em;">Ingredient: ${el.ingredients}<p></div>`
        }
    })
}



filterInput.addEventListener('submit', (e) => {
    console.log('start')
    const filtersInput = document.querySelectorAll('.filter-input')
    const chosenSet = document.getElementById('chosen-set').value
    let filters = {
        set: '',
        filters: []
    }
    filtersInput.forEach(el => {
        if (el.value != '') {
            filters.filters.push(el.value)
        }

    })
    if (filters.filters.length !== 0) {
        e.preventDefault()
        $.ajax({
            url: 'https://menu-server-jim.herokuapp.com/search',
            type: 'POST',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(filters),
            success: async function (data, textStatus, jqXHR) {
                let uniqueSetList = findUnique(data)
                let uniqueArr = createUniqueArr(uniqueSetList)
                checkIngredient(data, filters.filters)
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

