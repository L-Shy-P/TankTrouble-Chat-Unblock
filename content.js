// TT Chat Unblock — MAIN world (V2.9)
(function () {
  "use strict";

  // 镜像网站开关：关闭时跳过所有功能
  if (location.hostname === "cdn.tanktrouble.com" || location.hostname === "beta.tanktrouble.com") {
    var _mirCheck = null;
    try { _mirCheck = localStorage.getItem("tt-mir"); } catch (e) {}
    if (_mirCheck === "0") {
      console.log("[TT] mirror site disabled, skipping all hooks");
      return;
    }
  }

  var VERSION = "2.9";
  var V2_VER = " | v" + VERSION;
  var V2_SIG = V2_VER + " [Chat Unblocker]";
  var V1_SIG = " [Chat Unblocker]";

  var settings = { sig: true, enc: true, fmt: "v2", lang: null, ver: true, mir: true };
  // 同步读取语言，避免异步 init 消息延迟导致显示英文
  try { settings.lang = localStorage.getItem("tt-lang"); } catch (e) {}
  if (!settings.lang) settings.lang = "en";
  var _lastToggle = 0;
  var _lastSentText = "";
  var _isSending = false;
  var _sendQueue = [];

  var MSG_NO_RECIPIENTS = {
    en: "User not found",
    zh: "用户不存在",
    ja: "ユーザーが見つかりません",
    ko: "사용자를 찾을 수 없습니다",
    ru: "Пользователь не найден",
    ar: "المستخدم غير موجود",
    fr: "Utilisateur introuvable",
    es: "Usuario no encontrado",
    de: "Benutzer nicht gefunden",
    pt: "Usuário não encontrado"
  };

  var MSG_SELF = {
    en: "Why talk to yourself?",
    zh: "你为什么要自言自语？",
    ja: "なぜ独り言を？",
    ko: "왜 혼잣말을 하나요?",
    ru: "Зачем говорить с собой?",
    ar: "لماذا تتحدث مع نفسك؟",
    fr: "Pourquoi te parles-tu à toi-même ?",
    es: "¿Por qué hablas contigo mismo?",
    de: "Warum redest du mit dir selbst?",
    pt: "Por que falar consigo mesmo?"
  };

  var V1_LABEL = {
    en: "[V1.2 Format] ",
    zh: "[V1.2格式] ",
    ja: "[V1.2形式] ",
    ko: "[V1.2형식] ",
    ru: "[V1.2 Формат] ",
    ar: "[V1.2 تنسيق] ",
    fr: "[V1.2 Format] ",
    es: "[V1.2 Formato] ",
    de: "[V1.2 Format] ",
    pt: "[V1.2 Formato] "
  };

  var MIXED_LABEL = {
    en: "[Mixed Format] ",
    zh: "[混合编码格式] ",
    ja: "[混合形式] ",
    ko: "[혼합 형식] ",
    ru: "[Смешанный Формат] ",
    ar: "[تنسيق مختلط] ",
    fr: "[Format Mixte] ",
    es: "[Formato Mixto] ",
    de: "[Gemischtes Format] ",
    pt: "[Formato Misto] "
  };

  var SENDING_TEXT = {
    en: "Sending...",
    zh: "正在发送...",
    ja: "送信中...",
    ko: "전송 중...",
    ru: "Отправка...",
    ar: "جار الإرسال...",
    fr: "Envoi en cours...",
    es: "Enviando...",
    de: "Wird gesendet...",
    pt: "Enviando..."
  };

  // ---- bridge 通信 ----
  // 向 bridge 主动请求一次 init，防止首次 init 因时序问题被错过（新用户关键修复）
  function requestInit() {
    try { window.postMessage({ source: "tt-content", data: { type: "request-init" } }, "*"); } catch (e) {}
  }
  window.addEventListener("message", function (e) {
    if (!e.data || e.data.source !== "tt-bridge") return;
    var d = e.data.data;
    if (d.type === "init")  { settings.sig = d.sig; settings.enc = d.enc; settings.fmt = d.fmt || "v2"; settings.lang = d.lang; settings.ver = d.ver !== false; settings.mir = d.mir !== false; console.log("[TT] init sig=" + settings.sig + " enc=" + settings.enc + " fmt=" + settings.fmt + " lang=" + settings.lang + " ver=" + settings.ver + " mir=" + settings.mir); }
    if (d.type === "sig")   { settings.sig = d.value; console.log("[TT] sig→" + settings.sig); }
    if (d.type === "enc")   { settings.enc = d.value; console.log("[TT] enc→" + settings.enc); toggleMessages(); }
    if (d.type === "fmt")   { settings.fmt = d.value; console.log("[TT] fmt→" + settings.fmt); }
    if (d.type === "lang")  { settings.lang = d.value; console.log("[TT] lang→" + settings.lang); toggleMessages(); updateCopyLabels(); }
    if (d.type === "ver")   { settings.ver = d.value; console.log("[TT] ver→" + settings.ver); toggleMessages(); }
    if (d.type === "mir")   { settings.mir = d.value; console.log("[TT] mir→" + settings.mir); try { localStorage.setItem("tt-mir", d.value ? "1" : "0"); } catch (e) {} }
    if (d.type === "reset") { doReset(); }
  });
  // 脚本启动即请求 init（bridge 在 document_start 已注册监听，可立即响应）
  requestInit();
  // 兜底：延迟再请求一次，覆盖 document_start → document_idle 之间的所有时序
  setTimeout(requestInit, 300);

  // ---- 切换消息显示（编码开关 → 从 _raw 实时解析后重绘） ----
  function toggleMessages() {
    var now = Date.now();
    if (now - _lastToggle < 400) return;
    _lastToggle = now;
    try {
      var CB = window.TankTrouble && window.TankTrouble.ChatBox;
      if (!CB || !CB.messages) return;
      for (var i = 0; i < CB.messages.length; i++) {
        var msg = CB.messages[i];
        if (msg._raw) {
          if (settings.enc) {
            var decoded = null, isOld = false, isMixed = false;
            if (isV2(msg._raw) && isV1(msg._raw)) {
              decoded = stripSig(decodeV1(decodeV2(msg._raw)));
              isMixed = true;
            } else if (isV2(msg._raw)) {
              decoded = stripSig(decodeV2(msg._raw));
            } else if (isV1(msg._raw)) {
              decoded = stripSig(decodeV1(msg._raw));
              isOld = true;
            }
            if (decoded) {
              var lang = settings.lang || "en";
              var label = "";
              if (isMixed) {
                label = (MIXED_LABEL[lang] || MIXED_LABEL["en"]) + " ";
              } else if (isOld) {
                label = (V1_LABEL[lang] || V1_LABEL["en"]) + " ";
              }
              msg.message = label + decoded;
            }
          } else {
            msg.message = msg._raw;
          }
        }
      }
      CB._refreshChat(true);
      console.log("[TT] messages toggled, enc=" + settings.enc);
    } catch (e) { console.warn("[TT] toggle err:", e); }
  }

  function doReset() {
    try {
      var CB = window.TankTrouble && window.TankTrouble.ChatBox;
      if (CB && CB.chat && CB.chatInput) {
        CB.chat.removeClass("send user global");
        if (CB._updateInputBackground) CB._updateInputBackground(true);
        CB.chatInput.prop("disabled", false);
        var txt = CB.chatInput.val();
        if (txt) { CB.chatInput[0].select(); document.execCommand("copy"); }
        CB.chatInput.val("").outerHeight(16);
        console.log("[TT] reset done");
      }
    } catch (e) {}
  }

  // ---- 编码/解码 ----
  function hasNonAscii(s) {
    if (!s) return false;
    for (var i = 0; i < s.length; i++) { if (s.charCodeAt(i) > 127) return true; }
    return false;
  }

  function encodeV2(s) {
    var r = "";
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i);
      if (c > 127) r += "~" + ("000" + c.toString(16)).slice(-4);
      else if (s.charAt(i) === "\\") r += "\\\\";
      else r += s.charAt(i);
    }
    return r;
  }
  function decodeV2(s) {
    if (!s) return s;
    return s.replace(/~([0-9a-fA-F]{4})/g, function (_, h) { return String.fromCharCode(parseInt(h, 16)); });
  }

  function encodeV1(s) {
    var r = "";
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i);
      if (c > 127) r += "\\u" + ("000" + c.toString(16)).slice(-4);
      else if (s.charAt(i) === "\\") r += "\\\\";
      else r += s.charAt(i);
    }
    return r;
  }
  function decodeV1(s) {
    if (!s) return s;
    return s.replace(/\\u([0-9a-fA-F]{4})/g, function (_, h) { return String.fromCharCode(parseInt(h, 16)); });
  }

  function isV2(s) { return s && /~[0-9a-fA-F]{4}/.test(s); }
  function isV1(s) { return s && /\\u[0-9a-fA-F]{4}/.test(s); }

  function stripSig(s) {
    if (!s) return s;
    var p2 = s.lastIndexOf(V2_SIG);
    if (p2 >= 0) {
      var base = s.substring(0, p2);
      return settings.ver ? base + V2_VER : base;
    }
    var pv = s.lastIndexOf(V2_VER);
    if (pv >= 0) {
      var base = s.substring(0, pv);
      return settings.ver ? base + V2_VER : base;
    }
    var p1 = s.lastIndexOf(V1_SIG);
    if (p1 >= 0) return s.substring(0, p1);
    if (s.indexOf("[Chat Unblocker V") === 0) {
      var end = s.indexOf("] ");
      if (end > 0) return s.substring(end + 2);
    }
    return s;
  }

  // ---- @私聊异步查找 ----
  function resolveRecipients(CB, usernames, callback) {
    var count = 0, total = usernames.length;
    var notFound = [];
    for (var i = 0; i < usernames.length; i++) {
      Backend.getInstance().getPlayerDetailsByUsername(
        function (result) {
          if (typeof result === "object") {
            if (!Users.isAnyUser(result.getPlayerId())) {
              if (CB.recipientPlayerIds.indexOf(result.getPlayerId()) === -1) {
                CB.recipientPlayerIds.push(result.getPlayerId());
              }
            }
          } else {
            notFound.push(result);
          }
        },
        function () {},
        function () {
          count++;
          if (count === total) callback(CB.recipientPlayerIds.length > 0, notFound);
        },
        usernames[i],
        Caches.getPlayerDetailsByUsernameCache()
      );
    }
  }

  // ---- 全局CSS：选中样式修复 + 文本换行修复 + 复制按钮样式 ----
  var style = document.createElement("style");
  style.textContent = [
    "[data-tt-chat-body], [data-tt-chat-body] *:not(.username):not(a) { user-select: text !important; -webkit-user-select: text !important; }",
    "[data-tt-chat-body] .username, [data-tt-chat-body] a { cursor: pointer !important; -webkit-user-select: none !important; user-select: none !important; }",
    "[data-tt-chat-body] { overflow-x: hidden !important; word-wrap: break-word !important; overflow-wrap: break-word !important; }",
    "[data-tt-chat-body] > div, [data-tt-chat-body] > p, [data-tt-chat-body] > td, [data-tt-chat-body] div > div, [data-tt-chat-body] td > div, [data-tt-chat-body] td > p { word-wrap: break-word !important; overflow-wrap: break-word !important; word-break: break-word !important; white-space: normal !important; max-width: 100% !important; }",
    "[data-tt-chat-body] *::selection { background: #4f8 !important; color: #000 !important; text-shadow: none !important; -webkit-text-stroke: 0px !important; -webkit-text-fill-color: #000 !important; }",
    "[data-tt-chat-body] *::-moz-selection { background: #4f8 !important; color: #000 !important; text-shadow: none !important; }",
    ".tt-copy-icon { transition: left 0.2s cubic-bezier(0.1,0.9,0.2,1.0), top 0.2s cubic-bezier(0.1,0.9,0.2,1.0), opacity 0.18s ease, transform 0.18s cubic-bezier(0.34,1.56,0.64,1), background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease; }",
    ".tt-copy-icon::before { content:'';position:absolute;left:-8px;top:0;bottom:0;width:8px; }",
    ".tt-copy-icon:hover { background:rgba(255,255,255,0.97) !important; box-shadow:0 2px 8px rgba(0,0,0,0.18) !important; }",
    ".tt-copy-menu { transition: left 0.2s cubic-bezier(0.1,0.9,0.2,1.0), top 0.2s cubic-bezier(0.1,0.9,0.2,1.0), opacity 0.18s ease; }"
  ].join("\n");
  document.head.appendChild(style);

  // ---- 图标触发式复制菜单（悬停消息→图标→展开下拉菜单） ----
  var _iconEl = null;
  var _menuEl = null;
  var _currentRow = null;
  var _hideTimer = null;
  var _menuItems = [];
  var _chatContainerMarked = false;
  var _firstShow = true;
  var _veloTimer = null;
  var _lastMouseX = 0;
  var _lastMouseY = 0;
  var _lastMouseTime = 0;
  var _pendingRow = null;
  var _resizeTimer = null;
  var _resizing = false;

  var COPY_LABELS = {
    en: { icon: "\uD83D\uDCCB", copyText: "Copy text", copyName: "Copy name", copyFull: "Copy all", copied: "✓", title: "Copy message" },
    zh: { icon: "\uD83D\uDCCB", copyText: "复制内容", copyName: "复制名字", copyFull: "复制整条", copied: "✓", title: "复制消息内容" },
    ja: { icon: "\uD83D\uDCCB", copyText: "本文コピー", copyName: "名前コピー", copyFull: "全てコピー", copied: "✓", title: "メッセージをコピー" },
    ko: { icon: "\uD83D\uDCCB", copyText: "내용 복사", copyName: "이름 복사", copyFull: "전체 복사", copied: "✓", title: "메시지 복사" },
    ru: { icon: "\uD83D\uDCCB", copyText: "Копия текста", copyName: "Копия имени", copyFull: "Копия всего", copied: "✓", title: "Копировать сообщение" },
    ar: { icon: "\uD83D\uDCCB", copyText: "نسخ النص", copyName: "نسخ الاسم", copyFull: "نسخ الكل", copied: "✓", title: "نسخ الرسالة" },
    fr: { icon: "\uD83D\uDCCB", copyText: "Copier texte", copyName: "Copier nom", copyFull: "Tout copier", copied: "✓", title: "Copier le message" },
    es: { icon: "\uD83D\uDCCB", copyText: "Copiar texto", copyName: "Copiar nombre", copyFull: "Copiar todo", copied: "✓", title: "Copiar mensaje" },
    de: { icon: "\uD83D\uDCCB", copyText: "Text kopieren", copyName: "Name kopieren", copyFull: "Alles kopieren", copied: "✓", title: "Nachricht kopieren" },
    pt: { icon: "\uD83D\uDCCB", copyText: "Copiar texto", copyName: "Copiar nome", copyFull: "Copiar tudo", copied: "✓", title: "Copiar mensagem" }
  };

  function _L(key) {
    var lang = settings.lang || "en";
    var map = COPY_LABELS[lang] || COPY_LABELS["en"];
    return map[key];
  }

  function updateCopyLabels() {
    if (_iconEl) { _iconEl.textContent = _L("icon"); _iconEl.title = _L("title"); }
    // 菜单项在下一次 showMenu() 时会自动重建，无需额外处理
  }

  function ensureChatMarked() {
    if (_chatContainerMarked) return true;
    try {
      var TT = window.TankTrouble;
      if (!TT || !TT.ChatBox) return false;
      var CB = TT.ChatBox;
      var el = (CB.chatBody && CB.chatBody[0]) || (CB.chat && CB.chat[0]);
      if (el) {
        el.setAttribute("data-tt-chat-body", "1");
        _chatContainerMarked = true;
        console.log("[TT] marked chat body:", el.tagName, el.className || "(no class)");

        if (window.ResizeObserver) {
          new ResizeObserver(function () {
            clearTimeout(_resizeTimer);
            if (!_resizing && _iconEl && _iconEl.style.opacity === "1") {
              _resizing = true;
              if (_menuEl) { _menuEl.style.opacity = "0"; _menuEl.style.pointerEvents = "none"; }
              if (_iconEl) _iconEl.style.opacity = "0.6";
            }
            if (_currentRow) showIcon(_currentRow);
            _resizeTimer = setTimeout(function () {
              _resizing = false;
              if (_iconEl && _iconEl.style.opacity !== "0") _iconEl.style.opacity = "1";
              if (_currentRow) showIcon(_currentRow);
            }, 180);
          }).observe(el);
        }

        return true;
      }
    } catch (e) {}
    return false;
  }

  function getChat() { return document.querySelector("[data-tt-chat-body]"); }

  function isInteractive(el) {
    if (!el) return false;
    var tag = el.tagName;
    if (tag === "A" || tag === "BUTTON" || tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return true;
    if (el.closest && el.closest("a, button")) return true;
    if (typeof el.onclick === "function" || el.getAttribute("onclick")) return true;
    return false;
  }

  function findMessageRow(el) {
    if (!el) return null;
    var chat = getChat();
    if (!chat) return null;
    var p = el;
    while (p && p !== chat && p !== document.body) {
      var tag = p.tagName;
      if (tag === "TD" || tag === "TR") break;
      if (p.parentElement === chat) break;
      p = p.parentElement;
    }
    return (p && p !== chat && p !== document.body) ? p : null;
  }

  function getOrCreateIcon() {
      if (_iconEl) return _iconEl;
      _iconEl = document.createElement("div");
      _iconEl.className = "tt-copy-icon";
      _iconEl.style.cssText = "position:fixed;z-index:99998;opacity:0;pointer-events:none;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:14px;line-height:1;border-radius:4px;cursor:pointer;background:rgba(255,255,255,0.94);color:#555;border:1px solid rgba(0,0,0,0.1);box-shadow:0 1px 4px rgba(0,0,0,0.1);";
      _iconEl.textContent = _L("icon");
      _iconEl.title = _L("title");
      _iconEl.addEventListener("mouseenter", function () { clearTimeout(_hideTimer); showMenu(); });
      _iconEl.addEventListener("mouseleave", function (e) { if (!e.relatedTarget || !(_menuEl && _menuEl.contains(e.relatedTarget))) closeMenu(); if (!e.relatedTarget || !getChat() || !getChat().contains(e.relatedTarget)) scheduleHideFast(); });
      _iconEl.addEventListener("click", function (ev) { ev.stopPropagation(); copyRowText(); });
      document.body.appendChild(_iconEl);
      return _iconEl;
    }

    function getOrCreateMenu() {
      if (_menuEl) return _menuEl;
      _menuEl = document.createElement("div");
      _menuEl.className = "tt-copy-menu";
      _menuEl.style.cssText = "position:fixed;z-index:99999;opacity:0;pointer-events:none;border-radius:6px;background:rgba(255,255,255,0.96);border:1px solid rgba(0,0,0,0.1);box-shadow:0 4px 16px rgba(0,0,0,0.14);padding:4px 0;min-width:140px;font-size:12px;color:#333;";
      _menuEl.addEventListener("mouseenter", function () { clearTimeout(_hideTimer); });
      _menuEl.addEventListener("mouseleave", function (e) { if (e.relatedTarget && _iconEl && (_iconEl === e.relatedTarget || _iconEl.contains(e.relatedTarget))) return; closeMenu(); if (!e.relatedTarget || !getChat() || !getChat().contains(e.relatedTarget)) scheduleHideFast(); });
      document.body.appendChild(_menuEl);
      return _menuEl;
    }

  function showMenu() {
     var menu = getOrCreateMenu();
     if (!_currentRow) return;
     menu.innerHTML = "";
     _menuItems = [];

     var item = document.createElement("div");
     item.className = "tt-copy-item";
     item.style.cssText = "padding:6px 12px;cursor:pointer;white-space:nowrap;display:flex;align-items:center;gap:6px;transition:background 0.1s;";
     item.innerHTML = '<span style="font-size:14px;">\uD83D\uDCC4</span><span>' + _L("copyText") + '</span>';
     item.addEventListener("mouseenter", function () { item.style.background = "rgba(0,0,0,0.05)"; });
     item.addEventListener("mouseleave", function () { item.style.background = ""; });
     item.addEventListener("click", function (ev) { copyItem(ev, "text", _currentRow); });
     menu.appendChild(item);
     _menuItems.push({ el: item, type: "text" });

     var fullItem = document.createElement("div");
     fullItem.className = "tt-copy-item";
     fullItem.style.cssText = "padding:6px 12px;cursor:pointer;white-space:nowrap;display:flex;align-items:center;gap:6px;transition:background 0.1s;";
     fullItem.innerHTML = '<span style="font-size:14px;">\uD83D\uDCDD</span><span>' + _L("copyFull") + '</span>';
     fullItem.addEventListener("mouseenter", function () { fullItem.style.background = "rgba(0,0,0,0.05)"; });
     fullItem.addEventListener("mouseleave", function () { fullItem.style.background = ""; });
     fullItem.addEventListener("click", function (ev) { copyItem(ev, "full", _currentRow); });
     menu.appendChild(fullItem);
     _menuItems.push({ el: fullItem, type: "full" });

     var users = _currentRow.querySelectorAll(".username");
     for (var i = 0; i < users.length; i++) {
       (function (userEl) {
         var name = (userEl.textContent || "").replace(/:\s*$/, "").trim();
         if (!name) return;
         var uItem = document.createElement("div");
         uItem.className = "tt-copy-item";
         uItem.style.cssText = "padding:6px 12px;cursor:pointer;white-space:nowrap;display:flex;align-items:center;gap:6px;transition:background 0.1s;";
         uItem.innerHTML = '<span style="font-size:14px;">\uD83D\uDC64</span><span>' + _L("copyName") + ' <b>' + escapeHTML(name) + '</b></span>';
         uItem.addEventListener("mouseenter", function () { uItem.style.background = "rgba(0,0,0,0.05)"; });
         uItem.addEventListener("mouseleave", function () { uItem.style.background = ""; });
         uItem.addEventListener("click", function (ev) { copyItem(ev, "name", userEl, name); });
         menu.appendChild(uItem);
         _menuItems.push({ el: uItem, type: "name", name: name });
       })(users[i]);
     }

     var iconRect = _iconEl.getBoundingClientRect();
     var menuW = menu.offsetWidth || 140;
     var menuH = menu.offsetHeight || 40;

     var left = iconRect.left - menuW - 4;
     var top = iconRect.top + 12 - menuH / 2;
     if (left + menuW > iconRect.left) {
       top = iconRect.bottom + 4;
       left = iconRect.left + 12 - menuW / 2;
       if (left < 4) left = 4;
       if (top + menuH > window.innerHeight - 4) top = iconRect.top - menuH - 4;
     }
     if (top < 4) top = 4;
     if (top + menuH > window.innerHeight - 4) top = window.innerHeight - menuH - 4;

     menu.style.transition = "none";
     menu.style.left = left + "px";
     menu.style.top = top + "px";
     menu.offsetHeight;
     menu.style.transition = "";
     menu.style.pointerEvents = "auto";
     menu.style.opacity = "1";
   }

  function hideAll() {
    if (_iconEl) { _iconEl.style.opacity = "0"; _iconEl.style.pointerEvents = "none"; }
    if (_menuEl) { _menuEl.style.opacity = "0"; _menuEl.style.pointerEvents = "none"; }
    _currentRow = null;
    _menuItems = [];
    _firstShow = true;
    _pendingRow = null;
  }

  function closeMenu() {
    if (_menuEl) { _menuEl.style.opacity = "0"; _menuEl.style.pointerEvents = "none"; }
  }

  function escapeHTML(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  function isIconOrMenu(el) {
    return el && (el === _iconEl || el === _menuEl ||
      (_iconEl && _iconEl.contains(el)) || (_menuEl && _menuEl.contains(el)));
  }

  function showIcon(row) {
    var icon = getOrCreateIcon();
    icon.title = _L("title");
    var rect = row.getBoundingClientRect();
    var top = rect.top + rect.height / 2 - 12;
    if (top < 4) top = 4;
    if (top > window.innerHeight - 28) top = window.innerHeight - 28;
    icon.style.left = Math.max(4, rect.left - 30) + "px";
    icon.style.top = top + "px";
    icon.style.pointerEvents = "auto";
    if (_firstShow && !_resizing) { icon.offsetHeight; }
    icon.style.opacity = _resizing ? "0.6" : "1";
    if (_firstShow) _firstShow = false;
    _currentRow = row;
  }

  function scheduleHide(delay) {
    clearTimeout(_hideTimer);
    _hideTimer = setTimeout(hideAll, delay || 400);
  }

  function scheduleHideFast() { scheduleHide(500); }

  function copyRowText() {
    var row = _currentRow;
    if (!row) return;
    var clone = row.cloneNode(true);
    var users = clone.querySelectorAll(".username");
    for (var i = 0; i < users.length; i++) { users[i].parentNode.removeChild(users[i]); }
    var txt = (clone.textContent || "").trim();
    if (!txt) return;
    try { navigator.clipboard.writeText(txt).then(flashIcon); }
    catch (ex) {
      var ta = document.createElement("textarea");
      ta.value = txt; ta.style.cssText = "position:fixed;opacity:0;";
      document.body.appendChild(ta); ta.select(); document.execCommand("copy");
      document.body.removeChild(ta); flashIcon();
    }
  }

  function flashIcon() {
    if (!_iconEl) return;
    _iconEl.style.transform = "scale(0.85)";
    _iconEl.style.background = "rgba(76,175,80,0.25)";
    _iconEl.style.borderColor = "#4caf50";
    setTimeout(function () {
      if (!_iconEl) return;
      _iconEl.style.transform = "scale(1)";
      _iconEl.style.background = "rgba(255,255,255,0.94)";
      _iconEl.style.borderColor = "rgba(0,0,0,0.1)";
    }, 200);
  }

  function copyItem(ev, type, row, name) {
    ev.stopPropagation();
    ev.preventDefault();
    var txt;
    if (type === "text") {
      var clone = row.cloneNode(true);
      var users = clone.querySelectorAll(".username");
      for (var i = 0; i < users.length; i++) { users[i].parentNode.removeChild(users[i]); }
      txt = (clone.textContent || "").trim();
    } else if (type === "full") {
      txt = (row.textContent || "").trim();
    } else {
      txt = (name || "").replace(/:\s*$/, "").trim();
    }
    if (!txt) return;
    try {
      navigator.clipboard.writeText(txt).then(function () { flashItem(ev.target); });
    } catch (ex) {
      var ta = document.createElement("textarea");
      ta.value = txt;
      ta.style.cssText = "position:fixed;opacity:0;";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      flashItem(ev.target);
    }
  }

  function flashItem(el) {
    if (!el) return;
    var item = el.closest && el.closest(".tt-copy-item");
    if (!item) item = el;
    var origBG = item.style.background;
    item.style.background = "rgba(76,175,80,0.2)";
    setTimeout(function () { item.style.background = origBG; }, 600);
  }

  document.addEventListener("mousemove", function (e) {
    var now = Date.now();
    var dx = e.clientX - _lastMouseX;
    var dy = e.clientY - _lastMouseY;
    var dt = now - _lastMouseTime;
    _lastMouseX = e.clientX;
    _lastMouseY = e.clientY;
    _lastMouseTime = now;
    if (dt < 16) return;
    var speed = Math.sqrt(dx * dx + dy * dy) / dt;
    clearTimeout(_veloTimer);
    if (_pendingRow) {
      _veloTimer = setTimeout(function () {
        if (_pendingRow) {
          clearTimeout(_hideTimer);
          if (_menuEl) { _menuEl.style.opacity = "0"; _menuEl.style.pointerEvents = "none"; }
          showIcon(_pendingRow);
          _pendingRow = null;
        }
      }, speed > 0.5 ? 120 : 50);
    }
  }, true);

  document.addEventListener("mouseover", function (e) {
    if (!ensureChatMarked()) return;
    var chat = getChat();
    if (!chat) return;

    var el = e.target;
    if (!el || el.nodeType !== 1) return;

    if (isIconOrMenu(el)) { clearTimeout(_hideTimer); return; }

    if (!chat.contains(el)) { scheduleHide(); return; }

    if (isInteractive(el)) return;

    var selfTxt = (el.textContent || "").trim();
    var row = findMessageRow(el);
    if (!row || row === chat || selfTxt.length < 2) { scheduleHide(); return; }

    if (_currentRow === row) {
      if (_menuEl && _menuEl.style.opacity !== "0") return;
      clearTimeout(_hideTimer);
      return;
    }

    clearTimeout(_hideTimer);
    if (_menuEl) { _menuEl.style.opacity = "0"; _menuEl.style.pointerEvents = "none"; }
    _pendingRow = row;
    var now = Date.now();
    var dt = now - _lastMouseTime;
    var speed = dt > 0 ? Math.sqrt(Math.pow(e.clientX - _lastMouseX, 2) + Math.pow(e.clientY - _lastMouseY, 2)) / dt : 0;
    if (speed > 0.5 && dt < 200) { return; }
    var r = _pendingRow;
    _pendingRow = null;
    showIcon(r);
  }, true);

  document.addEventListener("mouseout", function (e) {
    var el = e.target;
    if (!el || el.nodeType !== 1) return;
    if (isIconOrMenu(el)) {
      var rel = e.relatedTarget;
      if (rel && chat && chat.contains(rel)) return;
      scheduleHideFast();
      return;
    }
    var chat = getChat();
    if (el === _currentRow || (_currentRow && _currentRow.contains(el))) {
      var rel2 = e.relatedTarget;
      if (rel2 && isIconOrMenu(rel2)) return;
      if (rel2 && chat && chat.contains(rel2)) return;
      scheduleHide();
    }
  }, true);

  console.log("[TT] icon-triggered copy menu ready");

  function hook() {
    var TT = window.TankTrouble;
    if (!TT || !TT.ChatBox) return false;
    var CB = TT.ChatBox;
    console.log("[TT] hooked V" + VERSION);

    // ---- 标记聊天框DOM（优先使用chatBody，fallback到chat） ----
    var chatEl = (CB.chatBody && CB.chatBody[0]) || (CB.chat && CB.chat[0]);
    if (chatEl) {
      chatEl.setAttribute("data-tt-chat-body", "1");
      console.log("[TT] marked chat body:", chatEl.tagName, chatEl.className || "(no class)");
    }

    // ---- 发送 ----
    var origSendChat = CB.sendChat;

    function showSendingIndicator() {
      var lang = settings.lang || "en";
      var text = SENDING_TEXT[lang] || SENDING_TEXT["en"];
      $(".tt-sending-indicator").remove();
      var indicator = $("<span class='tt-sending-indicator'>").text(text).css({
        position:"fixed",zIndex:"9999",right:"10px",bottom:"10px",
        color:"#fff",background:"rgba(0,0,0,0.7)",
        padding:"6px 12px",borderRadius:"4px",fontSize:"12px",
        display:"flex",alignItems:"center",gap:"6px"
      });
      var spinner = $("<span>").css({
        display:"inline-block",width:"12px",height:"12px",
        border:"2px solid #fff",borderTopColor:"transparent",
        borderRadius:"50%",animation:"tt-spin 1s linear infinite"
      });
      indicator.prepend(spinner);
      $("body").append(indicator);
    }

    function hideSendingIndicator() {
      $(".tt-sending-indicator").fadeOut(200, function(){ $(this).remove(); });
    }

    var spinStyle = document.createElement("style");
    spinStyle.textContent = "@keyframes tt-spin { to { transform: rotate(360deg); } }";
    document.head.appendChild(spinStyle);

    CB.sendChat = function () {
      if (this.chat.hasClass("send")) return;
      var val = this.chatInput.val();
      if (!val) return origSendChat.apply(this, arguments);
      var parsed = this._parseChat();

      if (this.recipientUsernames.length > 0) {
        var self = this;
        var hasNon = hasNonAscii(parsed);
        var text;
        if (hasNon && settings.enc) {
          text = settings.fmt === "v1" ? encodeV1(parsed) : encodeV2(parsed);
        } else {
          text = parsed;
        }
        if (hasNon && settings.enc) {
          text += V2_VER;
          if (settings.sig) text += " [Chat Unblocker]";
        }
        var usernames = this.recipientUsernames.slice();

        resolveRecipients(CB, usernames, function (ok, notFound) {
          if (ok) {
            self._sendChat(text);
          } else {
            var lang = settings.lang || "en";
            var isSelf = (notFound && notFound.length === 0);
            var msg = isSelf
              ? (MSG_SELF[lang] || MSG_SELF["en"])
              : (MSG_NO_RECIPIENTS[lang] || MSG_NO_RECIPIENTS["en"]);
            var bubbleColor = isSelf ? "#f0c040" : "#e53935";
            var arrowColor = isSelf ? "#f0c040" : "#e53935";
            $(".tt-err-bubble").remove();
            var off = self.chatInput.offset();
            var h = self.chatInput.outerHeight();
            var w = self.chatInput.outerWidth();
            var arrow = $("<span>").css({
              position:"absolute",left:"-6px",top:"50%",transform:"translateY(-50%)",
              width:"0",height:"0",borderTop:"5px solid transparent",
              borderBottom:"5px solid transparent",borderRight:"6px solid " + arrowColor
            });
            var bubble = $("<span class='tt-err-bubble'>").text(msg).css({
              position:"fixed",zIndex:"9999",left:(off.left+w+8)+"px",top:(off.top+h/2)+"px",
              transform:"translateY(-50%)",color: isSelf ? "#333" : "#fff",
              background:bubbleColor,
              padding:"4px 10px",borderRadius:"4px",fontSize:"12px",fontWeight:"bold",
              whiteSpace:"nowrap",boxShadow:"0 2px 6px rgba(0,0,0,.3)"
            });
            bubble.append(arrow).hide(); $("body").append(bubble);
            bubble.fadeIn(150).delay(2000).fadeOut(300,function(){$(this).remove();});
          }
        });
        return;
      }

      if (!hasNonAscii(parsed)) return origSendChat.apply(this, arguments);
      if (!parsed) return origSendChat.apply(this, arguments);

      var textToSend;
      if (settings.enc) {
        textToSend = settings.fmt === "v1" ? encodeV1(parsed) : encodeV2(parsed);
        textToSend += V2_VER;
        if (settings.sig) textToSend += " [Chat Unblocker]";
      } else {
        textToSend = parsed;
      }

      if (textToSend === _lastSentText && _isSending) {
        _sendQueue.push(textToSend);
        return;
      }

      _lastSentText = textToSend;
      _isSending = true;
      showSendingIndicator();

      var self = this;
      var origSend = this._sendChat;
      this._sendChat = function(text) {
        origSend.call(self, text);
        setTimeout(function() {
          _isSending = false;
          hideSendingIndicator();
          if (_sendQueue.length > 0) {
            var nextText = _sendQueue.shift();
            _lastSentText = nextText;
            _isSending = true;
            showSendingIndicator();
            self._sendChat(nextText);
          }
        }, 500);
      };

      this._sendChat(textToSend);
    };

    // ---- 接收 ----
    function storeRaw(raw) {
      try {
        var msgs = CB.messages;
        if (!msgs || msgs.length === 0) return;
        var lastMsg = msgs[msgs.length - 1];
        if (!lastMsg._raw) {
          lastMsg._raw = raw;
        }
      } catch (e) {}
    }

    function decodeMessage(m) {
      if (typeof m !== "string") return { decoded: null, isOld: false, isMixed: false };
      var hasV2 = isV2(m);
      var hasV1 = isV1(m);
      var decoded = null;
      var isOld = false;
      var isMixed = false;

      if (hasV2 && hasV1) {
        decoded = stripSig(decodeV1(decodeV2(m)));
        isMixed = true;
      } else if (hasV2) {
        decoded = stripSig(decodeV2(m));
      } else if (hasV1) {
        decoded = stripSig(decodeV1(m));
        isOld = true;
      }

      return { decoded: decoded, isOld: isOld, isMixed: isMixed };
    }

    function mkDec(orig, idx, label) {
      return function () {
        var m = arguments[idx];
        var raw = m;
        var result = decodeMessage(m);
        var decoded = result.decoded;
        var isOldFormat = result.isOld;
        var isMixed = result.isMixed;

        if (settings.enc && decoded) {
          var lang = settings.lang || "en";
          var label = "";
          if (isMixed) {
            label = (MIXED_LABEL[lang] || MIXED_LABEL["en"]) + " ";
          } else if (isOldFormat) {
            label = (V1_LABEL[lang] || V1_LABEL["en"]) + " ";
          }
          arguments[idx] = label + decoded;
        }
        var prevLen = CB.messages.length;
        var result = orig.apply(this, arguments);
        if (decoded) {
          if (prevLen < CB.messages.length) {
            storeRaw(raw);
          } else {
            // 消息可能被异步添加（首条消息/动画/批量场景），延迟重试确保 _raw 落位
            setTimeout(function () { storeRaw(raw); }, 50);
          }
        }
        return result;
      };
    }
    CB.addChatMessage       = mkDec(CB.addChatMessage,       1, "pub");
    CB.addGlobalChatMessage = mkDec(CB.addGlobalChatMessage, 1, "glo");
    CB.addUserChatMessage   = mkDec(CB.addUserChatMessage,   2, "prv");

    var origSys = CB.addSystemMessage;
    CB.addSystemMessage = function (p, m, u) {
      var raw = m;
      var result = decodeMessage(m);
      var decoded = result.decoded;
      var isOldFormat = result.isOld;
      var isMixed = result.isMixed;

      if (settings.enc && decoded) {
        var lang = settings.lang || "en";
        var label = "";
        if (isMixed) {
          label = (MIXED_LABEL[lang] || MIXED_LABEL["en"]) + " ";
        } else if (isOldFormat) {
          label = (V1_LABEL[lang] || V1_LABEL["en"]) + " ";
        }
        m = label + decoded;
      }
      var prevLen = CB.messages.length;
      var result = origSys.call(this, p, m, u);
      if (decoded) {
        if (prevLen < CB.messages.length) {
          storeRaw(raw);
        } else {
          // 与 mkDec 同步：异步添加时延迟重试
          setTimeout(function () { storeRaw(raw); }, 50);
        }
      }
      return result;
    };

    // ---- 复制按钮已在模块顶层初始化，此处确保标记 ----
    ensureChatMarked();
    console.log("[TT] copy menu ready (hook stage)");

    return true;
  }

  var n = 0;
  (function go() {
    n++;
    if (hook()) return;
    if (n < 30) setTimeout(go, 200);
    else console.warn("[TT] ChatBox not found");
  })();
})();
