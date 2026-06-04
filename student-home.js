// Student Home Dashboard Logic
document.addEventListener('DOMContentLoaded', () => {
    // Show welcome alert about verification status
    setTimeout(() => {
        if (typeof showNotification === 'function') {
            showNotification(
                'AI Security Verification', 
                'Identity check passed. Assessing loan application risk criteria...', 
                'info'
            );
        }
    }, 1500);

    // Add visual interactive animation for steps
    const activeIcon = document.querySelector('.fa-circle-notch');
    if (activeIcon) {
        let angle = 0;
        setInterval(() => {
            angle = (angle + 10) % 360;
            activeIcon.style.transform = `rotate(${angle}deg)`;
        }, 100);
    }
});
