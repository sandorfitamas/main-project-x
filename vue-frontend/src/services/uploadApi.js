import { API_BASE, getAuthHeaders } from './apiCommon.js';

export async function apiUploadImage(file) {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), Accept: 'application/json' },
      body: formData,
    });
    return response.json();
  } catch (error) {
    return { success: false, message: 'Hálózati hiba: Kép feltöltése sikertelen.' };
  }
}
