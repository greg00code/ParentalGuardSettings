// ParentalGuardSettings.js
(function() {
    class ParentalGuardSettings {
        constructor(options = {}) {
            this.container = options.container || document.createElement('div');
            this.password = options.password || '1234';
            this.isLocked = true;
            this.contentLevel = '3-6';
            this.initialize();
        }

        initialize() {
            // Création du HTML
            this.container.innerHTML = `
                <div class="settings-container">
                    <div class="settings-header">
                        <h2>Paramètres de contrôle parental</h2>
                        <div class="lock-status"></div>
                    </div>
                    <div class="password-section">
                        <input type="password" class="password-input" placeholder="Entrez le mot de passe"/>
                        <button class="unlock-button">Déverrouiller</button>
                    </div>
                    <div class="settings-content" style="display: none;">
                        <select class="content-level">
                            <option value="3-6">3-6 ans</option>
                            <option value="6-8">6-8 ans</option>
                            <option value="8-11">8-11 ans</option>
                            <option value="11-13">11-13 ans</option>
                            <option value="13-17">13-17 ans</option>
                            <option value="18+">18+</option>
                        </select>
                        <button class="save-button">Sauvegarder</button>
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
                }
                .settings-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 20px;
                }
                .settings-header h2 {
                    margin: 0;
                    color: #333;
                    font-size: 1.5em;
                }
                .password-section {
                    margin-bottom: 20px;
                }
                .password-input {
                    padding: 8px;
                    margin-right: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    width: 200px;
                }
                button {
                    padding: 8px 16px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                button:hover {
                    background-color: #0056b3;
                }
                .content-level {
                    width: 100%;
                    padding: 8px;
                    margin-bottom: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    background-color: white;
                }
                .content-level:focus {
                    border-color: #007bff;
                    outline: none;
                }
            `;
            document.head.appendChild(style);

            // Ajout des événements
            this.addEventListeners();
        }

        addEventListeners() {
            const unlockButton = this.container.querySelector('.unlock-button');
            const saveButton = this.container.querySelector('.save-button');
            const passwordInput = this.container.querySelector('.password-input');

            unlockButton.addEventListener('click', () => {
                if (passwordInput.value === this.password) {
                    this.unlock();
                } else {
                    alert('Mot de passe incorrect');
                }
            });

            saveButton.addEventListener('click', () => {
                this.save();
            });

            // Ajout de l'événement Enter sur le champ de mot de passe
            passwordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    unlockButton.click();
                }
            });
        }

        unlock() {
            this.isLocked = false;
            this.container.querySelector('.password-section').style.display = 'none';
            this.container.querySelector('.settings-content').style.display = 'block';
        }

        lock() {
            this.isLocked = true;
            this.container.querySelector('.password-section').style.display = 'block';
            this.container.querySelector('.settings-content').style.display = 'none';
            this.container.querySelector('.password-input').value = '';
        }

        save() {
            const contentLevel = this.container.querySelector('.content-level').value;
            this.contentLevel = contentLevel;
            // Déclencher l'événement Bubble
            if (window.bubble && window.bubble.triggerEvent) {
                window.bubble.triggerEvent('settings_saved', {
                    contentLevel: this.contentLevel
                });
            }
            this.lock();
        }
    }

    // Exposer la classe au scope global pour Bubble
    window.ParentalGuardSettings = ParentalGuardSettings;
})();