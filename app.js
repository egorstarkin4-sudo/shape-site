// Shape Visuals Client Page Logic & Supabase Authentication System

/* ==========================================================================
   Supabase Configuration
   ========================================================================== */
const SUPABASE_CONFIG = {
  url: "https://psowlftvhxaluzkahpin.supabase.co",
  anonKey: "sb_publishable_O_7uorZhbROJ4WbSIrIFHA_PpxD0kRo"
};

// Check if actual Supabase keys are configured
const cleanUrl = SUPABASE_CONFIG.url.replace(/\/rest\/v1\/?$/, '').trim();
const isSupabaseConfigured = 
  cleanUrl !== "YOUR_SUPABASE_URL" && 
  SUPABASE_CONFIG.anonKey !== "YOUR_SUPABASE_ANON_KEY" &&
  typeof window.supabase !== "undefined";

let supabaseClient = null;
if (isSupabaseConfigured) {
  try {
    supabaseClient = window.supabase.createClient(cleanUrl, SUPABASE_CONFIG.anonKey.trim());
    console.log("Supabase успешно подключен к проекту:", cleanUrl);
  } catch (err) {
    console.error("Ошибка инициализации Supabase:", err);
  }
}

// 1. Geometric Canvas Background Effect
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');

let particlesArray = [];
const mouse = {
  x: null,
  y: null,
  radius: 150
};

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

window.addEventListener('mousemove', (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

window.addEventListener('mouseout', () => {
  mouse.x = null;
  mouse.y = null;
});

class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    if (this.x > canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > canvas.height || this.y < 0) {
      this.directionY = -this.directionY;
    }

    this.x += this.directionX;
    this.y += this.directionY;
    this.draw();
  }
}

function initParticles() {
  particlesArray = [];
  const numberOfParticles = Math.floor((canvas.width * canvas.height) / 9000);
  for (let i = 0; i < numberOfParticles; i++) {
    const size = Math.random() * 2 + 1;
    const x = Math.random() * (canvas.width - size * 2) + size;
    const y = Math.random() * (canvas.height - size * 2) + size;
    const directionX = (Math.random() - 0.5) * 0.4;
    const directionY = (Math.random() - 0.5) * 0.4;
    const color = Math.random() > 0.5 ? 'rgba(168, 85, 247, 0.25)' : 'rgba(6, 182, 212, 0.2)';

    particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
  }
}

function connectParticles() {
  let opacityValue = 1;
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      const dx = particlesArray[a].x - particlesArray[b].x;
      const dy = particlesArray[a].y - particlesArray[b].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        opacityValue = 1 - distance / 100;
        ctx.strokeStyle = `rgba(168, 85, 247, ${opacityValue * 0.12})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }

    if (mouse.x && mouse.y) {
      const dxMouse = particlesArray[a].x - mouse.x;
      const dyMouse = particlesArray[a].y - mouse.y;
      const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
      if (distanceMouse < mouse.radius) {
        opacityValue = 1 - distanceMouse / mouse.radius;
        ctx.strokeStyle = `rgba(236, 72, 153, ${opacityValue * 0.18})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
  }
  connectParticles();
  requestAnimationFrame(animate);
}

initParticles();
animate();

window.addEventListener('resize', () => {
  initParticles();
});

// 2. FAQ Accordion Click Handler
document.querySelectorAll('.faq-question').forEach(question => {
  question.addEventListener('click', () => {
    const item = question.parentElement;
    const answer = item.querySelector('.faq-answer');
    const isActive = item.classList.contains('active');
    
    document.querySelectorAll('.faq-item').forEach(otherItem => {
      otherItem.classList.remove('active');
      otherItem.querySelector('.faq-answer').style.maxHeight = null;
    });

    if (!isActive) {
      item.classList.add('active');
      answer.style.maxHeight = answer.scrollHeight + "px";
    }
  });
});

// 3. Navigation & Smooth Scrolling
document.querySelectorAll('.scroll-link').forEach(button => {
  const scrollToTarget = () => {
    const target = document.querySelector(button.dataset.target);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };
  button.addEventListener('click', scrollToTarget);
  button.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      scrollToTarget();
    }
  });
});

document.querySelectorAll('.external-link').forEach(button => {
  button.addEventListener('click', () => {
    window.open(button.dataset.url, '_blank', 'noopener,noreferrer');
  });
});

// 4. Content Copy & Image Protection
document.addEventListener('contextmenu', (event) => event.preventDefault());
document.addEventListener('copy', (event) => event.preventDefault());
document.addEventListener('cut', (event) => event.preventDefault());
document.addEventListener('dragstart', (event) => event.preventDefault());
document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && ['a', 'c', 's', 'u'].includes(event.key.toLowerCase())) {
    event.preventDefault();
  }
});


/* ==========================================================================
   5. Authentication & Profile Dashboard Controller
   ========================================================================== */
const authModal = document.getElementById('auth-modal');
const profileModal = document.getElementById('profile-modal');
const btnOpenAuth = document.getElementById('btn-open-auth');
const btnOpenProfile = document.getElementById('btn-open-profile');
const btnCloseAuth = document.getElementById('btn-close-auth');
const btnCloseAuthAlt = document.getElementById('btn-close-auth-alt');
const btnCloseProfile = document.getElementById('btn-close-profile');
const btnCloseProfileAlt = document.getElementById('btn-close-profile-alt');
const tabLoginBtn = document.getElementById('tab-login-btn');
const tabRegisterBtn = document.getElementById('tab-register-btn');
const formLogin = document.getElementById('form-login');
const formRegister = document.getElementById('form-register');
const authAlert = document.getElementById('auth-alert');
const profileAlert = document.getElementById('profile-alert');
const btnDiscordLogin = document.getElementById('btn-discord-login');
const btnLogout = document.getElementById('btn-logout');
const btnResetHwid = document.getElementById('btn-reset-hwid');
const formRedeemKey = document.getElementById('form-redeem-key');
const inputLicenseKey = document.getElementById('input-license-key');
const adminGenBox = document.getElementById('admin-generator-box');
const btnAdminGenKey = document.getElementById('btn-admin-generate-key');
const selectKeyPlan = document.getElementById('select-key-plan');
const adminLastKeyDisplay = document.getElementById('admin-last-created-key');

// Current user state (Live or Demo fallback)
let currentUser = null;

// Helper: Show alert banner
function showAlert(el, message, type = 'error') {
  if (!el) return;
  el.textContent = message;
  el.className = `alert-msg ${type}`;
  el.style.display = 'block';
}

function clearAlert(el) {
  if (!el) return;
  el.style.display = 'none';
  el.textContent = '';
}

// Modal open/close helpers
function openModal(modal) {
  if (!modal) return;
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
}

// Open Auth & Profile -> Standalone page
if (btnOpenAuth) {
  btnOpenAuth.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'profile.html';
  });
}

if (btnOpenProfile) {
  btnOpenProfile.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'profile.html';
  });
}

// Close Buttons
if (btnCloseAuth) btnCloseAuth.addEventListener('click', () => closeModal(authModal));
if (btnCloseAuthAlt) btnCloseAuthAlt.addEventListener('click', () => closeModal(authModal));
if (btnCloseProfile) btnCloseProfile.addEventListener('click', () => closeModal(profileModal));
if (btnCloseProfileAlt) btnCloseProfileAlt.addEventListener('click', () => closeModal(profileModal));

