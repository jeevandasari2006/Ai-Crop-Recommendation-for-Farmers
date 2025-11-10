// Crop Suggestion
const getSuggestionsBtn = document.getElementById('getSuggestionsBtn');
const detectLocationBtn = document.getElementById('detectLocationBtn');
const cropResults = document.getElementById('cropResults');
const cropList = document.getElementById('cropList');
const regionInput = document.getElementById('region');

// Function to calculate nutrient match score
function calculateNutrientMatch(nitrogenReq, phosphorusReq, potassiumReq, phReq, nitrogenLevel, phosphorusLevel, potassiumLevel, phLevel) {
    // Parse requirement strings to get ideal ranges
    const parseRequirement = (req) => {
        if (typeof req !== 'string') return { min: 50, max: 50 };
        
        // Handle pH separately
        if (req.includes('-')) {
            const parts = req.split('-');
            return { min: parseFloat(parts[0]) * 10, max: parseFloat(parts[1]) * 10 };
        }
        
        // Handle qualitative descriptions
        const levelMap = {
            'very low': { min: 0, max: 20 },
            'low': { min: 20, max: 40 },
            'medium': { min: 40, max: 60 },
            'high': { min: 60, max: 80 },
            'very high': { min: 80, max: 100 }
        };
        
        const normalizedReq = req.toLowerCase();
        for (const [key, value] of Object.entries(levelMap)) {
            if (normalizedReq.includes(key)) {
                return value;
            }
        }
        
        // Default case
        return { min: 40, max: 60 };
    };
    
    // Parse requirements
    const nitrogenRange = parseRequirement(nitrogenReq);
    const phosphorusRange = parseRequirement(phosphorusReq);
    const potassiumRange = parseRequirement(potassiumReq);
    
    // Parse pH requirement
    let phRange = { min: 60, max: 70 }; // Default 6.0-7.0
    if (typeof phReq === 'string' && phReq.includes('-')) {
        const parts = phReq.split('-');
        phRange = { min: parseFloat(parts[0]) * 10, max: parseFloat(parts[1]) * 10 };
    }
    
    // Calculate match scores for each nutrient (0-100)
    const calculateMatch = (currentLevel, idealRange) => {
        const { min, max } = idealRange;
        
        if (currentLevel >= min && currentLevel <= max) {
            return 100; // Perfect match
        }
        
        // Calculate distance from ideal range
        const distance = currentLevel < min ? min - currentLevel : currentLevel - max;
        // Convert to score (0-100), with 0 distance = 100 score
        return Math.max(0, 100 - (distance * 2));
    };
    
    const nitrogenMatch = calculateMatch(nitrogenLevel, nitrogenRange);
    const phosphorusMatch = calculateMatch(phosphorusLevel, phosphorusRange);
    const potassiumMatch = calculateMatch(potassiumLevel, potassiumRange);
    const phMatch = calculateMatch(phLevel * 10, phRange);
    
    // Return average score
    return Math.round((nitrogenMatch + phosphorusMatch + potassiumMatch + phMatch) / 4);
}

