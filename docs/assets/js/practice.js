// 1. DATA STRUCTURES & DEFAULTS
const DEFAULT_STRAUSS = [
  { name: 'Ein Heldenleben', weight: 6 },
  { name: 'Don Juan', weight: 3 },
  { name: 'Der Rosenkavalier Act 2 reh 3', weight: 1 },
  { name: 'Salome act 2 reh 154', weight: 1 },
  { name: 'Also Sprach Zarathustra', weight: 1 },
  { name: 'Don Quixote', weight: 1 }
];

const DEFAULT_EXCERPTS = [
  { name: 'Bach: Brandenburg Concerto No.3', weight: 1 }, { name: 'Bach: Brandenburg Concerto No.5', weight: 1 },
  { name: 'Bach: Suite No. 2 in B', weight: 3 }, { name: 'Bach: Violin Concerto in E', weight: 2 },
  { name: 'Bartók: Concerto for Orchestra', weight: 2 }, { name: 'Bartók: Music for Strings, Percussion, and Celeste', weight: 2 },
  { name: 'Beethoven: Symphony No.3', weight: 1 }, { name: 'Beethoven: Symphony No.5', weight: 5 },
  { name: 'Beethoven: Symphony No.7', weight: 2 }, { name: 'Beethoven: Symphony No.9', weight: 5 },
  { name: 'Berlioz: Symphonie Fantastique', weight: 5 }, { name: 'Brahms: Symphony No.1', weight: 1 },
  { name: 'Brahms: Symphony No.2', weight: 5 }, { name: 'Brahms: Symphony No.4', weight: 1 },
  { name: 'Britten: Young Persons Guide', weight: 4 }, { name: 'Bruckner: Symphony No.7', weight: 1 },
  { name: 'Dvorak: Symphony No.8', weight: 1 }, { name: 'Dvorak: Symphony No.9', weight: 1 }, { name: 'Dvorak: Quintet Op.77', weight: 1 },
  { name: 'Franck: Symphony in D', weight: 1 }, { name: 'Ginastera: Concerto for Strings', weight: 1 }, { name: 'Ginastera: Variaciones Concertantes', weight: 2 },
  { name: 'Haydn: Symphony No.31', weight: 1 }, { name: 'Haydn: Symphony No.8', weight: 1 }, { name: 'Haydn: Symphony No.88', weight: 1 },
  { name: 'Mahler: Symphony No.1', weight: 1 }, { name: 'Mahler: Symphony No.2', weight: 7 }, { name: 'Mahler: Symphony No.3', weight: 2 },
  { name: 'Mahler: Symphony No.5', weight: 1 }, { name: 'Mahler: Symphony No.7 (2nd mvt.)', weight: 1 },
  { name: 'Mendelssohn: Symphony No. 4', weight: 3 }, { name: 'Mendelssohn: Midsummer Nights Dream', weight: 1 },
  { name: 'Mozart: Marriage of Figaro', weight: 1 }, { name: 'Mozart: Per Questa Bella Mano', weight: 1 },
  { name: 'Mozart: Symphony No.35', weight: 5 }, { name: 'Mozart: Symphony No.39', weight: 4 },
  { name: 'Mozart: Symphony No.40', weight: 5 }, { name: 'Mozart: Symphony No.41', weight: 2 }, { name: 'Mozart: The Magic Flute', weight: 1 },
  { name: 'Prokofiev: Lt. Kije', weight: 2 }, { name: 'Prokofiev: Romeo and Juliet', weight: 4 }, { name: 'Prokofiev: Cinderella', weight: 2 },
  { name: 'Rimsky-Korsakov: Scheherazade', weight: 2 }, { name: 'Rossini: Barber of Seville Overture', weight: 1 },
  { name: 'Saint-Saens: Elephant', weight: 2 }, { name: 'Schoenberg: Kammersymphonie, Op.9', weight: 2 },
  { name: 'Schubert: Symphony 9 in C Major', weight: 2 }, { name: 'Schubert: Trout Quintet', weight: 2 },
  { name: 'Shostakovich: Symphony No.5', weight: 4 }, { name: 'Sibelius: Symphony No.2', weight: 1 },
  { name: 'Smetana: Bartered Bride', weight: 4 }, { name: 'Smetana: Ma Vlast', weight: 1 },
  { name: 'Strauss: Ein Heldenleben', weight: 1 }, { name: 'Strauss: Don Juan', weight: 1 }, { name: 'Strauss: Der Rosenkavalier Act 2 reh 3', weight: 1 },
  { name: 'Strauss: Salome act 2 reh 154', weight: 1 }, { name: 'Strauss: Also Sprach Zarathustra', weight: 1 }, { name: 'Strauss: Don Quixote', weight: 1 },
  { name: 'Stravinsky: Pulcinella', weight: 3 }, { name: 'Stravinsky: Rubies', weight: 1 },
  { name: 'Tchaikovsky: Nutcracker Suite', weight: 1 }, { name: 'Tchaikovsky: Serenade for Strings', weight: 1 }, { name: 'Tchaikovsky: Sleeping Beauty', weight: 1 },
  { name: 'Tchaikovsky: Symphony No.1', weight: 1 }, { name: 'Tchaikovsky: Symphony No.4', weight: 4 },
  { name: 'Tchaikovsky: Symphony No.5', weight: 2 }, { name: 'Tchaikovsky: Symphony No.6', weight: 1 },
  { name: 'Verdi: Falstaff (beginning of act 3)', weight: 1 }, { name: 'Verdi: La Forza Del Destino', weight: 1 },
  { name: 'Verdi: Otello', weight: 2 }, { name: 'Verdi: Rigoletto', weight: 1 }, { name: 'Wagner: Meistersinger Prelude', weight: 1 }
];

