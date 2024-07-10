// auth.js

const AUTH_API_URL = 'https://xatr-zu7c-us3r.n7d.xano.io/api:pYf__RJh';
const PROJECTS_API_URL = 'https://xatr-zu7c-us3r.n7d.xano.io/api:V5nph6CL';

let isLogin = false;

function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const userInfo = document.getElementById('userInfo');

    if (mobileMenuBtn && userInfo) {
        mobileMenuBtn.addEventListener('click', function(event) {
            event.preventDefault();
            userInfo.classList.toggle('show');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!userInfo.contains(event.target) && event.target !== mobileMenuBtn) {
                userInfo.classList.remove('show');
            }
        });

        console.log('Mobile menu initialized');
    } else {
        console.error('Mobile menu button or user info element not found');
    }
}
function createAuthForm() {
    const authFormHTML = `
        <div class="max-w-md mx-auto">
            <div class="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
                <h2 id="authTitle" class="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">Sign Up</h2>
                <form id="authFormElement" onsubmit="handleAuth(event)" class="space-y-6">
                    <div id="nameField">
                        <label for="name" class="block text-sm font-medium text-gray-400 mb-2">Name</label>
                        <input type="text" id="name" name="name" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    </div>
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-400 mb-2">Email</label>
                        <input type="email" id="email" name="email" required class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    </div>
                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-400 mb-2">Password</label>
                        <input type="password" id="password" name="password" required class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <div id="passwordFeedback" class="mt-2 text-sm hidden"></div>
                    </div>
                    <div id="termsCheckboxContainer" class="flex items-center">
                        <input type="checkbox" id="termsCheckbox" name="termsCheckbox" required class="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out">
                        <label for="termsCheckbox" class="ml-2 block text-sm text-gray-400">
                            I agree to the <a href="https://cdn.rushrush.ai/terms-of-service" target="_blank" class="text-blue-400 hover:text-blue-300">Terms of Service</a> and <a href="https://cdn.rushrush.ai/privacy-policy" target="_blank" class="text-blue-400 hover:text-blue-300">Privacy Policy</a>
                        </label>
                    </div>
                    <div id="forgotPasswordContainer" class="text-right hidden">
                        <a href="/forgot-password" class="text-sm text-gray-500 hover:text-blue-300 transition-colors duration-300">Forgot Password?</a>
                    </div>
                    <button type="submit" id="authSubmitButton" class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
                        <span id="authButtonText">Sign Up</span>
                    </button>
                </form>
                <p class="mt-6 text-center text-sm text-gray-400">
                    <span id="authToggleText">Already have an account?</span>
                    <button onclick="toggleAuthMode()" class="text-blue-400 hover:text-blue-300 font-medium ml-1 transition-colors duration-300">
                        <span id="authToggleButtonText">Login</span>
                    </button>
                </p>
            </div>
        </div>
    `;

    const authFormContainer = document.getElementById('authForm');
    authFormContainer.innerHTML = authFormHTML;
    setupAuthListeners();
}

function toggleAuthMode() {
    isLogin = !isLogin;
    document.getElementById('authTitle').textContent = isLogin ? 'Login' : 'Sign Up';
    document.getElementById('authButtonText').textContent = isLogin ? 'Login' : 'Sign Up';
    document.getElementById('authToggleText').textContent = isLogin ? "Don't have an account?" : "Already have an account?";
    document.getElementById('authToggleButtonText').textContent = isLogin ? 'Sign Up' : 'Login';
    document.getElementById('nameField').style.display = isLogin ? 'none' : 'block';
    document.getElementById('termsCheckboxContainer').style.display = isLogin ? 'none' : 'flex';
    
        const termsCheckboxContainer = document.getElementById('termsCheckboxContainer');
    const termsCheckbox = document.getElementById('termsCheckbox');
    
    if (isLogin) {
        termsCheckboxContainer.style.display = 'none';
        termsCheckbox.removeAttribute('required');
    } else {
        termsCheckboxContainer.style.display = 'flex';
        termsCheckbox.setAttribute('required', '');
    }
    // Toggle visibility of forgot password link
    const forgotPasswordContainer = document.getElementById('forgotPasswordContainer');
    forgotPasswordContainer.style.display = isLogin ? 'block' : 'none';
    
    const passwordInput = document.getElementById('password');
    const passwordFeedback = document.getElementById('passwordFeedback');
    passwordInput.value = '';
    passwordFeedback.style.display = isLogin ? 'none' : 'block';
    passwordFeedback.innerHTML = '';
    
    // Always enable the button in login mode
    const submitButton = document.getElementById('authSubmitButton');
    if (isLogin) {
        submitButton.disabled = false;
        submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
        updatePasswordStrength('');
    }
}


