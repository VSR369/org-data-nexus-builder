import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export const fetchData = async (endpoint) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${endpoint}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};

export const postData = async (endpoint, data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error posting data to ${endpoint}:`, error);
    throw error;
  }
};

export const putData = async (endpoint, data, id) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${endpoint}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating data in ${endpoint}:`, error);
    throw error;  
  }
};

export const deleteData = async (endpoint, id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting data from ${endpoint}:`, error);
    throw error;
  }
};

// Add more functions for other HTTP methods as needed
