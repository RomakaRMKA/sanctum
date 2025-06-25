const charagrid = document.getElementById('charagrid');

async function fetchCharacterOrder() {
    const res = await fetch('characters/order.json');
    if (!res.ok) return [];
    return await res.json();
}

async function fetchCharacterData(dir) {
    let data = null;
    try {
        const res = await fetch(`characters/${dir}/data.json`);
        if (res.ok) {
            data = await res.json();
        }
    } catch (e) {
        data = null;
    }
    // Try jpg first, then png
    let imageUrl = `characters/${dir}/assets/portrait.jpg`;
    let imgRes = await fetch(imageUrl);
    if (!imgRes.ok) {
        imageUrl = `characters/${dir}/assets/portrait.png`;
        imgRes = await fetch(imageUrl);
        if (!imgRes.ok) imageUrl = 'assets/placeholder.jpg';
    }
    return {
        id: data && data.id ? data.id : dir,
        name: data && data.name ? data.name : dir,
        title: data && data.title ? data.title : 'Missing Data',
        image: imageUrl,
    };
}

async function generateCharacterGrid() {
    charagrid.innerHTML = '';
    const order = await fetchCharacterOrder();
    for (const dir of order) {
        const character = await fetchCharacterData(dir);
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
}

generateCharacterGrid();
