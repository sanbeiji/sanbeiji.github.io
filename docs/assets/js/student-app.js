document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('checklist-container');
  const dateEl = document.getElementById('date');
  const btnAddItem = document.getElementById('btn-add-item');
  const btnToggleEdit = document.getElementById('btn-toggle-edit');

  // Handle dragover sorting on container
  container.addEventListener('dragover', (e) => {
    e.preventDefault();
    const draggingElement = container.querySelector('.dragging');
    if (!draggingElement) return;
    
    const siblings = [...container.querySelectorAll('.practice-item:not(.dragging)')];
    const nextSibling = siblings.find(sibling => {
      const box = sibling.getBoundingClientRect();
      return e.clientY <= box.top + box.height / 2;
    });
    
    if (nextSibling) {
      container.insertBefore(draggingElement, nextSibling);
    } else {
      container.appendChild(draggingElement);
    }
  });
  
  const nameView = document.getElementById('student-name-view');
  const nameText = document.getElementById('student-name-text');
  const nameEditIcon = document.getElementById('student-name-edit-icon');
  const nameEdit = document.getElementById('student-name-edit');
  const nameInput = document.getElementById('student-name-input');
  
  const btnStartSession = document.getElementById('btn-start-session');
  const btnPauseResume = document.getElementById('btn-pause-resume');
  const btnEndSession = document.getElementById('btn-end-session');
  const stopwatchDisplay = document.getElementById('stopwatch-display');
  const defaultActions = document.getElementById('default-actions');
  const sessionActions = document.getElementById('session-actions');
  const startTimeDisplay = document.getElementById('start-time-display');
  const completeTimeDisplay = document.getElementById('complete-time-display');

  const btnGetLink = document.getElementById('btn-get-link');
  const shareDialogOverlay = document.getElementById('share-dialog-overlay');
  const shareLinkM3 = document.getElementById('share-link-m3');
  const btnDialogClose = document.getElementById('btn-dialog-close');
  const btnCopyLinkM3 = document.getElementById('btn-copy-link-m3');
  
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
  let isEditMode = false;
  let newlyAddedItemId = null;

  // Stopwatch State
  let secondsElapsed = 0;
  let timerInterval = null;
  let isPaused = false;
  let sessionStartTime = null;

  function formatStopwatch(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  // Setup student name field
  function renderStudentName() {
    if (appData.name.trim() === '') {
      nameText.innerHTML = '<span style="color:#888;font-style:italic">Student name</span>';
    } else {
      nameText.innerText = appData.name;
    }
    nameInput.value = appData.name;
    nameEditIcon.style.display = isEditMode ? 'inline' : 'none';
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
    
    // Toggle Add Item button visibility
    btnAddItem.style.display = isEditMode ? 'inline-block' : 'none';

    appData.items.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'practice-item';
      div.dataset.id = item.id;
      div.draggable = false;

      if (isEditMode) {
        // --- EDIT MODE ---
        // Drag handle
        const dragHandle = document.createElement('div');
        dragHandle.className = 'drag-handle';
        dragHandle.innerHTML = '⋮⋮';
        dragHandle.title = 'Drag to reorder';
        
        dragHandle.addEventListener('mousedown', () => {
          div.draggable = true;
        });
        dragHandle.addEventListener('mouseup', () => {
          div.draggable = false;
        });
        dragHandle.addEventListener('touchstart', () => {
          div.draggable = true;
        });
        dragHandle.addEventListener('touchend', () => {
          div.draggable = false;
        });

        // Drag events
        div.addEventListener('dragstart', (e) => {
          div.classList.add('dragging');
          e.dataTransfer.effectAllowed = 'move';
        });

        div.addEventListener('dragend', () => {
          div.classList.remove('dragging');
          div.draggable = false;
          
          // Reorder items based on DOM order
          const itemElements = [...container.querySelectorAll('.practice-item')];
          const newItems = itemElements.map(el => {
            const id = el.dataset.id;
            return appData.items.find(it => it.id === id);
          }).filter(Boolean);
          
          appData.items = newItems;
          saveData();
          renderChecklist();
        });

        div.appendChild(dragHandle);

        // Content area
        const content = document.createElement('div');
        content.className = 'practice-item-content';

        // Text Input
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'practice-input';
        input.placeholder = 'Practice item...';
        input.value = item.text;
        
        if (item.id === newlyAddedItemId) {
          setTimeout(() => input.focus(), 0);
          newlyAddedItemId = null;
        }
        
        input.addEventListener('input', () => {
          item.text = input.value.trim();
          saveData();
        });

        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            input.blur();
          }
        });

        // Delete button
        const delBtn = document.createElement('button');
        delBtn.className = 'del-btn';
        delBtn.innerText = 'X';
        delBtn.title = 'Remove item';
        
        delBtn.addEventListener('click', () => {
          appData.items.splice(index, 1);
          saveData();
          renderChecklist();
        });

        content.appendChild(input);
        content.appendChild(delBtn);
        div.appendChild(content);

      } else {
        // --- VIEW MODE (DEFAULT) ---
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

        const label = document.createElement('label');
        label.htmlFor = `chk_${item.id}`;
        
        const textSpan = document.createElement('span');
        textSpan.innerText = item.text ? item.text : 'Empty item';
        if (!item.text) {
          textSpan.style.color = '#888';
          textSpan.style.fontStyle = 'italic';
        }
        
        label.appendChild(textSpan);
        content.appendChild(label);
        div.appendChild(content);
      }

      container.appendChild(div);
    });
  }

  btnToggleEdit.addEventListener('click', () => {
    isEditMode = !isEditMode;
    if (isEditMode) {
      btnToggleEdit.classList.add('active');
      btnToggleEdit.classList.add('m3-button-blue-pulsate');
      btnToggleEdit.querySelector('.button-icon').innerText = '✔️';
      btnToggleEdit.querySelector('.button-text').innerText = ' Done editing';
    } else {
      btnToggleEdit.classList.remove('active');
      btnToggleEdit.classList.remove('m3-button-blue-pulsate');
      btnToggleEdit.querySelector('.button-icon').innerText = '✏️';
      btnToggleEdit.querySelector('.button-text').innerText = ' Edit';
    }
    renderChecklist();
    renderStudentName();
  });

  btnAddItem.addEventListener('click', () => {
    const newId = Date.now().toString();
    newlyAddedItemId = newId;
    appData.items.push({ id: newId, text: '' });
    saveData();
    renderChecklist();
  });

  function formatTimestamp(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    return `${yyyy}/${mm}/${dd} ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  }

  btnStartSession.addEventListener('click', () => {
    if (isEditMode) {
      isEditMode = false;
      btnToggleEdit.classList.remove('active');
      btnToggleEdit.classList.remove('m3-button-blue-pulsate');
      btnToggleEdit.querySelector('.button-icon').innerText = '✏️';
      btnToggleEdit.querySelector('.button-text').innerText = ' Edit';
      renderChecklist();
      renderStudentName();
    }

    sessionStartTime = new Date();
    secondsElapsed = 0;
    isPaused = false;
    
    startTimeDisplay.innerText = `Practice session started at ${formatTimestamp(sessionStartTime)}`;
    completeTimeDisplay.innerText = '';
    
    defaultActions.style.display = 'none';
    sessionActions.style.display = 'flex';
    btnPauseResume.querySelector('.button-icon').innerText = '⏸️';
    btnPauseResume.querySelector('.button-text').innerText = ' Pause';
    stopwatchDisplay.innerText = '00:00';

    timerInterval = setInterval(() => {
      secondsElapsed++;
      stopwatchDisplay.innerText = formatStopwatch(secondsElapsed);
    }, 1000);
  });

  btnPauseResume.addEventListener('click', () => {
    if (!isPaused) {
      isPaused = true;
      btnPauseResume.querySelector('.button-icon').innerText = '▶️';
      btnPauseResume.querySelector('.button-text').innerText = ' Resume';
      clearInterval(timerInterval);
    } else {
      isPaused = false;
      btnPauseResume.querySelector('.button-icon').innerText = '⏸️';
      btnPauseResume.querySelector('.button-text').innerText = ' Pause';
      timerInterval = setInterval(() => {
        secondsElapsed++;
        stopwatchDisplay.innerText = formatStopwatch(secondsElapsed);
      }, 1000);
    }
  });

  btnEndSession.addEventListener('click', () => {
    if (!sessionStartTime) return;
    clearInterval(timerInterval);
    
    defaultActions.style.display = 'flex';
    sessionActions.style.display = 'none';

    const endTime = new Date();
    const diffMs = endTime - sessionStartTime;
    const diffMins = Math.floor(diffMs / 60000);
    const remainingSecs = Math.floor((diffMs % 60000) / 1000);
    
    let durationText = "";
    if (diffMins > 0) {
      durationText = `${diffMins} minute${diffMins === 1 ? '' : 's'} and ${remainingSecs} second${remainingSecs === 1 ? '' : 's'}`;
    } else {
      durationText = `${remainingSecs} second${remainingSecs === 1 ? '' : 's'}`;
    }

    let text = `Practice session finished at ${formatTimestamp(endTime)}. You practiced for ${durationText}!`;
    if (diffMins < 10) {
      text += " You should really practice a bit more.";
    }
    completeTimeDisplay.innerText = text;
    
    sessionStartTime = null;
    timerInterval = null;
    secondsElapsed = 0;
  });

  // M3 Dialog Share Modal functionality
  btnGetLink.addEventListener('click', () => {
    const encoded = encodeData(appData);
    const url = window.location.origin + window.location.pathname + '?data=' + encoded;
    shareLinkM3.value = url;
    shareDialogOverlay.style.display = 'flex';
  });

  btnDialogClose.addEventListener('click', () => {
    shareDialogOverlay.style.display = 'none';
  });

  // Close overlay on backdrop click
  shareDialogOverlay.addEventListener('click', (e) => {
    if (e.target === shareDialogOverlay) {
      shareDialogOverlay.style.display = 'none';
    }
  });

  btnCopyLinkM3.addEventListener('click', () => {
    shareLinkM3.select();
    shareLinkM3.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(shareLinkM3.value)
      .then(() => {
        btnCopyLinkM3.innerText = 'Copied!';
        setTimeout(() => { btnCopyLinkM3.innerText = 'Copy Link'; }, 2000);
      })
      .catch(() => {
        document.execCommand('copy');
        btnCopyLinkM3.innerText = 'Copied!';
        setTimeout(() => { btnCopyLinkM3.innerText = 'Copy Link'; }, 2000);
      });
  });

  renderChecklist();
});