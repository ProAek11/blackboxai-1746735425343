// JavaScript for Trading Journal App

const entriesKey = 'tradingJournalEntries';

let entries = [];
let filteredType = 'All';
let editEntryId = null;

const entriesList = document.getElementById('entriesList');
const addEntryBtn = document.getElementById('addEntryBtn');
const entryModal = document.getElementById('entryModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const entryForm = document.getElementById('entryForm');
const entryDate = document.getElementById('entryDate');
const entryType = document.getElementById('entryType');
const entryNotes = document.getElementById('entryNotes');

const allEntriesBtn = document.getElementById('allEntriesBtn');
const investingBtn = document.getElementById('investingBtn');
const forexBtn = document.getElementById('forexBtn');

function loadEntries() {
  const stored = localStorage.getItem(entriesKey);
  entries = stored ? JSON.parse(stored) : [];
}

function saveEntries() {
  localStorage.setItem(entriesKey, JSON.stringify(entries));
}

function renderEntries() {
  entriesList.innerHTML = '';
  let filteredEntries = entries;
  if (filteredType !== 'All') {
    filteredEntries = entries.filter(e => e.type === filteredType);
  }
  if (filteredEntries.length === 0) {
    entriesList.innerHTML = '<p class="text-gray-500">No entries found.</p>';
    return;
  }
  filteredEntries.forEach(entry => {
    const entryEl = document.createElement('div');
    entryEl.className = 'bg-white p-4 rounded-md shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer';
    entryEl.innerHTML = `
      <div class="flex justify-between items-center mb-2">
        <div class="text-sm text-gray-500">${entry.date}</div>
        <div class="text-xs font-semibold text-blue-600">${entry.type}</div>
      </div>
      <div class="text-gray-900 whitespace-pre-wrap">${entry.notes}</div>
      <div class="mt-3 flex justify-end space-x-2">
        <button class="editBtn text-blue-600 hover:underline text-sm" data-id="${entry.id}">Edit</button>
        <button class="deleteBtn text-red-600 hover:underline text-sm" data-id="${entry.id}">Delete</button>
      </div>
    `;
    entriesList.appendChild(entryEl);
  });

  // Attach event listeners for edit and delete buttons
  document.querySelectorAll('.editBtn').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = e.target.getAttribute('data-id');
      openEditModal(id);
    });
  });
  document.querySelectorAll('.deleteBtn').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = e.target.getAttribute('data-id');
      deleteEntry(id);
    });
  });
}

function openAddModal() {
  editEntryId = null;
  entryForm.reset();
  entryModal.classList.remove('hidden');
}

function openEditModal(id) {
  const entry = entries.find(e => e.id === id);
  if (!entry) return;
  editEntryId = id;
  entryDate.value = entry.date;
  entryType.value = entry.type;
  entryNotes.value = entry.notes;
  entryModal.classList.remove('hidden');
}

function closeModal() {
  entryModal.classList.add('hidden');
}

function deleteEntry(id) {
  if (confirm('Are you sure you want to delete this entry?')) {
    entries = entries.filter(e => e.id !== id);
    saveEntries();
    renderEntries();
  }
}

function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

entryForm.addEventListener('submit', e => {
  e.preventDefault();
  const date = entryDate.value;
  const type = entryType.value;
  const notes = entryNotes.value.trim();
  if (!date || !type || !notes) return;

  if (editEntryId) {
    // Update existing entry
    const entry = entries.find(e => e.id === editEntryId);
    if (entry) {
      entry.date = date;
      entry.type = type;
      entry.notes = notes;
    }
  } else {
    // Add new entry
    const newEntry = {
      id: generateId(),
      date,
      type,
      notes,
    };
    entries.push(newEntry);
  }
  saveEntries();
  renderEntries();
  closeModal();
});

addEntryBtn.addEventListener('click', openAddModal);
closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

// Filter buttons
allEntriesBtn.addEventListener('click', () => {
  filteredType = 'All';
  setActiveFilterButton(allEntriesBtn);
  renderEntries();
});
investingBtn.addEventListener('click', () => {
  filteredType = 'Investing';
  setActiveFilterButton(investingBtn);
  renderEntries();
});
forexBtn.addEventListener('click', () => {
  filteredType = 'Forex';
  setActiveFilterButton(forexBtn);
  renderEntries();
});

function setActiveFilterButton(activeBtn) {
  [allEntriesBtn, investingBtn, forexBtn].forEach(btn => {
    btn.classList.remove('bg-gray-200', 'font-semibold');
  });
  activeBtn.classList.add('bg-gray-200', 'font-semibold');
}

// Initialize
loadEntries();
setActiveFilterButton(allEntriesBtn);
renderEntries();