// Soil nutrient requirements for different crops
const cropNutrientData = {
    'Rice': { nitrogen: 'High (120-150 kg/ha)', phosphorus: 'Medium (40-60 kg/ha)', potassium: 'High (40-60 kg/ha)', ph: '5.5-7.0' },
    'Wheat': { nitrogen: 'Medium (80-120 kg/ha)', phosphorus: 'High (60-90 kg/ha)', potassium: 'Medium (40-60 kg/ha)', ph: '6.0-7.5' },
    'Maize': { nitrogen: 'High (120-150 kg/ha)', phosphorus: 'Medium (60-90 kg/ha)', potassium: 'Medium (40-60 kg/ha)', ph: '5.8-7.0' },
    'Cotton': { nitrogen: 'High (100-150 kg/ha)', phosphorus: 'Medium (40-60 kg/ha)', potassium: 'High (60-90 kg/ha)', ph: '6.0-8.0' },
    'Sugarcane': { nitrogen: 'Very High (200-250 kg/ha)', phosphorus: 'High (100-150 kg/ha)', potassium: 'High (150-200 kg/ha)', ph: '6.5-7.5' },
    'Groundnut': { nitrogen: 'Low (20-40 kg/ha)', phosphorus: 'High (40-60 kg/ha)', potassium: 'Medium (20-40 kg/ha)', ph: '5.5-7.0' },
    'Soybean': { nitrogen: 'Low (20-40 kg/ha)', phosphorus: 'Medium (40-60 kg/ha)', potassium: 'Medium (40-60 kg/ha)', ph: '6.0-7.0' },
    'Bajra': { nitrogen: 'Low (40-60 kg/ha)', phosphorus: 'Medium (30-40 kg/ha)', potassium: 'Low (20-30 kg/ha)', ph: '6.5-8.0' },
    'Jowar': { nitrogen: 'Medium (60-80 kg/ha)', phosphorus: 'Medium (30-40 kg/ha)', potassium: 'Low (20-30 kg/ha)', ph: '6.0-7.5' },
    'Gram': { nitrogen: 'Low (20-40 kg/ha)', phosphorus: 'High (40-60 kg/ha)', potassium: 'Medium (20-40 kg/ha)', ph: '6.0-7.5' },
    'Mustard': { nitrogen: 'Medium (80-100 kg/ha)', phosphorus: 'High (40-60 kg/ha)', potassium: 'Medium (30-40 kg/ha)', ph: '6.0-7.5' },
    'Barley': { nitrogen: 'Medium (60-80 kg/ha)', phosphorus: 'Medium (40-60 kg/ha)', potassium: 'Low (20-30 kg/ha)', ph: '6.0-7.5' },
    'Lentil': { nitrogen: 'Low (20-30 kg/ha)', phosphorus: 'Medium (30-40 kg/ha)', potassium: 'Low (20-30 kg/ha)', ph: '6.0-7.5' },
    'Peas': { nitrogen: 'Low (20-30 kg/ha)', phosphorus: 'Medium (30-40 kg/ha)', potassium: 'Low (20-30 kg/ha)', ph: '6.0-7.5' },
    'Potato': { nitrogen: 'High (150-200 kg/ha)', phosphorus: 'High (80-120 kg/ha)', potassium: 'Very High (200-250 kg/ha)', ph: '5.0-6.5' },
    'Tomato': { nitrogen: 'High (120-150 kg/ha)', phosphorus: 'Medium (60-90 kg/ha)', potassium: 'High (120-150 kg/ha)', ph: '6.0-7.0' },
    'Onion': { nitrogen: 'High (100-120 kg/ha)', phosphorus: 'Medium (50-60 kg/ha)', potassium: 'High (100-120 kg/ha)', ph: '6.0-7.0' },
    'Garlic': { nitrogen: 'Medium (80-100 kg/ha)', phosphorus: 'Medium (40-50 kg/ha)', potassium: 'Medium (60-80 kg/ha)', ph: '6.0-7.0' },
    'Turmeric': { nitrogen: 'Medium (80-100 kg/ha)', phosphorus: 'Medium (40-50 kg/ha)', potassium: 'High (100-120 kg/ha)', ph: '6.0-7.5' },
    'Ginger': { nitrogen: 'Medium (100-120 kg/ha)', phosphorus: 'Medium (50-60 kg/ha)', potassium: 'High (120-150 kg/ha)', ph: '6.0-7.0' },
    'Cucumber': { nitrogen: 'High (100-150 kg/ha)', phosphorus: 'Medium (50-80 kg/ha)', potassium: 'High (100-150 kg/ha)', ph: '6.0-7.0' },
    'Watermelon': { nitrogen: 'High (80-120 kg/ha)', phosphorus: 'Medium (40-60 kg/ha)', potassium: 'High (80-120 kg/ha)', ph: '6.0-7.0' },
    'Muskmelon': { nitrogen: 'High (80-120 kg/ha)', phosphorus: 'Medium (40-60 kg/ha)', potassium: 'High (80-120 kg/ha)', ph: '6.0-7.0' },
    'Bitter Gourd': { nitrogen: 'High (100-120 kg/ha)', phosphorus: 'Medium (50-60 kg/ha)', potassium: 'High (80-100 kg/ha)', ph: '6.0-7.0' },
    'Bottle Gourd': { nitrogen: 'Medium (80-100 kg/ha)', phosphorus: 'Medium (40-50 kg/ha)', potassium: 'Medium (60-80 kg/ha)', ph: '6.0-7.0' },
    'Okra': { nitrogen: 'Medium (100-120 kg/ha)', phosphorus: 'Medium (50-60 kg/ha)', potassium: 'High (80-100 kg/ha)', ph: '6.0-7.5' },
    'Green Gram': { nitrogen: 'Low (20-30 kg/ha)', phosphorus: 'Medium (30-40 kg/ha)', potassium: 'Low (20-30 kg/ha)', ph: '6.0-7.5' },
    'Sesame': { nitrogen: 'Medium (40-60 kg/ha)', phosphorus: 'Medium (30-40 kg/ha)', potassium: 'Medium (30-40 kg/ha)', ph: '6.0-7.5' },
    'Castor': { nitrogen: 'Medium (60-80 kg/ha)', phosphorus: 'Medium (40-50 kg/ha)', potassium: 'Medium (40-50 kg/ha)', ph: '6.0-8.0' },
    'Cumin': { nitrogen: 'Medium (60-80 kg/ha)', phosphorus: 'Medium (30-40 kg/ha)', potassium: 'Medium (30-40 kg/ha)', ph: '6.5-8.0' },
    'Coriander': { nitrogen: 'Medium (80-100 kg/ha)', phosphorus: 'Medium (40-50 kg/ha)', potassium: 'Medium (60-80 kg/ha)', ph: '6.0-7.5' },
    'Sunflower': { nitrogen: 'High (100-120 kg/ha)', phosphorus: 'High (60-80 kg/ha)', potassium: 'High (80-100 kg/ha)', ph: '6.0-8.0' },
    'Jute': { nitrogen: 'High (100-150 kg/ha)', phosphorus: 'Medium (40-60 kg/ha)', potassium: 'Medium (40-60 kg/ha)', ph: '5.5-7.0' },
    'Tea': { nitrogen: 'Medium (50-80 kg/ha)', phosphorus: 'Medium (30-50 kg/ha)', potassium: 'High (80-120 kg/ha)', ph: '4.5-5.5' },
    'Coffee': { nitrogen: 'High (200-300 kg/ha)', phosphorus: 'High (100-150 kg/ha)', potassium: 'High (200-300 kg/ha)', ph: '6.0-6.5' },
    'Cardamom': { nitrogen: 'Medium (100-150 kg/ha)', phosphorus: 'Medium (50-80 kg/ha)', potassium: 'High (150-200 kg/ha)', ph: '6.0-7.0' },
    'Black Pepper': { nitrogen: 'Medium (100-150 kg/ha)', phosphorus: 'Medium (50-80 kg/ha)', potassium: 'High (150-200 kg/ha)', ph: '6.0-7.0' },
    'Strawberry': { nitrogen: 'High (150-200 kg/ha)', phosphorus: 'Medium (80-100 kg/ha)', potassium: 'High (150-200 kg/ha)', ph: '5.5-6.5' },
    'Cabbage': { nitrogen: 'High (150-200 kg/ha)', phosphorus: 'Medium (80-100 kg/ha)', potassium: 'High (150-200 kg/ha)', ph: '6.0-7.5' },
    'Cauliflower': { nitrogen: 'High (150-200 kg/ha)', phosphorus: 'Medium (80-100 kg/ha)', potassium: 'High (150-200 kg/ha)', ph: '6.0-7.5' },
    'Pumpkin': { nitrogen: 'Medium (100-120 kg/ha)', phosphorus: 'Medium (50-60 kg/ha)', potassium: 'High (100-120 kg/ha)', ph: '6.0-7.5' },
    'Ridge Gourd': { nitrogen: 'Medium (100-120 kg/ha)', phosphorus: 'Medium (50-60 kg/ha)', potassium: 'High (100-120 kg/ha)', ph: '6.0-7.0' },
    'Rapeseed': { nitrogen: 'High (120-150 kg/ha)', phosphorus: 'Medium (60-80 kg/ha)', potassium: 'High (80-100 kg/ha)', ph: '6.0-7.5' },
    'Banana': { nitrogen: 'High (200-250 kg/ha)', phosphorus: 'High (50-80 kg/ha)', potassium: 'Very High (300-400 kg/ha)', ph: '5.5-7.0' },
    'Tapioca': { nitrogen: 'Medium (100-120 kg/ha)', phosphorus: 'Medium (40-60 kg/ha)', potassium: 'High (150-200 kg/ha)', ph: '5.0-6.5' },
    'Pigeon Pea': { nitrogen: 'Low (20-40 kg/ha)', phosphorus: 'Medium (40-60 kg/ha)', potassium: 'Medium (40-60 kg/ha)', ph: '6.0-7.5' },
    'Cluster Bean': { nitrogen: 'Low (20-30 kg/ha)', phosphorus: 'Medium (30-40 kg/ha)', potassium: 'Low (20-30 kg/ha)', ph: '6.5-8.0' },
    'Fenugreek': { nitrogen: 'Medium (40-60 kg/ha)', phosphorus: 'Medium (30-40 kg/ha)', potassium: 'Medium (30-40 kg/ha)', ph: '6.0-7.5' },
    'Snake Gourd': { nitrogen: 'Medium (80-100 kg/ha)', phosphorus: 'Medium (40-50 kg/ha)', potassium: 'High (100-120 kg/ha)', ph: '6.0-7.0' },
    'Pulses': { nitrogen: 'Low (20-40 kg/ha)', phosphorus: 'Medium (30-50 kg/ha)', potassium: 'Low (20-40 kg/ha)', ph: '6.0-7.5' },
    'Black Gram': { nitrogen: 'Low (20-40 kg/ha)', phosphorus: 'Medium (30-50 kg/ha)', potassium: 'Low (20-40 kg/ha)', ph: '6.0-7.5' },
    'Carrot': { nitrogen: 'Medium (80-100 kg/ha)', phosphorus: 'Medium (40-60 kg/ha)', potassium: 'High (120-150 kg/ha)', ph: '6.0-7.0' },
    'Coconut': { nitrogen: 'Medium (50-80 kg/ha)', phosphorus: 'Medium (30-50 kg/ha)', potassium: 'Very High (200-300 kg/ha)', ph: '5.0-7.0' },
    'Areca Nut': { nitrogen: 'Medium (80-100 kg/ha)', phosphorus: 'Medium (40-60 kg/ha)', potassium: 'High (150-200 kg/ha)', ph: '5.5-7.0' },
    'Mushrooms': { nitrogen: 'Low (10-20 kg/ha)', phosphorus: 'Low (10-20 kg/ha)', potassium: 'Low (10-20 kg/ha)', ph: '6.0-7.0' },
    'Vegetables (Mixed)': { nitrogen: 'High (100-150 kg/ha)', phosphorus: 'Medium (50-80 kg/ha)', potassium: 'High (100-150 kg/ha)', ph: '6.0-7.0' },
    'Fodder Crops': { nitrogen: 'Medium (60-80 kg/ha)', phosphorus: 'Medium (30-50 kg/ha)', potassium: 'Medium (40-60 kg/ha)', ph: '6.0-7.5' },
    'Flowers (Commercial)': { nitrogen: 'High (120-150 kg/ha)', phosphorus: 'Medium (60-80 kg/ha)', potassium: 'High (120-150 kg/ha)', ph: '6.0-7.5' },
    'Exotic Vegetables': { nitrogen: 'High (150-200 kg/ha)', phosphorus: 'High (80-100 kg/ha)', potassium: 'High (150-200 kg/ha)', ph: '6.0-7.0' },
    // New crops added
    'Papaya': { nitrogen: 'Medium (100-150 kg/ha)', phosphorus: 'Medium (50-80 kg/ha)', potassium: 'High (150-200 kg/ha)', ph: '6.0-7.0' },
    'Mango': { nitrogen: 'Medium (80-120 kg/ha)', phosphorus: 'Medium (40-60 kg/ha)', potassium: 'High (100-150 kg/ha)', ph: '5.5-7.5' },
    'Guava': { nitrogen: 'Medium (100-120 kg/ha)', phosphorus: 'Medium (50-70 kg/ha)', potassium: 'High (100-150 kg/ha)', ph: '6.0-7.5' },
    'Pomegranate': { nitrogen: 'Medium (80-100 kg/ha)', phosphorus: 'Medium (40-60 kg/ha)', potassium: 'High (80-120 kg/ha)', ph: '6.5-7.5' },
    'Grapes': { nitrogen: 'Medium (100-150 kg/ha)', phosphorus: 'Medium (60-80 kg/ha)', potassium: 'High (120-180 kg/ha)', ph: '6.0-7.5' },
    'Orange': { nitrogen: 'High (150-200 kg/ha)', phosphorus: 'Medium (60-90 kg/ha)', potassium: 'High (150-200 kg/ha)', ph: '6.0-7.5' },
    'Lemon': { nitrogen: 'High (150-180 kg/ha)', phosphorus: 'Medium (60-80 kg/ha)', potassium: 'High (120-160 kg/ha)', ph: '5.5-6.5' },
    'Cashew': { nitrogen: 'Medium (50-70 kg/ha)', phosphorus: 'Medium (30-50 kg/ha)', potassium: 'High (80-120 kg/ha)', ph: '5.5-6.5' },
    'Chilli': { nitrogen: 'High (120-150 kg/ha)', phosphorus: 'Medium (60-80 kg/ha)', potassium: 'High (100-150 kg/ha)', ph: '6.0-7.0' },
    'Brinjal': { nitrogen: 'High (120-150 kg/ha)', phosphorus: 'Medium (60-90 kg/ha)', potassium: 'High (120-150 kg/ha)', ph: '6.0-7.0' },
    'Spinach': { nitrogen: 'High (100-150 kg/ha)', phosphorus: 'Medium (40-60 kg/ha)', potassium: 'High (80-120 kg/ha)', ph: '6.0-7.0' },
    'Radish': { nitrogen: 'Medium (80-100 kg/ha)', phosphorus: 'Medium (40-60 kg/ha)', potassium: 'Medium (60-80 kg/ha)', ph: '6.0-7.0' },
    'Beetroot': { nitrogen: 'Medium (80-120 kg/ha)', phosphorus: 'Medium (50-70 kg/ha)', potassium: 'High (100-140 kg/ha)', ph: '6.0-7.5' },
    'Sweet Potato': { nitrogen: 'Medium (80-100 kg/ha)', phosphorus: 'Medium (40-60 kg/ha)', potassium: 'High (120-160 kg/ha)', ph: '5.5-6.5' },
    'Oats': { nitrogen: 'Medium (80-100 kg/ha)', phosphorus: 'Medium (40-60 kg/ha)', potassium: 'Medium (40-60 kg/ha)', ph: '6.0-7.0' },
    'Millets': { nitrogen: 'Low (40-60 kg/ha)', phosphorus: 'Medium (30-40 kg/ha)', potassium: 'Low (30-40 kg/ha)', ph: '6.0-7.5' },
    'Ragi': { nitrogen: 'Medium (60-80 kg/ha)', phosphorus: 'Medium (40-50 kg/ha)', potassium: 'Medium (40-50 kg/ha)', ph: '5.5-7.0' },
    'Pearl Millet (Bajra)': { nitrogen: 'Low (40-60 kg/ha)', phosphorus: 'Medium (30-40 kg/ha)', potassium: 'Low (20-30 kg/ha)', ph: '6.5-8.0' },
    'Pigeon Pea (Arhar)': { nitrogen: 'Low (20-40 kg/ha)', phosphorus: 'Medium (40-60 kg/ha)', potassium: 'Medium (40-60 kg/ha)', ph: '6.0-7.5' },
    'Lentil (Masoor)': { nitrogen: 'Low (20-30 kg/ha)', phosphorus: 'Medium (30-40 kg/ha)', potassium: 'Low (20-30 kg/ha)', ph: '6.0-7.5' },
    'Green Gram (Moong)': { nitrogen: 'Low (20-30 kg/ha)', phosphorus: 'Medium (30-40 kg/ha)', potassium: 'Low (20-30 kg/ha)', ph: '6.0-7.5' },
    'Gram (Chickpea)': { nitrogen: 'Low (20-40 kg/ha)', phosphorus: 'High (40-60 kg/ha)', potassium: 'Medium (20-40 kg/ha)', ph: '6.0-7.5' },
    'Jowar (Sorghum)': { nitrogen: 'Medium (60-80 kg/ha)', phosphorus: 'Medium (30-40 kg/ha)', potassium: 'Low (20-30 kg/ha)', ph: '6.0-7.5' },
    'Okra (Bhindi)': { nitrogen: 'Medium (100-120 kg/ha)', phosphorus: 'Medium (50-60 kg/ha)', potassium: 'High (80-100 kg/ha)', ph: '6.0-7.5' },
    'Vegetables (Premium)': { nitrogen: 'High (150-200 kg/ha)', phosphorus: 'High (80-120 kg/ha)', potassium: 'High (150-200 kg/ha)', ph: '6.0-7.0' }
};

