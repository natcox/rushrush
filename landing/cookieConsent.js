// Square GTA Vice City-themed Cookie Consent Popup Module

(function() {
    // CSS Styles
    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap');
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        #cookieConsent {
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 450px;
            height: 450px;
            background-image: url('https://rushrush-landing.b-cdn.net/cookies.jpg');
            background-size: cover;
            background-position: center;
            color: #ffffff;
            padding: 1.5rem;
            box-shadow: 0 0 20px rgba(157, 140, 255, 0.7);
            z-index: 9999;
            font-family: 'Permanent Marker', cursive;
            animation: fadeIn 1s ease-out;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            border-radius: 20px; /* Added rounded corners */
            overflow: hidden; /* Ensure content doesn't overflow rounded corners */
        }
        #cookieConsent::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            border-radius: 20px; /* Match the parent's border-radius */
        }
        #cookieConsent * {
            position: relative;
        }
        #cookieConsent.hide {
            display: none;
        }
        #cookieConsent h2 {
            font-size: 2.2rem;
            margin-bottom: 0.5rem;
            color: #9d8cff;
            text-shadow: 2px 2px 4px #000000;
        }
        #cookieConsent p {
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
            text-shadow: 1px 1px 2px #000000;
        }
        #cookieConsent .buttons {
            display: flex;
            justify-content: space-between;
        }
        #cookieConsent button {
            background-color: #843dff;
            color: #ffffff;
            border: none;
            padding: 0.75rem 1.5rem;
            margin: 0.25rem 0;
            cursor: pointer;
            transition: background-color 0.3s, transform 0.3s, box-shadow 0.3s;
            font-size: 1.2rem;
            font-weight: bold;
            text-transform: uppercase;
            font-family: 'Permanent Marker', cursive;
            flex-grow: 1;
            margin-right: 0.5rem;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-radius: 10px; /* Added rounded corners to buttons */
        }
        #cookieConsent button:last-child {
            margin-right: 0;
        }
        #cookieConsent button:hover {
            background-color: #9d71ff;
            transform: scale(1.05) translateY(-2px);
            box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
        }
        #cookieConsent a {
            color: #bea6ff;
            text-decoration: underline;
            font-size: 1rem;
        }

        @media (max-width: 768px) {
            #cookieConsent {
                width: 90%;
                height: auto;
                left: 5%;
                bottom: 10px;
                padding: 1rem;
            }
            #cookieConsent h2 {
                font-size: 1.8rem;
            }
            #cookieConsent p {
                font-size: 1rem;
            }
            #cookieConsent button {
                font-size: 1rem;
                padding: 0.5rem 1rem;
            }
            #cookieConsent a {
                font-size: 0.9rem;
            }
        }

        @media (max-width: 480px) {
            #cookieConsent {
                width: 95%;
                left: 2.5%;
                bottom: 5px;
            }
            #cookieConsent h2 {
                font-size: 1.5rem;
            }
            #cookieConsent p {
                font-size: 0.9rem;
            }
            #cookieConsent button {
                font-size: 0.9rem;
                padding: 0.4rem 0.8rem;
            }
            #cookieConsent a {
                font-size: 0.8rem;
            }
            #cookieConsent .buttons {
                flex-direction: column;
            }
            #cookieConsent button {
                margin-right: 0;
                margin-bottom: 0.5rem;
            }
        }
    `;

    // HTML Content
    const htmlContent = `
        <div id="cookieConsent" class="hide">
            <h2>Listen up, Wiseguy!</h2>
            <p>We use cookies to enhance your... experience. You in?</p>
            <div class="buttons">
                <button id="acceptCookies">Count me in</button>
                <button id="rejectCookies">No Chance, Pal</button>
            </div>
            <p><a href="https://cdn.rushrush.ai/privacy-policy" target="_blank">Read the fine print</a></p>
        </div>
    `;

    // Inject CSS
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    // Inject HTML
    document.body.insertAdjacentHTML('beforeend', htmlContent);

    // JavaScript Functionality
    function initCookieConsent() {
        const cookieConsent = document.getElementById('cookieConsent');
        const acceptBtn = document.getElementById('acceptCookies');
        const rejectBtn = document.getElementById('rejectCookies');

        function setCookie(name, value, days) {
            let expires = "";
            if (days) {
                let date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "") + expires + "; path=/";
        }

        function getCookie(name) {
            let nameEQ = name + "=";
            let ca = document.cookie.split(';');
            for(let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }

        function showConsentPopup() {
            cookieConsent.classList.remove('hide');
        }

        function hideConsentPopup() {
            cookieConsent.classList.add('hide');
        }

        function handleCookieConsent(accepted) {
            setCookie('cookieConsent', accepted ? 'accepted' : 'rejected', 365);
            hideConsentPopup();
        }

        acceptBtn.addEventListener('click', function() {
            handleCookieConsent(true);
        });

        rejectBtn.addEventListener('click', function() {
            handleCookieConsent(false);
        });

        // Check if user has already made a choice
        let consentCookie = getCookie('cookieConsent');
        if (consentCookie === null) {
            // If no choice has been made, show the popup
            showConsentPopup();
        }
    }

    // Initialize the cookie consent functionality when the DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCookieConsent);
    } else {
        initCookieConsent();
    }
})();