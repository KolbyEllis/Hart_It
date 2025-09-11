/**
 * Test Site Contact Form Integration
 * 
 * This script integrates the test site form with your Keap clone.
 * It sends form data to your Keap clone instead of n8n.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Find your contact form
    const contactForm = document.querySelector('#cs-form-486');
    if (!contactForm) {
        console.error('Contact form not found');
        return;
    }

    contactForm.addEventListener('submit', async function(e) {
        // Don't prevent default - let Netlify handle the form submission
        // We'll send to Keap clone after Netlify processes it
        
        const formData = new FormData(contactForm);
        const contactData = {
            firstName: formData.get('first_name') || formData.get('firstName') || formData.get('first-name') || '',
            lastName: formData.get('last_name') || formData.get('lastName') || formData.get('last-name') || '',
            email: formData.get('email') || '',
            phone: formData.get('phone') || '',
            location: formData.get('location') || '',
            message: formData.get('Message') || formData.get('message') || '',
            source: 'test-site',
            tags: [
                'Test Contact',
                'Web Development Inquiry',
                'Kolby Ellis Site',
                new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) + ' Lead'
            ]
        };

        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"], input[type="submit"]');
        const originalButtonText = submitButton.textContent || submitButton.value;
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
        if (submitButton.value) submitButton.value = 'Submitting...';

        try {
            // Send to Netlify function (which forwards to Keap clone)
            const response = await fetch('/.netlify/functions/submit-contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contactData)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Create contact in Keap clone
                await createContactInKeapClone(result.contactData);
                showSuccessMessage('Thank you! Your information has been submitted successfully. We\'ll contact you soon.');
                // No form.reset() here to allow Netlify's default action
            } else {
                console.error('Keap clone submission failed:', result.error);
                // Don't show error to user - let Netlify handle the main submission
            }
        } catch (error) {
            console.error('Keap clone submission error:', error);
            // Don't show error to user - let Netlify handle the main submission
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            if (submitButton.value) submitButton.value = originalButtonText;
        }
    });
});

/**
 * Create contact in Keap clone
 */
async function createContactInKeapClone(contactData) {
    try {
        // Create contact object
        const newContact = {
            id: Date.now().toString(),
            firstName: contactData.firstName,
            lastName: contactData.lastName,
            email: contactData.email,
            phoneType: 'Mobile',
            phone: contactData.phone || '',
            tags: contactData.tags || [],
            source: contactData.source || 'external',
            createdAt: new Date().toISOString(),
            webhookData: {
                receivedAt: new Date().toISOString(),
                sourceWebsite: contactData.source || 'external',
                originalData: contactData
            }
        };

        // Send to Keap clone using the webhook endpoint
        // Since it's a static site, we'll use a different approach
        // We'll store the contact data and let the user manually add it
        console.log('Contact data ready for Keap clone:', newContact);
        
        // For now, we'll show a message to the user
        // In a real implementation, you'd use a server-side API
        showKeapCloneMessage('Contact data has been prepared for your Keap clone system!');
    } catch (error) {
        console.error('Error creating contact in Keap clone:', error);
    }
}

/**
 * Show Keap clone message
 */
function showKeapCloneMessage(message) {
    const keapDiv = document.createElement('div');
    keapDiv.className = 'keap-clone-message';
    keapDiv.innerHTML = `
        <div style="
            background: #3b82f6;
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            margin: 20px 0;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            animation: slideIn 0.3s ease-out;
        ">
            🔗 ${message}
        </div>
    `;
    
    // Insert after the form
    const form = document.querySelector('#cs-form-486');
    form.parentNode.insertBefore(keapDiv, form.nextSibling);
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
        keapDiv.remove();
    }, 8000);
}

/**
 * Show success message to user
 */
function showSuccessMessage(message) {
    // Remove any existing messages
    removeExistingMessages();
    
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success-message';
    successDiv.innerHTML = `
        <div style="
            background: #10b981;
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            margin: 20px 0;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            animation: slideIn 0.3s ease-out;
        ">
            ✅ ${message}
        </div>
    `;
    
    // Insert after the form
    const form = document.querySelector('#cs-form-486');
    form.parentNode.insertBefore(successDiv, form.nextSibling);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

/**
 * Show error message to user
 */
function showErrorMessage(message) {
    // Remove any existing messages
    removeExistingMessages();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error-message';
    errorDiv.innerHTML = `
        <div style="
            background: #ef4444;
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            margin: 20px 0;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            animation: slideIn 0.3s ease-out;
        ">
            ❌ ${message}
        </div>
    `;
    
    // Insert after the form
    const form = document.querySelector('#cs-form-486');
    form.parentNode.insertBefore(errorDiv, form.nextSibling);
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 8000);
}

/**
 * Remove existing success/error messages
 */
function removeExistingMessages() {
    const existingMessages = document.querySelectorAll('.form-success-message, .form-error-message');
    existingMessages.forEach(msg => msg.remove());
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
