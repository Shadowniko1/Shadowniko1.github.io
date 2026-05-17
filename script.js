// Elemente aus dem HTML holen
const viewDashboard = document.getElementById('view-dashboard');
const viewEditor = document.getElementById('view-editor');
const notesList = document.getElementById('notes-list');
const addNoteBtn = document.getElementById('add-note-btn');
const saveBtn = document.getElementById('save-btn');
const backBtn = document.getElementById('back-btn');
const openBtn = document.getElementById('open-btn');
const noteTextarea = document.getElementById('note-textarea');

let currentNoteId = null;

// Beim Start der App: Notizen laden
document.addEventListener('DOMContentLoaded', loadNotes);

// Event Listener für Navigation
addNoteBtn.addEventListener('click', () => {
    openEditor(null);
});

backBtn.addEventListener('click', () => {
    showDashboard();
});

saveBtn.addEventListener('click', saveNote);

// Textformatierung (Fett, Kursiv, Unterstrichen)
function formatText(command) {
    document.execCommand(command, false, null);
    noteTextarea.focus(); // Fokus zurück auf den Textbereich legen
}

// Ansicht wechseln: Zum Dashboard
function showDashboard() {
    viewDashboard.classList.remove('hidden');
    openBtn.classList.remove('hidden');
    viewEditor.classList.add('hidden');
    backBtn.classList.add('hidden');
    loadNotes();
}

// Ansicht wechseln: Zum Editor
function openEditor(noteId = null) {
    viewDashboard.classList.add('hidden');
    openBtn.classList.add('hidden');
    viewEditor.classList.remove('hidden');
    backBtn.classList.remove('hidden');
    
    currentNoteId = noteId;
    
    if (noteId) {
        // Bestehende Notiz laden
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        const note = notes.find(n => n.id === noteId);
        if (note) {
            noteTextarea.innerHTML = note.content;
        }
    } else {
        // Leere Notiz für neuen Eintrag
        noteTextarea.innerHTML = '';
    }
    noteTextarea.focus();
}

// Funktion: Notiz speichern
function saveNote() {
    const content = noteTextarea.innerHTML.trim();
    if (!content) return alert('Die Notiz ist leer!');

    let notes = JSON.parse(localStorage.getItem('notes')) || [];

    if (currentNoteId) {
        // Bestehende Notiz aktualisieren
        notes = notes.map(n => n.id === currentNoteId ? { ...n, content: content } : n);
    } else {
        // Neue Notiz erstellen
        // Extrahiert den reinen Text für den Titel der Kachel (z.B. "last_note.txt")
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        let plainText = tempDiv.textContent || tempDiv.innerText || 'note';
        let titleName = plainText.trim().split(' ')[0].substring(0, 12);
        if(!titleName) titleName = 'note';

        const newNote = {
            id: Date.now().toString(),
            title: `${titleName.toLowerCase()}.txt`,
            content: content
        };
        notes.push(newNote);
    }

    localStorage.setItem('notes', JSON.stringify(notes));
    showDashboard();
}

// Funktion: Alle Notizen auf dem Dashboard anzeigen
function loadNotes() {
    notesList.innerHTML = '';
    const notes = JSON.parse(localStorage.getItem('notes')) || [];

    notes.forEach(note => {
        const card = document.createElement('div');
        card.className = 'note-card';
        card.innerText = note.title;
        card.addEventListener('click', () => openEditor(note.id));
        notesList.appendChild(card);
    });
}
