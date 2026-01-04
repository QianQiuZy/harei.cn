const DEFAULT_HEADERS = {
  Accept: 'application/json'
};

export async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...DEFAULT_HEADERS,
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || `请求失败: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function submitMessage(payload) {
  return fetchJson('/api/box', {
    method: 'POST',
    body: payload
  });
}

export async function fetchMessages(params = '') {
  return fetchJson(`/api/messages${params}`);
}

export async function fetchTags() {
  return fetchJson('/api/tags');
}
