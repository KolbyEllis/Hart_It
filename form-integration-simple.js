/**
 * Test Site Form Integration with Supabase Database
 * 
 * This script submits form data directly to Supabase database
 */

// Supabase configuration
const SUPABASE_URL = 'https://tukqivldrbcxijqjgqkw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1a3FpdmxkcmJjeGlqcWpncWt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2Mjg4ODcsImV4cCI6MjA3MzIwNDg4N30.0zp-fED7GB7QgajlzmHk3M7iYTPaXob-rH1bY63_Eq4';

// Initialize Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', function() {
    console.log('Supabase form integration script loaded successfully');
    
    // Find your contact form
    const contactForm = document.querySelector('#cs-form-486');
    if (!contactForm) {
        console.error('Contact form not found with ID #cs-form-486');
        console.log('Available forms:', document.querySelectorAll('form'));
        return;
    }

    console.log('Contact form found:', contactForm);

    contactForm.addEventListener('submit', async function(e) {
        console.log('Form submission detected');
        
        // Don't prevent default - let Netlify handle the form submission
        
        const formData = new FormData(contactForm);
        const contactData = {
            first_name: formData.get('first_name') || '',
            last_name: formData.get('last_name') || '',
            email: formData.get('email') || '',
            phone: formData.get('phone') || '',
            location: formData.get('location') || '',
            message: formData.get('Message') || '',
            phone_type: 'Mobile',
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
            // Submit to Supabase database
            await submitContactToDatabase(contactData);
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
 * Submit contact data to Supabase database
 */
async function submitContactToDatabase(contactData) {
    console.log('Submitting contact to database:', contactData);
    
    try {
        const { data, error } = await supabaseClient
            .from('contacts')
            .insert([contactData])
            .select();

        if (error) {
            console.error('Database error:', error);
            throw error;
        }

        console.log('Contact submitted successfully:', data);
        
        // Open Keap clone to show the new contact
        setTimeout(() => {
            window.open('https://jovial-melomakarona-ad9e4e.netlify.app/contacts', '_blank');
        }, 1000);
        
    } catch (error) {
        console.error('Failed to submit contact:', error);
        throw error;
    }
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
