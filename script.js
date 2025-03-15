document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const elements = {
        productInput: document.getElementById('product-input'),
        priceInput: document.getElementById('price-input'),
        languageSelect: document.getElementById('language-select'),
        apiKeyInput: document.getElementById('api-key'),
        generateBtn: document.getElementById('generate-btn'),
        loadingElement: document.getElementById('loading'),
        offerOutput: document.getElementById('offer-output'),
        offerHeadline: document.getElementById('offer-headline'),
        coreProduct: document.getElementById('core-product'),
        valueStack: document.getElementById('value-stack'),
        valuableBonus: document.getElementById('valuable-bonus'),
        urgencyElement: document.getElementById('urgency-element'),
        ctaButton: document.getElementById('cta-button'),
        copyBtn: document.getElementById('copy-btn'),
        regenerateBtn: document.getElementById('regenerate-btn'),
        instructionsLink: document.getElementById('instructions-link'),
        instructionsModal: document.getElementById('instructions-modal'),
        closeModal: document.querySelector('.close'),
        themeToggleBtn: document.getElementById('theme-toggle-btn')
    };

    // App state
    const state = {
        language: localStorage.getItem('preferredLanguage') || 'en',
        theme: localStorage.getItem('theme') || 'light'
    };

    // Initialize app
    function init() {
        loadSavedSettings();
        attachEventListeners();
        updatePlaceholders();
        applyTheme();
    }

    // Load saved settings
    function loadSavedSettings() {
        if (localStorage.getItem('openRouterApiKey')) {
            elements.apiKeyInput.value = localStorage.getItem('openRouterApiKey');
        }
        
        if (localStorage.getItem('preferredLanguage')) {
            elements.languageSelect.value = localStorage.getItem('preferredLanguage');
            state.language = localStorage.getItem('preferredLanguage');
        }
    }

    // Attach event listeners
    function attachEventListeners() {
        elements.generateBtn.addEventListener('click', generateOffer);
        elements.copyBtn.addEventListener('click', copyOfferToClipboard);
        elements.regenerateBtn.addEventListener('click', generateOffer);
        elements.instructionsLink.addEventListener('click', openInstructions);
        elements.closeModal.addEventListener('click', closeInstructions);
        elements.themeToggleBtn.addEventListener('click', toggleTheme);
        
        window.addEventListener('click', (e) => {
            if (e.target === elements.instructionsModal) {
                closeInstructions();
            }
        });

        elements.apiKeyInput.addEventListener('blur', function() {
            if (elements.apiKeyInput.value.trim() !== '') {
                localStorage.setItem('openRouterApiKey', elements.apiKeyInput.value);
            }
        });
        
        elements.languageSelect.addEventListener('change', function() {
            state.language = elements.languageSelect.value;
            localStorage.setItem('preferredLanguage', state.language);
            updatePlaceholders();
        });
    }
    
    // Toggle theme
    function toggleTheme() {
        state.theme = state.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', state.theme);
        applyTheme();
    }
    
    // Apply theme
    function applyTheme() {
        if (state.theme === 'dark') {
            document.body.classList.add('dark-theme');
            elements.themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.body.classList.remove('dark-theme');
            elements.themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }
    
    // Update placeholders based on selected language
    function updatePlaceholders() {
        if (state.language === 'ms') {
            elements.productInput.placeholder = 'cth., Jam Pintar, Kursus Online, Perkhidmatan Perundingan';
            elements.priceInput.placeholder = 'cth., 199';
            elements.generateBtn.innerHTML = 'Jana Tawaran <i class="fas fa-magic"></i>';
            elements.loadingElement.querySelector('p').textContent = 'Menyediakan tawaran sempurna anda...';
            elements.copyBtn.innerHTML = '<i class="fas fa-copy"></i> Salin Tawaran';
            elements.regenerateBtn.innerHTML = '<i class="fas fa-redo"></i> Jana Semula';
        } else {
            elements.productInput.placeholder = 'e.g., Smartwatch, Online Course, Consulting Service';
            elements.priceInput.placeholder = 'e.g., 199';
            elements.generateBtn.innerHTML = 'Generate Offer <i class="fas fa-magic"></i>';
            elements.loadingElement.querySelector('p').textContent = 'Crafting your perfect offer...';
            elements.copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Offer';
            elements.regenerateBtn.innerHTML = '<i class="fas fa-redo"></i> Regenerate';
        }
    }

    // Generate offer
    async function generateOffer() {
        const product = elements.productInput.value.trim();
        const price = elements.priceInput.value.trim();
        const apiKey = elements.apiKeyInput.value.trim();

        if (!validateInputs(product, price, apiKey)) return;

        // Show loading state
        elements.loadingElement.classList.remove('hidden');
        elements.generateBtn.disabled = true;
        elements.offerOutput.classList.add('hidden');

        try {
            const response = await fetchOfferFromAI(product, price, apiKey);
            displayOffer(response);
        } catch (error) {
            console.error('Error generating offer:', error);
            showError();
        } finally {
            // Hide loading state
            elements.loadingElement.classList.add('hidden');
            elements.generateBtn.disabled = false;
        }
    }
    
    // Validate inputs
    function validateInputs(product, price, apiKey) {
        if (!product) {
            alert(state.language === 'ms' ? 'Sila masukkan nama produk atau perkhidmatan.' : 'Please enter a product or service name.');
            return false;
        }
        
        if (!price) {
            alert(state.language === 'ms' ? 'Sila masukkan anggaran harga.' : 'Please enter an approximate price.');
            return false;
        }

        if (!apiKey) {
            alert(state.language === 'ms' ? 'Sila masukkan kunci API OpenRouter anda.' : 'Please enter your OpenRouter API key.');
            return false;
        }
        
        return true;
    }
    
    // Show error message
    function showError() {
        alert(state.language === 'ms' ? 
            'Ralat menjana tawaran. Sila periksa kunci API anda dan cuba lagi.' : 
            'Error generating offer. Please check your API key and try again.');
    }

    // Fetch offer from AI
    async function fetchOfferFromAI(product, price, apiKey) {
        const prompt = getPrompt(product, price);

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': window.location.href,
                'X-Title': 'Product Offer Generator'
            },
            body: JSON.stringify({
                model: 'google/learnlm-1.5-pro-experimental:free',
                messages: [
                    { 
                        role: 'system', 
                        content: state.language === 'ms' ? 
                            'Anda adalah pakar pemasaran yang mengkhusus dalam mencipta tawaran produk yang menarik dalam Bahasa Malaysia.' : 
                            'You are a marketing expert specializing in creating compelling product offers.'
                    },
                    { role: 'user', content: prompt }
                ],
                response_format: { type: 'json_object' }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to generate offer');
        }

        return parseAIResponse(await response.json());
    }
    
    // Get prompt based on language
    function getPrompt(product, price) {
        if (state.language === 'ms') {
            return `
            Cipta tawaran produk/perkhidmatan yang menarik untuk "${product}" dengan harga RM${price} menggunakan formula Value Stack dan Valuable Bonus.
            
            Format jawapan anda sebagai JSON dengan struktur berikut:
            {
                "headline": "Tajuk menarik untuk tawaran",
                "coreProduct": "Penerangan produk/perkhidmatan utama",
                "valueStack": ["Item 1 dengan nilai harga dalam RM", "Item 2 dengan nilai harga dalam RM", "Item 3 dengan nilai harga dalam RM"],
                "valuableBonus": "Butiran tawaran bonus",
                "urgencyElement": "Elemen terhad masa atau kekurangan",
                "ctaText": "Teks butang seruan untuk bertindak"
            }
            
            Buat tawaran yang menarik, spesifik, dan meyakinkan. Sertakan sekurang-kurangnya 3 item dalam value stack. Pastikan setiap item dalam value stack menyertakan nilai harga dalam Ringgit Malaysia (RM) untuk menunjukkan nilai sebenar tawaran. Jumlah nilai semua item dalam value stack sepatutnya melebihi harga produk untuk menunjukkan nilai yang baik (berbaloi).
            `;
        } else {
            return `
            Create a compelling product/service offer for "${product}" priced at RM${price} using the Value Stack and Valuable Bonus formula.
            
            Format your response as JSON with the following structure:
            {
                "headline": "A catchy headline for the offer",
                "coreProduct": "Description of the main product/service",
                "valueStack": ["Item 1 with price value in RM", "Item 2 with price value in RM", "Item 3 with price value in RM"],
                "valuableBonus": "Details of the bonus offer",
                "urgencyElement": "A time-limited or scarcity element",
                "ctaText": "Call to action button text"
            }
            
            Make the offer compelling, specific, and persuasive. Include at least 3 items in the value stack. Make sure each item in the value stack includes a price value in Malaysian Ringgit (RM) to show the actual value of the offer. The total value of all items in the value stack should exceed the product price to demonstrate good value (berbaloi).
            `;
        }
    }
    
    // Parse AI response
    function parseAIResponse(data) {
        try {
            // Parse the JSON from the AI response
            return JSON.parse(data.choices[0].message.content);
        } catch (e) {
            // If parsing fails, try to extract JSON from the text
            const content = data.choices[0].message.content;
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('Failed to parse AI response');
            }
        }
    }

    // Display offer
    function displayOffer(offerData) {
        // Update the offer elements with the AI-generated content
        elements.offerHeadline.textContent = offerData.headline;
        elements.coreProduct.textContent = offerData.coreProduct;
        
        // Clear and populate value stack items
        elements.valueStack.innerHTML = '';
        offerData.valueStack.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            elements.valueStack.appendChild(li);
        });
        
        elements.valuableBonus.textContent = offerData.valuableBonus;
        elements.urgencyElement.textContent = offerData.urgencyElement;
        elements.ctaButton.textContent = offerData.ctaText;
        
        // Show the offer output
        elements.offerOutput.classList.remove('hidden');
        
        // Scroll to the offer
        elements.offerOutput.scrollIntoView({ behavior: 'smooth' });
    }

    // Copy offer to clipboard
    function copyOfferToClipboard() {
        const offerText = getFormattedOfferText();

        navigator.clipboard.writeText(offerText)
            .then(() => {
                // Change button text temporarily
                const originalText = elements.copyBtn.innerHTML;
                elements.copyBtn.innerHTML = state.language === 'ms' ? 
                    '<i class="fas fa-check"></i> Disalin!' : 
                    '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    elements.copyBtn.innerHTML = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                alert(state.language === 'ms' ? 
                    'Gagal menyalin ke papan keratan' : 
                    'Failed to copy to clipboard');
            });
    }
    
    // Get formatted offer text
    function getFormattedOfferText() {
        if (state.language === 'ms') {
            return `
${elements.offerHeadline.textContent}

Produk/Perkhidmatan Utama:
${elements.coreProduct.textContent}

Value Stack:
${Array.from(elements.valueStack.children).map(li => `- ${li.textContent}`).join('\n')}

Bonus Bernilai:
${elements.valuableBonus.textContent}

${elements.urgencyElement.textContent}

${elements.ctaButton.textContent}
            `.trim();
        } else {
            return `
${elements.offerHeadline.textContent}

Core Product/Service:
${elements.coreProduct.textContent}

Value Stack:
${Array.from(elements.valueStack.children).map(li => `- ${li.textContent}`).join('\n')}

Valuable Bonus:
${elements.valuableBonus.textContent}

${elements.urgencyElement.textContent}

${elements.ctaButton.textContent}
            `.trim();
        }
    }

    // Open instructions modal
    function openInstructions(e) {
        e.preventDefault();
        elements.instructionsModal.classList.remove('hidden');
    }

    // Close instructions modal
    function closeInstructions() {
        elements.instructionsModal.classList.add('hidden');
    }
    
    // Initialize the app
    init();
}); 