// Close on Overlay Click
[authModal, profileModal].forEach(modal => {
  if (!modal) return;
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });
});

// Close on Escape Key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal(authModal);
    closeModal(profileModal);
  }
});

// Auth Tabs Switcher
function switchTab(tab) {
  clearAlert(authAlert);
  if (tab === 'login') {
    tabLoginBtn.classList.add('active');
    tabRegisterBtn.classList.remove('active');
    formLogin.classList.add('active');
    formRegister.classList.remove('active');
    document.getElementById('auth-modal-title').textContent = 'Вход в аккаунт';
  } else {
    tabRegisterBtn.classList.add('active');
    tabLoginBtn.classList.remove('active');
    formRegister.classList.add('active');
    formLogin.classList.remove('active');
    document.getElementById('auth-modal-title').textContent = 'Регистрация';
  }
}

if (tabLoginBtn) tabLoginBtn.addEventListener('click', () => switchTab('login'));
if (tabRegisterBtn) tabRegisterBtn.addEventListener('click', () => switchTab('register'));

// Update Header UI based on auth state
function updateHeaderAuth(user) {
  currentUser = user;
  if (user) {
    if (btnOpenAuth) btnOpenAuth.style.display = 'none';
    if (btnOpenProfile) {
      btnOpenProfile.style.display = 'inline-flex';
      const nickEl = document.getElementById('nav-user-nick');
      if (nickEl) {
        nickEl.textContent = user.user_metadata?.mc_nickname || user.email?.split('@')[0] || 'Кабинет';
      }
    }
  } else {
    if (btnOpenAuth) btnOpenAuth.style.display = 'block';
    if (btnOpenProfile) btnOpenProfile.style.display = 'none';
  }
}

// Render Profile Modal Data
async function fetchAndRenderProfile() {
  if (!currentUser) return;

  if (supabaseClient) {
    try {
      const email = currentUser.email;
      const nick = currentUser.user_metadata?.mc_nickname;
      
      let query = supabaseClient.from('profiles').select('*');
      if (email && nick) {
        query = query.or(`email.eq.${email},mc_nickname.ilike.${nick},id.eq.${currentUser.id}`);
      } else if (email) {
        query = query.or(`email.eq.${email},id.eq.${currentUser.id}`);
      } else {
        query = query.eq('id', currentUser.id);
      }
      
      const { data: profs, error } = await query.limit(1);

      if (profs && profs.length > 0) {
        const prof = profs[0];
        if (!currentUser.user_metadata) currentUser.user_metadata = {};
        currentUser.user_metadata.hwid = (prof.hwid && prof.hwid !== 'null') ? prof.hwid : null;
        
        const isDbActive = prof.subscription_active === true || prof.subscription_active === 'true' || 
          (prof.subscription_until && prof.subscription_until !== 'Не активна' && prof.subscription_until !== 'Требуется активация ключа');
        currentUser.user_metadata.subscription_active = isDbActive;
        
        if (prof.subscription_until) currentUser.user_metadata.subscription_until = prof.subscription_until;
        if (prof.mc_nickname) currentUser.user_metadata.mc_nickname = prof.mc_nickname;
      }
    } catch (err) {
      console.warn("Error fetching latest profile:", err);
    }
  }

  renderProfileData();
}

function renderProfileData() {
  if (!currentUser) return;
  
  const nickname = currentUser.user_metadata?.mc_nickname || currentUser.email?.split('@')[0] || 'Player';
  const email = currentUser.email || 'Не указан';
  const hwid = currentUser.user_metadata?.hwid || 'Не привязан';
  
  const rawSubActive = currentUser.user_metadata?.subscription_active;
  const rawSubUntil = currentUser.user_metadata?.subscription_until;
  
  const subActive = rawSubActive === true || rawSubActive === 'true' || 
    (rawSubUntil && rawSubUntil !== 'Не активна' && rawSubUntil !== 'Требуется активация ключа');
  
  const subExpiry = rawSubUntil || (subActive ? 'Навсегда (Lifetime)' : 'Требуется активация ключа');

  // Update DOM elements
  const nickEl = document.getElementById('profile-username');
  const emailEl = document.getElementById('profile-email');
  const avatarEl = document.getElementById('profile-mc-avatar');
  const subBadge = document.getElementById('profile-sub-badge');
  const subExpiryEl = document.getElementById('profile-sub-expiry');
  const hwidValEl = document.getElementById('profile-hwid-val');

  if (nickEl) nickEl.textContent = nickname;
  if (emailEl) emailEl.textContent = email;
  if (avatarEl) {
    avatarEl.src = `https://minotar.net/avatar/${encodeURIComponent(nickname)}/80.png`;
  }

  if (subBadge) {
    if (subActive) {
      subBadge.textContent = 'Активна';
      subBadge.className = 'card-status-badge';
    } else {
      subBadge.textContent = 'Не активна';
      subBadge.className = 'card-status-badge inactive';
    }
  }

  if (subExpiryEl) {
    subExpiryEl.textContent = subActive ? `Действует: ${subExpiry}` : 'Требуется активация ключа';
  }

  if (hwidValEl) {
    hwidValEl.textContent = hwid;
  }

  // Show admin generator box & HWID reset button strictly for admin
  const isAdmin = email === 'gorwok.h@yandex.ru' || currentUser.user_metadata?.role === 'Admin';
  if (adminGenBox) {
    adminGenBox.style.display = isAdmin ? 'block' : 'none';
  }
  if (btnResetHwid) {
    btnResetHwid.style.display = isAdmin ? 'flex' : 'none';
  }

  // Show client download box for anyone with active subscription (and admin)
  const dlBox = document.getElementById('profile-download-box');
  if (dlBox) {
    dlBox.style.display = (subActive || isAdmin) ? 'block' : 'none';
  }
}

