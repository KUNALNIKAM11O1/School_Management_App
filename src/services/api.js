
import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCollection = async (collection) => {
  try {
    const response = await api.get(`/${collection}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${collection}:`, error);
    return [];
  }
};

export const addToCollection = async (collection, data) => {
  try {
    const response = await api.post(`/${collection}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error adding to ${collection}:`, error);
    throw error;
  }
};

export const updateInCollection = async (collection, id, data) => {
  try {
    const response = await api.put(`/${collection}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating in ${collection}:`, error);
    throw error;
  }
};

export const deleteFromCollection = async (collection, id) => {
  try {
    await api.delete(`/${collection}/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting from ${collection}:`, error);
    throw error;
  }
};

// Helper to simulate looking up user by username/password (Not secure, but requested flow)
// Helper to simulate looking up user by username/password (Not secure, but requested flow)
export const loginUser = async (usergmail, password, role) => {
    try {
        let collection = '';
        if (role === 'admin') collection = 'admin';
        else if (role === 'teacher') collection = 'teachers';
        else if (role === 'student') collection = 'students';
        
        // json-server query
        const response = await api.get(`/${collection}?usergmail=${usergmail}&password=${password}`);
        
        const user = response.data[0];
        if (user) {
            // Ensure role is attached for context
            return { ...user, role: role };
        }
        return null;
    } catch (error) {
        console.error("Login error", error);
        return null;
    }
}

export default api;
