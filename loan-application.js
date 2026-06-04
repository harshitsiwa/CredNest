// Notification Toast Helper
function showNotification(title, message, type = 'info') {
    let container = document.querySelector('.notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `notification-toast ${type}`;

    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';
    if (type === 'error') icon = 'fa-exclamation-circle';

    toast.innerHTML = `
        <i class="fas ${icon} text-lg"></i>
        <div>
            <strong class="block font-semibold">${title}</strong>
            <span class="text-sm text-gray-500">${message}</span>
        </div>
    `;

    container.appendChild(toast);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Logout Handler
function logout() {
    showNotification('Logged Out', 'Redirecting to landing page...', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// File Upload Handler
function handleFileUpload(input, statusId) {
    const statusDiv = document.getElementById(statusId);
    const file = input.files[0];

    if (!file) {
        statusDiv.className = 'upload-status';
        statusDiv.style.display = 'none';
        return;
    }

    // Check file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
        statusDiv.className = 'upload-status error';
        statusDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i>File too large! Maximum size: 5MB';
        input.value = ''; // Clear the input
        return;
    }

    // Check file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
        statusDiv.className = 'upload-status error';
        statusDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i>Invalid file type! Use PDF, JPG, or PNG';
        input.value = ''; // Clear the input
        return;
    }

    // Success
    const fileSize = (file.size / 1024).toFixed(2); // Convert to KB
    statusDiv.className = 'upload-status success';
    statusDiv.innerHTML = `<i class="fas fa-check-circle"></i>Uploaded: ${file.name} (${fileSize} KB)`;
}

let currentStep = 1;
let mediaStream = null;
let mediaRecorder = null;
let recordedChunks = [];
let recordedVideoBlob = null;

// Step Navigation
function nextStep() {
    const step = document.getElementById(`step${currentStep}`);
    const inputs = step.querySelectorAll('input[required], select[required], textarea[required]');

    let valid = true;
    inputs.forEach(input => {
        if (!input.value) {
            input.classList.add('border-red-500');
            valid = false;
        } else {
            input.classList.remove('border-red-500');
        }
    });

    if (!valid) {
        showNotification('Required Fields', 'Please fill all required fields', 'warning');
        return;
    }

    document.getElementById(`step${currentStep}`).classList.add('hidden');
    currentStep++;
    document.getElementById(`step${currentStep}`).classList.remove('hidden');
    updateProgress();
}

function prevStep() {
    document.getElementById(`step${currentStep}`).classList.add('hidden');
    currentStep--;
    document.getElementById(`step${currentStep}`).classList.remove('hidden');
    updateProgress();
}

function updateProgress() {
    const progress = (currentStep / 3) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('progress').textContent = Math.round(progress);
    document.getElementById('currentStep').textContent = currentStep;
}

// Camera KYC
document.getElementById('startKycBtn')?.addEventListener('click', async () => {
    const btn = document.getElementById('startKycBtn');
    const status = document.getElementById('kycStatus');
    const container = document.getElementById('kycVideoContainer');

    try {
        btn.disabled = true;
        btn.classList.add('opacity-50');
        status.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Requesting camera access...';
        status.className = 'text-sm text-center mt-4 text-blue-600 font-semibold';

        mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: 1280, height: 720 },
            audio: true
        });

        container.innerHTML = `
            <div class="relative">
                <video id="kycLiveVideo" autoplay playsinline muted class="w-full rounded-xl"></video>
                <div class="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center">
                    <span class="w-3 h-3 bg-white rounded-full mr-2 animate-pulse"></span>LIVE
                </div>
            </div>
        `;

        document.getElementById('kycLiveVideo').srcObject = mediaStream;
        status.innerHTML = 'Camera ready. Starting in 3 seconds...';

        await new Promise(resolve => setTimeout(resolve, 3000));
        startRecording(mediaStream);

    } catch (error) {
        status.innerHTML = '<i class="fas fa-exclamation-triangle mr-2"></i>Camera access denied. Please allow permissions.';
        status.className = 'text-sm text-center mt-4 text-red-600 font-semibold';
        btn.disabled = false;
        btn.classList.remove('opacity-50');
    }
});

function startRecording(stream) {
    const status = document.getElementById('kycStatus');
    recordedChunks = [];

    const options = { mimeType: 'video/webm;codecs=vp9' };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'video/webm';
    }

    mediaRecorder = new MediaRecorder(stream, options);

    mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
        recordedVideoBlob = new Blob(recordedChunks, { type: 'video/webm' });
        showRecordingComplete();
        mediaStream.getTracks().forEach(track => track.stop());
    };

    mediaRecorder.start();

    let countdown = 10;
    const interval = setInterval(() => {
        countdown--;
        status.innerHTML = `<i class="fas fa-circle text-red-600 animate-pulse mr-2"></i>Recording... ${countdown}s`;
        if (countdown <= 0) clearInterval(interval);
    }, 1000);

    setTimeout(() => {
        if (mediaRecorder?.state === 'recording') {
            mediaRecorder.stop();
        }
    }, 10000);
}

function showRecordingComplete() {
    const container = document.getElementById('kycVideoContainer');
    const status = document.getElementById('kycStatus');
    const btn = document.getElementById('startKycBtn');

    const videoUrl = URL.createObjectURL(recordedVideoBlob);

    container.innerHTML = `
        <div class="relative">
            <video controls class="w-full rounded-xl"><source src="${videoUrl}" type="video/webm"></video>
            <div class="absolute top-4 left-4 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                <i class="fas fa-check-circle mr-2"></i>VERIFIED
            </div>
        </div>
    `;

    status.innerHTML = `<i class="fas fa-check-circle mr-2"></i>KYC Verified! Size: ${(recordedVideoBlob.size / 1024 / 1024).toFixed(2)} MB`;
    status.className = 'text-sm text-center mt-4 text-green-600 font-semibold';

    btn.innerHTML = '<i class="fas fa-check mr-2"></i>Verification Complete';
    btn.classList.remove('bg-gradient-to-r', 'from-green-500', 'to-emerald-600');
    btn.classList.add('bg-gray-500');
}

// Form Submission
// Form Submission (UPDATE THIS SECTION)
document.getElementById('loanForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!recordedVideoBlob) {
        showNotification('KYC Required', 'Please complete video KYC verification', 'warning');
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...';

    // Create FormData with all form fields and files
    const formData = new FormData(e.target);
    formData.append('kyc_video', recordedVideoBlob, `kyc_${Date.now()}.webm`);

    // Log uploaded documents (for demo purposes)
    const documents = {
        aadhaar: formData.get('aadhaarDoc')?.name,
        pan: formData.get('panDoc')?.name,
        marksheet10: formData.get('marksheet10')?.name,
        marksheet12: formData.get('marksheet12')?.name,
        admission: formData.get('admissionLetter')?.name,
        bank: formData.get('bankStatement')?.name,
        income: formData.get('incomeProof')?.name,
        photo: formData.get('photo')?.name
    };

    console.log('Uploaded Documents:', documents);
    console.log('KYC Video Size:', (recordedVideoBlob.size / 1024 / 1024).toFixed(2), 'MB');

    // Simulate processing time
    setTimeout(() => {
        showNotification('Success!', 'Application with documents submitted successfully! AI is verifying your documents now.', 'success');
        setTimeout(() => window.location.href = 'student-dashboard.html', 2000);
    }, 2000);
});