// --------------------------------------------------------------------------
// Login Handler
// --------------------------------------------------------------------------
if (formLogin) {
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAlert(authAlert);
    const loginInput = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const submitBtn = document.getElementById('login-submit-btn');

    if (!loginInput) {
      showAlert(authAlert, 'Пожалуйста, укажите ваш Email или игровой никнейм.', 'error');
      return;
    }

    if (!password) {
      showAlert(authAlert, 'Пожалуйста, введите пароль от аккаунта.', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Проверка...';

    // Determine if input is email or nickname
    let targetEmail = loginInput;

    if (supabaseClient) {
      // Live Supabase Auth
      try {
        // If user entered nickname instead of email, look up their email in database
        if (!loginInput.includes('@')) {
          try {
            const { data: userProfiles, error: pErr } = await supabaseClient
              .from('profiles')
              .select('email')
              .ilike('mc_nickname', loginInput.trim())
              .limit(1);

            if (userProfiles && userProfiles.length > 0 && userProfiles[0].email) {
              targetEmail = userProfiles[0].email;
            } else {
              showAlert(authAlert, `Игрок с никнеймом "${loginInput}" не найден в базе. Войдите по Email или зарегистрируйтесь.`, 'error');
              submitBtn.disabled = false;
              submitBtn.textContent = 'Войти в аккаунт';
              return;
            }
          } catch (err) {
            console.error("Profile lookup error:", err);
          }
        }

        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: targetEmail,
          password: password
        });

        if (error) {
          let userMsg = error.message;
          if (error.message.includes('Invalid login credentials')) {
            userMsg = 'Неверный логин или пароль.';
          } else if (error.message.includes('Email not confirmed')) {
            userMsg = 'Почта не подтверждена. Отключите "Confirm email" в настройках Supabase или подтвердите пользователя в панели.';
          }
          showAlert(authAlert, userMsg, 'error');
        } else {
          showAlert(authAlert, 'Успешный вход! Загрузка профиля...', 'success');
          // Sync profile to table if missing
          try {
            const nick = data.user.user_metadata?.mc_nickname || loginInput;
            await supabaseClient.from('profiles').upsert([
              {
                id: data.user.id,
                email: data.user.email,
                mc_nickname: nick,
                subscription_active: data.user.user_metadata?.subscription_active === true,
                subscription_until: data.user.user_metadata?.subscription_until || 'Не активна'
              }
            ], { onConflict: 'id' });
          } catch (ignored) {}

          setTimeout(() => {
            closeModal(authModal);
            updateHeaderAuth(data.user);
          }, 700);
        }
      } catch (err) {
        showAlert(authAlert, 'Ошибка связи с сервером.', 'error');
      }
    } else {
      // Demo / Local Mode (when Supabase keys are not entered yet)
      setTimeout(() => {
        const demoUser = {
          id: 'demo-' + Date.now(),
          email: targetEmail.includes('@') ? targetEmail : `${targetEmail}@shape.client`,
          user_metadata: {
            mc_nickname: loginInput.replace('@', '_'),
            hwid: 'HWID-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
            subscription_active: false,
            subscription_until: 'Не активна'
          }
        };
        localStorage.setItem('shape_demo_user', JSON.stringify(demoUser));
        showAlert(authAlert, 'Успешный вход! (Демо-режим)', 'success');
        setTimeout(() => {
          closeModal(authModal);
          updateHeaderAuth(demoUser);
        }, 600);
      }, 400);
    }

    submitBtn.disabled = false;
    submitBtn.textContent = 'Войти в аккаунт';
  });
}

// --------------------------------------------------------------------------
// Register Handler
// --------------------------------------------------------------------------
if (formRegister) {
  formRegister.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAlert(authAlert);
    const nickname = document.getElementById('reg-nickname').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const passwordConfirm = document.getElementById('reg-password-confirm').value;
    const submitBtn = document.getElementById('reg-submit-btn');

    if (!nickname) {
      showAlert(authAlert, 'Пожалуйста, введите ваш никнейм в Minecraft.', 'error');
      return;
    }

    if (!email || !email.includes('@') || !email.includes('.')) {
      showAlert(authAlert, 'Введите корректный адрес электронной почты (например: name@mail.ru).', 'error');
      return;
    }

    if (password.length < 6) {
      showAlert(authAlert, 'Пароль должен содержать минимум 6 символов.', 'error');
      return;
    }

    if (password !== passwordConfirm) {
      showAlert(authAlert, 'Введенные пароли не совпадают!', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Создание аккаунта...';

    if (supabaseClient) {
      // Live Supabase Sign Up
      try {
        const { data, error } = await supabaseClient.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              mc_nickname: nickname,
              hwid: null,
              subscription_active: false,
              subscription_until: 'Не активна'
            }
          }
        });

        if (error) {
          showAlert(authAlert, `Ошибка регистрации: ${error.message}`, 'error');
        } else {
          // Save to profiles table
          if (data.user) {
            try {
              await supabaseClient.from('profiles').upsert([
                {
                  id: data.user.id,
                  email: email,
                  mc_nickname: nickname,
                  hwid: null,
                  subscription_active: false,
                  subscription_until: 'Не активна'
                }
              ]);
            } catch (err) {
              console.warn("Could not insert profile:", err);
            }
          }

          showAlert(authAlert, 'Аккаунт успешно создан!', 'success');
          if (data.user) {
            setTimeout(() => {
              closeModal(authModal);
              updateHeaderAuth(data.user);
            }, 800);
          }
        }
      } catch (err) {
        showAlert(authAlert, 'Ошибка создания аккаунта на сервере.', 'error');
      }
    } else {
      // Demo / Local Mode
      setTimeout(() => {
        const demoUser = {
          id: 'demo-' + Date.now(),
          email: email,
          user_metadata: {
            mc_nickname: nickname,
            hwid: null,
            subscription_active: false,
            subscription_until: 'Не активна'
          }
        };
        localStorage.setItem('shape_demo_user', JSON.stringify(demoUser));
        showAlert(authAlert, 'Аккаунт успешно создан! (Демо-режим)', 'success');
        setTimeout(() => {
          closeModal(authModal);
          updateHeaderAuth(demoUser);
        }, 800);
      }, 500);
    }

    submitBtn.disabled = false;
    submitBtn.textContent = 'Создать аккаунт';
  });
}

// --------------------------------------------------------------------------
// Key Redemption Handler (Активация ключа покупателем)
// --------------------------------------------------------------------------
if (formRedeemKey) {
  formRedeemKey.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    clearAlert(profileAlert);

    const keyInput = inputLicenseKey.value.trim().toUpperCase();
    if (!keyInput) {
      showAlert(profileAlert, 'Пожалуйста, введите лицензионный ключ.', 'error');
      return;
    }

    const btnRedeem = document.getElementById('btn-redeem-key');
    btnRedeem.disabled = true;
    btnRedeem.textContent = 'Проверка...';

    if (supabaseClient) {
      try {
        const { data: keys, error } = await supabaseClient
          .from('license_keys')
          .select('*')
          .eq('code', keyInput)
          .limit(1);

        if (error || !keys || keys.length === 0) {
          showAlert(profileAlert, 'Ключ не найден или введен неверно!', 'error');
        } else {
          const keyRecord = keys[0];
          if (keyRecord.is_used) {
            showAlert(profileAlert, 'Этот ключ уже был активирован ранее!', 'error');
          } else {
            // Check if key is a HWID Reset key
            const isHwidResetKey = keyRecord.duration_days === 0 || (keyRecord.code && keyRecord.code.startsWith('SHAPE-RESET-'));

            if (isHwidResetKey) {
              // Mark key as used
              await supabaseClient
                .from('license_keys')
                .update({
                  is_used: true,
                  used_by: currentUser.user_metadata?.mc_nickname || currentUser.email
                })
                .eq('id', keyRecord.id);

              // Reset HWID in auth metadata
              await supabaseClient.auth.updateUser({
                data: { hwid: null }
              });

              // Reset HWID in profiles table
              try {
                await supabaseClient
                  .from('profiles')
                  .update({ hwid: null })
                  .eq('id', currentUser.id);
              } catch (e) {}

              currentUser.user_metadata.hwid = null;
              renderProfileData();
              inputLicenseKey.value = '';
              showAlert(profileAlert, '✓ Ключ сброса применен! Привязка HWID успешно сброшена. Новый ПК привяжется автоматически при первом запуске игры.', 'success');
            } else {
              // Regular Subscription Key
              let subText = 'Навсегда (Lifetime)';
              if (keyRecord.duration_days < 9000) {
                const expireDate = new Date();
                expireDate.setDate(expireDate.getDate() + keyRecord.duration_days);
                const day = String(expireDate.getDate()).padStart(2, '0');
                const month = String(expireDate.getMonth() + 1).padStart(2, '0');
                const year = expireDate.getFullYear();
                subText = `до ${day}.${month}.${year}`;
              }

              // Mark key as used
              await supabaseClient
                .from('license_keys')
                .update({
                  is_used: true,
                  used_by: currentUser.user_metadata?.mc_nickname || currentUser.email
                })
                .eq('id', keyRecord.id);

              // Update user metadata
              await supabaseClient.auth.updateUser({
                data: {
                  subscription_active: true,
                  subscription_until: subText
                }
              });

              // Sync with profiles table for client mod
              try {
                await supabaseClient
                  .from('profiles')
                  .update({
                    subscription_active: true,
                    subscription_until: subText
                  })
                  .eq('id', currentUser.id);
              } catch (err) {
                console.warn("Could not update profiles table:", err);
              }

              currentUser.user_metadata.subscription_active = true;
              currentUser.user_metadata.subscription_until = subText;
              renderProfileData();
              inputLicenseKey.value = '';
              showAlert(profileAlert, `✓ Поздравляем! Подписка успешно активирована (${subText})!`, 'success');
            }
          }
        }
      } catch (err) {
        showAlert(profileAlert, 'Ошибка связи с сервером при активации.', 'error');
      }
    } else {
      // Demo Mode Key Activation
      setTimeout(() => {
        if (keyInput.startsWith('SHAPE-RESET-')) {
          currentUser.user_metadata.hwid = 'Не привязан (Сброшено по ключу)';
          localStorage.setItem('shape_demo_user', JSON.stringify(currentUser));
          renderProfileData();
          inputLicenseKey.value = '';
          showAlert(profileAlert, '✓ Ключ сброса применен! HWID сброшен. (Демо-режим)', 'success');
        } else {
          currentUser.user_metadata.subscription_active = true;
          currentUser.user_metadata.subscription_until = 'Навсегда (Lifetime)';
          localStorage.setItem('shape_demo_user', JSON.stringify(currentUser));
          renderProfileData();
          inputLicenseKey.value = '';
          showAlert(profileAlert, '✓ Ключ успешно активирован! (Демо-режим)', 'success');
        }
      }, 500);
    }

    btnRedeem.disabled = false;
    btnRedeem.textContent = 'Применить';
  });
}