function validatePassword(password) {
    const requirements = [
        { regex: /.{8,}/, description: "At least 8 characters" },
        { regex: /[A-Z]/, description: "At least one uppercase letter" },
        { regex: /[a-z]/, description: "At least one lowercase letter" },
        { regex: /[0-9]/, description: "At least one number" },
        { regex: /[^A-Za-z0-9]/, description: "At least one special character" }
    ];

    return requirements.map(req => ({
        met: req.regex.test(password),
        description: req.description
    }));
}

function updatePasswordStrength(password) {
    const feedback = document.getElementById('passwordFeedback');
    const results = validatePassword(password);
    const allMet = results.every(result => result.met);

    feedback.innerHTML = results.map(result => 
        `<div class="${result.met ? 'text-green-500' : 'text-red-500'}">
            ${result.met ? '✓' : '✗'} ${result.description}
        </div>`
    ).join('');

    const submitButton = document.getElementById('authSubmitButton');
    submitButton.disabled = !allMet && !isLogin;
    submitButton.classList.toggle('opacity-50', !allMet && !isLogin);
    submitButton.classList.toggle('cursor-not-allowed', !allMet && !isLogin);
}

async function handleAuth(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    const termsCheckbox = document.getElementById('termsCheckbox');

    if (!isLogin) {
        if (!validatePassword(password).every(result => result.met)) {
            alert('Please ensure your password meets all the requirements.');
            return;
        }
        if (!termsCheckbox.checked) {
            alert('You must agree to the Terms of Service and Privacy Policy to sign up.');
            return;
        }
    }

    setButtonLoading(true);

    try {
        let response;
        if (isLogin) {
            response = await fetch(`${AUTH_API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
        } else {
            response = await fetch(`${AUTH_API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
        }

        if (response.ok) {
            const { authToken } = await response.json();
            localStorage.setItem('authToken', authToken);
            await fetchUser(authToken);
        } else {
            throw new Error(isLogin ? 'Login failed' : 'Signup failed');
        }
    } catch (error) {
        console.error('Auth error:', error);
        alert(isLogin ? 'Login failed. Please check your credentials.' : 'Signup failed. Please try again.');
        setButtonLoading(false);
    }
}

async function fetchUser(token) {
    try {
        setButtonLoading(false);
        initializeEditor();
        const response = await fetch(`${AUTH_API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
            const userData = await response.json();
            localStorage.setItem('userId', userData.id);
            document.getElementById('welcomeMessage').textContent = `Welcome, ${userData.name}`;
            document.getElementById('gens_remaining').textContent = `${userData.gens_remaining} Generations remaining`;
            
            // Update plan button
            const planButton = document.createElement('button');
            planButton.id = 'planButton';
            planButton.className = 'px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md hover:from-blue-600 hover:to-purple-600 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg font-semibold';
            
            // Format the plan name
            let planText = userData.plan.toLowerCase();
            if (['free', 'pro', 'ultra'].includes(planText)) {
                planText = planText.charAt(0).toUpperCase() + planText.slice(1) + ' plan';
            } else if (planText === 'please confirm your email') {
                planText = 'Please confirm your email';
            }
            planButton.textContent = planText;
            
            planButton.addEventListener('click', () => handlePlanButtonClick(userData.plan));
            
            const planContainer = document.getElementById('plan');
            planContainer.innerHTML = '';
            planContainer.appendChild(planButton);
            
            document.getElementById('authForm').style.display = 'none';
            document.getElementById('userInfo').style.display = 'block';
            document.getElementById('mainContent').style.display = 'block';
            document.getElementById('projectManagement').classList.remove('hidden');
            
            updateGenerateButtonStates(userData.gens_remaining);
            setupMobileMenu();
            await loadProjects(token, userData.active_project);
        } else {
            throw new Error('Failed to fetch user data');
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        showLoginForm();
    }
}

async function handlePlanButtonClick(plan) {
    const lowerPlan = plan.toLowerCase();
    switch (lowerPlan) {
        case 'please confirm your email':
            window.location.href = '/resend-confirm/index.html';
            break;
        case 'free':
            window.location.href = '/select-price/index.html';
            break;
        case 'pro':
        case 'ultra':
            await createCustomerPortalSession();
            break;
        default:
            console.error('Unknown plan type:', plan);
    }
}

async function createCustomerPortalSession() {
    const token = localStorage.getItem('authToken');
    try {
        const response = await fetch('https://xatr-zu7c-us3r.n7d.xano.io/api:UQuTJ3vx/create_customer_portal_session', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error('No URL returned from the customer portal session creation');
            }
        } else {
            throw new Error('Failed to create customer portal session');
        }
    } catch (error) {
        console.error('Error creating customer portal session:', error);
        alert('Failed to access the customer portal. Please try again later.');
    }
}


function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('plan');
    localStorage.removeItem('gens_remaining');
    localStorage.removeItem('active_project');

        // Reset UI elements
    document.getElementById('welcomeMessage').textContent = '';
    document.getElementById('gens_remaining').textContent = '';
    document.getElementById('plan').innerHTML = '';
    document.getElementById('projectSelect').innerHTML = '<option value="">Select a project</option>';
    updateUIForAuthState(false);
    document.body.classList.remove('menu-open');
    document.getElementById('authFormElement').reset();


    document.getElementById('authForm').style.display = 'block';
    document.getElementById('userInfo').style.display = 'none';
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('projectManagement').classList.add('hidden');
    document.getElementById('authFormElement').reset();

    document.body.classList.remove('menu-open');
}

function updateUIForAuthState(isLoggedIn) {
    const userInfo = document.getElementById('userInfo');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const authForm = document.getElementById('authForm');
    const mainContent = document.getElementById('mainContent');
    const projectManagement = document.getElementById('projectManagement');
    const logoutButton = document.querySelector('button[onclick="logout()"]');

    if (isLoggedIn) {
        userInfo.style.display = 'flex';
        mobileMenuBtn.style.display = 'block';
        authForm.style.display = 'none';
        mainContent.style.display = 'block';
        projectManagement.classList.remove('hidden');
        if (logoutButton) logoutButton.style.display = 'block';
    } else {
        userInfo.style.display = 'none';
        mobileMenuBtn.style.display = 'none';
        authForm.style.display = 'block';
        mainContent.style.display = 'none';
        projectManagement.classList.add('hidden');
        if (logoutButton) logoutButton.style.display = 'none';
    }
}
async function checkAuth() {
    const token = localStorage.getItem('authToken');
    if (token) {
        try {
            await fetchUser(token);
        } catch (error) {
            console.error('Error checking auth:', error);
            updateUIForAuthState(false);
        }
    } else {
        updateUIForAuthState(false);
    }
}

function showLoginForm() {
    document.getElementById('authForm').style.display = 'block';
    document.getElementById('userInfo').style.display = 'none';
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('projectManagement').classList.add('hidden');
}

function setupAuthListeners() {
    const passwordInput = document.getElementById('password');
    const passwordFeedback = document.getElementById('passwordFeedback');

    passwordFeedback.style.display = 'block'; // Show feedback initially for signup

    passwordInput.addEventListener('focus', () => {
        if (!isLogin) {
            passwordFeedback.style.display = 'block';
            updatePasswordStrength(passwordInput.value);
        }
    });
    
    passwordInput.addEventListener('input', (e) => {
        if (!isLogin) {
            updatePasswordStrength(e.target.value);
        }
    });
    
    document.addEventListener('click', (e) => {
        if (e.target !== passwordInput && !passwordInput.contains(e.target) && !isLogin) {
            passwordFeedback.style.display = 'none';
        }
    });
}
    
    passwordInput.addEventListener('input', (e) => {
        if (!isLogin) {
            updatePasswordStrength(e.target.value);
        }
    });
    
    document.addEventListener('click', (e) => {
        if (e.target !== passwordInput && !passwordInput.contains(e.target)) {
            passwordFeedback.style.display = 'none';
        }
    });


async function loadProjects(token, activeProjectId) {
    try {
        const response = await fetch(`${PROJECTS_API_URL}/projects`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
            const projects = await response.json();
            
            const selectElement = document.getElementById('projectSelect');
            selectElement.innerHTML = '<option value="">Select a project</option>';
            
            projects.forEach(project => {
                const option = document.createElement('option');
                option.value = project.id;
                option.textContent = project.name;
                if (project.id === activeProjectId) {
                    option.selected = true;
                }
                selectElement.appendChild(option);
            });
            
            if (activeProjectId && projects.some(p => p.id === activeProjectId)) {
                await loadProjectContent(token, activeProjectId);
            } else if (projects.length > 0) {
                await loadProjectContent(token, projects[0].id);
            }
            
            selectElement.addEventListener('change', async (e) => {
                const selectedProjectId = e.target.value;
                if (selectedProjectId) {
                    await updateActiveProject(token, selectedProjectId);
                    await loadProjectContent(token, selectedProjectId);
                }
            });
        } else {
            throw new Error('Failed to fetch projects');
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        alert(`Failed to load projects: ${error.message}`);
    }
}

async function updateActiveProject(token, projectId) {
    try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            throw new Error('User ID not found');
        }
        const response = await fetch(`${AUTH_API_URL}/user/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ active_project: projectId })
        });

        if (!response.ok) {
            throw new Error('Failed to update active project');
        }
    } catch (error) {
        console.error('Error updating active project:', error);
        alert('Failed to update active project. Please try again.');
    }
}