const KEYS = ['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab'];
const MODES = ['major', 'major', 'major', 'major', 'major', 'major', 'harmonic minor', 'melodic minor', 'whole tone', 'chromatic'];

const SHIFTPATTERNS = [
  'I-A-1-1', 'I-A-1-2', 'I-A-1-4', 'I-Bb-2-1', 'I-Bb-2-2', 'I-Bb-2-4', 'I-B-4-1', 'I-B-4-2', 'I-B-4-4',
  'II-E-1-1', 'II-E-1-2', 'II-E-1-4', 'II-F-2-1', 'II-F-2-2', 'II-F-2-4', 'II-F#-4-1', 'II-F#-4-2', 'II-F#-4-4',
  'III-B-1-1', 'III-B-1-2', 'III-B-1-4', 'III-C-2-1', 'III-C-2-2', 'III-C-2-4', 'III-C#-4-1', 'III-C#-4-2', 'III-C#-4-4',
  'IV-F#-1-1', 'IV-F#-1-2', 'IV-F#-1-4', 'IV-G-2-1', 'IV-G-2-2', 'IV-G-2-4', 'IV-G#-4-1', 'IV-G#-4-2', 'IV-G#-4-4'
];

// 2. LOCAL STORAGE MANAGEMENT
function loadData() {
  const defaults = {
    userFields: { concerto: '', bach: '', otherSolo: '' },
    pools: { strauss: DEFAULT_STRAUSS, excerpts: DEFAULT_EXCERPTS },
    settings: { excerptCount: 5 }
  };
  const data = localStorage.getItem('practiceAppData');
  if (!data) return defaults;
  const parsed = JSON.parse(data);
  // Ensure we have all properties to avoid crashes
  return {
    userFields: { ...defaults.userFields, ...(parsed.userFields || {}) },
    pools: { ...defaults.pools, ...(parsed.pools || {}) },
    settings: { ...defaults.settings, ...(parsed.settings || {}) }
  };
}

function saveData(data) {
  localStorage.setItem('practiceAppData', JSON.stringify(data));
}

// 3. GENERATIVE LOGIC
function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getWeightedItem(pool, exclude = []) {
  const filteredPool = pool.filter(item => !exclude.includes(item.name));
  if (filteredPool.length === 0) return null;
  
  let totalWeight = filteredPool.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (let item of filteredPool) {
    if (random < item.weight) return item.name;
    random -= item.weight;
  }
  return filteredPool[filteredPool.length - 1].name;
}

function getUniqueSamples(pool, count, exclude = []) {
  let results = [];
  let currentExclude = [...exclude];
  for (let i = 0; i < count; i++) {
    let pick = getWeightedItem(pool, currentExclude);
    if (pick) {
      results.push(pick);
      currentExclude.push(pick);
    }
  }
  return results;
}

function getTodayString() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

// 4. DAILY STATE GENERATION
window.practiceAppData = loadData();

window.generateDailyList = function(force = false) {
  const todayStr = getTodayString();
  const savedState = localStorage.getItem('practiceDailyState');
  let state = savedState ? JSON.parse(savedState) : null;
  
  if (!state || state.date !== todayStr || force) {
    const todays_key = getRandomItem(KEYS) + " " + getRandomItem(MODES);
    const todays_strauss = getWeightedItem(window.practiceAppData.pools.strauss) || "No Strauss selected";
    
    const todays_excerpts = getUniqueSamples(window.practiceAppData.pools.excerpts, window.practiceAppData.settings.excerptCount, [todays_strauss]);
    
    const fallbackExcerpts = [...todays_excerpts];
    while(fallbackExcerpts.length < 5) fallbackExcerpts.push("None");

    const shift1 = getRandomItem(SHIFTPATTERNS);
    let shift2 = getRandomItem(SHIFTPATTERNS);
    while(shift1 === shift2) shift2 = getRandomItem(SHIFTPATTERNS);

    state = {
      date: todayStr,
      todays_key,
      todays_strauss,
      todays_excerpts: fallbackExcerpts,
      actual_excerpts: todays_excerpts, // Keep track of the dynamically generated count
      shift1,
      shift2,
      checked: {}
    };
    localStorage.setItem('practiceDailyState', JSON.stringify(state));
  }
  window.dailyState = state;
  return state;
}

window.generateDailyList();

// 5. GLOBALS FOR BACKWARDS COMPATIBILITY
window.todays_key = window.dailyState.todays_key;
window.todays_strauss = window.dailyState.todays_strauss;
window.todays_excerpt = window.dailyState.todays_excerpts[0];
window.todays_excerpt2 = window.dailyState.todays_excerpts[1];
window.todays_excerpt3 = window.dailyState.todays_excerpts[2];
window.todays_excerpt4 = window.dailyState.todays_excerpts[3];
window.todays_excerpt5 = window.dailyState.todays_excerpts[4];
window.todays_shiftpattern = window.dailyState.shift1;
window.todays_shiftpattern2 = window.dailyState.shift2;
window.mandatory = ['Schoenberg Verkarte Nacht', 'Mozart 35', 'Brahms 2', 'Schubert 9'];