// --------------------------------------------------------------------------
// Custom Dropdown & Admin Key Generator Handler
// --------------------------------------------------------------------------
const customPlanSelect = document.getElementById('custom-plan-select');
const customPlanTrigger = document.getElementById('custom-plan-trigger');
const customPlanLabel = document.getElementById('custom-plan-selected-label');
const customPlanOptions = document.querySelectorAll('#custom-plan-options .custom-option');
const hiddenKeyPlanInput = document.getElementById('select-key-plan');

if (customPlanTrigger && customPlanSelect) {
  customPlanTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    customPlanSelect.classList.toggle('open');
  });

  customPlanOptions.forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      customPlanOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      const val = opt.getAttribute('data-value');
      const labelText = opt.textContent.replace('✓', '').trim();
      if (hiddenKeyPlanInput) hiddenKeyPlanInput.value = val;
      if (customPlanLabel) customPlanLabel.textContent = labelText;
      customPlanSelect.classList.remove('open');
    });
  });

  document.addEventListener('click', () => {
    customPlanSelect.classList.remove('open');
  });
}

// Universal reliable clipboard copy function with textarea fallback
async function copyTextToClipboard(text) {
  let copied = false;
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch (e) {}
  }
  if (!copied) {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      textArea.setAttribute("readonly", "");
      document.body.appendChild(textArea);
      textArea.select();
      textArea.setSelectionRange(0, 99999);
      copied = document.execCommand('copy');
      document.body.removeChild(textArea);
    } catch (err) {}
  }
  return copied;
}

if (adminLastKeyDisplay) {
  adminLastKeyDisplay.style.cursor = 'pointer';
  adminLastKeyDisplay.title = 'Нажмите, чтобы скопировать ключ';
  adminLastKeyDisplay.addEventListener('click', async () => {
    const keyText = adminLastKeyDisplay.getAttribute('data-key') || adminLastKeyDisplay.textContent.replace(/[^\w-]/g, '').trim();
    if (keyText) {
      await copyTextToClipboard(keyText);
      showAlert(profileAlert, `Ключ ${keyText} скопирован в буфер обмена!`, 'success');
    }
  });
}

if (btnAdminGenKey) {
  btnAdminGenKey.addEventListener('click', async () => {
    if (!currentUser) return;
    clearAlert(profileAlert);
    const planVal = hiddenKeyPlanInput ? hiddenKeyPlanInput.value : '9999';
    const days = parseInt(planVal, 10);
    let prefix = 'SHAPE-30D-';
    if (days === 0) prefix = 'SHAPE-RESET-';
    else if (days >= 9000) prefix = 'SHAPE-LIFE-';
    else if (days >= 365) prefix = 'SHAPE-YEAR-';
    else if (days <= 7) prefix = 'SHAPE-7D-';

    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    const newKeyCode = prefix + randomSuffix;

    btnAdminGenKey.disabled = true;
    btnAdminGenKey.textContent = 'Создание...';

    if (supabaseClient) {
      try {
        const { error } = await supabaseClient
          .from('license_keys')
          .insert([
            { code: newKeyCode, duration_days: days, is_used: false }
          ]);

        if (error) {
          showAlert(profileAlert, `Ошибка создания ключа: ${error.message}`, 'error');
        } else {
          adminLastKeyDisplay.style.display = 'block';
          adminLastKeyDisplay.setAttribute('data-key', newKeyCode);
          adminLastKeyDisplay.innerHTML = `✓ Ключ создан (нажмите для копирования): <strong>${newKeyCode}</strong>`;
          await copyTextToClipboard(newKeyCode);
          showAlert(profileAlert, `Ключ ${newKeyCode} успешно создан и скопирован в буфер обмена!`, 'success');
        }
      } catch (err) {
        showAlert(profileAlert, 'Ошибка создания ключа в базе данных.', 'error');
      }
    } else {
      adminLastKeyDisplay.style.display = 'block';
      adminLastKeyDisplay.setAttribute('data-key', newKeyCode);
      adminLastKeyDisplay.innerHTML = `✓ Ключ создан (нажмите для копирования): <strong>${newKeyCode}</strong>`;
      await copyTextToClipboard(newKeyCode);
      showAlert(profileAlert, `Ключ ${newKeyCode} скопирован в буфер обмена!`, 'success');
    }

    btnAdminGenKey.disabled = false;
    btnAdminGenKey.textContent = '+ Создать ключ';
  });
}

// --------------------------------------------------------------------------
// Discord OAuth Login
// --------------------------------------------------------------------------
if (btnDiscordLogin) {
  btnDiscordLogin.addEventListener('click', async () => {
    if (supabaseClient) {
      try {
        const { error } = await supabaseClient.auth.signInWithOAuth({
          provider: 'discord',
          options: {
            redirectTo: window.location.origin + window.location.pathname
          }
        });
        if (error) showAlert(authAlert, `Ошибка Discord: ${error.message}`, 'error');
      } catch (err) {
        showAlert(authAlert, 'Ошибка запуска Discord авторизации.', 'error');
      }
    } else {
      showAlert(authAlert, 'Для входа через Discord укажите ключи Supabase в app.js', 'error');
    }
  });
}

