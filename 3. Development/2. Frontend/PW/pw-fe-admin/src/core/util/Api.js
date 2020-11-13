import axios from 'axios';

export default axios.create({
    baseURL: process.env.REACT_APP_CUSTOM_STATIC_API_URL,
    // timeout: process.env.REACT_APP_CUSTOM_STATIC_API_TIME_OUT,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.id_token}`
    },
});
