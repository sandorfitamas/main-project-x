// --- AUTH API FUNCTIONS ---

async function registerUser(name, email, password) {
  try {
    const response = await fetch('auth.php?action=register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Hiba a regisztráció során:', error);
    return { success: false, error: error.message };
  }
}

async function loginUser(email, password) {
  try {
    const response = await fetch('auth.php?action=login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Hiba a bejelentkezés során:', error);
    return { success: false, error: error.message };
  }
}

async function logoutUser() {
  try {
    const response = await fetch('auth.php?action=logout', {
      method: 'POST'
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Hiba a kijelentkezés során:', error);
    return { success: false, error: error.message };
  }
}

async function getCurrentUser() {
  try {
    const response = await fetch('auth.php?action=current');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Hiba a felhasználó lekérése során:', error);
    return { success: false, user: null };
  }
}
