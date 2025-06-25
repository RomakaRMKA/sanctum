document.addEventListener('DOMContentLoaded', () => {
    const charList = document.getElementById('character-list');
    const editorSection = document.getElementById('editor-section');
    const editorTitle = document.getElementById('editor-title');
    const charForm = document.getElementById('character-form');
    const charName = document.getElementById('char-name');
    const charBio = document.getElementById('char-bio');
    const charId = document.getElementById('char-id');
    const charTitle = document.getElementById('char-title');
    const charRace = document.getElementById('char-race');
    const charPortrait = document.getElementById('char-portrait');
    const portraitPreview = document.getElementById('portrait-preview');
    let currentChar = null;
    let sortable;

    function loadCharacters() {
        fetch('/api/characters').then(r => r.json()).then(chars => {
            charList.innerHTML = '';
            chars.forEach(name => {
                const li = document.createElement('li');
                li.className = 'list-group-item list-group-item-action';
                li.textContent = name;
                li.onclick = () => loadCharacter(name);
                charList.appendChild(li);
            });
            if (sortable) sortable.destroy();
            sortable = Sortable.create(charList, {
                animation: 150
            });
        });
    }

    function loadCharacter(name) {
        fetch(`/api/character/${encodeURIComponent(name)}`).then(r => r.json()).then(data => {
            currentChar = name;
            editorSection.style.display = '';
            editorTitle.textContent = `Editing: ${name}`;
            charId.value = data.id || '';
            charName.value = data.name || '';
            charTitle.value = data.title || '';
            charRace.value = data.race || '';
            charBio.value = data.bio || '';
            // Try to load portrait
            fetch(`/characters/${encodeURIComponent(name)}/assets/portrait.jpg`).then(resp => {
                if (resp.ok) {
                    portraitPreview.src = `/characters/${encodeURIComponent(name)}/assets/portrait.jpg`;
                    portraitPreview.style.display = '';
                } else {
                    portraitPreview.style.display = 'none';
                }
            });
        });
    }

    charForm.onsubmit = async (e) => {
        e.preventDefault();
        if (!currentChar) return;
        const data = {
            id: charId.value,
            name: charName.value,
            title: charTitle.value,
            race: charRace.value,
            bio: charBio.value
        };
        await fetch(`/api/character/${encodeURIComponent(currentChar)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        // Handle portrait upload
        if (charPortrait.files.length > 0) {
            const formData = new FormData();
            formData.append('portrait', charPortrait.files[0]);
            await fetch(`/api/character/${encodeURIComponent(currentChar)}/portrait`, {
                method: 'POST',
                body: formData
            });
        }
        loadCharacter(currentChar);
        alert('Saved!');
    };

    document.getElementById('add-character').onclick = () => {
        const id = prompt('Enter new character ID:');
        if (!id) return;
        const name = prompt('Enter new character name:');
        if (!name) return;
        fetch('/api/character', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, name })
        }).then(r => r.json()).then(res => {
            if (res.success) {
                loadCharacters();
            } else {
                alert(res.error || 'Error creating character');
            }
        });
    };

    document.getElementById('save-order').onclick = () => {
        const order = Array.from(charList.children).map(li => li.textContent);
        fetch('/api/characters/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order })
        }).then(r => r.json()).then(res => {
            if (res.success) {
                alert('Order saved!');
            } else {
                alert(res.error || 'Error saving order');
            }
        });
    };

    loadCharacters();
}); 