async function loadProjectContent(token, projectId) {
    try {
        const response = await fetch(`${PROJECTS_API_URL}/projects/${projectId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.ok) {
            const project = await response.json();
            
            if (editor && typeof editor.setValue === 'function') {
                editor.setValue(project.content || '');
                editor.clearSelection();
                updatePreview();
                editor.session.getUndoManager().reset();
                document.getElementById('saveButton').classList.add('hidden');
            }
            
            if (project.share_link) {
                const previewButton = document.getElementById('previewButton');
                const copyShareLinkButton = document.getElementById('copyShareLinkButton');
                
                previewButton.onclick = (event) => {
                    event.preventDefault();
                    const timestamp = Date.now();
                    const freshShareLink = `${project.share_link}?time=${timestamp}`;
                    window.open(freshShareLink, '_blank');
                };
                
                copyShareLinkButton.onclick = () => {
                    copyToClipboard(project.share_link);
                };
            }
        } else if (response.status === 404) {
            console.error('Project not found');
            alert('The selected project does not exist. Please choose another project.');
        } else {
            throw new Error(`Failed to fetch project content. Status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error loading project content:', error);
        alert(`Failed to load project content: ${error.message}`);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Optionally, provide user feedback
        alert('Share link copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy share link. Please try again.');
    });
}

