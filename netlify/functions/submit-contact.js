/**
 * Netlify Function: Submit Contact to Keap Clone
 * 
 * This function receives form submissions from your test site
 * and forwards them to your Keap clone for contact creation.
 */

const handler = async (event, context) => {
    // Handle CORS preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
            },
        };
    }

    // Only accept POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    try {
        // Parse the incoming form data
        const formData = JSON.parse(event.body);
        
        // Map form fields to contact data
        const contactData = {
            firstName: formData.firstName || formData['first-name'] || formData.name || '',
            lastName: formData.lastName || formData['last-name'] || '',
            email: formData.email || formData['email-address'] || '',
            phone: formData.phone || formData['phone-number'] || '',
            location: formData.location || formData['approximate-location'] || '',
            message: formData.message || formData.Message || formData['property-details'] || formData['tell-us-about-your-property'] || '',
            source: formData.source || 'external',
            tags: formData.tags || [
                'Test Contact',
                'Web Development Inquiry',
                'Kolby Ellis Site',
                new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) + ' Lead'
            ]
        };

        // Validate required fields
        if (!contactData.firstName || !contactData.email) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    error: 'Missing required fields: firstName, email' 
                }),
            };
        }

        // Forward to your Keap clone
        const keapCloneResponse = await fetch('https://jovial-melomakarona-ad9e4e.netlify.app/api/contact-webhook.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Test-Site-Form/1.0',
            },
            body: JSON.stringify(contactData),
        });

        const keapCloneResult = await keapCloneResponse.json();

        if (keapCloneResponse.ok && keapCloneResult.success) {
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    success: true, 
                    message: 'Contact created successfully',
                    contactId: keapCloneResult.contactId 
                }),
            };
        } else {
            console.error('Keap clone error:', keapCloneResult);
            return {
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    error: 'Failed to create contact in Keap clone',
                    details: keapCloneResult.error 
                }),
            };
        }

    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                error: 'Internal server error',
                details: error.message 
            }),
        };
    }
};

module.exports = { handler };