// --------------------------------------------------------------------------
// Reset HWID Handler
// --------------------------------------------------------------------------
if (btnResetHwid) {
  btnResetHwid.addEventListener('click', async () => {
    if (!currentUser) return;
    clearAlert(profileAlert);

    btnResetHwid.disabled = true;
    btnResetHwid.textContent = 'Сброс привязки...';

    if (supabaseClient) {
      try {
        const { error } = await supabaseClient.auth.updateUser({
          data: { hwid: null }
        });

        // Also reset in profiles table
        try {
          await supabaseClient
            .from('profiles')
            .update({ hwid: null })
            .eq('id', currentUser.id);
        } catch (e) {}

        if (error) {
          showAlert(profileAlert, `Ошибка сброса: ${error.message}`, 'error');
        } else {
          currentUser.user_metadata.hwid = null;
          renderProfileData();
          showAlert(profileAlert, '✓ Привязка HWID успешно сброшена! Новый ПК привяжется автоматически при первом запуске игры.', 'success');
        }
      } catch (err) {
        showAlert(profileAlert, 'Ошибка отправки запроса на сброс HWID.', 'error');
      }
    } else {
      // Demo Mode
      setTimeout(() => {
        currentUser.user_metadata.hwid = 'Не привязан (Сброшено)';
        localStorage.setItem('shape_demo_user', JSON.stringify(currentUser));
        renderProfileData();
        showAlert(profileAlert, '✓ Привязка HWID успешно сброшена! (Демо-режим)', 'success');
      }, 400);
    }

    btnResetHwid.disabled = false;
    btnResetHwid.innerHTML = '<span>⟳</span> Сбросить привязку HWID';
  });
}

// --------------------------------------------------------------------------
// Logout Handler
// --------------------------------------------------------------------------
if (btnLogout) {
  btnLogout.addEventListener('click', async () => {
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
    } else {
      localStorage.removeItem('shape_demo_user');
    }
    updateHeaderAuth(null);
    closeModal(profileModal);
  });
}

// --------------------------------------------------------------------------
// Initialize Auth State on Page Load
// --------------------------------------------------------------------------
async function checkInitialSession() {
  if (supabaseClient) {
    try {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (session && session.user) {
        updateHeaderAuth(session.user);
        fetchAndRenderProfile();
      }

      supabaseClient.auth.onAuthStateChange((event, session) => {
        if (session && session.user) {
          updateHeaderAuth(session.user);
          fetchAndRenderProfile();
        } else {
          updateHeaderAuth(null);
        }
      });
    } catch (err) {
      console.error("Ошибка проверки сессии Supabase:", err);
    }
  } else {
    // Demo mode restore
    const savedDemoUser = localStorage.getItem('shape_demo_user');
    if (savedDemoUser) {
      try {
        const user = JSON.parse(savedDemoUser);
        updateHeaderAuth(user);
        renderProfileData();
      } catch (e) {}
    }
  }
}

