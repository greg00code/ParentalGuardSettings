// ParentalGuardSettings.js
(function() {
    class ParentalGuardSettings {
        constructor(options = {}) {
            this.container = options.container || document.createElement('div');
            this.password = options.password || '1234';
            this.onUnlock = options.onUnlock || function() {};
            this.onError = options.onError || function() {};
            this.isLocked = true;
            this.attemptCount = 0;
            this.initialize();
        }

        initialize() {
            // Création du HTML
            this.container.innerHTML = `
                <div class="settings-container">
                    <div class="settings-header">
                        <h2>Verrouillage Parental</h2>
                    </div>
                    <div class="password-section">
                        <input type="password" 
                               class="password-input" 
                               placeholder="Entrez le code PIN"
                               maxlength="4"
                               pattern="[0-9]*"
                               inputmode="numeric"/>
                        <button class="unlock-button">Déverrouiller</button>
                        <div class="error-message" style="display: none; color: red; margin-top: 10px;"></div>
                    </div>
                </div>
            `;

            // Ajout des styles
            const style = document.createElement('style');
            style.textContent = `
                .settings-container {
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    background-color: white;
                    max-width: 400px;
                    margin: auto;
                }
                .settings-header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .settings-header h2 {
                    color: #333;
                    margin: 0;
                }
                .password-section {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    align-items: center;
                }
                .password-input {
                    padding: 12px;
                    border: 2px solid #ddd;
                    border-radius: 4px;
                    font-size: 16px;
                    width: 200px;
                    text-align: center;
                    letter-spacing: 4px;
                }
                .password-input:focus {
                    border-color: #007bff;
                    outline: none;
                }
                .unlock-button {
                    padding: 12px 24px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: background-color 0.2s;
                    width: 200px;
                }
                .unlock-button:hover {
                    background-color: #0056b3;
                }
                .unlock-button:disabled {
                    background-color: #cccccc;
                    cursor: not-allowed;
                }
                .error-message {
                    text-align: center;
                    font-size: 14px;
                }
            `;
            document.head.appendChild(style);

            // Ajout des événements
            this.addEventListeners();
            
            // Réinitialisation de l'état
            this.resetState();
        }

        resetState() {
            const input = this.container.querySelector('.password-input');
            const button = this.container.querySelector('.unlock-button');
            const errorMessage = this.container.querySelector('.error-message');
            
            if (input) {
                input.value = '';
                input.disabled = false;
            }
            if (button) {
                button.disabled = false;
            }
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
            this.attemptCount = 0;
        }

        addEventListeners() {
            const unlockButton = this.container.querySelector('.unlock-button');
            const passwordInput = this.container.querySelector('.password-input');
            const errorMessage = this.container.querySelector('.error-message');

            const handleUnlock = () => {
                if (passwordInput.value === this.password) {
                    this.unlock();
                } else {
                    this.attemptCount++;
                    if (this.attemptCount >= 3) {
                        errorMessage.textContent = 'Trop de tentatives. Réessayez dans quelques instants.';
                        errorMessage.style.display = 'block';
                        passwordInput.disabled = true;
                        unlockButton.disabled = true;
                        
                        // Réactiver après 30 secondes
                        setTimeout(() => {
                            this.resetState();
                        }, 30000);
                    } else {
                        errorMessage.textContent = 'Code PIN incorrect';
                        errorMessage.style.display = 'block';
                        passwordInput.value = '';
                    }
                    this.onError();
                }
            };

            unlockButton.addEventListener('click', handleUnlock);

            passwordInput.addEventListener('keypress', (e) => {
                // Permettre uniquement les chiffres
                if (e.key < '0' || e.key > '9') {
                    e.preventDefault();
                }
                // Valider avec Enter
                if (e.key === 'Enter') {
                    handleUnlock();
                }
            });

            passwordInput.addEventListener('input', () => {
                errorMessage.style.display = 'none';
            });
        }

        unlock() {
            this.isLocked = false;
            if (typeof this.onUnlock === 'function') {
                this.onUnlock();
            }
        }

        lock() {
            this.isLocked = true;
            this.resetState();
        }
    }

    // Exposer la classe au scope global pour Bubble
    window.ParentalGuardSettings = ParentalGuardSettings;
})();