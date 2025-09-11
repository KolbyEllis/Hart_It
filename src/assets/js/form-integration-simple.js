/**
 * Simple Integration for Test Site
 * 
 * This script integrates the test site form with your Keap clone
 * by opening the Keap clone with contact data in URL parameters.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Find your contact form
    const contactForm = document.querySelector('#cs-form-486');
    if (!contactForm) {
        console.error('Contact form not found');
        return;
    }

    console.log('Form integration script loaded successfully');

    contactForm.addEventListener('submit', async function(e) {
        console.log('Form submission detected');
        
        // Don't prevent default - let Netlify handle the form submission
        
        const formData = new FormData(contactForm);
        const contactData = {
            firstName: formData.get('first_name') || '',
            lastName: formData.get('last_name') || '',
            email: formData.get('email') || '',
            phone: formData.get('phone') || '',
            location: formData.get('location') || '',
            message: formData.get('Message') || '',
            source: 'test-site',
            tags: [
                'Test Contact',
                'Web Development Inquiry',
                'Kolby Ellis Site',
                new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) + ' Lead'
            ]
        };

        console.log('Contact data extracted:', contactData);

        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        try {
            // Create contact in Keap clone by opening it in a new window
            await createContactInKeapClone(contactData);
            showSuccessMessage('Thank you! Your information has been submitted successfully.');
        } catch (error) {
            console.error('Error:', error);
            showErrorMessage('There was an error submitting your information.');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
});

/**
 * Create contact in Keap clone by opening it in a new window
 */
async function createContactInKeapClone(contactData) {
    console.log('Creating contact in Keap clone:', contactData);
    
    // Create the contact object
    const newContact = {
        id: Date.now().toString(),
        firstName: contactData.firstName,
        lastName: contactData.lastName,
        email: contactData.email,
        phoneType: 'Mobile',
        phone: contactData.phone,
        tags: contactData.tags,
        source: contactData.source,
        createdAt: new Date().toISOString()
    };

    console.log('New contact object:', newContact);

    // Encode the contact data as URL parameters
    const params = new URLSearchParams({
        action: 'addContact',
        contactData: JSON.stringify(newContact)
    });

    // Open Keap clone in new window with the contact data
    const keapUrl = `https://jovial-melomakarona-ad9e4e.netlify.app/contacts?${params.toString()}`;
    
    console.log('Opening Keap clone URL:', keapUrl);
    
    // Open in new tab
    window.open(keapUrl, '_blank');
    
    console.log('Keap clone opened successfully');
}

/**
 * Show success message
 */
function showSuccessMessage(message) {
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
    
    const form = document.querySelector('#cs-form-486');
    form.parentNode.insertBefore(successDiv, form.nextSibling);
    
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

/**
 * Show error message
 */
function showErrorMessage(message) {
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
    
    const form = document.querySelector('#cs-form-486');
    form.parentNode.insertBefore(errorDiv, form.nextSibling);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 8000);
}

/**
 * Remove existing messages
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
