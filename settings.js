// ParentalGuardSettings.js
(function() {
    class ParentalGuardSettings {
        constructor(options = {}) {
            this.container = options.container || document.createElement('div');
            this.password = options.password || '1234';
            this.initialize();
        }

        initialize() {
            // Création du HTML pour le PIN uniquement
            this.container.innerHTML = `
                <div style="padding: 20px; max-width: 300px; margin: auto; text-align: center;">
                    <h3 style="margin-bottom: 20px;">Accès Protégé</h3>
                    <div>
                        <input type="password" 
                               id="pin-input"
                               placeholder="Entrez le code PIN"
                               style="padding: 10px; margin-bottom: 10px; width: 200px; text-align: center;"
                               maxlength="4">
                    </div>
                    <button id="unlock-btn" 
                            style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Déverrouiller
                    </button>
                    <div id="error-msg" style="color: red; margin-top: 10px; display: none;"></div>
                </div>
            `;

            // Ajout des événements
            const button = this.container.querySelector('#unlock-btn');
            const input = this.container.querySelector('#pin-input');
            const errorMsg = this.container.querySelector('#error-msg');

            const tryUnlock = () => {
                if (input.value === this.password) {
                    errorMsg.style.color = 'green';
                    errorMsg.textContent = 'Accès autorisé !';
                    errorMsg.style.display = 'block';
                    
                    // Déclencher le workflow Bubble (essayer différentes méthodes)
                    if (window.bubble) {
                        // Méthode 1
                        bubble.triggerWorkflow('unlock_settings');
                        // Méthode 2
                        try {
                            bubble.v.triggerWorkflow('unlock_settings');
                        } catch(e) {}
                        // Méthode 3
                        try {
                            bubble.v.executeWorkflow('unlock_settings');
                        } catch(e) {}
                    }
                } else {
                    input.value = '';
                    errorMsg.style.color = 'red';
                    errorMsg.textContent = 'Code PIN incorrect';
                    errorMsg.style.display = 'block';
                }
            };

            button.addEventListener('click', tryUnlock);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    tryUnlock();
                }
            });
        }
    }

    window.ParentalGuardSettings = ParentalGuardSettings;
})();
