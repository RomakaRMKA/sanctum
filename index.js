const charagrid = document.getElementById('charagrid');
import characterData from "./data.json" with {type: 'json'};

const characterList = characterData.characters;

class Character {
    constructor(name, title, image) {
        this.name = name;
        this.title = title;
        this.image = image;
    }
}

function generateCharacterBox(character) {
    const characterBox = document.createElement('div');
    characterBox.className = 'character-box';
    characterBox.id = character.id;
    characterBox.innerHTML = `
        <img class="character-image" src="${character.image}" alt="${character.name}">
        <h2 class="character-name">${character.name}</h2>
        <p class="character-title">${character.title}</p>
    `;
    charagrid.appendChild(characterBox);
}

function generateCharacterGrid(characterList) {
    characterList.forEach((character) => generateCharacterBox(character));
}

generateCharacterGrid(characterList);
