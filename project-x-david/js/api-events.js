// --- API FUNCTIONS ---

async function loadEventsFromDB() {
  try {
    const response = await fetch('api.php?action=list');
    const data = await response.json();
    if (data.success) {
      return data.events;
    } else {
      console.error('Hiba az események betöltésekor:', data.error);
      return [];
    }
  } catch (error) {
    console.error('Hiba az API hívás során:', error);
    return [];
  }
}

async function createEventInDB(eventData) {
  try {
    const response = await fetch('api.php?action=create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventData)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Hiba az esemény létrehozásakor:', error);
    return { success: false, error: error.message };
  }
}

async function loadMyEventsFromDB() {
  try {
    const response = await fetch('api.php?action=my-events');
    const data = await response.json();
    if (data.success) {
      return data.events;
    } else {
      console.error('Hiba a saját események betöltésekor:', data.error);
      return [];
    }
  } catch (error) {
    console.error('Hiba az API hívás során:', error);
    return [];
  }
}

async function updateEventInDB(eventData) {
  try {
    const response = await fetch('api.php?action=update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventData)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Hiba az esemény módosításakor:', error);
    return { success: false, error: error.message };
  }
}

async function deleteEventFromDB(eventId) {
  try {
    const response = await fetch('api.php?action=delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: eventId })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Hiba az esemény törlésekor:', error);
    return { success: false, error: error.message };
  }
}

// --- KEDVENCEK API ---

async function getFavoriteEvents() {
  try {
    const response = await fetch('api.php?action=favorites');
    const data = await response.json();
    if (data.success) {
      return data.events;
    } else {
      console.error('Hiba a kedvencek betöltésekor:', data.error);
      return [];
    }
  } catch (error) {
    console.error('Hiba az API hívás során:', error);
    return [];
  }
}

async function addToFavorites(eventId) {
  try {
    console.log('Adding to favorites, eventId:', eventId, 'type:', typeof eventId);
    const response = await fetch('api.php?action=add-favorite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ event_id: eventId })
    });
    const data = await response.json();
    console.log('Add to favorites response:', data);
    return data;
  } catch (error) {
    console.error('Hiba a kedvencekhez adáskor:', error);
    return { success: false, error: error.message };
  }
}

async function removeFromFavorites(eventId) {
  try {
    const response = await fetch('api.php?action=remove-favorite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ event_id: eventId })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Hiba a kedvencekből való eltávolításkor:', error);
    return { success: false, error: error.message };
  }
}

