require("dotenv").config({
path: path.resolve(__dirname, "../.env")
});
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const signup = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/signup`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
    });
    return response.json();
};

export const signin = async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/signin`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
    });
    return response.json();
};
