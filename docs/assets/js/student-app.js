document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('checklist-container');
  const dateEl = document.getElementById('date');
  const btnAddItem = document.getElementById('btn-add-item');
  
  const nameView = document.getElementById('student-name-view');
  const nameText = document.getElementById('student-name-text');
  const nameEditIcon = document.getElementById('student-name-edit-icon');
  const nameEdit = document.getElementById('student-name-edit');
  const nameInput = document.getElementById('student-name-input');
  
  const btnGetLink = document.getElementById('btn-get-link');
  const linkContainer = document.getElementById('link-container');
  const shareLinkInput = document.getElementById('share-link');
  const btnCopyLink = document.getElementById('btn-copy-link');
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  dateEl.innerHTML = `Practice checklist for ${monthNames[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;

  function encodeData(data) {
    return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  }

  function decodeData(str) {
    return JSON.parse(decodeURIComponent(escape(atob(str))));
  }

  // Load configuration (name and list of items)
  function loadData() {
    const urlParams = new URLSearchParams(window.location.search);
    const dataParam = urlParams.get('data');
    if (dataParam) {
      try {
        const decoded = decodeData(dataParam);
        // Clear URL parameters to keep address bar clean
        window.history.replaceState({}, document.title, window.location.pathname);
        // Save imported list to local storage
        localStorage.setItem('studentAppData', JSON.stringify(decoded));
        return decoded;
      } catch (e) {
        console.error("Failed to parse URL data");
      }
    }

    const data = localStorage.getItem('studentAppData');
    if (data) {
      return JSON.parse(data);
    }
    // Default state: empty name, one blank item
    return { name: '', items: [{ id: Date.now().toString(), text: '' }] };
  }

  function saveData() {
    localStorage.setItem('studentAppData', JSON.stringify(appData));
  }

  // Load daily checkbox state
  function loadDailyState() {
    const state = localStorage.getItem('studentDailyState');
    if (state) {
      const parsed = JSON.parse(state);
      // Reset if it's a new day
      if (parsed.date === todayStr) {
        return parsed;
      }
    }
    return { date: todayStr, checked: {} };
  }

  function saveDailyState() {
    localStorage.setItem('studentDailyState', JSON.stringify(dailyState));
  }

  let appData = loadData();
  let dailyState = loadDailyState();

  // Setup student name field
  function renderStudentName() {
    if (appData.name.trim() === '') {
      nameText.innerHTML = '<span style="color:#888;font-style:italic">Student Name</span>';
    } else {
      nameText.innerText = appData.name;
    }
    nameInput.value = appData.name;
  }

  renderStudentName();

  nameEditIcon.addEventListener('click', () => {
    nameView.style.display = 'none';
    nameEdit.style.display = 'flex';
    nameInput.focus();
  });

  nameInput.addEventListener('blur', () => {
    nameEdit.style.display = 'none';
    nameView.style.display = 'flex';
    appData.name = nameInput.value.trim();
    saveData();
    renderStudentName();
  });

  nameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      nameInput.blur();
    }
  });

  function renderChecklist() {
    container.innerHTML = '';
    
    appData.items.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'practice-item';
      
      // Checkbox
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'practice-checkbox';
      checkbox.id = `chk_${item.id}`;
      checkbox.checked = !!dailyState.checked[item.id];
      
      checkbox.addEventListener('change', (e) => {
        dailyState.checked[item.id] = e.target.checked;
        saveDailyState();
      });

      div.appendChild(checkbox);

      // Content area
      const content = document.createElement('div');
      content.className = 'practice-item-content';
      content.style.flexWrap = 'wrap';

      // View mode
      const viewMode = document.createElement('div');
      viewMode.style.display = 'flex';
      viewMode.style.alignItems = 'center';
      viewMode.style.width = '100%';
      
      const label = document.createElement('label');
      label.htmlFor = `chk_${item.id}`;
      
      const textSpan = document.createElement('span');
      textSpan.innerHTML = item.text ? item.text : '<span style="color:#888;font-style:italic">Click edit icon to add</span>';
      label.appendChild(textSpan);
      viewMode.appendChild(label);
      
      const editIcon = document.createElement('span');
      editIcon.innerHTML = '✏️';
      editIcon.style.cursor = 'pointer';
      editIcon.style.marginLeft = '10px';
      editIcon.title = 'Edit item';
      viewMode.appendChild(editIcon);

      // Edit mode
      const editMode = document.createElement('div');
      editMode.style.display = 'none';
      editMode.style.width = '100%';
      editMode.style.alignItems = 'center';

      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'practice-input';
      input.placeholder = 'Practice item...';
      input.value = item.text;
      
      // Delete button
      const delBtn = document.createElement('button');
      delBtn.className = 'del-btn';
      delBtn.innerText = 'X';
      delBtn.title = 'Remove item';
      // Ensure the button can get focus so focusout can detect it
      delBtn.tabIndex = 0; 
      
      delBtn.addEventListener('click', () => {
        appData.items.splice(index, 1);
        saveData();
        renderChecklist();
      });

      editMode.appendChild(input);
      editMode.appendChild(delBtn);

      // Event listeners for toggle
      editIcon.addEventListener('click', () => {
        viewMode.style.display = 'none';
        editMode.style.display = 'flex';
        input.focus();
      });

      input.addEventListener('focusout', (e) => {
        // If clicking the delete button, let its click handler run instead of blurring back to view mode
        if (e.relatedTarget === delBtn) {
          return;
        }
        editMode.style.display = 'none';
        viewMode.style.display = 'flex';
        item.text = input.value.trim();
        saveData();
        textSpan.innerHTML = item.text ? item.text : '<span style="color:#888;font-style:italic">Click edit icon to add</span>';
      });

      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          input.blur();
        }
      });

      content.appendChild(viewMode);
      content.appendChild(editMode);

      div.appendChild(content);
      container.appendChild(div);
    });
  }

  btnAddItem.addEventListener('click', () => {
    appData.items.push({ id: Date.now().toString(), text: '' });
    saveData();
    renderChecklist();
  });

  // Get Link functionality
  btnGetLink.addEventListener('click', () => {
    const encoded = encodeData(appData);
    const url = window.location.origin + window.location.pathname + '?data=' + encoded;
    shareLinkInput.value = url;
    linkContainer.style.display = 'block';
  });

  btnCopyLink.addEventListener('click', () => {
    shareLinkInput.select();
    document.execCommand('copy');
    btnCopyLink.innerText = 'Copied!';
    setTimeout(() => { btnCopyLink.innerText = 'Copy Link'; }, 2000);
  });

  renderChecklist();
});