function updateGenerateButtonStates(gensRemaining) {
    const generateButton = document.getElementById('generateButton');
    const generateButtonText = document.getElementById('generateButtonText');
    const buttonGensRemaining = document.getElementById('buttonGensRemaining');
    
    if (!generateButton || !generateButtonText || !buttonGensRemaining) return;

    const disableButtons = gensRemaining <= 0;

    generateButton.disabled = disableButtons;

    if (disableButtons) {
        generateButton.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        generateButton.classList.remove('opacity-50', 'cursor-not-allowed');
    }

    // Update the text to show remaining generations
    generateButtonText.textContent = currentMode === 'edit' ? 'Edit' : 'Generate';
    buttonGensRemaining.textContent = gensRemaining;
}

function initAuth() {
    createAuthForm();
    document.getElementById('passwordFeedback').style.display = 'none';
    checkAuth();
    setupMobileMenu(); // Add this line
}

function setButtonLoading(loading) {
    const button = document.getElementById('authSubmitButton');
    const buttonText = document.getElementById('authButtonText');
    if (loading) {
        button.disabled = true;
        buttonText.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            ${isLogin ? 'Logging in...' : 'Signing up...'}
        `;
    } else {
        button.disabled = false;
        buttonText.textContent = isLogin ? 'Login' : 'Sign Up';
    }
}

function showButtonFeedback(success, message) {
    const button = document.getElementById('authSubmitButton');
    const buttonText = document.getElementById('authButtonText');
    button.disabled = true;
    button.classList.add('opacity-50', 'cursor-not-allowed');
    button.classList.remove('bg-gradient-to-r', 'from-blue-600', 'to-purple-600', 'hover:from-blue-700', 'hover:to-purple-700');
    button.classList.add(success ? 'bg-green-500' : 'bg-red-500');
    buttonText.textContent = message;

    setTimeout(() => {
        button.disabled = false;
        button.classList.remove('opacity-50', 'cursor-not-allowed', 'bg-green-500', 'bg-red-500');
        button.classList.add('bg-gradient-to-r', 'from-blue-600', 'to-purple-600', 'hover:from-blue-700', 'hover:to-purple-700');
        buttonText.textContent = isLogin ? 'Login' : 'Sign Up';
    }, 3000);
}

// Export functions that need to be accessed from other files
window.toggleAuthMode = toggleAuthMode;
window.handleAuth = handleAuth;
window.logout = logout;
window.initAuth = initAuth;
window.fetchUser = fetchUser;
window.loadProjects = loadProjects;
window.updateActiveProject = updateActiveProject;
window.loadProjectContent = loadProjectContent;
window.copyToClipboard = copyToClipboard;

