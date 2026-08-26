'use strict';

/* =========================================================
   1. DATA — все методы bot.send_*
========================================================= */
const METHODS = [
  {
    id: 'message', emoji: '📝', fn: 'send_message', title: 'send_message()',
    desc: 'Отправляет обычное текстовое сообщение пользователю. Самый базовый и самый частый метод в любом боте.',
    code: `bot.send_message(
    message.chat.id,
    "Привет!"
)`,
    note: null, preview: 'text'
  },
  {
    id: 'photo', emoji: '🖼', fn: 'send_photo', title: 'send_photo()',
    desc: 'Отправляет фотографию. Можно передать файл, ссылку или file_id, а также подпись через caption.',
    code: `bot.send_photo(
    message.chat.id,
    "photo.jpg"
)

# с подписью
bot.send_photo(
    message.chat.id,
    "photo.jpg",
    caption="Вот наше фото 📸"
)`,
    note: null, preview: 'photo'
  },
  {
    id: 'video', emoji: '🎥', fn: 'send_video', title: 'send_video()',
    desc: 'Отправляет видеофайл. Telegram сам сгенерирует превью и покажет плеер в чате.',
    code: `bot.send_video(
    message.chat.id,
    "video.mp4"
)`,
    note: null, preview: 'video'
  },
  {
    id: 'audio', emoji: '🎵', fn: 'send_audio', title: 'send_audio()',
    desc: 'Отправляет аудиофайл (музыку). Появляется как трек с плеером — можно указать title и performer.',
    code: `bot.send_audio(
    message.chat.id,
    "song.mp3"
)`,
    note: null, preview: 'audio'
  },
  {
    id: 'voice', emoji: '🎤', fn: 'send_voice', title: 'send_voice()',
    desc: 'Отправляет голосовое сообщение в формате .ogg — отображается как компактная волна, как в реальных войсах.',
    code: `bot.send_voice(
    message.chat.id,
    "voice.ogg"
)`,
    note: null, preview: 'voice'
  },
  {
    id: 'document', emoji: '📄', fn: 'send_document', title: 'send_document()',
    desc: 'Отправляет любой файл как документ: PDF, ZIP, DOCX и так далее — с иконкой и названием файла.',
    code: `bot.send_document(
    message.chat.id,
    "lesson.pdf"
)`,
    note: null, preview: 'document'
  },
  {
    id: 'animation', emoji: '🎞', fn: 'send_animation', title: 'send_animation()',
    desc: 'Отправляет GIF или MP4 без звука, которое воспроизводится по кругу прямо в чате.',
    code: `bot.send_animation(
    message.chat.id,
    "animation.gif"
)`,
    note: null, preview: 'animation'
  },
  {
    id: 'sticker', emoji: '😎', fn: 'send_sticker', title: 'send_sticker()',
    desc: 'Отправляет стикер. В отличие от фото и видео, для стикеров почти всегда используют готовый file_id.',
    code: `bot.send_sticker(
    message.chat.id,
    "STICKER_FILE_ID"
)`,
    note: 'Для sticker обычно используется Telegram <b>file_id</b>, а не путь к локальному файлу.',
    preview: 'sticker'
  },
  {
    id: 'location', emoji: '📍', fn: 'send_location', title: 'send_location()',
    desc: 'Отправляет геолокацию на карте по координатам широты и долготы.',
    code: `bot.send_location(
    message.chat.id,
    latitude=42.8746,
    longitude=74.5698
)`,
    note: null, preview: 'location'
  },
  {
    id: 'contact', emoji: '👤', fn: 'send_contact', title: 'send_contact()',
    desc: 'Отправляет визитку контакта — номер телефона и имя, которые можно сразу сохранить.',
    code: `bot.send_contact(
    message.chat.id,
    phone_number="+996700123456",
    first_name="Aiperi"
)`,
    note: null, preview: 'contact'
  },
  {
    id: 'poll', emoji: '📊', fn: 'send_poll', title: 'send_poll()',
    desc: 'Отправляет опрос с вариантами ответа. Пользователи в чате могут проголосовать прямо в Telegram.',
    code: `bot.send_poll(
    message.chat.id,
    "Какой язык программирования нравится?",
    ["Python", "JavaScript", "C++"]
)`,
    note: null, preview: 'poll'
  }
];