// --------------------------------------------------------------------------
// Standalone Profile & Auth Page Controller (profile.html)
// --------------------------------------------------------------------------
function initStandaloneProfilePage() {
  const authView = document.getElementById('authView');
  const profileView = document.getElementById('profileView');
  if (!authView && !profileView) return; // Not on profile.html

  const tabLoginBtn = document.getElementById('tabLoginBtn');
  const tabRegisterBtn = document.getElementById('tabRegisterBtn');
  const formLogin = document.getElementById('formLogin');
  const formRegister = document.getElementById('formRegister');
  const authAlert = document.getElementById('authAlert');
  const profileAlert = document.getElementById('profileAlert');

  const profileAvatar = document.getElementById('profileAvatar');
  const profileUsername = document.getElementById('profileUsername');
  const profileUserEmail = document.getElementById('profileUserEmail');
  const profileSubBadge = document.getElementById('profileSubBadge');
  const profileSubExpiry = document.getElementById('profileSubExpiry');
  const profileHwidVal = document.getElementById('profileHwidVal');
  const formRedeemKey = document.getElementById('formRedeemKey');
  const inputLicenseKey = document.getElementById('inputLicenseKey');
  const btnRedeemKey = document.getElementById('btnRedeemKey');

  const adminGenBox = document.getElementById('adminGeneratorBox');
  const btnAdminGenKey = document.getElementById('btnAdminGenKey');
  const selectKeyPlan = document.getElementById('selectKeyPlan');
  const adminLastKeyDisplay = document.getElementById('adminLastKeyDisplay');
  const customPlanSelect = document.getElementById('customPlanSelect');
  const customPlanTrigger = document.getElementById('customPlanTrigger');
  const customPlanLabel = document.getElementById('customPlanSelectedLabel');
  const customPlanOptions = document.querySelectorAll('#customPlanOptions .custom-option');

  const dlBox = document.getElementById('profileDownloadBox');
  const btnDownloadClient = document.getElementById('btnDownloadClient');
  const btnResetHwid = document.getElementById('btnResetHwid');
  const btnLogout = document.getElementById('btnLogout');

  // Tab switcher
  if (tabLoginBtn && tabRegisterBtn && formLogin && formRegister) {
    tabLoginBtn.addEventListener('click', () => {
      tabLoginBtn.classList.add('active');
      tabRegisterBtn.classList.remove('active');
      formLogin.classList.add('active');
      formRegister.classList.remove('active');
      clearAlert(authAlert);
    });
    tabRegisterBtn.addEventListener('click', () => {
      tabRegisterBtn.classList.add('active');
      tabLoginBtn.classList.remove('active');
      formRegister.classList.add('active');
      formLogin.classList.remove('active');
      clearAlert(authAlert);
    });
  }

  // Render profile view on profile.html
  async function renderStandaloneProfile(user) {
    if (!user) {
      if (authView) authView.classList.add('active');
      if (profileView) profileView.classList.remove('active');
      return;
    }

    if (authView) authView.classList.remove('active');
    if (profileView) profileView.classList.add('active');

    let nickname = user.user_metadata?.mc_nickname || user.email?.split('@')[0] || 'Игрок';
    let email = user.email || 'Не указан';
    let hwid = user.user_metadata?.hwid || 'Не привязан';
    let rawSubActive = user.user_metadata?.subscription_active;
    let rawSubUntil = user.user_metadata?.subscription_until;

    // Pull live HWID and subscription from profiles table
    if (supabaseClient) {
      try {
        let query = supabaseClient.from('profiles').select('*');
        if (email && nickname) {
          query = query.or(`email.eq.${email},mc_nickname.ilike.${nickname},id.eq.${user.id}`);
        } else {
          query = query.eq('id', user.id);
        }
        const { data: profs } = await query.limit(1);
        if (profs && profs.length > 0) {
          const prof = profs[0];
          if (prof.hwid && prof.hwid !== 'null' && prof.hwid !== '') {
            hwid = prof.hwid;
            if (!user.user_metadata) user.user_metadata = {};
            user.user_metadata.hwid = prof.hwid;
          }
          if (prof.mc_nickname) nickname = prof.mc_nickname;
          if (prof.subscription_until) rawSubUntil = prof.subscription_until;
          if (prof.subscription_active !== undefined) rawSubActive = prof.subscription_active;
        }
      } catch (e) {
        console.warn("Live profile fetch error:", e);
      }
    }

    const isBanned = (rawSubUntil === 'BANNED' || hwid === 'BANNED' || rawSubUntil === 'Заблокирован');
    if (isBanned) {
      if (supabaseClient) await supabaseClient.auth.signOut();
      if (authView) authView.classList.add('active');
      if (profileView) profileView.classList.remove('active');
      showAlert(authAlert, '⛔ Ваш аккаунт заблокирован администратором!', 'error');
      return;
    }

    const subActive = rawSubActive === true || rawSubActive === 'true' || 
      (rawSubUntil && rawSubUntil !== 'Не активна' && rawSubUntil !== 'Требуется активация ключа');
    const subExpiry = rawSubUntil || (subActive ? 'Навсегда (Lifetime)' : 'Требуется активация ключа');

    if (profileUsername) profileUsername.textContent = nickname;
    if (profileUserEmail) profileUserEmail.textContent = email;
    if (profileAvatar) {
      profileAvatar.src = `https://minotar.net/avatar/${encodeURIComponent(nickname)}/80.png`;
    }

    if (profileSubBadge) {
      if (subActive) {
        profileSubBadge.textContent = 'Активна';
        profileSubBadge.className = 'card-status-badge';
      } else {
        profileSubBadge.textContent = 'Не активна';
        profileSubBadge.className = 'card-status-badge inactive';
      }
    }

    if (profileSubExpiry) {
      profileSubExpiry.textContent = subActive ? `Действует: ${subExpiry}` : 'Требуется активация ключа';
    }

    if (profileHwidVal) {
      profileHwidVal.textContent = hwid;
    }

    const btnAdminPanel = document.getElementById('btnAdminPanel');
    const isAdmin = email === 'gorwok.h@yandex.ru' || user.user_metadata?.role === 'Admin' || prof?.is_admin;
    if (btnAdminPanel) btnAdminPanel.style.display = isAdmin ? 'inline-flex' : 'none';
    if (adminGenBox) adminGenBox.style.display = 'none';
    if (btnResetHwid) btnResetHwid.style.display = isAdmin ? 'inline-flex' : 'none';
    if (dlBox) dlBox.style.display = (subActive || isAdmin) ? 'block' : 'none';
  }

  // Update standalone on auth change
  const originalUpdateHeader = updateHeaderAuth;
  updateHeaderAuth = function(user) {
    originalUpdateHeader(user);
    renderStandaloneProfile(user);
  };

  if (currentUser) {
    renderStandaloneProfile(currentUser);
  }

  // Form Login
  if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearAlert(authAlert);
      const emailInput = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;
      const btn = document.getElementById('btnSubmitLogin');

      if (!emailInput || !password) {
        showAlert(authAlert, 'Заполните все поля для входа.', 'error');
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Вход...';

      if (supabaseClient) {
        try {
          const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: emailInput,
            password: password
          });
          if (error) {
            showAlert(authAlert, error.message.includes('Invalid login') ? 'Неверный Email или пароль.' : error.message, 'error');
          } else {
            // Check if user is banned
            const { data: profs } = await supabaseClient.from('profiles').select('*').eq('id', data.user.id).limit(1);
            const prof = profs && profs[0];
            const isBan = prof && (prof.subscription_until === 'BANNED' || prof.hwid === 'BANNED' || prof.subscription_until === 'Заблокирован');
            if (isBan) {
              await supabaseClient.auth.signOut();
              showAlert(authAlert, '⛔ Ваш аккаунт заблокирован администратором!', 'error');
              btn.disabled = false;
              btn.textContent = 'Войти в аккаунт';
              return;
            }
            showAlert(authAlert, 'Успешный вход! Загрузка профиля...', 'success');
            updateHeaderAuth(data.user);
            fetchAndRenderProfile();
          }
        } catch (err) {
          showAlert(authAlert, 'Ошибка связи с сервером.', 'error');
        }
      }
      btn.disabled = false;
      btn.textContent = 'Войти в аккаунт';
    });
  }

  // Form Register
  if (formRegister) {
    formRegister.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearAlert(authAlert);
      const nick = document.getElementById('regNickname').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const pass = document.getElementById('regPassword').value;
      const btn = document.getElementById('btnSubmitRegister');

      if (!nick || !email || !pass) {
        showAlert(authAlert, 'Заполните все поля регистрации.', 'error');
        return;
      }
      if (pass.length < 6) {
        showAlert(authAlert, 'Пароль должен быть минимум 6 символов.', 'error');
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Создание...';

      if (supabaseClient) {
        try {
          const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: pass,
            options: {
              data: {
                mc_nickname: nick,
                hwid: null,
                subscription_active: false,
                subscription_until: 'Не активна'
              }
            }
          });
          if (error) {
            showAlert(authAlert, error.message, 'error');
          } else {
            if (data.user) {
              try {
                await supabaseClient.from('profiles').upsert([{
                  id: data.user.id,
                  email: email,
                  mc_nickname: nick,
                  hwid: null,
                  subscription_active: false,
                  subscription_until: 'Не активна'
                }]);
              } catch (e) {}
              showAlert(authAlert, 'Аккаунт успешно создан!', 'success');
              updateHeaderAuth(data.user);
              fetchAndRenderProfile();
            }
          }
        } catch (err) {
          showAlert(authAlert, 'Ошибка связи с сервером.', 'error');
        }
      }
      btn.disabled = false;
      btn.textContent = 'Зарегистрироваться';
    });
  }

  // Form Key Redeem
  if (formRedeemKey) {
    formRedeemKey.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearAlert(profileAlert);
      const keyVal = inputLicenseKey ? inputLicenseKey.value.trim().toUpperCase() : '';
      if (!keyVal) {
        showAlert(profileAlert, 'Введите лицензионный ключ.', 'error');
        return;
      }

      btnRedeemKey.disabled = true;
      btnRedeemKey.textContent = 'Проверка...';

      if (supabaseClient && currentUser) {
        try {
          const { data: keys, error } = await supabaseClient
            .from('license_keys')
            .select('*')
            .eq('code', keyVal)
            .limit(1);

          if (error || !keys || keys.length === 0) {
            showAlert(profileAlert, 'Ключ не найден или введен неверно!', 'error');
          } else {
            const keyRecord = keys[0];
            if (keyRecord.is_used) {
              showAlert(profileAlert, 'Этот ключ уже был активирован ранее!', 'error');
            } else {
              const isReset = keyRecord.duration_days === 0 || keyVal.startsWith('SHAPE-RESET-');
              if (isReset) {
                await supabaseClient.from('license_keys').update({ is_used: true, used_by: currentUser.user_metadata?.mc_nickname || currentUser.email }).eq('id', keyRecord.id);
                await supabaseClient.auth.updateUser({ data: { hwid: null } });
                try { await supabaseClient.from('profiles').update({ hwid: null }).eq('id', currentUser.id); } catch(e){}
                currentUser.user_metadata.hwid = null;
                renderStandaloneProfile(currentUser);
                inputLicenseKey.value = '';
                showAlert(profileAlert, '✓ Ключ сброса применен! HWID сброшен.', 'success');
              } else {
                let subText = 'Навсегда (Lifetime)';
                if (keyRecord.duration_days < 9000) {
                  const expireDate = new Date();
                  expireDate.setDate(expireDate.getDate() + keyRecord.duration_days);
                  const day = String(expireDate.getDate()).padStart(2, '0');
                  const month = String(expireDate.getMonth() + 1).padStart(2, '0');
                  subText = `до ${day}.${month}.${expireDate.getFullYear()}`;
                }
                await supabaseClient.from('license_keys').update({ is_used: true, used_by: currentUser.user_metadata?.mc_nickname || currentUser.email }).eq('id', keyRecord.id);
                await supabaseClient.auth.updateUser({ data: { subscription_active: true, subscription_until: subText } });
                try { await supabaseClient.from('profiles').update({ subscription_active: true, subscription_until: subText }).eq('id', currentUser.id); } catch(e){}
                currentUser.user_metadata.subscription_active = true;
                currentUser.user_metadata.subscription_until = subText;
                renderStandaloneProfile(currentUser);
                inputLicenseKey.value = '';
                showAlert(profileAlert, `✓ Подписка активирована: ${subText}!`, 'success');
              }
            }
          }
        } catch (err) {
          showAlert(profileAlert, 'Ошибка связи с сервером.', 'error');
        }
      }
      btnRedeemKey.disabled = false;
      btnRedeemKey.textContent = 'Применить';
    });
  }

  // Admin Custom Dropdown
  if (customPlanTrigger && customPlanSelect) {
    customPlanTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      customPlanSelect.classList.toggle('open');
    });
    customPlanOptions.forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        customPlanOptions.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        const val = opt.getAttribute('data-value');
        if (selectKeyPlan) selectKeyPlan.value = val;
        if (customPlanLabel) customPlanLabel.textContent = opt.textContent.trim();
        customPlanSelect.classList.remove('open');
      });
    });
    document.addEventListener('click', () => customPlanSelect.classList.remove('open'));
  }

  // Admin Key Generator (Fixed: without created_by column)
  if (btnAdminGenKey) {
    btnAdminGenKey.addEventListener('click', async () => {
      clearAlert(profileAlert);
      const planVal = selectKeyPlan ? selectKeyPlan.value : '9999';
      const days = parseInt(planVal, 10);
      let prefix = 'SHAPE-LIFE';
      if (days === 0) prefix = 'SHAPE-RESET';
      else if (days === 7) prefix = 'SHAPE-7D';
      else if (days === 30) prefix = 'SHAPE-30D';
      else if (days === 365) prefix = 'SHAPE-365D';

      const randomPart = Array.from({length: 3}, () => Math.random().toString(36).substring(2, 6).toUpperCase()).join('-');
      const generatedCode = `${prefix}-${randomPart}`;

      btnAdminGenKey.disabled = true;
      btnAdminGenKey.textContent = 'Генерация...';

      if (supabaseClient) {
        try {
          const { error } = await supabaseClient.from('license_keys').insert([{
            code: generatedCode,
            duration_days: days,
            is_used: false
          }]);
          if (error) {
            showAlert(profileAlert, `Ошибка генерации ключа: ${error.message}`, 'error');
          } else {
            if (adminLastKeyDisplay) {
              adminLastKeyDisplay.style.display = 'block';
              adminLastKeyDisplay.innerHTML = `
                <div class="key-gen-result">
                  <div class="key-gen-info">
                    <span class="key-gen-label">Сгенерированный ключ</span>
                    <span class="key-gen-code">${generatedCode}</span>
                  </div>
                  <button type="button" class="btn-copy-key" id="btnCopyGenKey">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    <span>Скопировать</span>
                  </button>
                </div>
              `;

              const copyBtn = document.getElementById('btnCopyGenKey');
              if (copyBtn) {
                copyBtn.addEventListener('click', async (e) => {
                  e.stopPropagation();
                  let copied = false;
                  try {
                    await navigator.clipboard.writeText(generatedCode);
                    copied = true;
                  } catch (err) {
                    const ta = document.createElement('textarea');
                    ta.value = generatedCode;
                    document.body.appendChild(ta);
                    ta.select();
                    copied = document.execCommand('copy');
                    document.body.removeChild(ta);
                  }
                  copyBtn.classList.add('copied');
                  copyBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Скопировано!</span>
                  `;
                  setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    copyBtn.innerHTML = `
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                      <span>Скопировать</span>
                    `;
                  }, 2200);
                });
              }
            }
            showAlert(profileAlert, `✓ Ключ ${generatedCode} успешно сохранен в базе данных!`, 'success');
          }
        } catch (err) {
          showAlert(profileAlert, 'Ошибка связи с базой данных.', 'error');
        }
      }
      btnAdminGenKey.disabled = false;
      btnAdminGenKey.textContent = '+ Создать ключ';
    });
  }

  // Custom Confirm Dialog Modal Helper
  function showCustomConfirm({ title = 'Подтвердите действие', message = 'Вы уверены?', confirmText = 'Да, сбросить', onConfirm }) {
    const modal = document.getElementById('confirmModal');
    if (!modal) {
      if (confirm(message)) {
        if (typeof onConfirm === 'function') onConfirm();
      }
      return;
    }

    const titleEl = document.getElementById('confirmModalTitle');
    const msgEl = document.getElementById('confirmModalMsg');
    const btnOk = document.getElementById('btnConfirmOk');
    const btnCancel = document.getElementById('btnConfirmCancel');

    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;
    if (btnOk) btnOk.textContent = confirmText;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');

    const handleCancel = () => {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      cleanup();
    };

    const handleOk = () => {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      cleanup();
      if (typeof onConfirm === 'function') onConfirm();
    };

    const handleOverlay = (e) => {
      if (e.target === modal) handleCancel();
    };

    function cleanup() {
      if (btnCancel) btnCancel.removeEventListener('click', handleCancel);
      if (btnOk) btnOk.removeEventListener('click', handleOk);
      modal.removeEventListener('click', handleOverlay);
    }

    if (btnCancel) btnCancel.addEventListener('click', handleCancel);
    if (btnOk) btnOk.addEventListener('click', handleOk);
    modal.addEventListener('click', handleOverlay);
  }

  // HWID Reset with Custom Neon Confirmation
  if (btnResetHwid) {
    btnResetHwid.addEventListener('click', () => {
      showCustomConfirm({
        title: 'Подтвердите действие',
        message: 'Вы уверены, что хотите сбросить привязку HWID? Новый ПК будет привязан автоматически при следующем входе.',
        confirmText: 'Да, сбросить',
        onConfirm: async () => {
          clearAlert(profileAlert);
          btnResetHwid.disabled = true;
          btnResetHwid.textContent = 'Сброс...';

          if (supabaseClient && currentUser) {
            try {
              await supabaseClient.auth.updateUser({ data: { hwid: null } });
              try { await supabaseClient.from('profiles').update({ hwid: null }).eq('id', currentUser.id); } catch(e){}
              currentUser.user_metadata.hwid = null;
              renderStandaloneProfile(currentUser);
              showAlert(profileAlert, '✓ Привязка HWID успешно сброшена! Новый ПК привяжется автоматически при первом запуске игры.', 'success');
            } catch (err) {
              showAlert(profileAlert, 'Ошибка связи с сервером при сбросе HWID.', 'error');
            }
          }
          btnResetHwid.disabled = false;
          btnResetHwid.innerHTML = '<span>⟳</span> Сбросить привязку HWID';
        }
      });
    });
  }

  // Logout
  if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
      if (supabaseClient) {
        await supabaseClient.auth.signOut();
      } else {
        localStorage.removeItem('shape_demo_user');
      }
      updateHeaderAuth(null);
      renderStandaloneProfile(null);
    });
  }
}

// Auto-run Standalone Profile Page
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStandaloneProfilePage);
} else {
  initStandaloneProfilePage();
}

checkInitialSession();

// Direct Client Download via Supabase Cloud Storage (shape.exe launcher)
const btnDownloadClient = document.getElementById('btnDownloadClient') || document.getElementById('btn-download-client');
if (btnDownloadClient) {
  btnDownloadClient.addEventListener('click', () => {
    const downloadUrl = 'https://psowlftvhxaluzkahpin.supabase.co/storage/v1/object/public/downloads/shape.exe';
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'shape.exe';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

/* ==========================================================================
   6. AnyPay Checkout & Payment Controller
   ========================================================================== */
const checkoutModal = document.getElementById('checkout-modal');
const btnCloseCheckout = document.getElementById('btn-close-checkout');
const formCheckout = document.getElementById('form-checkout');
const checkoutPlanNameEl = document.getElementById('checkout-plan-name');
const checkoutPlanPriceEl = document.getElementById('checkout-plan-price');
const checkoutHiddenPlan = document.getElementById('checkout-hidden-plan');
const checkoutHiddenPrice = document.getElementById('checkout-hidden-price');
const checkoutNickInput = document.getElementById('checkout-nickname');
const checkoutEmailInput = document.getElementById('checkout-email');
const checkoutAlert = document.getElementById('checkout-alert');

// AnyPay Project ID
const ANYPAY_PROJECT_ID = '18155';

// Discord Purchase Link
const DISCORD_PURCHASE_URL = 'https://discord.gg/8nbq9S54Vh';

// Direct Buy Plan click -> Open Discord
document.querySelectorAll('.btn-buy-plan').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.open(DISCORD_PURCHASE_URL, '_blank');
  });
});

if (btnCloseCheckout) {
  btnCloseCheckout.addEventListener('click', () => closeModal(checkoutModal));
}

// Close checkout modal on overlay click
if (checkoutModal) {
  checkoutModal.addEventListener('click', (e) => {
    if (e.target === checkoutModal) closeModal(checkoutModal);
  });
}

// Handle Payment Submission -> Discord Redirect
if (formCheckout) {
  formCheckout.addEventListener('submit', (e) => {
    e.preventDefault();
    window.open(DISCORD_PURCHASE_URL, '_blank');
  });
}

// Check if returning from payment
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('payment') === 'success') {
  setTimeout(() => {
    alert('🎉 Оплата успешно завершена! Ваш ключ активируется автоматически. Если у вас возникнут вопросы — напишите нам в Discord!');
    window.history.replaceState({}, document.title, window.location.pathname);
  }, 600);
} else if (urlParams.get('payment') === 'fail') {
  setTimeout(() => {
    alert('❌ Оплата была отменена или не завершена. Попробуйте снова или выберите другой способ оплаты.');
    window.history.replaceState({}, document.title, window.location.pathname);
  }, 600);
}

/* ==========================================================================
   7. Interactive Visual Comparison Slider ("Играй по-своему")
   ========================================================================== */
function initComparisonSlider() {
  const frame = document.getElementById('comparisonFrame');
  const layerAfter = document.getElementById('layerAfter');
  const slider = document.getElementById('comparisonSlider');
  const hint = document.getElementById('comparisonHint');
  const afterImg = layerAfter ? layerAfter.querySelector('img') : null;

  if (!frame || !layerAfter || !slider) return;

  let isDragging = false;

  function updateAfterImgWidth() {
    if (afterImg && frame) {
      afterImg.style.width = `${frame.offsetWidth}px`;
    }
  }

  window.addEventListener('resize', updateAfterImgWidth);
  updateAfterImgWidth();

  function setSliderPosition(xRatio) {
    const clamped = Math.max(0, Math.min(1, xRatio));
    const percent = (clamped * 100).toFixed(2);
    layerAfter.style.width = `${percent}%`;
    slider.style.left = `${percent}%`;
    if (hint && !frame.classList.contains('has-interacted')) {
      frame.classList.add('has-interacted');
    }
  }

  function handlePointer(e) {
    const rect = frame.getBoundingClientRect();
    const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
    const xRatio = (clientX - rect.left) / rect.width;
    setSliderPosition(xRatio);
  }

  frame.addEventListener('mousedown', (e) => {
    isDragging = true;
    frame.classList.add('is-dragging');
    layerAfter.style.transition = 'none';
    slider.style.transition = 'none';
    handlePointer(e);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    handlePointer(e);
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      frame.classList.remove('is-dragging');
    }
  });

  frame.addEventListener('touchstart', (e) => {
    isDragging = true;
    frame.classList.add('is-dragging');
    layerAfter.style.transition = 'none';
    slider.style.transition = 'none';
    handlePointer(e);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    handlePointer(e);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    if (isDragging) {
      isDragging = false;
      frame.classList.remove('is-dragging');
    }
  });

  // Smooth intro reveal animation when scrolling into view
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateAfterImgWidth();
          layerAfter.style.transition = 'width 0.85s cubic-bezier(0.25, 1, 0.5, 1)';
          slider.style.transition = 'left 0.85s cubic-bezier(0.25, 1, 0.5, 1)';
          setSliderPosition(0.5);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(frame);
  } else {
    setSliderPosition(0.5);
  }
}

// Auto-run Comparison Slider
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initComparisonSlider);
} else {
  initComparisonSlider();
}

// --------------------------------------------------------------------------
// Smooth Page Transitions
// --------------------------------------------------------------------------
function smoothNavigate(url) {
  if (!url) return;
  if (url.startsWith('#') || url.startsWith('javascript:')) return;
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    if (!url.includes(window.location.host)) {
      window.open(url, '_blank');
      return;
    }
  }

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const targetBase = url.split('#')[0].split('?')[0];
  if (targetBase === currentPath && url.includes('#')) {
    const hash = url.substring(url.indexOf('#'));
    const targetEl = document.querySelector(hash);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
      return;
    }
  }

  document.body.classList.add('page-transition-exit');
  setTimeout(() => {
    window.location.href = url;
  }, 400);
}

// Intercept page navigations
document.addEventListener('click', (e) => {
  const target = e.target.closest('button, a');
  if (!target) return;

  const onclickAttr = target.getAttribute('onclick');
  if (onclickAttr && (onclickAttr.includes("location.href='") || onclickAttr.includes('location.href="'))) {
    const match = onclickAttr.match(/location\.href=['"]([^'"]+)['"]/);
    if (match && match[1]) {
      const url = match[1];
      if (!url.startsWith('http') || url.includes(window.location.host)) {
        e.preventDefault();
        e.stopImmediatePropagation();
        smoothNavigate(url);
      }
    }
  }
}, true);

// Reset transition on pageshow (e.g. browser back/forward buttons)
window.addEventListener('pageshow', () => {
  document.body.classList.remove('page-transition-exit');
});
