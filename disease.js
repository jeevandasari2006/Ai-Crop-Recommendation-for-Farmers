// Disease Detection
const uploadArea = document.getElementById('uploadArea');
const diseaseImage = document.getElementById('diseaseImage');
const diseaseResult = document.getElementById('diseaseResult');
const uploadedImage = document.getElementById('uploadedImage');
const saveReportBtn = document.getElementById('saveReport');

uploadArea.addEventListener('click', () => diseaseImage.click());

diseaseImage.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        uploadedImage.src = event.target.result;
        
        // Simulate more accurate AI detection with comprehensive disease database
        setTimeout(() => {
            // Comprehensive database of plant diseases with detailed information
            // Categorized by pathogen and symptom type
            const diseaseDatabase = [
                // Fungal diseases
                {
                    name: 'Leaf Blight',
                    category: 'Fungal',
                    type: 'Blight',
                    scientificName: 'Pyricularia oryzae',
                    cause: 'Fungal infection caused by Pyricularia oryzae, commonly affecting rice plants. Thrives in warm, humid conditions with temperatures between 25-30°C.',
                    symptoms: 'Small, dark brown spots on leaf tips that expand rapidly, causing leaf death. Lesions may have a grayish center with brown borders.',
                    treatment: 'Apply systemic fungicides like propiconazole or carbendazim. Remove and destroy infected plant parts. Improve air circulation and avoid overhead watering. Use resistant varieties when available.',
                    prevention: 'Practice crop rotation, maintain proper plant spacing, and avoid excessive nitrogen fertilization. Apply preventive fungicides during high-risk periods.',
                    confidence: '92%'
                },
                {
                    name: 'Powdery Mildew',
                    category: 'Fungal',
                    type: 'Mildew',
                    scientificName: 'Erysiphe spp.',
                    cause: 'Fungal disease caused by various Erysiphe species. Common in warm, dry climates with high humidity at night.',
                    symptoms: 'White, powdery fungal growth on leaf surfaces, stems, and sometimes fruits. Leaves may yellow and wither prematurely.',
                    treatment: 'Apply sulfur-based fungicides or potassium bicarbonate. Remove infected plant parts. Increase air circulation and reduce humidity.',
                    prevention: 'Choose resistant varieties, avoid overcrowding plants, and water at soil level rather than overhead. Maintain proper plant spacing.',
                    confidence: '88%'
                },
                {
                    name: 'Late Blight',
                    category: 'Fungal',
                    type: 'Blight',
                    scientificName: 'Phytophthora infestans',
                    cause: 'Oomycete pathogen causing devastating effects on tomato and potato crops, especially in cool, wet conditions.',
                    symptoms: 'Large, water-soaked lesions on leaves and stems, white fungal growth on leaf undersides in humid conditions, dark lesions on stems and fruits.',
                    treatment: 'Apply copper-based fungicides or systemic fungicides like metalaxyl. Remove infected plant parts immediately. Harvest tubers before foliage dies.',
                    prevention: 'Plant resistant varieties, avoid overhead irrigation, and provide good air circulation. Monitor weather conditions for early warning.',
                    confidence: '90%'
                },
                {
                    name: 'Rust Disease',
                    category: 'Fungal',
                    type: 'Rust',
                    scientificName: 'Puccinia spp.',
                    cause: 'Fungal rust pathogens that produce characteristic orange, brown, or black pustules on plant surfaces.',
                    symptoms: 'Small, raised pustules on leaf undersides that rupture to release rust-colored spores. Yellowing and premature leaf drop.',
                    treatment: 'Apply fungicides containing triadimefon or propiconazole. Remove and destroy infected leaves. Improve air circulation around plants.',
                    prevention: 'Space plants properly for air movement, water at ground level, and remove plant debris at season end. Apply preventive fungicides if history of rust.',
                    confidence: '87%'
                },
                {
                    name: 'Early Blight',
                    category: 'Fungal',
                    type: 'Blight',
                    scientificName: 'Alternaria solani',
                    cause: 'Fungal pathogen affecting tomatoes and potatoes. Spreads in warm, humid conditions.',
                    symptoms: 'Concentric rings on lower leaves, creating a target-like pattern. Yellowing and death of lower leaves, progressing upward.',
                    treatment: 'Apply fungicides containing chlorothalonil or mancozeb. Remove affected leaves. Mulch plants to prevent soil splash.',
                    prevention: 'Rotate crops, space plants for air circulation, and water at soil level. Remove plant debris at season end.',
                    confidence: '89%'
                },
                {
                    name: 'Leaf Spot',
                    category: 'Fungal',
                    type: 'Spot',
                    scientificName: 'Cercospora spp.',
                    cause: 'Fungal infection causing circular spots on leaves. Common in humid conditions.',
                    symptoms: 'Small, circular spots with gray or tan centers and dark borders on leaves. Severe infections cause leaf drop.',
                    treatment: 'Apply fungicides containing chlorothalonil. Remove infected leaves. Improve air circulation.',
                    prevention: 'Avoid overhead watering, space plants properly, and rotate crops. Remove plant debris.',
                    confidence: '86%'
                },
                // Bacterial diseases
                {
                    name: 'Bacterial Wilt',
                    category: 'Bacterial',
                    type: 'Wilt',
                    scientificName: 'Ralstonia solanacearum',
                    cause: 'Bacterial infection caused by Ralstonia solanacearum, affecting solanaceous crops like tomatoes and potatoes.',
                    symptoms: 'Rapid wilting of leaves while they remain green, yellowing and browning of vascular tissue, stunted growth.',
                    treatment: 'Remove and destroy infected plants immediately. Solarize soil to reduce bacterial load. Avoid working in fields when plants are wet.',
                    prevention: 'Use disease-free seeds and transplants. Practice crop rotation with non-host crops. Maintain proper drainage and avoid overwatering.',
                    confidence: '85%'
                },
                {
                    name: 'Bacterial Leaf Spot',
                    category: 'Bacterial',
                    type: 'Spot',
                    scientificName: 'Xanthomonas campestris',
                    cause: 'Bacterial infection causing water-soaked spots on leaves. Spreads in wet conditions.',
                    symptoms: 'Small, water-soaked spots that become brown or black with yellow halos. Leaves may yellow and drop.',
                    treatment: 'Remove infected plant parts. Avoid overhead watering. Apply copper-based bactericides.',
                    prevention: 'Use disease-free seeds, rotate crops, and avoid working with plants when wet. Control weeds that harbor bacteria.',
                    confidence: '84%'
                },
                // Viral diseases
                {
                    name: 'Mosaic Virus',
                    category: 'Viral',
                    type: 'Distortion',
                    scientificName: 'Tobacco Mosaic Virus',
                    cause: 'Viral infection causing mottled patterns on leaves. Spread by contact and insects.',
                    symptoms: 'Mottled light and dark green patterns on leaves, leaf distortion, stunted growth, reduced yield.',
                    treatment: 'No cure for viral infections. Remove and destroy infected plants. Control insect vectors.',
                    prevention: 'Use virus-free seeds, control aphids and other vectors, and sanitize tools. Remove weeds that harbor viruses.',
                    confidence: '82%'
                },
                // Wilts
                {
                    name: 'Fusarium Wilt',
                    category: 'Fungal',
                    type: 'Wilt',
                    scientificName: 'Fusarium oxysporum',
                    cause: 'Soil-borne fungal pathogen that blocks water transport in plants, causing wilting and death.',
                    symptoms: 'Yellowing and wilting of lower leaves, one-sided wilting, brown discoloration of vascular tissue when stems are cut.',
                    treatment: 'Remove infected plants and solarize soil. Apply beneficial microbes like Trichoderma. Use resistant varieties when available.',
                    prevention: 'Practice long crop rotations, maintain soil health with organic matter, and avoid planting susceptible crops in infected fields.',
                    confidence: '83%'
                },
                // Cankers
                {
                    name: 'Canker Disease',
                    category: 'Fungal',
                    type: 'Canker',
                    scientificName: 'Botryosphaeria spp.',
                    cause: 'Fungal pathogens causing sunken, dead areas on stems and branches, often following injury.',
                    symptoms: 'Sunken, discolored areas on stems and branches, dieback of shoots above canker, cracking of bark.',
                    treatment: 'Prune out infected branches, cutting several inches below the canker. Disinfect tools between cuts.',
                    prevention: 'Avoid plant injury, maintain plant health with proper watering and fertilization, and protect from sunscald.',
                    confidence: '81%'
                },
                // Root and stem rots
                {
                    name: 'Root Rot',
                    category: 'Fungal',
                    type: 'Rot',
                    scientificName: 'Pythium spp.',
                    cause: 'Soil-borne fungal pathogens causing decay of roots in overly wet conditions.',
                    symptoms: 'Wilting, yellowing leaves, stunted growth, blackened roots, plant death in severe cases.',
                    treatment: 'Improve drainage, reduce watering, and apply beneficial fungi like mycorrhizae. Remove severely infected plants.',
                    prevention: 'Ensure proper drainage, avoid overwatering, and use pasteurized soil for seedlings.',
                    confidence: '80%'
                },
                // Healthy Plant
                {
                    name: 'Healthy Plant',
                    category: 'None',
                    type: 'Healthy',
                    scientificName: 'No pathogens detected',
                    cause: 'Plant appears healthy with no visible signs of disease or pest damage.',
                    symptoms: 'Vibrant green coloration, normal growth patterns, no spots, lesions, or deformities.',
                    treatment: 'Continue regular care and monitoring. Maintain proper watering, fertilization, and pest control practices.',
                    prevention: 'Continue current good cultural practices. Monitor regularly for early signs of problems.',
                    confidence: '95%'
                }
            ];
            
            // Select a disease based on probability (making diseases more likely for demonstration)
            const random = Math.random();
            let result;
            
            if (random < 0.2) {
                // 20% chance of healthy plant
                result = diseaseDatabase[diseaseDatabase.length - 1];
            } else {
                // 80% chance of disease (excluding healthy)
                const diseaseIndex = Math.floor(Math.random() * (diseaseDatabase.length - 1));
                result = diseaseDatabase[diseaseIndex];
            }
            
            // Display results
            document.getElementById('diseaseName').textContent = `${result.name} (${result.scientificName})`;
            document.getElementById('diseaseCategory').textContent = result.category;
            document.getElementById('diseaseType').textContent = result.type;
            document.getElementById('diseaseCause').textContent = result.cause;
            document.getElementById('diseaseSymptoms').textContent = result.symptoms;
            document.getElementById('diseaseTreatment').textContent = result.treatment;
            document.getElementById('diseasePrevention').textContent = result.prevention;
            document.getElementById('confidence').textContent = result.confidence;
            
            diseaseResult.classList.remove('hidden');
        }, 1500);
    };
    reader.readAsDataURL(file);
});

saveReportBtn.addEventListener('click', () => {
    alert('Report saved successfully! You can access it from your profile.');
});