const TOTAL_METHODS = METHODS.length;

/* =========================================================
   2. SYNTAX HIGHLIGHTING (lightweight, regex-based)
========================================================= */
function escapeHtml(s){
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function highlightCode(raw){
  let s = escapeHtml(raw);
  s = s.replace(/(#.*)$/gm, '<span class="tok-com">$1</span>');
  s = s.replace(/"([^"]*)"/g, '<span class="tok-str">"$1"</span>');
  s = s.replace(/\b(\d+\.?\d*)\b/g, '<span class="tok-num">$1</span>');
  s = s.replace(/\b([a-zA-Z_]\w*)\(/g, '<span class="tok-fn">$1</span>(');
  s = s.replace(/\b(latitude|longitude|caption|phone_number|first_name|performer|title)=/g, '<span class="tok-arg">$1</span>=');
  return s;
}
function buildCodeTable(raw){
  const lines = raw.split('\n');
  let rows = '';
  lines.forEach((line, i) => {
    rows += `<tr><td class="ln">${i + 1}</td><td class="code">${highlightCode(line) || ' '}</td></tr>`;
  });
  return `<table>${rows}</table>`;
}

/* =========================================================
   3. RENDER METHOD CARDS
========================================================= */
const methodsRoot = document.getElementById('methodsRoot');

function renderMethods(){
  const html = METHODS.map(m => `
    <section class="method-block" id="${m.id}" data-search="${m.id} ${m.fn} ${m.title}">
      <div class="method-card">
        <div class="method-icon">${m.emoji}</div>
        <div class="method-head">
          <span class="method-name"><span class="fn">bot.${m.fn}</span>()</span>
        </div>
        <p class="method-desc">${m.desc}</p>

        <div class="code-block">
          <div class="code-toolbar">
            <div class="code-dots"><span></span><span></span><span></span></div>
            <button class="copy-btn" data-copy="${m.id}">📋 Copy</button>
          </div>
          <div class="code-pre" id="code-${m.id}">${buildCodeTable(m.code)}</div>
        </div>

        <div class="method-actions">
          <button class="try-btn" data-try="${m.id}">▶ Try Example</button>
          ${m.note ? `<span class="method-note">💡 ${m.note}</span>` : ''}
        </div>
      </div>
    </section>
  `).join('');
  methodsRoot.innerHTML = html;
}
renderMethods();

/* =========================================================
   4. PROGRESS (localStorage)
========================================================= */
const STORAGE_KEY = 'tgAcademyProgress_v1';

function loadProgress(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function saveProgress(list){
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
}
let viewed = new Set(loadProgress());

function updateProgressUI(){
  const count = viewed.size;
  const pct = Math.round((count / TOTAL_METHODS) * 100);
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressLabel').textContent = `${count} / ${TOTAL_METHODS}`;
  document.getElementById('heroProgressText').textContent = `${count} / ${TOTAL_METHODS} изучено`;
  METHODS.forEach(m => {
    const check = document.getElementById('check-' + m.id);
    if (check) check.classList.toggle('done', viewed.has(m.id));
  });
}
function markViewed(id){
  if (!viewed.has(id)){
    viewed.add(id);
    saveProgress([...viewed]);
    updateProgressUI();
  }
}
updateProgressUI();

document.getElementById('resetProgress').addEventListener('click', () => {
  viewed = new Set();
  saveProgress([]);
  updateProgressUI();
});

/* =========================================================
   5. SIDEBAR NAV + MOBILE MENU
========================================================= */
const sidebar = document.getElementById('sidebar');
const backdrop = document.getElementById('sidebarBackdrop');
const menuToggle = document.getElementById('menuToggle');

function openSidebar(){ sidebar.classList.add('open'); backdrop.classList.add('show'); }
function closeSidebar(){ sidebar.classList.remove('open'); backdrop.classList.remove('show'); }
menuToggle.addEventListener('click', () => {
  sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
});
backdrop.addEventListener('click', closeSidebar);

const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    navItems.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    closeSidebar();
  });
});

