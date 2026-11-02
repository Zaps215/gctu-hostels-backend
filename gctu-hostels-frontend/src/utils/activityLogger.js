async function requestUserData(path, options = {}) {
    const response = await fetch(`${API_CONFIG.AUTH_API}${path}`, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    });
    const result = await response.json();

    if (!response.ok) {
        const error = new Error(result.error || 'Unable to load account data');
        error.status = response.status;
        throw error;
    }

    return result;
}

async function logUserActivity(type, details = {}) {
    return requestUserData('/activity', {
        method: 'POST',
        keepalive: true,
        body: JSON.stringify({ type, ...details })
    });
}

async function getDashboardData() {
    const result = await requestUserData('/dashboard', { cache: 'no-store' });
    return result.data;
}

async function getSavedHostels() {
    const result = await requestUserData('/favorites');
    return result.data;
}

async function setHostelSaved(hostelId, shouldSave) {
    const result = await requestUserData(`/favorites/${encodeURIComponent(hostelId)}`, {
        method: shouldSave ? 'PUT' : 'DELETE'
    });
    return result.saved;
}