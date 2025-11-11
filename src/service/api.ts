import axios from 'axios';

const api = axios.create({
	baseURL: 'https://api-farmpet.onrender.com/',
});

export default api;
