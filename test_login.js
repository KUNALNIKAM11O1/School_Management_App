
import axios from 'axios';

const API_URL = 'http://localhost:5000';

async function testLogin(role, email, password, collectionName) {
    try {
        const url = `${API_URL}/${collectionName}?usergmail=${email}&password=${password}`;
        console.log(`Testing ${role}: ${url}`);
        const response = await axios.get(url);
        if (response.data.length > 0) {
            console.log(`✅ [SUCCESS] ${role} login working! Found:`, response.data[0]);
        } else {
            console.log(`❌ [FAILED] ${role} login failed. No user found.`);
            // Try fetching all to see what's there
            const allUrl = `${API_URL}/${collectionName}`;
            const all = await axios.get(allUrl);
            console.log(`   [DEBUG] All users in ${collectionName}:`, all.data);
        }
    } catch (e) {
        console.error(`❌ [ERROR] Could not connect to API for ${role}:`, e.message);
    }
    console.log('-----------------------------------');
}

async function run() {
    console.log("Starting Login Diagnostics...\n");
    // Test Admin
    await testLogin('Admin', 'admin@gmail.com', 'password', 'admin');
    
    // Test Teacher (User changed password to 'teacher')
    await testLogin('Teacher', 'teacher@gmail.com', 'teacher', 'teachers');

    // Test Student
    await testLogin('Student', 'student@gmail.com', 'password', 'students');
}

run();
