// ✅ script.js (clean version)
const API_BASE = "http://127.0.0.1:5000";

// Get elements
const templatesSelect = document.getElementById('templates');
const previewArea = document.getElementById('templatePreview');
const resultArea = document.getElementById('resultArea');
const text0Input = document.getElementById('text0');
const text1Input = document.getElementById('text1');
const previewBtn = document.getElementById('previewBtn');
const generateBtn = document.getElementById('generateBtn');

let templates = [];

// ✅ Fetch templates from backend
async function loadTemplates() {
  templatesSelect.disabled = true;
  templatesSelect.innerHTML = '<option>Loading...</option>';
  try {
    const res = await fetch(`${API_BASE}/api/templates`);
    const json = await res.json();
    if (!json.success) throw new Error('Failed to get templates');

    templates = json.data.memes || [];
    templatesSelect.innerHTML = templates.map(t =>
      `<option value="${t.id}" data-url="${t.url}" data-width="${t.width}" data-height="${t.height}">${t.name}</option>`
    ).join('');
    templatesSelect.disabled = false;
    renderPreview();
  } catch (err) {
    console.error(err);
    templatesSelect.innerHTML = '<option>Error loading templates</option>';
  }
}

// ✅ Render preview of selected template
function renderPreview() {
  const selected = templatesSelect.selectedIndex >= 0 ? templates[templatesSelect.selectedIndex] : null;
  if (!selected) {
    previewArea.innerHTML = '<p>Select a template and click Preview</p>';
    return;
  }
  previewArea.innerHTML = `
    <div class="template-card">
      <img src="${selected.url}" alt="${selected.name}" />
      <div class="meta">
        <strong>${selected.name}</strong>
        <small>id: ${selected.id}</small>
      </div>
    </div>
  `;
}

// ✅ Generate meme (call backend)
async function generateMeme() {
  const template_id = templatesSelect.value;
  const text0 = text0Input.value;
  const text1 = text1Input.value;

  if (!template_id) {
    alert('Please select a template');
    return;
  }

  generateBtn.disabled = true;
  generateBtn.textContent = 'Generating...';

  try {
    const res = await fetch(`${API_BASE}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template_id, text0, text1 })
    });

    const json = await res.json();
    if (!json.success) {
      console.error('Imgflip error:', json);
      alert('Failed to generate meme. See console for details.');
      return;
    }

    const imageUrl = json.data.url;
    resultArea.innerHTML = `
      <a href="${json.data.page_url}" target="_blank" rel="noopener noreferrer">
        <img src="${imageUrl}" alt="Generated meme" />
      </a>`;
  } catch (err) {
    console.error('Error generating meme:', err);
    alert('Network error while generating meme');
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = 'Generate Meme';
  }
}

// ✅ Event listeners
previewBtn.addEventListener('click', renderPreview);
generateBtn.addEventListener('click', generateMeme);
templatesSelect.addEventListener('change', renderPreview);

// ✅ Initial load
loadTemplates();