// Highlight active nav item on scroll
const observedSections = [document.getElementById('hero'), ...METHODS.map(m => document.getElementById(m.id))];
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      const id = entry.target.id;
      navItems.forEach(b => b.classList.toggle('active', b.dataset.target === id));
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });
observedSections.forEach(sec => sec && io.observe(sec));

document.getElementById('heroStart').addEventListener('click', () => {
  document.getElementById('message').scrollIntoView({ behavior: 'smooth' });
});

/* =========================================================
   6. SEARCH
========================================================= */
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  METHODS.forEach(m => {
    const block = document.getElementById(m.id);
    const navBtn = document.querySelector(`.nav-item[data-target="${m.id}"]`);
    const haystack = (block.dataset.search || '').toLowerCase();
    const match = q === '' || haystack.includes(q);
    block.classList.toggle('filtered-out', !match);
    if (navBtn) navBtn.classList.toggle('hidden', !match);
  });
  document.getElementById('hero').style.display = q === '' ? '' : 'none';
});

/* =========================================================
   7. COPY TO CLIPBOARD
========================================================= */
const toast = document.getElementById('toast');
let toastTimer = null;
function showToast(msg){
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1600);
}

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.copy-btn');
  if (!btn) return;
  const method = METHODS.find(m => m.id === btn.dataset.copy);
  if (!method) return;
  const text = method.code;
  const done = () => showToast('Copied! ✓');
  if (navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
  } else {
    fallbackCopy(text, done);
  }
});
function fallbackCopy(text, cb){
  const ta = document.createElement('textarea');
  ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); } catch {}
  document.body.removeChild(ta);
  cb();
}

/* =========================================================
   8. LIVE TELEGRAM PREVIEW
========================================================= */
const tgChat = document.getElementById('tgChat');

function nowTime(){
  const d = new Date();
  return d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
}

function previewInner(type){
  switch(type){
    case 'text':
      return `Привет!<span class="tg-time">${nowTime()}</span>`;
    case 'photo':
      return `<div class="tg-photo"><div class="tg-photo-mock">🖼</div></div>Вот наше фото 📸<span class="tg-time">${nowTime()}</span>`;
    case 'video':
      return `<div class="tg-video-mock"></div>video.mp4<span class="tg-time">${nowTime()}</span>`;
    case 'audio':
      return `<div class="tg-audio-mock"><div class="tg-play">▶</div><div class="tg-waveform"></div></div>song.mp3<span class="tg-time">${nowTime()}</span>`;
    case 'voice':
      return `<div class="tg-voice-mock"><div class="tg-play">▶</div><div class="tg-waveform"></div></div>0:07<span class="tg-time">${nowTime()}</span>`;
    case 'document':
      return `<div class="tg-doc-mock"><div class="tg-doc-icon">📄</div><div><div class="tg-doc-name">lesson.pdf</div><div class="tg-doc-sub">240 KB</div></div></div><span class="tg-time">${nowTime()}</span>`;
    case 'animation':
      return `<div class="tg-photo"><div class="tg-photo-mock">🎞</div></div>animation.gif<span class="tg-time">${nowTime()}</span>`;
    case 'sticker':
      return `<div class="tg-sticker-mock">😎</div><span class="tg-time">${nowTime()}</span>`;
    case 'location':
      return `<div class="tg-map-mock"><div class="tg-map-pin">📍</div></div>Бишкек, Кыргызстан<span class="tg-time">${nowTime()}</span>`;
    case 'contact':
      return `<div class="tg-contact-mock"><div class="tg-contact-avatar">👤</div><div><div class="tg-doc-name">Aiperi</div><div class="tg-doc-sub">+996 700 123 456</div></div></div><span class="tg-time">${nowTime()}</span>`;
    case 'poll':
      return `<div class="tg-poll-mock"><div class="tg-poll-q">Какой язык программирования нравится?</div>
        <div class="tg-poll-opt"><span class="dot"></span>Python</div>
        <div class="tg-poll-opt"><span class="dot"></span>JavaScript</div>
        <div class="tg-poll-opt"><span class="dot"></span>C++</div></div><span class="tg-time">${nowTime()}</span>`;
    default:
      return `Готово<span class="tg-time">${nowTime()}</span>`;
  }
}

