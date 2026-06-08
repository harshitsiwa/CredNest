// Student AI Chatbot Logic
document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatHistory = document.getElementById('chatHistory');

    // FAQ response mappings
    const answers = {
        verification: "Our AI-powered extraction models scan and verify your identity cards (Aadhaar & PAN) within seconds! The overall review, credit scoring, and location assessments typically complete in **12 to 24 hours**. You can track active logs in your [Dashboard](student-dashboard.html).",
        income: "To authenticate income claims, please upload your parent/guardian's **last 6 months bank statement** (PDF) and their **salary certificate/ITR**. Our anti-tamper models scan these to ensure consistency and speed up review.",
        secure: "Security is our highest priority. All files in your document locker are protected with **AES-256 bank-level encryption**. The video KYC feed is tokenized, processed for liveness validation, and never shared with third parties.",
        interest: "StudyVault offers a fixed interest rate of **8.5% p.a.** for portal applicants. You can simulate monthly EMI breakdowns, total interest payable, and customize repayment tenures directly in the [Interactive Dashboard](student-dashboard.html).",
        support: "You can reach out to our dedicated student help desk at `support@studyvault.com` or request a live coordinator callback through the portal options menu.",
        default: "That is an excellent question! For details regarding your active application (**ID: EDU-2026-8947**), please visit the [Interactive Dashboard](student-dashboard.html). Alternatively, I can help clarify document rules, interest rates, or video KYC steps."
    };

    function appendMessage(text, isStudent = false) {
        const bubble = document.createElement('div');
        
        if (isStudent) {
            bubble.className = "flex items-start space-x-3.5 max-w-[85%] justify-end ml-auto";
            bubble.innerHTML = `
                <div class="bg-purple-600 text-white p-4 rounded-2xl rounded-tr-none shadow-sm text-sm leading-relaxed">
                    ${text}
                </div>
                <div class="w-9 h-9 bg-purple-600 text-white rounded-xl flex-shrink-0 flex items-center justify-center text-sm font-semibold">
                    AS
                </div>
            `;
        } else {
            bubble.className = "flex items-start space-x-3.5 max-w-[85%]";
            bubble.innerHTML = `
                <div class="w-9 h-9 bg-purple-100 text-purple-600 rounded-xl flex-shrink-0 flex items-center justify-center text-sm font-bold">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm text-sm text-gray-700 leading-relaxed">
                    ${text}
                </div>
            `;
        }

        chatHistory.appendChild(bubble);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'typingIndicator';
        indicator.className = "flex items-start space-x-3.5 max-w-[85%] animate-pulse";
        indicator.innerHTML = `
            <div class="w-9 h-9 bg-purple-100 text-purple-600 rounded-xl flex-shrink-0 flex items-center justify-center text-sm font-bold">
                <i class="fas fa-robot animate-bounce"></i>
            </div>
            <div class="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm text-sm text-gray-400 italic flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"></span>
                <span class="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
                <span class="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></span>
            </div>
        `;
        chatHistory.appendChild(indicator);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.remove();
    }

    function handleUserInput(message) {
        if (!message.trim()) return;

        appendMessage(message, true);
        showTypingIndicator();

        // Check for keyword matches to deliver accurate responses
        let reply = answers.default;
        const msgLower = message.toLowerCase();
        
        if (msgLower.includes('verify') || msgLower.includes('verification') || msgLower.includes('long') || msgLower.includes('time')) {
            reply = answers.verification;
        } else if (msgLower.includes('income') || msgLower.includes('document') || msgLower.includes('proof') || msgLower.includes('salary')) {
            reply = answers.income;
        } else if (msgLower.includes('secure') || msgLower.includes('safety') || msgLower.includes('privacy') || msgLower.includes('safe') || msgLower.includes('kyc')) {
            reply = answers.secure;
        } else if (msgLower.includes('interest') || msgLower.includes('rate') || msgLower.includes('percent') || msgLower.includes('emi')) {
            reply = answers.interest;
        } else if (msgLower.includes('support') || msgLower.includes('contact') || msgLower.includes('help') || msgLower.includes('call')) {
            reply = answers.support;
        }

        setTimeout(() => {
            removeTypingIndicator();
            appendMessage(reply, false);
        }, 1200);
    }

    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const message = chatInput.value;
            chatInput.value = '';
            handleUserInput(message);
        });
    }

    // Expose chip click function globally
    window.askQuestionChip = function(question) {
        handleUserInput(question);
    };

    // Expose reset chat function globally
    window.resetChat = function() {
        chatHistory.innerHTML = `
            <div class="flex items-start space-x-3.5 max-w-[85%]">
                <div class="w-9 h-9 bg-purple-100 text-purple-600 rounded-xl flex-shrink-0 flex items-center justify-center text-sm font-bold">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm text-sm text-gray-700 leading-relaxed">
                    Chat history reset. How else can I assist you with your loan application today?
                </div>
            </div>
        `;
        if (typeof showNotification === 'function') {
            showNotification('Chat Reset', 'Conversation history has been cleared.', 'info');
        }
    };
});
