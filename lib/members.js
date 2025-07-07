import axios from 'axios';
import { API_URL } from './constants';

export async function getMembers(searchParameter) {
	const response = await axios.get(`${API_URL}/api/members`, {
		params: {
			search: searchParameter, // Pass the debounced search term as a query parameter
		},
	});
	return response.data;
}

export async function getMembersById(id) {
	const response = await axios.get(`${API_URL}/api/members/${id}`);
	//const response = await fetch(`/api/users/${id}`);
	return response.data;
}

export async function updateMembersById(id, data) {
	console.log('server update:', id, data);
	const response = await axios.put(`${API_URL}/api/members/${id}`, data);
	return response.data;
}

export async function deleteMembersById(id) {
	const response = await axios.delete(`${API_URL}/api/members/${id}`);
	return response.data;
}