function pushPreview(type, outgoing = true){
  const wrap = document.createElement('div');
  wrap.className = 'tg-msg ' + (outgoing ? 'tg-out' : 'tg-in');
  wrap.innerHTML = `<div class="tg-bubble">${previewInner(type)}</div>`;
  tgChat.appendChild(wrap);
  tgChat.scrollTop = tgChat.scrollHeight;
}

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.try-btn');
  if (!btn) return;
  const method = METHODS.find(m => m.id === btn.dataset.try);
  if (!method) return;
  pushPreview(method.preview, true);
  markViewed(method.id);
  const status = document.getElementById('tgStatus');
  status.textContent = 'typing…';
  setTimeout(() => status.textContent = 'online', 900);
});

/* =========================================================
   9. QUIZ
========================================================= */
const QUIZ = [
  { q: 'Как отправить фото?', options: ['bot.send_message()', 'bot.send_photo()', 'bot.send_image()'], correct: 1 },
  { q: 'Каким методом отправляется голосовое сообщение?', options: ['bot.send_audio()', 'bot.send_sound()', 'bot.send_voice()'], correct: 2 },
  { q: 'Что обычно передают в send_sticker() вместо пути к файлу?', options: ['URL картинки', 'file_id стикера', 'HTML-код'], correct: 1 },
  { q: 'Какие параметры обязательны для bot.send_location()?', options: ['latitude и longitude', 'address и city', 'photo и caption'], correct: 0 },
  { q: 'Каким методом отправить документ (например, PDF)?', options: ['bot.send_file()', 'bot.send_document()', 'bot.send_pdf()'], correct: 1 },
];

const quizCard = document.getElementById('quizCard');
let quizIndex = 0;
let quizScore = 0;
let quizAnswered = false;

function renderQuizProgress(){
  let bars = '';
  for (let i = 0; i < QUIZ.length; i++){
    let cls = '';
    if (i < quizIndex) cls = 'done';
    else if (i === quizIndex) cls = 'current';
    bars += `<span class="${cls}"></span>`;
  }
  return `<div class="quiz-progress">${bars}</div>`;
}

function renderQuizQuestion(){
  quizAnswered = false;
  const item = QUIZ[quizIndex];
  const letters = ['A', 'B', 'C'];
  quizCard.innerHTML = `
    ${renderQuizProgress()}
    <div class="quiz-question">${quizIndex + 1}. ${item.q}</div>
    <div class="quiz-options">
      ${item.options.map((opt, i) => `<button class="quiz-option" data-i="${i}"><b>${letters[i]})</b> ${opt}</button>`).join('')}
    </div>
    <div class="quiz-feedback" id="quizFeedback"></div>
  `;
  quizCard.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => handleQuizAnswer(parseInt(btn.dataset.i)));
  });
}

function handleQuizAnswer(i){
  if (quizAnswered) return;
  quizAnswered = true;
  const item = QUIZ[quizIndex];
  const options = quizCard.querySelectorAll('.quiz-option');
  options.forEach(o => o.disabled = true);
  const feedback = document.getElementById('quizFeedback');
  if (i === item.correct){
    options[i].classList.add('correct');
    feedback.textContent = '✓ Correct!';
    feedback.className = 'quiz-feedback ok';
    quizScore++;
  } else {
    options[i].classList.add('wrong');
    options[item.correct].classList.add('correct');
    feedback.textContent = '✗ Try again';
    feedback.className = 'quiz-feedback no';
  }
  const nextBtn = document.createElement('button');
  nextBtn.className = 'quiz-next';
  nextBtn.textContent = quizIndex < QUIZ.length - 1 ? 'Следующий вопрос →' : 'Показать результат';
  nextBtn.addEventListener('click', () => {
    quizIndex++;
    if (quizIndex < QUIZ.length) renderQuizQuestion();
    else renderQuizResult();
  });
  quizCard.appendChild(nextBtn);
}

function renderQuizResult(){
  quizCard.innerHTML = `
    <div class="quiz-result">
      <div class="score">${quizScore} / ${QUIZ.length}</div>
      <p>${quizScore === QUIZ.length ? 'Отлично! Ты знаешь все методы 🎉' : 'Хороший результат — можно повторить сложные темы.'}</p>
      <button class="quiz-next" id="quizRestart">Пройти заново</button>
    </div>
  `;
  document.getElementById('quizRestart').addEventListener('click', () => {
    quizIndex = 0; quizScore = 0; renderQuizQuestion();
  });
}
renderQuizQuestion();

