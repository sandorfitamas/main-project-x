// --- MODAL FUNCTIONS ---

function toggleModal(show) {
  if (show) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  } else {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
    createEventForm.reset();
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');
    const imageUploadLabel = document.getElementById('image-upload-label');
    if (imagePreviewContainer && imagePreview && imageUploadLabel) {
      imagePreviewContainer.classList.add('hidden');
      imagePreview.src = '';
      imageUploadLabel.classList.remove('hidden');
    }
  }
}

function toggleEditModal(show) {
  const editModal = document.getElementById('edit-event-modal');
  const editForm = document.getElementById('edit-event-form');
  
  if (show) {
    editModal.classList.remove('hidden');
    editModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  } else {
    editModal.classList.add('hidden');
    editModal.classList.remove('flex');
    document.body.style.overflow = '';
    editForm.reset();
    editingEventId = null;
    
    const imagePreviewContainer = document.getElementById('edit-image-preview-container');
    const imagePreview = document.getElementById('edit-image-preview');
    const imageUploadLabel = document.getElementById('edit-image-upload-label');
    const currentImageDiv = document.getElementById('edit-current-image');
    
    if (imagePreviewContainer && imagePreview && imageUploadLabel && currentImageDiv) {
      imagePreviewContainer.classList.add('hidden');
      imagePreview.src = '';
      imageUploadLabel.classList.remove('hidden');
      currentImageDiv.classList.add('hidden');
    }
  }
}

function toggleAuthModal(show) {
  if (show) {
    authModal.classList.remove('hidden');
    authModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  } else {
    authModal.classList.add('hidden');
    authModal.classList.remove('flex');
    document.body.style.overflow = '';
    loginForm.reset();
    registerForm.reset();
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    authModalTitle.textContent = 'Bejelentkezés';
    authToggleText.textContent = 'Nincs még fiókod?';
    authToggleBtn.textContent = 'Regisztrálj most';
  }
}

function setupImagePreview() {
  const imageInput = document.getElementById('event-image');
  const imagePreviewContainer = document.getElementById('image-preview-container');
  const imagePreview = document.getElementById('image-preview');
  const imageUploadLabel = document.getElementById('image-upload-label');
  const removeImageBtn = document.getElementById('remove-image-btn');

  if (imageInput) {
    imageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert('A fájl mérete nem lehet nagyobb 5MB-nál!');
          imageInput.value = '';
          return;
        }
        
        if (!file.type.startsWith('image/')) {
          alert('Csak képfájlokat lehet feltölteni!');
          imageInput.value = '';
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          imagePreview.src = e.target.result;
          imagePreviewContainer.classList.remove('hidden');
          imageUploadLabel.classList.add('hidden');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (removeImageBtn) {
    removeImageBtn.addEventListener('click', () => {
      imageInput.value = '';
      imagePreview.src = '';
      imagePreviewContainer.classList.add('hidden');
      imageUploadLabel.classList.remove('hidden');
    });
  }
}

function setupEditImagePreview() {
  const imageInput = document.getElementById('edit-event-image');
  const imagePreviewContainer = document.getElementById('edit-image-preview-container');
  const imagePreview = document.getElementById('edit-image-preview');
  const imageUploadLabel = document.getElementById('edit-image-upload-label');
  const removeImageBtn = document.getElementById('edit-remove-image-btn');
  const currentImageDiv = document.getElementById('edit-current-image');

  if (imageInput) {
    imageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert('A fájl mérete nem lehet nagyobb 5MB-nál!');
          imageInput.value = '';
          return;
        }
        
        if (!file.type.startsWith('image/')) {
          alert('Csak képfájlokat lehet feltölteni!');
          imageInput.value = '';
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          imagePreview.src = e.target.result;
          imagePreviewContainer.classList.remove('hidden');
          imageUploadLabel.classList.add('hidden');
          currentImageDiv.classList.add('hidden');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (removeImageBtn) {
    removeImageBtn.addEventListener('click', () => {
      imageInput.value = '';
      imagePreview.src = '';
      imagePreviewContainer.classList.add('hidden');
      imageUploadLabel.classList.remove('hidden');
      currentImageDiv.classList.remove('hidden');
    });
  }
}
