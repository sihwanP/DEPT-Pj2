import axios from 'axios';
import fs from 'fs';

async function verify() {
    try {
        const response = await axios.get('http://localhost:3000/api/products');
        console.log('Status:', response.status);
        console.log('Data:', response.data);
        fs.writeFileSync('api_response.json', JSON.stringify(response.data, null, 2));
    } catch (error: any) {
        console.error('Error verifying API:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
        fs.writeFileSync('api_response_error.txt', error.message);
    }
}

verify();