/* =========================================================
   10. FINAL CHALLENGE
========================================================= */
const SCENARIOS = [
  {
    command: '/photo',
    types: [['📄 Документ', false], ['🖼 Фото', true], ['📍 Локацию', false]],
    methods: [['bot.send_document()', false], ['bot.send_photo()', true], ['bot.send_video()', false]],
    files: [['song.mp3', false], ['photo.jpg', true], ['voice.ogg', false]],
    texts: [['Вот твой файл', false], ['Вот наше фото 📸', true], ['Голосовое получено', false]],
  },
  {
    command: '/pdf',
    types: [['📄 Документ', true], ['🎥 Видео', false], ['😎 Стикер', false]],
    methods: [['bot.send_document()', true], ['bot.send_sticker()', false], ['bot.send_audio()', false]],
    files: [['lesson.pdf', true], ['animation.gif', false], ['photo.jpg', false]],
    texts: [['Держи документ 📄', true], ['Вот стикер', false], ['Это видео', false]],
  },
  {
    command: '/where',
    types: [['📍 Локацию', true], ['📊 Опрос', false], ['🎵 Аудио', false]],
    methods: [['bot.send_location()', true], ['bot.send_poll()', false], ['bot.send_contact()', false]],
    files: [['latitude=42.87, longitude=74.57', true], ['song.mp3', false], ['photo.jpg', false]],
    texts: [['Вот моя геолокация 📍', true], ['Опрос запущен', false], ['Файл отправлен', false]],
  },
];

let scenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
const selection = { type: null, method: null, file: null, text: null };

function renderStepOptions(containerId, list, stepKey){
  const el = document.getElementById(containerId);
  el.innerHTML = list.map((item, i) =>
    `<button class="step-opt" data-step="${stepKey}" data-i="${i}" data-correct="${item[1]}">${item[0]}</button>`
  ).join('');
}

function renderChallenge(){
  document.getElementById('challengeCommand').textContent = scenario.command;
  selection.type = selection.method = selection.file = selection.text = null;
  renderStepOptions('stepType', scenario.types, 'type');
  renderStepOptions('stepMethod', scenario.methods, 'method');
  renderStepOptions('stepFile', scenario.files, 'file');
  renderStepOptions('stepText', scenario.texts, 'text');
  document.getElementById('challengeResultCode').textContent = '// Собери шаги выше 👆';
  document.getElementById('challengeVerdict').textContent = '';
  document.getElementById('challengeVerdict').className = 'challenge-verdict';
}
renderChallenge();

document.getElementById('challengeSteps').addEventListener('click', (e) => {
  const btn = e.target.closest('.step-opt');
  if (!btn) return;
  const step = btn.dataset.step;
  document.querySelectorAll(`.step-opt[data-step="${step}"]`).forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selection[step] = { text: btn.textContent, correct: btn.dataset.correct === 'true' };
  checkChallenge();
});

function checkChallenge(){
  const { type, method, file, text } = selection;
  if (!type || !method || !file || !text) return;
  const code = `bot.${method.text.replace('()','')}(
    message.chat.id,
    "${file.text}",
    caption="${text.text}"
)`;
  document.getElementById('challengeResultCode').textContent = code.replace('bot.bot.', 'bot.');
  const allCorrect = type.correct && method.correct && file.correct && text.correct;
  const verdict = document.getElementById('challengeVerdict');
  if (allCorrect){
    verdict.textContent = '✓ Отлично! Именно так бот ответит на ' + scenario.command;
    verdict.className = 'challenge-verdict ok';
    pushPreview(scenario.types.find(t => t[1])[0].includes('Фото') ? 'photo' :
                scenario.command === '/pdf' ? 'document' : 'location', true);
  } else {
    verdict.textContent = '✗ Похоже, что-то выбрано неверно — попробуй ещё раз';
    verdict.className = 'challenge-verdict';
    verdict.style.color = 'var(--accent-red)';
  }
}

/* =========================================================
   11. INIT
========================================================= */
navItems[0] && navItems[0].classList.add('active');