// Detect location and get detailed location information (state, district, mandal)
detectLocationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
    }
    
    detectLocationBtn.disabled = true;
    detectLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            try {
                // Use reverse geocoding to get detailed location information
                // Request more detailed address information
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`
                );
                const data = await response.json();
                
                console.log('Full location data:', data);
                
                // Extract detailed location information
                const address = data.address || {};
                
                // Get state, district, and sub-district (mandal) information
                const state = address.state || address.region || 'Unknown State';
                const district = address.county || address.district || 'Unknown District';
                const mandal = address.suburb || address.neighbourhood || address.city || address.town || address.village || 'Unknown Mandal';
                
                // Create a formatted location string
                const locationDetails = `${mandal}, ${district}, ${state}`;
                
                // Set the value in the region input field
                regionInput.value = locationDetails;
                
                console.log('Detailed location detected:', locationDetails);
            } catch (error) {
                console.error('Location detection error:', error);
                regionInput.value = 'India'; // Fallback
            } finally {
                detectLocationBtn.disabled = false;
                detectLocationBtn.innerHTML = '<i class="fas fa-location-arrow"></i>';
            }
        },
        (error) => {
            console.error('Geolocation error:', error);
            regionInput.value = 'India'; // Fallback
            detectLocationBtn.disabled = false;
            detectLocationBtn.innerHTML = '<i class="fas fa-location-arrow"></i>';
        }
    );
});

// Region-specific crop database for India
const regionCropData = {
    // North India
    punjab: { climate: 'subtropical', rainfall: 'moderate' },
    haryana: { climate: 'subtropical', rainfall: 'moderate' },
    delhi: { climate: 'subtropical', rainfall: 'moderate' },
    uttarakhand: { climate: 'temperate', rainfall: 'high' },
    himachal: { climate: 'temperate', rainfall: 'high' },
    jammu: { climate: 'temperate', rainfall: 'moderate' },
    
    // South India
    karnataka: { climate: 'tropical', rainfall: 'high' },
    tamilnadu: { climate: 'tropical', rainfall: 'moderate' },
    kerala: { climate: 'tropical', rainfall: 'high' },
    andhra: { climate: 'tropical', rainfall: 'moderate' },
    telangana: { climate: 'tropical', rainfall: 'low' },
    
    // West India
    maharashtra: { climate: 'tropical', rainfall: 'moderate' },
    gujarat: { climate: 'arid', rainfall: 'low' },
    rajasthan: { climate: 'arid', rainfall: 'low' },
    goa: { climate: 'tropical', rainfall: 'high' },
    
    // East India
    westbengal: { climate: 'tropical', rainfall: 'high' },
    odisha: { climate: 'tropical', rainfall: 'high' },
    bihar: { climate: 'subtropical', rainfall: 'moderate' },
    jharkhand: { climate: 'tropical', rainfall: 'moderate' },
    
    // Central India
    madhyapradesh: { climate: 'subtropical', rainfall: 'moderate' },
    chhattisgarh: { climate: 'tropical', rainfall: 'high' },
    
    // Northeast India
    assam: { climate: 'tropical', rainfall: 'high' },
    meghalaya: { climate: 'tropical', rainfall: 'high' },
    manipur: { climate: 'tropical', rainfall: 'high' }
};

// Expanded crop database with more crops
const cropDatabase = {
    loamy: {
        kharif: [
            { name: 'Rice', suitability: 95, profit: 45000, regions: ['punjab', 'haryana', 'westbengal', 'andhra', 'telangana'] },
            { name: 'Cotton', suitability: 88, profit: 52000, regions: ['maharashtra', 'gujarat', 'telangana', 'punjab'] },
            { name: 'Soybean', suitability: 85, profit: 38000, regions: ['madhyapradesh', 'maharashtra', 'rajasthan'] },
            { name: 'Maize', suitability: 90, profit: 40000, regions: ['karnataka', 'rajasthan', 'bihar', 'madhyapradesh'] },
            { name: 'Pearl Millet (Bajra)', suitability: 82, profit: 35000, regions: ['rajasthan', 'gujarat', 'haryana'] },
            { name: 'Pigeon Pea (Arhar)', suitability: 84, profit: 42000, regions: ['maharashtra', 'karnataka', 'madhyapradesh'] },
            { name: 'Sugarcane', suitability: 90, profit: 65000, regions: ['uttarpradesh', 'karnataka', 'maharashtra', 'tamilnadu'] },
            { name: 'Groundnut', suitability: 85, profit: 42000, regions: ['gujarat', 'tamilnadu', 'andhra'] },
            { name: 'Papaya', suitability: 87, profit: 55000, regions: ['karnataka', 'maharashtra', 'tamilnadu'] },
            { name: 'Banana', suitability: 86, profit: 55000, regions: ['tamilnadu', 'kerala', 'karnataka'] },
            { name: 'Chilli', suitability: 83, profit: 48000, regions: ['andhra', 'telangana', 'karnataka'] }
        ],
        rabi: [
            { name: 'Wheat', suitability: 92, profit: 42000, regions: ['punjab', 'haryana', 'uttarakhand', 'madhyapradesh'] },
            { name: 'Gram (Chickpea)', suitability: 87, profit: 36000, regions: ['madhyapradesh', 'rajasthan', 'maharashtra'] },
            { name: 'Mustard', suitability: 84, profit: 34000, regions: ['rajasthan', 'haryana', 'punjab'] },
            { name: 'Barley', suitability: 85, profit: 32000, regions: ['rajasthan', 'punjab', 'haryana'] },
            { name: 'Lentil (Masoor)', suitability: 86, profit: 38000, regions: ['madhyapradesh', 'westbengal', 'bihar'] },
            { name: 'Peas', suitability: 83, profit: 33000, regions: ['punjab', 'haryana', 'uttarakhand'] },
            { name: 'Rapeseed', suitability: 82, profit: 35000, regions: ['westbengal', 'uttarpradesh', 'bihar'] },
            { name: 'Potato', suitability: 88, profit: 50000, regions: ['uttarpradesh', 'bihar', 'westbengal'] },
            { name: 'Carrot', suitability: 85, profit: 40000, regions: ['punjab', 'haryana', 'uttarpradesh'] },
            { name: 'Radish', suitability: 82, profit: 32000, regions: ['punjab', 'haryana', 'westbengal'] },
            { name: 'Beetroot', suitability: 84, profit: 38000, regions: ['punjab', 'haryana', 'maharashtra'] }
        ],
        zaid: [
            { name: 'Cucumber', suitability: 88, profit: 40000, regions: ['punjab', 'haryana', 'maharashtra'] },
            { name: 'Watermelon', suitability: 85, profit: 38000, regions: ['karnataka', 'tamilnadu', 'maharashtra'] },
            { name: 'Muskmelon', suitability: 82, profit: 35000, regions: ['punjab', 'haryana', 'rajasthan'] },
            { name: 'Bitter Gourd', suitability: 84, profit: 42000, regions: ['maharashtra', 'karnataka', 'kerala'] },
            { name: 'Bottle Gourd', suitability: 86, profit: 37000, regions: ['punjab', 'haryana', 'westbengal'] },
            { name: 'Okra (Bhindi)', suitability: 85, profit: 42000, regions: ['odisha', 'westbengal', 'uttarpradesh'] },
            { name: 'Pumpkin', suitability: 83, profit: 33000, regions: ['karnataka', 'maharashtra', 'tamilnadu'] },
            { name: 'Brinjal', suitability: 87, profit: 45000, regions: ['westbengal', 'odisha', 'karnataka'] },
            { name: 'Spinach', suitability: 81, profit: 30000, regions: ['punjab', 'haryana', 'uttarpradesh'] }
        ]
    },
    clay: {
        kharif: [
            { name: 'Rice', suitability: 93, profit: 44000, regions: ['westbengal', 'odisha', 'assam', 'andhra'] },
            { name: 'Sugarcane', suitability: 90, profit: 65000, regions: ['maharashtra', 'tamilnadu', 'karnataka', 'punjab'] },
            { name: 'Jowar (Sorghum)', suitability: 84, profit: 32000, regions: ['maharashtra', 'karnataka', 'rajasthan'] },
            { name: 'Turmeric', suitability: 88, profit: 55000, regions: ['andhra', 'telangana', 'maharashtra'] },
            { name: 'Ginger', suitability: 85, profit: 60000, regions: ['kerala', 'karnataka', 'meghalaya'] },
            { name: 'Banana', suitability: 87, profit: 55000, regions: ['tamilnadu', 'kerala', 'karnataka'] },
            { name: 'Tapioca', suitability: 85, profit: 35000, regions: ['kerala', 'tamilnadu', 'karnataka'] }
        ],
        rabi: [
            { name: 'Wheat', suitability: 91, profit: 41000, regions: ['punjab', 'haryana', 'madhyapradesh'] },
            { name: 'Lentil', suitability: 86, profit: 35000, regions: ['madhyapradesh', 'westbengal', 'bihar'] },
            { name: 'Peas', suitability: 83, profit: 33000, regions: ['punjab', 'uttarakhand'] },
            { name: 'Onion', suitability: 87, profit: 48000, regions: ['maharashtra', 'karnataka', 'gujarat'] },
            { name: 'Garlic', suitability: 84, profit: 52000, regions: ['madhyapradesh', 'rajasthan', 'gujarat'] },
            { name: 'Cabbage', suitability: 85, profit: 42000, regions: ['karnataka', 'maharashtra', 'punjab'] },
            { name: 'Cauliflower', suitability: 86, profit: 44000, regions: ['karnataka', 'maharashtra', 'punjab'] }
        ],
        zaid: [
            { name: 'Vegetables (Mixed)', suitability: 87, profit: 39000, regions: ['punjab', 'haryana', 'maharashtra'] },
            { name: 'Fodder Crops', suitability: 85, profit: 28000, regions: ['punjab', 'haryana', 'rajasthan'] },
            { name: 'Green Gram (Moong)', suitability: 82, profit: 30000, regions: ['rajasthan', 'maharashtra', 'karnataka'] },
            { name: 'Okra (Bhindi)', suitability: 86, profit: 42000, regions: ['maharashtra', 'karnataka', 'westbengal'] },
            { name: 'Tomato', suitability: 88, profit: 45000, regions: ['maharashtra', 'karnataka', 'andhra'] }
        ]
    },
    sandy: {
        kharif: [
            { name: 'Bajra (Pearl Millet)', suitability: 92, profit: 30000, regions: ['rajasthan', 'gujarat', 'haryana'] },
            { name: 'Groundnut', suitability: 89, profit: 42000, regions: ['gujarat', 'tamilnadu', 'karnataka', 'andhra'] },
            { name: 'Green Gram (Moong)', suitability: 85, profit: 32000, regions: ['rajasthan', 'maharashtra', 'karnataka'] },
            { name: 'Sesame', suitability: 84, profit: 38000, regions: ['rajasthan', 'gujarat', 'maharashtra'] },
            { name: 'Castor', suitability: 86, profit: 40000, regions: ['gujarat', 'rajasthan', 'andhra'] },
            { name: 'Pigeon Pea', suitability: 83, profit: 40000, regions: ['rajasthan', 'maharashtra', 'gujarat'] },
            { name: 'Cluster Bean', suitability: 82, profit: 35000, regions: ['rajasthan', 'gujarat', 'haryana'] },
            { name: 'Ragi', suitability: 81, profit: 32000, regions: ['karnataka', 'tamilnadu', 'maharashtra'] },
            { name: 'Millets', suitability: 80, profit: 28000, regions: ['rajasthan', 'karnataka', 'maharashtra'] }
        ],
        rabi: [
            { name: 'Barley', suitability: 90, profit: 28000, regions: ['rajasthan', 'punjab', 'haryana'] },
            { name: 'Gram (Chickpea)', suitability: 86, profit: 34000, regions: ['rajasthan', 'madhyapradesh', 'maharashtra'] },
            { name: 'Mustard', suitability: 83, profit: 30000, regions: ['rajasthan', 'haryana', 'punjab'] },
            { name: 'Cumin', suitability: 87, profit: 45000, regions: ['gujarat', 'rajasthan'] },
            { name: 'Coriander', suitability: 84, profit: 36000, regions: ['rajasthan', 'madhyapradesh', 'gujarat'] },
            { name: 'Fenugreek', suitability: 80, profit: 38000, regions: ['rajasthan', 'gujarat', 'madhyapradesh'] },
            { name: 'Sweet Potato', suitability: 85, profit: 40000, regions: ['maharashtra', 'odisha', 'kerala'] },
            { name: 'Oats', suitability: 82, profit: 30000, regions: ['punjab', 'haryana', 'rajasthan'] }
        ],
        zaid: [
            { name: 'Watermelon', suitability: 90, profit: 40000, regions: ['rajasthan', 'karnataka', 'tamilnadu'] },
            { name: 'Muskmelon', suitability: 87, profit: 37000, regions: ['rajasthan', 'punjab', 'haryana'] },
            { name: 'Cucumber', suitability: 84, profit: 35000, regions: ['punjab', 'haryana', 'maharashtra'] },
            { name: 'Pumpkin', suitability: 85, profit: 33000, regions: ['rajasthan', 'gujarat', 'maharashtra'] },
            { name: 'Snake Gourd', suitability: 82, profit: 32000, regions: ['tamilnadu', 'kerala', 'karnataka'] },
            { name: 'Brinjal', suitability: 83, profit: 42000, regions: ['karnataka', 'maharashtra', 'andhra'] }
        ]
    },
    silt: {
        kharif: [
            { name: 'Rice', suitability: 94, profit: 46000, regions: ['westbengal', 'assam', 'odisha', 'bihar'] },
            { name: 'Maize', suitability: 90, profit: 40000, regions: ['karnataka', 'bihar', 'madhyapradesh'] },
            { name: 'Soybean', suitability: 87, profit: 39000, regions: ['madhyapradesh', 'maharashtra', 'rajasthan'] },
            { name: 'Jute', suitability: 92, profit: 35000, regions: ['westbengal', 'assam', 'bihar'] },
            { name: 'Tea', suitability: 89, profit: 70000, regions: ['assam', 'westbengal', 'kerala'] },
            { name: 'Pulses', suitability: 85, profit: 38000, regions: ['uttarpradesh', 'bihar', 'westbengal'] },
            { name: 'Black Gram', suitability: 84, profit: 36000, regions: ['uttarpradesh', 'madhyapradesh', 'bihar'] }
        ],
        rabi: [
            { name: 'Wheat', suitability: 93, profit: 43000, regions: ['punjab', 'haryana', 'madhyapradesh', 'bihar'] },
            { name: 'Mustard', suitability: 88, profit: 36000, regions: ['rajasthan', 'haryana', 'westbengal'] },
            { name: 'Barley', suitability: 85, profit: 32000, regions: ['rajasthan', 'punjab', 'haryana'] },
            { name: 'Potato', suitability: 91, profit: 50000, regions: ['punjab', 'westbengal', 'bihar'] },
            { name: 'Tomato', suitability: 87, profit: 45000, regions: ['karnataka', 'maharashtra', 'andhra'] },
            { name: 'Onion', suitability: 86, profit: 48000, regions: ['maharashtra', 'karnataka', 'uttarpradesh'] },
            { name: 'Carrot', suitability: 83, profit: 40000, regions: ['punjab', 'haryana', 'uttarpradesh'] }
        ],
        zaid: [
            { name: 'Vegetables (Mixed)', suitability: 89, profit: 42000, regions: ['punjab', 'haryana', 'maharashtra'] },
            { name: 'Fodder Crops', suitability: 86, profit: 30000, regions: ['punjab', 'haryana', 'rajasthan'] },
            { name: 'Sunflower', suitability: 83, profit: 35000, regions: ['karnataka', 'maharashtra', 'andhra'] },
            { name: 'Ridge Gourd', suitability: 85, profit: 38000, regions: ['maharashtra', 'karnataka', 'tamilnadu'] },
            { name: 'Bottle Gourd', suitability: 84, profit: 37000, regions: ['karnataka', 'maharashtra', 'andhra'] }
        ]
    },
    peat: {
        kharif: [
            { name: 'Rice', suitability: 96, profit: 48000, regions: ['kerala', 'westbengal', 'assam'] },
            { name: 'Sugarcane', suitability: 92, profit: 68000, regions: ['maharashtra', 'tamilnadu', 'karnataka'] },
            { name: 'Vegetables (Premium)', suitability: 88, profit: 45000, regions: ['kerala', 'karnataka', 'himachal'] },
            { name: 'Cardamom', suitability: 90, profit: 80000, regions: ['kerala', 'karnataka'] },
            { name: 'Black Pepper', suitability: 89, profit: 75000, regions: ['kerala', 'karnataka'] },
            { name: 'Coconut', suitability: 92, profit: 70000, regions: ['kerala', 'tamilnadu', 'karnataka'] },
            { name: 'Areca Nut', suitability: 88, profit: 65000, regions: ['kerala', 'karnataka', 'goa'] },
            { name: 'Ginger', suitability: 87, profit: 60000, regions: ['kerala', 'karnataka', 'meghalaya'] },
            { name: 'Turmeric', suitability: 86, profit: 55000, regions: ['andhra', 'telangana', 'kerala'] }
        ],
        rabi: [
            { name: 'Vegetables (Premium)', suitability: 93, profit: 47000, regions: ['himachal', 'uttarakhand', 'kerala'] },
            { name: 'Potato', suitability: 90, profit: 50000, regions: ['punjab', 'westbengal', 'uttarakhand'] },
            { name: 'Cabbage', suitability: 87, profit: 42000, regions: ['maharashtra', 'karnataka', 'himachal'] },
            { name: 'Cauliflower', suitability: 88, profit: 44000, regions: ['punjab', 'haryana', 'westbengal'] },
            { name: 'Strawberry', suitability: 91, profit: 85000, regions: ['himachal', 'uttarakhand', 'maharashtra'] },
            { name: 'Flowers (Commercial)', suitability: 86, profit: 55000, regions: ['kerala', 'tamilnadu', 'karnataka'] },
            { name: 'Mango', suitability: 84, profit: 70000, regions: ['maharashtra', 'uttarpradesh', 'karnataka'] },
            { name: 'Guava', suitability: 83, profit: 50000, regions: ['uttarpradesh', 'bihar', 'maharashtra'] }
        ],
        zaid: [
            { name: 'Vegetables (Premium)', suitability: 91, profit: 46000, regions: ['himachal', 'kerala', 'karnataka'] },
            { name: 'Fodder Crops', suitability: 88, profit: 32000, regions: ['punjab', 'haryana'] },
            { name: 'Flowers (Commercial)', suitability: 85, profit: 55000, regions: ['karnataka', 'maharashtra', 'westbengal'] },
            { name: 'Exotic Vegetables', suitability: 89, profit: 60000, regions: ['himachal', 'uttarakhand', 'kerala'] },
            { name: 'Mushrooms', suitability: 87, profit: 65000, regions: ['himachal', 'kerala', 'maharashtra'] },
            { name: 'Grapes', suitability: 86, profit: 75000, regions: ['maharashtra', 'karnataka', 'andhra'] },
            { name: 'Pomegranate', suitability: 85, profit: 70000, regions: ['maharashtra', 'karnataka', 'andhra'] }
        ]
    }
};

getSuggestionsBtn.addEventListener('click', () => {
    const soilType = document.getElementById('soilType').value;
    const region = document.getElementById('region').value.toLowerCase().trim();
    const landSize = document.getElementById('landSize').value;
    const season = document.getElementById('season').value;
    
    // Get nutrient levels
    const nitrogenLevel = parseInt(document.getElementById('nitrogenLevel').value);
    const phosphorusLevel = parseInt(document.getElementById('phosphorusLevel').value);
    const potassiumLevel = parseInt(document.getElementById('potassiumLevel').value);
    const phLevel = parseFloat(document.getElementById('phLevel').value) / 10;
    
    if (!region || !landSize) {
        alert('Please fill in all fields');
        return;
    }
    
    let crops = cropDatabase[soilType][season];
    
    // Filter crops by region if region matches Indian states
    const normalizedRegion = region.replace(/\s+/g, '').toLowerCase();
    const matchedRegionKey = Object.keys(regionCropData).find(key => 
        normalizedRegion.includes(key) || key.includes(normalizedRegion)
    );
    
    if (matchedRegionKey) {
        // Filter crops that are suitable for this region
        const regionSuitableCrops = crops.filter(crop => 
            crop.regions.some(r => r === matchedRegionKey || normalizedRegion.includes(r))
        );
        
        // If we found region-specific crops, use them; otherwise use all crops
        if (regionSuitableCrops.length > 0) {
            crops = regionSuitableCrops;
            // Boost suitability for region-matched crops
            crops = crops.map(crop => ({
                ...crop,
                suitability: Math.min(crop.suitability + 5, 100),
                regionMatch: true
            }));
        }
    }
    
    // Adjust suitability based on nutrient levels
    crops = crops.map(crop => {
        const nutrients = cropNutrientData[crop.name] || { 
            nitrogen: 'Medium', 
            phosphorus: 'Medium', 
            potassium: 'Medium', 
            ph: '6.0-7.0' 
        };
        
        // Calculate nutrient match score (0-100)
        let nutrientScore = calculateNutrientMatch(
            nutrients.nitrogen, nutrients.phosphorus, nutrients.potassium, nutrients.ph,
            nitrogenLevel, phosphorusLevel, potassiumLevel, phLevel
        );
        
        // Adjust suitability based on nutrient match
        const adjustedSuitability = Math.round((crop.suitability * 0.7) + (nutrientScore * 0.3));
        
        return {
            ...crop,
            originalSuitability: crop.suitability,
            nutrientScore: nutrientScore,
            suitability: adjustedSuitability
        };
    });
    
    // Sort by adjusted suitability and show all crops
    crops = crops.sort((a, b) => b.suitability - a.suitability);
    
    cropList.innerHTML = crops.map((crop, index) => {
        const nutrients = cropNutrientData[crop.name] || { 
            nitrogen: 'Medium', 
            phosphorus: 'Medium', 
            potassium: 'Medium', 
            ph: '6.0-7.0' 
        };
        
        return `
        <div class="crop-item glass-card" style="margin-bottom: 1rem; padding: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                <div style="flex: 1; min-width: 200px;">
                    <h4 style="color: var(--primary-green); font-size: 1.3rem; margin-bottom: 0.5rem;">
                        ${index + 1}. ${crop.name}
                        ${crop.regionMatch ? '<span style="font-size: 0.8rem; color: var(--primary-blue); margin-left: 0.5rem;">📍 Best for your region</span>' : ''}
                    </h4>
                    <p style="color: var(--text-gray);">Suitability: ${crop.suitability}%</p>
                    ${crop.regions ? `<p style="color: var(--text-gray); font-size: 0.85rem; margin-top: 0.3rem;">Suitable regions: ${crop.regions.join(', ').substring(0, 50)}...</p>` : ''}
                </div>
                <div style="text-align: right;">
                    <p style="font-size: 1.5rem; font-weight: 700; color: var(--primary-blue);">
                        ₹${crop.profit.toLocaleString()}/acre
                    </p>
                    <small style="color: var(--text-gray);">Expected profit</small>
                </div>
            </div>
            
            <!-- Nutrient Information -->
            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--glass-border);">
                <h5 style="color: var(--primary-green); margin-bottom: 0.5rem;">Nutrient Requirements:</h5>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.5rem; font-size: 0.9rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="color: #4ade80;">N</span>
                        <span>Nitrogen: ${nutrients.nitrogen}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="color: #f87171;">P</span>
                        <span>Phosphorus: ${nutrients.phosphorus}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="color: #60a5fa;">K</span>
                        <span>Potassium: ${nutrients.potassium}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="color: #fbbf24;">pH</span>
                        <span>Soil pH: ${nutrients.ph}</span>
                    </div>
                </div>
            </div>
        </div>
    `}).join('');
    
    cropResults.classList.remove('hidden');
    createProfitChart(crops);
});

function createProfitChart(crops) {
    const canvas = document.getElementById('profitChart');
    const ctx = canvas.getContext('2d');
    
    if (window.profitChart) {
        window.profitChart.destroy();
    }
    
    window.profitChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: crops.map(c => c.name),
            datasets: [{
                label: 'Expected Profit (₹/acre)',
                data: crops.map(c => c.profit),
                backgroundColor: crops.map((_, index) => {
                    const colors = [
                        'rgba(74, 222, 128, 0.8)',
                        'rgba(96, 165, 250, 0.8)',
                        'rgba(251, 191, 36, 0.8)',
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(167, 139, 250, 0.8)',
                        'rgba(14, 165, 233, 0.8)',
                        'rgba(244, 114, 182, 0.8)',
                        'rgba(251, 146, 60, 0.8)',
                        'rgba(132, 204, 22, 0.8)',
                        'rgba(161, 161, 170, 0.8)'
                    ];
                    return colors[index % colors.length];
                }),
                borderColor: crops.map((_, index) => {
                    const colors = [
                        'rgba(74, 222, 128, 1)',
                        'rgba(96, 165, 250, 1)',
                        'rgba(251, 191, 36, 1)',
                        'rgba(239, 68, 68, 1)',
                        'rgba(167, 139, 250, 1)',
                        'rgba(14, 165, 233, 1)',
                        'rgba(244, 114, 182, 1)',
                        'rgba(251, 146, 60, 1)',
                        'rgba(132, 204, 22, 1)',
                        'rgba(161, 161, 170, 1)'
                    ];
                    return colors[index % colors.length];
                }),
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: '#ffffff', font: { size: 14 } }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#ffffff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    ticks: { color: '#ffffff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });
}

// Particles
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 'px';
        particle.style.height = particle.style.width;
        particle.style.borderRadius = '50%';
        particle.style.background = 'rgba(74, 222, 128, 0.3)';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${Math.random() * 10 + 5}s ease-in-out infinite`;
        container.appendChild(particle);
    }
}

createParticles();
