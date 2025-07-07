/**
 * Helper function for making API requests
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method
 * @param {object} data - Request body
 * @returns {Promise} - Response data
 */
export async function apiRequest(endpoint, method = 'GET', data = null) {
	const options = {
		method,
		headers: {
			'Content-Type': 'application/json',
		},
	};

	if (data) {
		options.body = JSON.stringify(data);
	}

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_FRONTEND_API_URL}/api/${endpoint}`,
		options
	);

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || 'Something went wrong');
	}

	if (response.status !== 204) {
		return await response.json();
	}

	return null;
}
