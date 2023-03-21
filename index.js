const inputWrapper = document.querySelector('.input-wrapper');
const input = createElement('input', 'search-input');
const selectRepositories = createElement('ul', 'select-repositories');
const savedRepositories = document.querySelector('.saved-repositories');
const btnDelete = createElement('button', 'btn-delete');
let result;

const startSearch = debounce(searchRepository, 500);

inputWrapper.append(input);
inputWrapper.append(selectRepositories);

input.addEventListener('keyup', startSearch);

selectRepositories.addEventListener('click', (e) => {
    let target = e.target;
    saveRepository(target);
    selectRepositories.textContent = '';
    input.value = '';
})

savedRepositories.addEventListener('click', (e) => {
    let target = e.target;

    if (target.classList.contains('btn-delete')) {
        target.parentElement.remove();
    }
})

function createElement(tagName, tagClass) {
    const element = document.createElement(tagName);

    if (tagClass) {
        element.classList.add(tagClass);
    }

    return element;
}

function debounce(fn, ms) {
    return function(...args) {
        let previousCall = this.lastCall;
        this.lastCall = Date.now();
  
        if (previousCall && this.lastCall - previousCall <= ms) {
            clearTimeout(this.lastCallTimer);
        }

        this.lastCallTimer = setTimeout(() => fn(...args), ms);
    }
}

async function searchRepository() {
    return await fetch(`https://api.github.com/search/repositories?q=${input.value}&per_page=5`)
        .then(response => response.json())
        .then(response => {

            let element;
            let item = document.querySelectorAll('.select-repositories__item');

            result = response.items;

            if (input.value == '') {
                selectRepositories.textContent = '';
                return;
            }

            if (item.length == 0) {    
                result.forEach((item, i) => {
                    element = createElement('li', 'select-repositories__item');
                    element.textContent = `${item['name']}`;
                    selectRepositories.append(element);
                    saveInfo(item, element);
                });
            
            } else {
                item.forEach((el, i) => {
                    el.textContent = `${result[i]['name']}`;
                });
            }
        })
        .catch(err => console.log('repositories not found'));
}

function saveInfo(item, el) {
    el.dataset.owner = `${item['owner']['login']}`;
    el.dataset.stars = `${item['stargazers_count']}`;
}
  
function saveRepository(el) {
    const savedRepository = createElement('div', 'saved-repositories__item');
    const name = createElement('p', 'saved-repositories__item--text');
    const owner = createElement('p', 'saved-repositories__item--text');
    const stars = createElement('p', 'saved-repositories__item--text');
    const btnDelete = createElement('button', 'btn-delete');

    name.textContent = `Name: ${el.textContent}`;
    owner.textContent = `Owner: ${el.dataset.owner}`
    stars.textContent = `Stars: ${el.dataset.stars}`

    savedRepositories.append(savedRepository);
    savedRepository.append(name);
    savedRepository.append(owner);
    savedRepository.append(stars);
    savedRepository.append(btnDelete);
}



