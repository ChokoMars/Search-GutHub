const inputSearch = document.querySelector('.search');
const inputApp = document.querySelector('.app-container');
const appCards = document.querySelector('.chosen-container');
 
function clearInputApp () {
    inputApp.innerHTML = '';
};

function showResult (repositories) {
    clearInputApp();
    
    for (let i = 0; i < 5; i++) {
        let name = repositories[i].name;
        let owner = repositories[i].owner.login;
        let stars = repositories[i].stargazers_count;
        
        let appContent = `<div class='app-content' data-owner='${owner}' data-stars='${stars}'>${name}</div>`
        inputApp.innerHTML += appContent;
    }
};

function addCard (target) {
    let name = target.textContent;
    let owner = target.dataset.owner;
    let stars = target.dataset.stars;

    appCards.innerHTML += `<div class='chosen'>Name: ${name}</br>Owner: ${owner}</br>Stars: ${stars}<button class='btn-close'></button></div>`;
};

async function searchRepos () {
    let inputValue = inputSearch.value;
    if (inputValue === '') {
        clearInputApp();
        return;
    };

    const url = new URL('https://api.github.com/search/repositories?q=Q');
    url.searchParams.append('q', inputValue);

    try {
        const res = await fetch (url);

        if (res.ok) {
            const repos = await res.json();
            showResult(repos.items);
            console.log(repos.items);
        } else {
            return null;
        }
    } catch {
        return null;
    };

};

function debounce (fn, debounceTime) {
    let timer;
    
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, debounceTime);
    }
};

const getDebounse = debounce(searchRepos, 300);
inputSearch.addEventListener('input', getDebounse);

inputApp.addEventListener('click', (event) => {
    clearInputApp();
    inputSearch.value = '';

    const target = event.target;
    if (!target.classList.contains('app-content')) {
        return;
    }

    addCard (target);
});

appCards.addEventListener('click', (event) => {
    const target = event.target;
    if (!target.classList.contains('btn-close')) {
        return;
    }

    target.parentElement.remove();
});