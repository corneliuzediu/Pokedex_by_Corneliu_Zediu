// CONSTANTS

colors = {
    'normal': "#BBBBAD",
    'grass': "#48D0B0",
    'fire': "#FB6D6C",
    'water': "#76BDFD",
    'fighting': "#A55744",
    'flying': "#7AA4FF",

    'poison': "#A95EA1",
    'ground': "peru",
    'rock': "#CEBC72",
    'bug': "#C2D11E",
    'ghost': "#7973D5",
    'electric': "#FFD86F",

    'psychic': "#FE64B3",
    'ice': "#95F1FE",
    'dragon': "#8C76FF",
    'dark': "#8B6653",
    'steel': "#C4C2DA",
    'fairy': "#FBACFF"
}


// VARIABLES
let pokemonList = [];
let searchPokemonList = [];
let generalInfoBool = true;
let cardOpen = false;
let isLoading = false;
let limit = 150;
let next;
let previous;

// FUNTIONS

const fetchPokemon = () => {
    if (!isLoading) {
        let promises = []  //Makes an array of all the promisses from feth function
        for (let i = 1; i <= limit; i++) {
            const url = `https://pokeapi.co/api/v2/pokemon/${i}`; // Base URL
            promises.push(fetch(url).then((result) => { return result.json() })); // Transform the feth into json format
        }

        Promise.all(promises).then(result => { // Provides all the pokemons at the same time 
            const pokemon = result.map((data) =>
            ({
                name: data.name,
                id: data.id,
                image: data['sprites']['other']['official-artwork']['front_default'],
                types: data.types,
            }))
            pokemon.forEach((poke) => pokemonList.push(poke))
            displayPokemonCard(pokemonList)
        })
    }
}

const displayPokemonCard = (pokemon) => {
    const pokeboard = document.getElementById("cards__wrapper");
    const pokemonHTMLString = pokemon.map(pokemon => templateCardDiv(pokemon)).join("");
    pokeboard.innerHTML = pokemonHTMLString;
}

const pokemonStats = async (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    response = await fetch(url)
    data = await response.json()
    generateStatsDiv(data);
    generalInfoBool ? showGeneralInfo() : showMainStats()
    showBaseStatsOnClick()

}

function closeStats() {
    cardOpen = false;
    document.getElementById('stats__wrapper').classList.add('d-none');
    document.querySelector('body').style.overflowY = ('unset');
    document.getElementById('cards__wrapper').classList.remove('blur');
}

function showBaseStatsOnClick() {
    cardOpen = true
    document.getElementById('stats__wrapper').classList.remove('d-none');
}


function showMainStats() {
    generalInfoBool = false
    document.getElementById('more__info--container').classList.add('d-none')
    document.getElementById('more__info--button').classList.remove('heighlight')
    document.getElementById('base__stats--container').classList.remove('d-none')
    document.getElementById('base__stats--button').classList.add('heighlight')
}


function showGeneralInfo() {
    generalInfoBool = true
    document.getElementById('more__info--container').classList.remove('d-none')
    document.getElementById('more__info--button').classList.add('heighlight')
    document.getElementById('base__stats--container').classList.add('d-none')
    document.getElementById('base__stats--button').classList.remove('heighlight')
}

function generateStatsDiv(i) {
    let stats_container = document.getElementById('stats__container');
    stats_container.innerHTML = templateCardStatDiv(i);
}

//Stop Propagation
function stopPropagation(event) {
    event.stopPropagation();
}


//Search for pokemon
function searchPokemon(event) {
    searchPokemonList = pokemonList
    let searchInput = event.target.value.toLowerCase();
    let filterPokemon = searchPokemonList.filter((pokemon) => {
        return (pokemon['name'].toLowerCase().includes(searchInput));
    })
    displayPokemonCard(filterPokemon)
    searchPokemonList = filterPokemon
}


function clearSearch(event) {
    searchInput = 0
    searchPokemon(event)
    displayPokemonCard(pokemonList)
}


// The funtions are called when the DOM Content is full loaded 
document.addEventListener("DOMContentLoaded", () => {
    getControllers()
})


// Use arrow to navigate between the cards
function getControllers() {
    document.addEventListener('keyup', (e) => {
        if (cardOpen) {
            if (e.keyCode == 39) pokemonStats(next);        // Right arrow
            if (e.keyCode == 37) pokemonStats(previous);    // Left arrow
            if (e.keyCode == 27) closeStats();              // ESC key
        }
    })
}


const fetchMorePokemon = () => {
    let newLimit = limit + 20;
    if (!isLoading) {
        let promises = []  //Makes an array of all the promisses from feth function
        for (let i = limit + 1; i <= newLimit; i++) {
            const url = `https://pokeapi.co/api/v2/pokemon/${i}`; // Base URL
            promises.push(fetch(url).then((result) => { return result.json() })); // Transform the feth into json format
        }

        Promise.all(promises).then(result => { // Provides all the pokemons at the same time 
            const pokemon = result.map((data) =>
            ({
                name: data.name,
                id: data.id,
                image: data['sprites']['other']['official-artwork']['front_default'],
                types: data.types,
            }))
            debugger
            pokemonList = pokemonList.concat(pokemon)
            displayPokemonCard(pokemonList)
        })
        limit = newLimit
        pokemonList = pokemonList
    }
}

const getIndexInPokemonList = (clickedPokemon) => {
    const index = pokemonList.findIndex(pokemon => pokemon.id === clickedPokemon['id'])
    return index
}

const changePokemonCard = (index, direction) => {
    debugger
    if (limit == searchPokemonList.length) {
        pokemonStats(direction)
    } else if (searchPokemonList.length == 1) {
        console.log("just one piece")
    } else {
        let newIndex = searchPokemonList.findIndex(pokemon => pokemon['id'] === index);
        // debugger
        if (index < direction && newIndex <= searchPokemonList.length) pokemonStats((searchPokemonList[newIndex + 1].id));
        if (index > direction && newIndex >= 1) pokemonStats((searchPokemonList[newIndex - 1].id));
    }
}


fetchPokemon();



