const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('.'));
app.use(express.json());

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint to get configuration (without exposing sensitive data directly)
app.get('/api/config', (req, res) => {
    res.json({
        SUPABASE_URL: process.env.SUPABASE_URL,
        // Note: We'll handle the service role key on the server side for security
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    });
});

// API endpoint to delete user (server-side for security)
app.post('/api/delete-user', async (req, res) => {
    try {
        const { createClient } = require('@supabase/supabase-js');
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        // First try to authenticate to verify credentials
        let userId = null;
        
        try {
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            if (signInError) {
                return res.status(401).json({ error: 'Invalid credentials: ' + signInError.message });
            }
            
            userId = signInData.user?.id;
            await supabase.auth.signOut();
            
        } catch (authError) {
            console.log('Direct auth failed, trying admin lookup');
        }

        // If direct auth failed, try admin lookup
        if (!userId) {
            const { data: users, error: listError } = await supabase.auth.admin.listUsers();
            
            if (listError) {
                return res.status(500).json({ error: 'Failed to list users: ' + listError.message });
            }
            
            const user = users.users.find(u => u.email === email);
            if (!user) {
                return res.status(404).json({ error: 'User not found with email: ' + email });
            }
            
            userId = user.id;
        }

        // Delete the user
        const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
        
        if (deleteError) {
            return res.status(500).json({ error: 'Failed to delete user: ' + deleteError.message });
        }

        res.json({ success: true, message: `User account with email "${email}" deleted successfully!` });

    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
