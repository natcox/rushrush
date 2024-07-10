console.log('editor.js is being executed');

let editor;

const editorHTML = `
<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div class="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
        <div class="p-4 bg-gray-900 flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-100">Code Editor</h2>
            <button id="saveButton" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg font-semibold hidden">
                Save
            </button>
        </div>
        <div id="editor" class="w-full h-[calc(100vh-16rem)]"></div>
    </div>
    <div class="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
        <div class="p-4 bg-gray-900 flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-100">Preview</h2>
            <button id="previewButton" class="btn-preview flex items-center space-x-1">
                <span>Share</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
            </button>
        </div>
        <iframe id="preview" class="w-full h-[calc(100vh-16rem)] bg-white"></iframe>
    </div>
</div>
`;

function insertEditorHTML() {
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
        mainContent.insertAdjacentHTML('beforeend', editorHTML);
    } else {
        console.error('Main content div not found');
    }
}

function initializeEditor() {
    console.log('Initializing editor');
    if (editor) return;
    
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/html");
    editor.setOptions({
        fontSize: "14px",
        showPrintMargin: false,
        showGutter: true,
        highlightActiveLine: true,
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true
    });

    let initialContent = editor.getValue();
    const saveButton = document.getElementById('saveButton');

    editor.on('change', () => {
        updatePreview();
        if (editor.getValue() !== initialContent) {
            saveButton.classList.remove('hidden');
        } else {
            saveButton.classList.add('hidden');
        }
    });

    saveButton.addEventListener('click', saveProjectContent);
}

function updatePreview() {
    console.log('Updating preview');
    const previewFrame = document.getElementById('preview');
    const previewContent = previewFrame.contentDocument || previewFrame.contentWindow.document;
    previewContent.open();
    previewContent.write(editor.getValue());
    previewContent.close();
}

async function saveProjectContent() {
    console.log('Saving project content');
    const token = localStorage.getItem('authToken');
    const projectId = document.getElementById('projectSelect').value;
    const content = editor.getValue();

    try {
        const response = await fetch(`${window.PROJECTS_API_URL}/projects/${projectId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ content })
        });

        if (response.ok) {
            const saveButton = document.getElementById('saveButton');
            saveButton.classList.add('hidden');
            alert('Project saved successfully!');
        } else {
            throw new Error('Failed to save project');
        }
    } catch (error) {
        console.error('Error saving project:', error);
        alert('Failed to save project. Please try again.');
    }
}

function setupEditorAndPreview() {
    insertEditorHTML();
    initializeEditor();
    updatePreview();
}

// Export functions that need to be accessed from other files
window.setupEditorAndPreview = setupEditorAndPreview;
window.updatePreview = updatePreview;
window.saveProjectContent = saveProjectContent;