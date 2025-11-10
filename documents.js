// Document Upload
const uploadArea = document.getElementById('uploadArea');
const documentFile = document.getElementById('documentFile');
const filesList = document.getElementById('filesList');

// Load saved documents
let uploadedDocuments = JSON.parse(localStorage.getItem('uploadedDocuments') || '[]');
displayDocuments();

uploadArea.addEventListener('click', () => documentFile.click());

// Drag and drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--primary-green)';
    uploadArea.style.background = 'rgba(74, 222, 128, 0.1)';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = 'var(--glass-border)';
    uploadArea.style.background = 'var(--glass-bg)';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--glass-border)';
    uploadArea.style.background = 'var(--glass-bg)';
    
    const files = e.dataTransfer.files;
    handleFiles(files);
});

documentFile.addEventListener('change', (e) => {
    const files = e.target.files;
    handleFiles(files);
});

function handleFiles(files) {
    Array.from(files).forEach(file => {
        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert(`${file.name} is too large. Max size is 10MB.`);
            return;
        }
        
        // Check file type
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            alert(`${file.name} is not a supported file type.`);
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const document = {
                id: Date.now() + Math.random(),
                name: file.name,
                size: file.size,
                type: file.type,
                data: e.target.result,
                uploadedAt: new Date().toISOString()
            };
            
            uploadedDocuments.push(document);
            localStorage.setItem('uploadedDocuments', JSON.stringify(uploadedDocuments));
            displayDocuments();
            alert(`${file.name} uploaded successfully!`);
        };
        reader.readAsDataURL(file);
    });
}

function displayDocuments() {
    if (uploadedDocuments.length === 0) {
        filesList.innerHTML = '<p style="color: var(--text-gray); text-align: center; padding: 2rem;">No documents uploaded yet</p>';
        return;
    }
    
    filesList.innerHTML = uploadedDocuments.map(doc => {
        const icon = getFileIcon(doc.type);
        const size = (doc.size / 1024).toFixed(2);
        const date = new Date(doc.uploadedAt).toLocaleDateString();
        
        return `
            <div class="file-item glass-card" style="margin-bottom: 1rem; padding: 1rem; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <i class="${icon}" style="font-size: 2rem; color: var(--primary-green);"></i>
                    <div>
                        <strong style="color: var(--text-white);">${doc.name}</strong>
                        <p style="font-size: 0.85rem; color: var(--text-gray);">${size} KB • ${date}</p>
                    </div>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="icon-btn" onclick="downloadDocument('${doc.id}')" title="Download">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="icon-btn delete" onclick="deleteDocument('${doc.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function getFileIcon(type) {
    if (type === 'application/pdf') return 'fas fa-file-pdf';
    if (type.includes('word')) return 'fas fa-file-word';
    if (type.includes('image')) return 'fas fa-file-image';
    return 'fas fa-file';
}

window.downloadDocument = function(id) {
    const doc = uploadedDocuments.find(d => d.id == id);
    if (!doc) return;
    
    const link = document.createElement('a');
    link.href = doc.data;
    link.download = doc.name;
    link.click();
};

window.deleteDocument = function(id) {
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    uploadedDocuments = uploadedDocuments.filter(d => d.id != id);
    localStorage.setItem('uploadedDocuments', JSON.stringify(uploadedDocuments));
    displayDocuments();
};

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
