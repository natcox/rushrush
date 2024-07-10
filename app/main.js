let editor;
let currentMode = 'new';

function initializeEditor() {
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

async function generateHtml(type) {
    const prompt = document.getElementById('prompt').value;
    const token = localStorage.getItem('authToken');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const generateButton = document.getElementById('generateButton');

    try {
        loadingIndicator.classList.remove('hidden');
        generateButton.disabled = true;
        generateButton.classList.add('opacity-50', 'cursor-not-allowed');

        let context = '';
        if (type === 'edit') {
            context = editor.getValue();
        }

        const requestBody = {
            prompt,
            context,
            type
        };

        const response = await fetch(`${AUTH_API_URL}/generate_html_from_prompt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(requestBody),
        });

        if (response.ok) {
            const result = await response.json();
            
            let generatedHtml = '';
            if (typeof result === 'object' && result !== null) {
                const possibleKeys = ['html', 'generated_html', 'content', 'result', 'output'];
                for (const key of possibleKeys) {
                    if (result[key] && typeof result[key] === 'string') {
                        generatedHtml = result[key];
                        break;
                    }
                }
            } else if (typeof result === 'string') {
                generatedHtml = result;
            }

            if (generatedHtml) {
                editor.setValue(generatedHtml);
                editor.clearSelection();
                updatePreview();
                
                await fetchUser(token);
            } else {
                console.error('Unable to find HTML content in the response');
                alert('Generated HTML not found in the response. Please check the console for details.');
            }
        } else {
            throw new Error('Failed to generate HTML');
        }
    } catch (error) {
        console.error('Error generating HTML:', error);
        alert('Failed to generate HTML. Please try again and check the console for details.');
    } finally {
        loadingIndicator.classList.add('hidden');
        generateButton.disabled = false;
        generateButton.classList.remove('opacity-50', 'cursor-not-allowed');
    }
}

async function saveProjectContent() {
    const token = localStorage.getItem('authToken');
    const projectId = document.getElementById('projectSelect').value;
    const content = editor.getValue();

    try {
        const response = await fetch(`${PROJECTS_API_URL}/projects/${projectId}`, {
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

function updatePreview() {
    const previewFrame = document.getElementById('preview');
    const previewContent = previewFrame.contentDocument || previewFrame.contentWindow.document;
    previewContent.open();
    previewContent.write(editor.getValue());
    previewContent.close();
}

function showNewProjectModal() {
    const planElement = document.getElementById('plan');
    const planButton = planElement.querySelector('button');
    const planText = planButton ? planButton.textContent.toLowerCase() : '';

    if (planText === 'free plan') {
        document.getElementById('upgradeModal').classList.remove('hidden');
    } else if (planText === 'please confirm your email') {
        document.getElementById('confirmEmailModal').classList.remove('hidden');
    } else {
        document.getElementById('newProjectModal').classList.remove('hidden');
    }
}

function hideNewProjectModal() {
    document.getElementById('newProjectModal').classList.add('hidden');
    document.getElementById('newProjectName').value = '';
}

function hideUpgradeModal() {
    document.getElementById('upgradeModal').classList.add('hidden');
}

function hideConfirmEmailModal() {
    document.getElementById('confirmEmailModal').classList.add('hidden');
}

function handleUpgrade() {
    // Add logic to redirect to upgrade page
    console.log('Redirect to upgrade page');
    hideUpgradeModal();
}

function handleResendConfirmation() {
    // Add logic to resend confirmation email
    console.log('Resend confirmation email');
    // You might want to call an API endpoint here to resend the email
    alert('Confirmation email has been resent. Please check your inbox.');
}


async function handleCreateNewProject() {
    const projectName = document.getElementById('newProjectName').value.trim();
    const createProjectBtn = document.getElementById('createProjectBtn');

    if (projectName) {
        // Disable the button and show loading state
        createProjectBtn.disabled = true;
        createProjectBtn.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating...
        `;

        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`${PROJECTS_API_URL}/projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: projectName,
                    content: '<h1>New Project</h1>'
                }),
            });
            if (response.ok) {
                const newProject = await response.json();
                await loadProjects(token, newProject.id);
                hideNewProjectModal();
                // Show success feedback
                createProjectBtn.classList.remove('bg-purple-500', 'hover:bg-purple-600');
                createProjectBtn.classList.add('bg-green-500');
                createProjectBtn.innerHTML = 'Project Created!';
                setTimeout(() => {
                    createProjectBtn.classList.remove('bg-green-500');
                    createProjectBtn.classList.add('bg-purple-500', 'hover:bg-purple-600');
                    createProjectBtn.innerHTML = 'Create Project';
                    createProjectBtn.disabled = false;
                }, 2000);
            } else {
                throw new Error('Failed to create new project');
            }
        } catch (error) {
            console.error('Error creating new project:', error);
            alert('Failed to create new project. Please try again.');
            // Show error feedback
            createProjectBtn.classList.remove('bg-purple-500', 'hover:bg-purple-600');
            createProjectBtn.classList.add('bg-red-500');
            createProjectBtn.innerHTML = 'Error. Try Again';
            setTimeout(() => {
                createProjectBtn.classList.remove('bg-red-500');
                createProjectBtn.classList.add('bg-purple-500', 'hover:bg-purple-600');
                createProjectBtn.innerHTML = 'Create Project';
                createProjectBtn.disabled = false;
            }, 2000);
        }
    } else {
        alert('Please enter a project name.');
    }
}

function createNewProject() {
    showNewProjectModal();
}

function setupNewProjectModalListeners() {
    const newProjectBtn = document.getElementById('newProjectBtn');
    const createProjectBtn = document.getElementById('createProjectBtn');
    const cancelProjectBtn = document.getElementById('cancelProjectBtn');
    const closeUpgradeModalBtn = document.getElementById('closeUpgradeModalBtn');
    const upgradeBtn = document.getElementById('upgradeBtn');
    const closeConfirmEmailModalBtn = document.getElementById('closeConfirmEmailModalBtn');
    const resendConfirmationBtn = document.getElementById('resendConfirmationBtn');

    if (newProjectBtn) newProjectBtn.addEventListener('click', showNewProjectModal);
    if (createProjectBtn) createProjectBtn.addEventListener('click', handleCreateNewProject);
    if (cancelProjectBtn) cancelProjectBtn.addEventListener('click', hideNewProjectModal);
    if (closeUpgradeModalBtn) closeUpgradeModalBtn.addEventListener('click', hideUpgradeModal);
    if (upgradeBtn) upgradeBtn.addEventListener('click', handleUpgrade);
    if (closeConfirmEmailModalBtn) closeConfirmEmailModalBtn.addEventListener('click', hideConfirmEmailModal);
    if (resendConfirmationBtn) resendConfirmationBtn.addEventListener('click', handleResendConfirmation);

    console.log('Event listeners set up');
}

function initializeApp() {
    if (typeof window.initAuth === 'function') {
        window.initAuth();
    } else {
        console.error('initAuth function not found. Check if auth.js is loaded correctly.');
    }
    setupNewProjectModalListeners();
    setupGenerateButtonListeners();
}

function setupGenerateButtonListeners() {
    const generateButton = document.getElementById('generateButton');
    const generateDropdownToggle = document.getElementById('generateDropdownToggle');
    const generateMenu = document.getElementById('generateMenu');
    const generateNew = document.getElementById('generateNew');
    const generateEdit = document.getElementById('generateEdit');
    const generateButtonText = document.getElementById('generateButtonText');

    generateButton.addEventListener('click', function(event) {
        event.preventDefault();
        generateHtml(currentMode);
    });

    generateDropdownToggle.addEventListener('click', function(event) {
        event.stopPropagation();
        generateMenu.classList.toggle('hidden');
    });

    generateNew.addEventListener('click', function(event) {
        event.preventDefault();
        currentMode = 'new';
        generateButtonText.textContent = 'Generate';
        generateMenu.classList.add('hidden');
    });

    generateEdit.addEventListener('click', function(event) {
        event.preventDefault();
        currentMode = 'edit';
        generateButtonText.textContent = 'Edit';
        generateMenu.classList.add('hidden');
    });

    document.addEventListener('click', function(event) {
        if (!generateButton.contains(event.target) && !generateDropdownToggle.contains(event.target)) {
            generateMenu.classList.add('hidden');
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupNewProjectModalListeners();
});

    const upgradeBtn = document.getElementById('upgradeBtn');
    if (upgradeBtn) {
        upgradeBtn.addEventListener('click', function() {
            window.location.href = '/select-price/index.html';
        });
    }