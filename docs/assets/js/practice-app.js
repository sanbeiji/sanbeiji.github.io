document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('checklist-container');
  const dateEl = document.getElementById('date');
  const btnRegenerate = document.getElementById('btn-regenerate');
  const btnTogglePool = document.getElementById('btn-toggle-pool');
  const editPoolContainer = document.getElementById('edit-pool-container');
  const excerptCountInput = document.getElementById('excerpt-count');
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const today = new Date();
  dateEl.innerHTML = `Practice plan for ${monthNames[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;

  function getSearchLink(query, display) {
    const encoded = encodeURIComponent(query);
    return `<a href="https://www.google.com/search?q=${encoded}" target="_blank" title="Search for this item">${display}</a>`;
  }

  function getShiftLink(pattern) {
    const map = {
      'I-A': 1, 'I-Bb': 2, 'I-B': 3,
      'II-E': 4, 'II-F': 5, 'II-F#': 6,
      'III-B': 7, 'III-C': 8, 'III-C#': 9,
      'IV-F#': 10, 'IV-G': 11, 'IV-G#': 12
    };
    const parts = pattern.split('-');
    const key = parts[0] + '-' + parts[1];
    const index = map[key] || 1;
    const url = `https://youtu.be/vH7rsMUMbfE?list=PLepnI3lzfWKa0NJAdLQ8j-5zO74HvYVIV&index=${index}`;
    return `<a href="${url}" target="_blank" title="Watch shifting exercise video">Shift exercise ${pattern}</a>`;
  }

  function saveDailyState() {
    localStorage.setItem('practiceDailyState', JSON.stringify(window.dailyState));
  }

  function renderChecklist() {
    container.innerHTML = '';
    
    const state = window.dailyState;
    const userFields = window.practiceAppData.userFields;

    const items = [
      { id: 'scale', label: `Daily scale: ${getSearchLink('bass clef scale ' + state.todays_key, state.todays_key)}<br><span class="small" style="font-size:0.8em;">Whole note, quarter tonic + 8ths, 8 notes per bow, 16th notes spicatto, hoe-down vars.</span>` },
      { id: 'shift1', label: getShiftLink(state.shift1) },
      { id: 'shift2', label: getShiftLink(state.shift2) },
      { id: 'bowing', label: getSearchLink('Zimmerman bowing patterns double bass', 'Zimmerman bowing patterns') },
      
      // User Editable Fields
      { id: 'concerto', isInput: true, placeholder: 'Concerto...', value: userFields.concerto },
      { id: 'bach', isInput: true, placeholder: 'Bach...', value: userFields.bach },
      { id: 'otherSolo', isInput: true, placeholder: 'Other solo piece...', value: userFields.otherSolo },

      { id: 'strauss', label: `Daily Strauss: ${getSearchLink('double bass excerpt ' + state.todays_strauss, state.todays_strauss)}` }
    ];

    state.actual_excerpts.forEach((exc, index) => {
      items.push({
        id: `excerpt_${index}`,
        label: `Excerpt No.${index + 1}: ${getSearchLink('double bass excerpt ' + exc, exc)}`
      });
    });

    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'practice-item';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'practice-checkbox';
      checkbox.id = `chk_${item.id}`;
      checkbox.checked = !!state.checked[item.id];
      
      checkbox.addEventListener('change', (e) => {
        window.dailyState.checked[item.id] = e.target.checked;
        saveDailyState();
      });

      div.appendChild(checkbox);

      const content = document.createElement('div');
      content.className = 'practice-item-content';

      if (item.isInput) {
        const prefix = item.placeholder.replace('...', '');
        
        const viewMode = document.createElement('div');
        viewMode.style.display = 'flex';
        viewMode.style.alignItems = 'center';
        viewMode.style.width = '100%';
        
        const label = document.createElement('label');
        label.htmlFor = `chk_${item.id}`;
        
        const textSpan = document.createElement('span');
        const renderText = (val) => `${prefix}: ${val ? getSearchLink(val, val) : '<span style="color:#888;font-style:italic">Click edit icon to add</span>'}`;
        textSpan.innerHTML = renderText(item.value);
        label.appendChild(textSpan);
        viewMode.appendChild(label);
        
        const editIcon = document.createElement('span');
        editIcon.innerHTML = '✏️';
        editIcon.style.cursor = 'pointer';
        editIcon.style.marginLeft = '10px';
        editIcon.title = 'Edit ' + prefix;
        viewMode.appendChild(editIcon);
        
        const editMode = document.createElement('div');
        editMode.style.display = 'none';
        editMode.style.width = '100%';
        
        const lbl = document.createElement('div');
        lbl.style.fontWeight = 'bold';
        lbl.style.marginBottom = '2px';
        lbl.innerText = prefix;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'practice-input';
        input.placeholder = item.placeholder;
        input.value = item.value;
        
        editMode.appendChild(lbl);
        editMode.appendChild(input);
        
        editIcon.addEventListener('click', () => {
          viewMode.style.display = 'none';
          editMode.style.display = 'block';
          input.focus();
        });
        
        input.addEventListener('blur', () => {
          editMode.style.display = 'none';
          viewMode.style.display = 'flex';
          textSpan.innerHTML = renderText(input.value);
        });
        
        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            input.blur();
          }
        });

        input.addEventListener('input', (e) => {
          window.practiceAppData.userFields[item.id] = e.target.value;
          localStorage.setItem('practiceAppData', JSON.stringify(window.practiceAppData));
        });
        
        content.appendChild(viewMode);
        content.appendChild(editMode);
      } else {
        const label = document.createElement('label');
        label.htmlFor = `chk_${item.id}`;
        label.innerHTML = item.label;
        content.appendChild(label);
      }

      div.appendChild(content);
      container.appendChild(div);
    });
  }

  // --- Pool Management ---
  function renderPool(poolName, containerId) {
    const poolContainer = document.getElementById(containerId);
    poolContainer.innerHTML = '';
    const pool = window.practiceAppData.pools[poolName];
    
    pool.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'pool-item';
      
      const weightInput = document.createElement('select');
      for (let i = 1; i <= 10; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.innerText = i;
        if (i === item.weight) opt.selected = true;
        weightInput.appendChild(opt);
      }
      weightInput.addEventListener('change', (e) => {
        let w = parseInt(e.target.value, 10);
        if (isNaN(w) || w < 1) w = 1;
        if (w > 10) w = 10;
        item.weight = w;
        localStorage.setItem('practiceAppData', JSON.stringify(window.practiceAppData));
      });
      
      const span = document.createElement('span');
      span.innerText = item.name;
      
      const delBtn = document.createElement('button');
      delBtn.innerText = 'Del';
      delBtn.addEventListener('click', () => {
        window.practiceAppData.pools[poolName].splice(index, 1);
        localStorage.setItem('practiceAppData', JSON.stringify(window.practiceAppData));
        renderPools();
      });
      
      div.appendChild(weightInput);
      div.appendChild(span);
      div.appendChild(delBtn);
      poolContainer.appendChild(div);
    });
  }

  function renderPools() {
    renderPool('strauss', 'strauss-pool-list');
    renderPool('excerpts', 'excerpts-pool-list');
  }

  function handleAddPoolItem(e, poolName) {
    e.preventDefault();
    const form = e.target;
    const nameInput = form.querySelector('input[type="text"]');
    const weightSelect = form.querySelector('select');
    const name = nameInput.value.trim();
    let weight = parseInt(weightSelect.value, 10);
    
    if (name) {
      if (isNaN(weight) || weight < 1) weight = 1;
      if (weight > 10) weight = 10;
      window.practiceAppData.pools[poolName].push({ name, weight });
      localStorage.setItem('practiceAppData', JSON.stringify(window.practiceAppData));
      nameInput.value = '';
      weightSelect.value = '1';
      renderPools();
    }
  }

  document.getElementById('form-add-strauss').addEventListener('submit', (e) => handleAddPoolItem(e, 'strauss'));
  document.getElementById('form-add-excerpt').addEventListener('submit', (e) => handleAddPoolItem(e, 'excerpts'));

  // --- Initial Setup ---
  excerptCountInput.value = window.practiceAppData.settings.excerptCount || 5;
  excerptCountInput.addEventListener('change', (e) => {
    let c = parseInt(e.target.value, 10);
    if (isNaN(c) || c < 1) c = 1;
    if (c > 10) c = 10;
    window.practiceAppData.settings.excerptCount = c;
    localStorage.setItem('practiceAppData', JSON.stringify(window.practiceAppData));
    window.generateDailyList(true);
    renderChecklist();
  });

  btnRegenerate.addEventListener('click', () => {
    window.generateDailyList(true);
    renderChecklist();
  });

  btnTogglePool.addEventListener('click', () => {
    if (editPoolContainer.style.display === 'none') {
      editPoolContainer.style.display = 'block';
      btnTogglePool.innerText = 'Hide pools';
    } else {
      editPoolContainer.style.display = 'none';
      btnTogglePool.innerText = 'Edit pools';
    }
  });

  renderChecklist();
  renderPools();
});