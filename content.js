// TT Chat Unblock — MAIN world (V2.10)
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

  var VERSION = "2.10";
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
  var _sendHooked = false;      // _sendChat 是否已包装（移除游戏条纹 + 队列续发）

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

  var DUP_MSG = {
    en: "Repeated message blocked.",
    zh: "已拦截连续重复消息。",
    ja: "連続した重複メッセージをブロックしました。",
    ko: "연속 중복 메시지를 차단했습니다.",
    ru: "Повторное сообщение заблокировано.",
    ar: "تم حظر الرسالة المكررة.",
    fr: "Message répété bloqué.",
    es: "Mensaje repetido bloqueado.",
    de: "Wiederholte Nachricht blockiert.",
    pt: "Mensagem repetida bloqueada."
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
      _suppressGuard = true;   // 自身重绘：抑制翻译守卫误报
      CB._refreshChat(true);
      setTimeout(function () { _suppressGuard = false; }, 200);
      // 消息DOM全部重绘：旧行全部失效（异步重建时 pruneChecked 的断开检测不可靠），
      // 强制清空勾选/预览/常驻圆圈/工具栏数量，避免"勾选消失但数量不变"及后续点击状态紊乱
      hideAll();
      clearAllChecks();
      // 若鼠标仍停在消息区域：直接用新DOM行恢复按钮显示
      var curRow = getRowAtPoint(_lastMouseX, _lastMouseY, 52);
      if (curRow) showIcon(curRow);
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
    ".tt-copy-icon { transition: left 0.2s cubic-bezier(0.1,0.9,0.2,1.0), top 0.2s cubic-bezier(0.1,0.9,0.2,1.0), opacity 0.25s cubic-bezier(0.16,1,0.3,1), transform 0.18s cubic-bezier(0.34,1.56,0.64,1), background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease; }",
    ".tt-copy-icon::before { content:'';position:absolute;left:-8px;top:0;bottom:0;width:8px; }",
    ".tt-copy-icon:hover { background:rgba(255,255,255,0.97) !important; box-shadow:0 2px 8px rgba(0,0,0,0.18) !important; }",
    ".tt-copy-menu { transition: left 0.2s cubic-bezier(0.1,0.9,0.2,1.0), top 0.2s cubic-bezier(0.1,0.9,0.2,1.0), opacity 0.18s ease; }",
    // 多选小圆圈：3种状态（未选/待选/已选）+ 常驻已选；内部半透明、边缘不透明
    ".tt-check { position:fixed;z-index:99998;width:14px;height:14px;border-radius:50%;border:1.5px solid rgba(0,0,0,0.55);background:rgba(255,255,255,0.35);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:9px;color:#fff;opacity:0;pointer-events:none;box-sizing:border-box;transform:scale(0.5);transition:opacity 0.25s cubic-bezier(0.16,1,0.3,1),background 0.2s ease,border-color 0.2s ease,transform 0.3s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.2s ease,left 0.2s cubic-bezier(0.1,0.9,0.2,1.0),top 0.2s cubic-bezier(0.1,0.9,0.2,1.0); }",
    ".tt-check.show { opacity:1; pointer-events:auto; transform:scale(1); }",
    ".tt-check:hover { border-color:#2d8f4f;transform:scale(1.25);box-shadow:0 0 8px rgba(77,255,136,0.6); }",
    ".tt-check.preview { background:rgba(77,255,136,0.6);border-color:#2d8f4f;box-shadow:0 0 8px rgba(77,255,136,0.6); }",
    ".tt-check.checked { background:rgba(77,255,136,0.6);border-color:#2d8f4f;box-shadow:0 0 8px rgba(77,255,136,0.6);color:#000; }",
    ".tt-check.persist { opacity:1;pointer-events:auto;transform:scale(1);transition:opacity 0.25s cubic-bezier(0.16,1,0.3,1),background 0.2s ease,border-color 0.2s ease,transform 0.3s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.2s ease,left 0s,top 0s; }",   // 常驻圆圈 left/top 零过渡：滚动时与消息完全同步（不走追赶）
    ".tt-check.persist.anim { animation:tt-pop 0.35s cubic-bezier(0.34,1.56,0.64,1); }",
    "@keyframes tt-pop { 0% { transform:scale(0.3); opacity:0; } 60% { transform:scale(1.25); } 100% { transform:scale(1); opacity:1; } }",
    ".tt-fade { opacity:0 !important; pointer-events:none !important; transition:opacity 0.3s ease !important; }",
    // 消息行状态（选中/预览背景明显，绿线在左侧外部避免重叠文字，背景过渡）
    ".tt-row-checked { position:relative; isolation:isolate; box-shadow:-2px 0 0 rgba(77,255,136,0.85); transition:box-shadow 0.3s ease; }",
    ".tt-row-preview { position:relative; isolation:isolate; }",
    // 选中/待选高亮层：绿色只铺在名字区域之外（名字开关关闭时 left 右移到名字右边缘，名字+冒号露出原本背景，像没选中一样）
    ".tt-row-highlight { position:absolute;top:0;bottom:0;right:0;left:0;background:rgba(77,255,136,0.25);pointer-events:none;z-index:-1;transition:left 0.3s cubic-bezier(0.16,1,0.3,1),opacity 0.3s ease,background 0.3s ease; }",
    ".tt-row-highlight.hl-preview { background:rgba(77,255,136,0.12); }",
    // 多选工具栏（透明背景+浮空按钮，官网风格阴影）
    ".tt-multi-bar { position:fixed;z-index:99997;opacity:0;pointer-events:none;background:transparent;display:flex;align-items:center;gap:4px;transition:opacity 0.25s ease; }",
    ".tt-multi-bar.show { opacity:1;pointer-events:auto; }",
    ".tt-multi-bar .tt-mcount { padding:2px 4px;font-weight:700;font-size:12px;white-space:nowrap;color:#8f8f8f;text-shadow:0 2px 5px rgba(0,0,0,0.8),0 1px 0 rgba(0,0,0,0.35);-webkit-text-stroke:1.5px #fff;paint-order:stroke fill; }",
    ".tt-multi-bar .tt-mcount b { color:#4f8;font-weight:800;text-shadow:0 2px 5px rgba(0,0,0,0.8),0 0 10px rgba(77,255,136,0.85);-webkit-text-stroke:1.5px #fff;paint-order:stroke fill; }",
    ".tt-multi-bar .tt-mbtn { width:24px;height:24px;padding:0;border-radius:5px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:13px;color:#444;background:rgba(255,255,255,0.92);border:1px solid rgba(0,0,0,0.12);box-shadow:0 4px 12px rgba(0,0,0,0.55);transition:background 0.15s,transform 0.12s,box-shadow 0.15s,color 0.15s; }",
    ".tt-multi-bar .tt-mbtn:hover { background:#fff;transform:scale(1.08);box-shadow:0 5px 14px rgba(0,0,0,0.65); }",
    ".tt-multi-bar .tt-mbtn:active { transform:scale(0.94); }",
    ".tt-multi-bar .tt-mbtn-copy { color:#2d8f4f; }",
    ".tt-multi-bar .tt-mbtn-name { color:#666; }",
    ".tt-multi-bar .tt-mbtn-name.on { color:#2d8f4f;background:rgba(77,255,136,0.25);border-color:#2d8f4f; }",
    ".tt-multi-bar .tt-mbtn-batch { color:#8a6d1a; }",
    ".tt-multi-bar .tt-mbtn-batch.on { color:#2d8f4f;background:rgba(77,255,136,0.3);border-color:#2d8f4f; }",
    ".tt-multi-bar .tt-mbtn-clear { color:#c44; }",
    // 覆盖游戏发送中斜条纹视觉（配合 removeClass 双保险；只影响发送中的输入框）
    ".chat.send input, .chat.send textarea { background-image:none !important; }",
    // 发送中转圈：SVG 画弧动画（从一点逐渐画出，头部转动、尾巴拖出、变长到常态），速度稍快
    "@keyframes tt-rotate { to { transform: rotate(360deg); } }",
    "@keyframes tt-spin-dash { 0% { stroke-dasharray:0.1, 44; stroke-dashoffset:0; } 50% { stroke-dasharray:35, 44; stroke-dashoffset:-30; } 100% { stroke-dasharray:35, 44; stroke-dashoffset:-44; } }",
    ".tt-spin-svg { display:block; animation: tt-rotate 0.9s linear infinite; }",
    ".tt-spin-circle { stroke-dasharray:0.1, 44; animation: tt-spin-dash 0.9s ease-in-out infinite; }"
  ].join("\n");
  document.head.appendChild(style);

  // ---- 图标触发式复制菜单（悬停消息→图标→展开下拉菜单） ----
  var _iconEl = null;
  var _menuEl = null;
  var _currentRow = null;
  var _menuItems = [];
  var _chatContainerMarked = false;
  var _firstShow = true;
  var _lastMouseX = 0;
  var _lastMouseY = 0;
  var _lastMouseTime = 0;
  var _hoverCheckTimer = null;  // 鼠标输入合并防抖定时器（所有事件只调度状态机）
  var _hoverTarget = null;      // 状态机推导的目标行（null=隐藏）
  var _resizeTimer = null;
  var _resizing = false;

  // ---- 多选复制状态 ----
  var _checkEl = null;          // 小圆圈元素（hover/待选）
  var _checkedSet = [];         // 已勾选的消息行数组（保持顺序）
  var _checkedEls = [];         // 已勾选消息的常驻圆圈 {row, el}
  var _lastCheckedRow = null;   // 上次勾选的消息行（批量选择起点）
  var _batchMode = true;        // 批量选择模式（默认开启）
  var _previewRows = [];        // 当前hover预览的消息行数组
  var _statusBarEl = null;      // 多选工具栏元素（固定在输入栏上方）
  var _previewActive = false;   // 是否正在预览
  var _withNames = true;        // 复制时是否包含发消息者名字（默认包含）
  var _checkRow = null;         // 圆圈当前关联的消息行（切换动画用）
  var _checkToken = 0;          // 切换动画令牌，避免旧定时器覆盖新位置
  var _dragMoving = false;      // 正在拖动消息栏（位置连续变化）
  var _dragRAF = null;          // 拖动中的 rAF 跟随手势（每帧高频定位常驻圆圈/工具栏）
  var _lastChatPosKey = null;   // 上次chat容器位置（拖动检测）
  var _chatVisibleLast = false; // 上次轮询时聊天栏可见性（关闭/打开边沿检测）
  var _savedHoverRow = null;    // 关闭消息栏前最后hover的消息行（重新打开时恢复）
  var _repaintTimer = null;     // 翻译回归自动重绘防抖定时器
  var _repainting = false;      // 正在自动重绘（防循环）
  var _suppressGuard = false;   // 游戏/插件自身重绘期间抑制翻译守卫（避免误报）
  var _guardBound = false;      // 翻译守卫是否已绑定
  var _baseUsername = null;     // 基准.username引用（用于检测被浏览器翻译替换）
  var _origNameText = null;     // 人名原文文本（用于区分"翻译中"与"已回归原文"）
  var _translated = false;      // 是否检测到过翻译（文本偏离原文）；只有翻译过才允许回归时重绘

  var COPY_LABELS = {
    en: { icon: "\uD83D\uDCCB", copyText: "Copy text", copyName: "Copy name", copyFull: "Copy all", copied: "✓", title: "Copy message",
          checkTitle: "Select message", copySelText: "Copy selected messages", selected: "Selected: {0}", clear: "Clear", batchOn: "Batch: ON", batchOff: "Batch: OFF", nameToggle: "Include sender names: ON" },
    zh: { icon: "\uD83D\uDCCB", copyText: "复制内容", copyName: "复制名字", copyFull: "复制整条", copied: "✓", title: "复制消息内容",
          checkTitle: "勾选消息", copySelText: "复制选中消息", selected: "已选 {0} 条", clear: "清除", batchOn: "批量: 开", batchOff: "批量: 关", nameToggle: "包含发消息者名字：开" },
    ja: { icon: "\uD83D\uDCCB", copyText: "本文コピー", copyName: "名前コピー", copyFull: "全てコピー", copied: "✓", title: "メッセージをコピー",
          checkTitle: "メッセージ選択", copySelText: "選択中をコピー", selected: "選択中: {0}件", clear: "クリア", batchOn: "一括: オン", batchOff: "一括: オフ", nameToggle: "送信者名を含む: オン" },
    ko: { icon: "\uD83D\uDCCB", copyText: "내용 복사", copyName: "이름 복사", copyFull: "전체 복사", copied: "✓", title: "메시지 복사",
          checkTitle: "메시지 선택", copySelText: "선택 복사", selected: "선택됨: {0}개", clear: "삭제", batchOn: "일괄: 켜짐", batchOff: "일괄: 꺼짐", nameToggle: "보낸 사람 이름 포함: 켜짐" },
    ru: { icon: "\uD83D\uDCCB", copyText: "Копия текста", copyName: "Копия имени", copyFull: "Копия всего", copied: "✓", title: "Копировать сообщение",
          checkTitle: "Выбрать сообщение", copySelText: "Копировать выбранные", selected: "Выбрано: {0}", clear: "Очистить", batchOn: "Пакет: ВКЛ", batchOff: "Пакет: ВЫКЛ", nameToggle: "Включать имена: ВКЛ" },
    ar: { icon: "\uD83D\uDCCB", copyText: "نسخ النص", copyName: "نسخ الاسم", copyFull: "نسخ الكل", copied: "✓", title: "نسخ الرسالة",
          checkTitle: "تحديد الرسالة", copySelText: "نسخ المحدد", selected: "محدد: {0}", clear: "مسح", batchOn: "دفعة: تشغيل", batchOff: "دفعة: إيقاف", nameToggle: "تضمين الأسماء: تشغيل" },
    fr: { icon: "\uD83D\uDCCB", copyText: "Copier texte", copyName: "Copier nom", copyFull: "Tout copier", copied: "✓", title: "Copier le message",
          checkTitle: "Sélectionner le message", copySelText: "Copier la sélection", selected: "Sélectionné: {0}", clear: "Effacer", batchOn: "Lot: ON", batchOff: "Lot: OFF", nameToggle: "Inclure les noms: ON" },
    es: { icon: "\uD83D\uDCCB", copyText: "Copiar texto", copyName: "Copiar nombre", copyFull: "Copiar todo", copied: "✓", title: "Copiar mensaje",
          checkTitle: "Seleccionar mensaje", copySelText: "Copiar selección", selected: "Seleccionado: {0}", clear: "Limpiar", batchOn: "Lote: ON", batchOff: "Lote: OFF", nameToggle: "Incluir nombres: ON" },
    de: { icon: "\uD83D\uDCCB", copyText: "Text kopieren", copyName: "Name kopieren", copyFull: "Alles kopieren", copied: "✓", title: "Nachricht kopieren",
          checkTitle: "Nachricht auswählen", copySelText: "Auswahl kopieren", selected: "Ausgewählt: {0}", clear: "Löschen", batchOn: "Stapel: AN", batchOff: "Stapel: AUS", nameToggle: "Namen einschließen: AN" },
    pt: { icon: "\uD83D\uDCCB", copyText: "Copiar texto", copyName: "Copiar nome", copyFull: "Copiar tudo", copied: "✓", title: "Copiar mensagem",
          checkTitle: "Selecionar mensagem", copySelText: "Copiar seleção", selected: "Selecionado: {0}", clear: "Limpar", batchOn: "Lote: LIG", batchOff: "Lote: DES", nameToggle: "Incluir nomes: LIG" }
  };

  function _L(key) {
    var lang = settings.lang || "en";
    var map = COPY_LABELS[lang] || COPY_LABELS["en"];
    return map[key];
  }

  function updateCopyLabels() {
    if (_iconEl) { _iconEl.textContent = _L("icon"); _iconEl.title = _L("title"); }
    if (_checkEl) _checkEl.title = _L("checkTitle");
    // 已勾选消息的常驻圆圈标题同步换语言
    for (var i = 0; i < _checkedEls.length; i++) {
      if (_checkedEls[i].el) _checkedEls[i].el.title = _L("checkTitle");
    }
    // 工具栏有勾选时按新语言重建
    if (_statusBarEl && _checkedSet.length > 0) updateStatusBar();
    // 菜单当前打开 → 按新语言重建
    if (_menuEl && _menuEl.style.opacity !== "0" && _currentRow) showMenu();
  }

  function ensureChatMarked() {
    // 已标记的chat仍在DOM → 直接成功（避免chat容器被游戏重建后失效）
    var cur = document.querySelector("[data-tt-chat-body]");
    if (cur && cur.isConnected) return true;
    _chatContainerMarked = false;
    _guardBound = false;        // 聊天容器被重建：重置翻译守卫，使其绑定到新容器
    _baseUsername = null;
    _origNameText = null;
    _translated = false;
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

        initTranslateGuard();

        return true;
      }
    } catch (e) {}
    return false;
  }

  // ---- 浏览器翻译守卫 ----
  // 浏览器翻译（或翻译回归）会重建消息DOM，导致游戏在.username上挂的@点击绑定丢失。
  // 检测到基准.username元素被移除/替换后，防抖自动重绘消息，恢复@功能。
  function initTranslateGuard() {
    var chat = getChat();
    if (!chat || !window.MutationObserver || _guardBound) return;
    _guardBound = true;
    _baseUsername = chat.querySelector(".username");
    _origNameText = _baseUsername ? _baseUsername.textContent : null;
    _translated = false;
    new MutationObserver(function (mutations) {
      // 游戏/插件自身重绘期间忽略，避免误报
      if (_repainting || _suppressGuard) return;
      // 初始化时可能还没有消息：先记录当前基准，等待真正的替换
      if (!_baseUsername) {
        _baseUsername = chat.querySelector(".username");
        _origNameText = _baseUsername ? _baseUsername.textContent : null;
        return;
      }
      for (var i = 0; i < mutations.length; i++) {
        var m = mutations[i];
        if (m.type === "characterData") {
          // 浏览器翻译直接改写username文本：标记翻译状态（目标为username或其内文本节点）
          if (m.target === _baseUsername || (_baseUsername && _baseUsername.contains(m.target))) {
            if (_origNameText !== null && _baseUsername.textContent !== _origNameText) {
              _translated = true;   // 检测到译文
            } else if (_translated && _baseUsername.textContent === _origNameText) {
              _translated = false;  // 同一元素回归原文：@绑定仍在元素上，无需重绘
            }
          }
          continue;
        }
        if (m.type !== "childList") continue;
        for (var j = 0; j < m.removedNodes.length; j++) {
          var node = m.removedNodes[j];
          if (node === _baseUsername || (_baseUsername && node.contains && node.contains(_baseUsername))) {
            scheduleRepaint();
            return;
          }
        }
      }
    }).observe(chat, { childList: true, subtree: true, characterData: true });
  }

  function scheduleRepaint() {
    if (_repainting) return;
    clearTimeout(_repaintTimer);
    _repaintTimer = setTimeout(function () {
      if (_repainting) return;
      var chat = getChat();
      if (!chat) return;
      var nowUsername = chat.querySelector(".username");
      if (!nowUsername) return;
      // 元素未替换（仅文本变化已由 observer 标记处理）：无需重绘
      if (nowUsername === _baseUsername) return;
      // 新文本与原文不同 → 仍处于翻译状态（译文）：保持译文，仅推进基准，等回归原文后再恢复
      if (_origNameText !== null && nowUsername.textContent !== _origNameText) {
        _baseUsername = nowUsername;
        return;
      }
      // 新文本 == 原文：区分"游戏自身重绘"与"翻译回归"
      if (!_translated) {
        // 从未检测到翻译 → 游戏/插件自身的重绘（如关闭重开消息栏），@绑定已由游戏重新挂载，无需多余重绘
        _baseUsername = nowUsername;
        return;
      }
      // 确实翻译过且已回归原文：重绘消息，恢复游戏挂载在 .username 上的@绑定
      _translated = false;
      try {
        var CB = window.TankTrouble && window.TankTrouble.ChatBox;
        if (!CB || typeof CB._refreshChat !== "function") return;
        _repainting = true;
        hideAll();           // 清理hover状态（旧行引用已失效）
        pruneChecked();      // 清理被重建移除的勾选行
        CB._refreshChat(true);
        console.log("[TT] repaint after translate restore");
      } catch (e) {}
      setTimeout(function () {
        _repainting = false;
        _baseUsername = getChat() ? getChat().querySelector(".username") : null;
        _origNameText = _baseUsername ? _baseUsername.textContent : _origNameText;
      }, 250);
    }, 600);
  }

  // 清理已失效（被翻译/重绘/重建移除）的勾选消息行
  function pruneChecked() {
    var dead = [];
    for (var i = 0; i < _checkedSet.length; i++) {
      if (!_checkedSet[i] || !_checkedSet[i].isConnected) dead.push(_checkedSet[i]);
    }
    if (dead.length === 0) return;
    for (var d = 0; d < dead.length; d++) {
      var idx = _checkedSet.indexOf(dead[d]);
      if (idx !== -1) _checkedSet.splice(idx, 1);
      removeCheckedEl(dead[d]);
    }
    if (_checkedSet.length === 0) {
      _lastCheckedRow = null;
    } else if (_lastCheckedRow && !_lastCheckedRow.isConnected) {
      // 批量起点失效：回退到最后一个有效勾选行，避免批量操作拿到死引用
      _lastCheckedRow = _checkedSet[_checkedSet.length - 1];
    }
    updateStatusBar();   // 只要有失效行被清理，就同步工具栏数量
  }

  function getChat() { return document.querySelector("[data-tt-chat-body]"); }

  function getOrCreateIcon() {
      if (_iconEl) return _iconEl;
      _iconEl = document.createElement("div");
      _iconEl.className = "tt-copy-icon";
      _iconEl.style.cssText = "position:fixed;z-index:99998;opacity:0;pointer-events:none;width:24px;height:24px;box-sizing:border-box;display:flex;align-items:center;justify-content:center;font-size:14px;line-height:1;border-radius:4px;cursor:pointer;background:rgba(255,255,255,0.94);color:#555;border:1px solid rgba(0,0,0,0.1);box-shadow:0 1px 4px rgba(0,0,0,0.1);";
      _iconEl.textContent = _L("icon");
      _iconEl.title = _L("title");
      _iconEl.addEventListener("mouseenter", function () { showMenu(); });
      _iconEl.addEventListener("click", function (ev) { ev.stopPropagation(); copyRowText(); });
      document.body.appendChild(_iconEl);
      return _iconEl;
    }

  // ---- 多选：小圆圈 ----
  function getOrCreateCheck() {
    if (_checkEl) return _checkEl;
    _checkEl = document.createElement("div");
    _checkEl.className = "tt-check";
    _checkEl.title = _L("checkTitle");
    _checkEl.addEventListener("mouseenter", function () {
      // 即时显示按钮（预览的触发/清除统一由状态机 applyHover 按坐标管理，保证背景与圆圈实时一一对应）
      if (_currentRow) showIcon(_currentRow);
    });
    _checkEl.addEventListener("click", function (ev) {
      ev.stopPropagation();
      if (!_currentRow) return;
      if (_batchMode && _lastCheckedRow && _lastCheckedRow !== _currentRow) {
        confirmBatchCheck(_currentRow);
      } else {
        toggleCheck(_currentRow);
      }
    });
    document.body.appendChild(_checkEl);
    return _checkEl;
  }

  function isChecked(row) { return _checkedSet.indexOf(row) !== -1; }

  function getAllMessageRows() {
    var chat = getChat();
    if (!chat) return [];
    var rows = [];
    var children = chat.children;
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (c === chat || c.nodeType !== 1) continue;
      rows.push(c);
    }
    return rows;
  }

  function getRowsBetween(from, to) {
    var rows = getAllMessageRows();
    var i1 = rows.indexOf(from), i2 = rows.indexOf(to);
    if (i1 === -1 || i2 === -1) return [];
    var lo = Math.min(i1, i2), hi = Math.max(i1, i2);
    return rows.slice(lo, hi + 1);
  }

  // ---- 滚动可视区判断（消息列表过长时游戏产生滚动条+边缘淡出，附属浮层需随消息一起淡出） ----
  // 找到消息列表的滚动容器（overflow-y auto/scroll 且实际可滚动）；无则 null
  function getScrollContainer() {
    var el = getChat();
    if (!el) return null;
    for (var i = 0; i < 5 && el && el !== document.body; i++) {
      var cs = getComputedStyle(el);
      if ((cs.overflowY === "auto" || cs.overflowY === "scroll") && el.scrollHeight > el.clientHeight) return el;
      el = el.parentElement;
    }
    return null;
  }

  // 行在滚动容器可视区内的可见比例（0~1）；无滚动容器视为全可见
  function rowVisibleRatio(row) {
    var rr = row.getBoundingClientRect();
    if (rr.width <= 0 || rr.height <= 0) return 0;
    var top = rr.top, bottom = rr.bottom;
    // 滚动容器裁剪（消息列表滚动：行滚出列表可视区）
    var sc = getScrollContainer();
    if (sc) {
      var cr = sc.getBoundingClientRect();
      top = Math.max(top, cr.top);
      bottom = Math.min(bottom, cr.bottom);
    }
    // 视口裁剪（消息栏被拖出屏幕：行滚出视口）
    top = Math.max(top, 0);
    bottom = Math.min(bottom, window.innerHeight);
    if (bottom <= top) return 0;
    return Math.min(1, (bottom - top) / rr.height);
  }

  // 行是否在滚动容器可视区内（部分可见即视为可见）
  function rowInScrollView(row) {
    return rowVisibleRatio(row) > 0;
  }

  // 探测官网自定义滚动条（滚动条位于消息列表左侧，非原生滚动条，是游戏自绘的窄高条元素）：
  // 在聊天容器与其父级子树内找"窄(≤20px)且高(≥30%容器高)且贴左缘"的元素，取其左右边缘。
  // 结果缓存：容器 rect 变化立即重算；滚动条自身增删/移位（chat rect 不变）由 800ms 过期兜底自愈；
  // 重算间隔 ≥150ms 限频（拖动中每帧调用也不会高频扫描）。探测不到返回 null
  var _sbZone = { chat: null, key: "", left: 0, right: 0, t: 0 };
  function getLeftScrollbarZone() {
    var chat = getChat();
    if (!chat) return null;
    var cr = chat.getBoundingClientRect();
    var key = Math.round(cr.left) + "," + Math.round(cr.top) + "," + Math.round(cr.width) + "," + Math.round(cr.height);
    var now = Date.now();
    if (_sbZone.chat === chat && _sbZone.key === key && now - _sbZone.t < 800) return _sbZone.right > 0 ? _sbZone : null;
    if (_sbZone.chat === chat && now - _sbZone.t < 150) return _sbZone.right > 0 ? _sbZone : null;   // 扫描限频
    var left = 0, right = 0;
    var roots = [chat, chat.parentElement];
    for (var r = 0; r < roots.length; r++) {
      var root = roots[r];
      if (!root || root === document.body || root === document.documentElement) continue;
      var els = root.querySelectorAll("*");
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (el === chat) continue;
        var cls = " " + (typeof el.className === "string" ? el.className : "") + " ";
        if (cls.indexOf(" tt-") !== -1) continue;   // 跳过扩展自己的浮层/高亮层
        var rr = el.getBoundingClientRect();
        if (rr.width <= 0 || rr.height <= 0) continue;
        if (rr.width > 20) continue;                      // 窄条（滚动条粗细量级）
        if (rr.height < cr.height * 0.3) continue;        // 高条（接近列表高度，排除行内小元素）
        if (rr.right > cr.left + 60) continue;            // 贴左缘区域
        if (rr.right > right) { right = rr.right; left = rr.left; }
      }
    }
    if (right > 0 && right !== _sbZone.right) console.log("[TT] left scrollbar zone =", Math.round(left), "-", Math.round(right));
    _sbZone = { chat: chat, key: key, left: left, right: right, t: now };
    return right > 0 ? _sbZone : null;
  }

  // 统一圆圈定位：hover圆圈与常驻圆圈使用同一逻辑（以勾选后位置为准）；整体紧贴消息消除空隙
  function computeCheckPos(row) {
    var rect = row.getBoundingClientRect();
    var top = rect.top + rect.height / 2 - 12;
    // 位置完全跟随行的屏幕位置，不 clamp 到窗口边缘：
    // 行被拖出屏幕时圆圈随行一起移出视口，由 clip-path 边缘裁剪负责消失，
    // 避免多行同时出界时圆圈全部挤到屏幕边缘重叠
    var checkW = 14, iconW = 24, gap = 4;
    // 圆圈左置：右缘距消息左缘约一个圆圈宽（20px），给左侧滚动条留出充足空间不遮挡
    var checkLeft = Math.max(4, rect.left - checkW - 20);
    // 滚动条避让（官网自定义滚动条在消息左侧）：仅当自然位整组（图标左缘~圆圈右缘，留 3px 余量）
    // 与滚动条**实际重叠**时才推右（iconLeft ≥ 滚动条右缘+3）——整组已在滚动条左侧留白
    // （20px 间距的偏好位）或右侧时不干预；空间不足时圆圈右移（与用户名避让同一策略）
    var sb = getLeftScrollbarZone();
    var sbFloor = 0;
    if (sb) {
      var groupLeft = checkLeft - iconW - gap;
      var groupRight = checkLeft + checkW;
      if (groupRight + 3 > sb.left && groupLeft < sb.right + 3) {
        sbFloor = sb.right + 3 + iconW + gap;
      }
    }
    if (sbFloor > 0 && checkLeft < sbFloor) checkLeft = sbFloor;
    // 避让.username：圆圈+复制按钮整体范围不与名字重叠
    var users = row.querySelectorAll(".username");
    var checkRect = { left: checkLeft - iconW - gap, top: top, right: checkLeft + checkW, bottom: top + 24 };
    for (var i = 0; i < users.length; i++) {
      var uRect = users[i].getBoundingClientRect();
      if (rectsOverlap(checkRect, uRect)) {
        checkLeft = uRect.right + gap;
        checkRect = { left: checkLeft - iconW - gap, top: top, right: checkLeft + checkW, bottom: top + 24 };
        break;
      }
    }
    var maxRight = rect.right - checkW - 2;
    // 右界收敛仅在不低于滚动条避让下限时生效（避让优先级更高）
    if (checkLeft > maxRight && checkLeft > sbFloor) checkLeft = Math.max(maxRight, sbFloor, 4);
    if (checkLeft < 4) checkLeft = 4;
    var iconLeft = checkLeft - iconW - gap;
    if (iconLeft < 4) iconLeft = 4;
    return { checkLeft: checkLeft, iconLeft: iconLeft, top: top };
  }

  // 浮层按可见区域（滚动容器 ∩ 视口）边缘硬裁剪：与普通消息滚出列表时被直接挡住的行为一致
  // （替代旧的 opacity 随可见比例渐变淡出）；完全出界时整体裁空（clip 区域不响应点击）
  function applyEdgeClip(el) {
    var er = el.getBoundingClientRect();
    if (er.width <= 0 || er.height <= 0) return;
    var t = 0, b = window.innerHeight;
    var sc = getScrollContainer();
    if (sc) {
      var cr = sc.getBoundingClientRect();
      t = Math.max(t, cr.top);
      b = Math.min(b, cr.bottom);
    }
    var ct = Math.max(0, t - er.top);
    var cb = Math.max(0, er.bottom - b);
    el.style.clipPath = (ct + cb > 0) ? ("inset(" + ct + "px 0px " + cb + "px 0px)") : "";
  }

  // 已选消息的常驻圆圈
  function positionCheckedEl(row, el) {
    // 消息行已被移除（游戏重渲染）：圆圈淡出，避免瞬移到左上角
    if (!row || !row.isConnected) { el.classList.add("tt-fade"); return; }
    // 位置始终跟随行（即使不可见也定位到正确位置）；可见性用 clip-path 按列表/视口边缘
    // 硬裁剪（滚出列表像普通消息一样被直接挡住，不再 opacity 渐变淡出），恢复后自动回来，跟随永不中断
    el.classList.remove("tt-fade");
    var p = computeCheckPos(row);
    el.style.left = p.checkLeft + "px";
    el.style.top = (p.top + 5) + "px";
    applyEdgeClip(el);
  }

  function createCheckedEl(row) {
    var el = document.createElement("div");
    el.className = "tt-check checked persist anim";
    el.textContent = "✓";
    el.title = _L("checkTitle");
    el.addEventListener("mouseenter", function () {
      if (_currentRow !== row) showIcon(row);
    });
    el.addEventListener("click", function (ev) {
      ev.stopPropagation();
      toggleCheck(row);
    });
    document.body.appendChild(el);
    positionCheckedEl(row, el);
    return el;
  }

  function removeCheckedEl(row) {
    for (var i = 0; i < _checkedEls.length; i++) {
      if (_checkedEls[i].row === row) {
        if (_checkedEls[i]._fol) removeFollower(_checkedEls[i]._fol);
        _checkedEls[i].el.remove();
        _checkedEls.splice(i, 1);
        return;
      }
    }
  }

  function chatVisible() {
    var chat = getChat();
    if (!chat) return false;
    if (chat.getClientRects().length > 0) return true;
    // 兜底：chat 自身无 rect（如滚动容器塌陷/高度为0），但存在可见消息行 → 视为聊天打开，避免误判导致圆圈不显示
    for (var i = 0; i < chat.children.length; i++) {
      var c = chat.children[i];
      if (!c || c.nodeType !== 1 || c === chat) continue;
      var r = c.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) return true;
    }
    return false;
  }

  function updateCheckedPositions() {
    var vis = chatVisible();
    if (!vis) {
      // 消息栏关闭：常驻圆圈+工具栏淡出（hover状态由 applyHover 统一隐藏并保存恢复行），不清除勾选
      _chatVisibleLast = false;
      for (var i = 0; i < _checkedEls.length; i++) _checkedEls[i].el.classList.add("tt-fade");
      if (_statusBarEl && _statusBarEl.classList.contains("show")) _statusBarEl.classList.add("tt-fade");
      applyHover();
      return;
    }
    for (var i = 0; i < _checkedEls.length; i++) {
      var c = _checkedEls[i];
      if (!_dragMoving) c.el.classList.remove("tt-fade");
      positionCheckedEl(c.row, c.el);
    }
    if (_statusBarEl) {
      if (!_dragMoving) _statusBarEl.classList.remove("tt-fade");
      if (_statusBarEl.classList.contains("show")) positionMultiBar();
    }
    if (_dragMoving) {
      // 拖动中：hover淡出，位置跟随由常驻逻辑处理；拖动结束由 endDrag 恢复
      if (_iconEl && _iconEl.style.opacity !== "0" && !_iconEl.classList.contains("tt-fade")) _iconEl.classList.add("tt-fade");
      if (_checkEl && _checkEl.classList.contains("show")) _checkEl.classList.add("tt-fade");
      return;
    }
    if (_iconEl) _iconEl.classList.remove("tt-fade");
    if (_checkEl) _checkEl.classList.remove("tt-fade");
    // hover 状态机：显示/隐藏/位置/关闭恢复统一推导
    applyHover();
  }

  // 拖动结束：清空拖动前残留的hover状态，恢复常驻元素定位；
  // 随后 applyHover 按鼠标坐标决定是否恢复按钮显示（拖动结束一般鼠标在标题栏，保持隐藏）
  function endDrag() {
    _dragMoving = false;
    hideAll();
    updateCheckedPositions();
  }

  // ============ 物理跟随系统 ============
  // 拖动消息栏时，所有 fixed 定位的扩展浮层（常驻圆圈/工具栏/错误气泡）用弹簧物理追赶目标，
  // 替代直接瞬移：猛烈拖动时平滑滑行、停止后惯性收尾；质量越大惯性越大、越平滑
  var _followers = [];   // [{el, mass, stiff, damp, cx, cy, vx, vy, getTarget}]
  var _barFollower = null;
  var _scrollBound = null;    // 已绑定 scroll 同步的消息列表滚动容器
  var _chatScrollRAF = false; // 滚动同步的 rAF 合并标志（每帧最多一次定位）

  // 滚动容器滚动：rAF 合并后立即同步圆圈位置（与消息完全同步，替代 100ms 轮询的延迟）
  function onChatScroll() {
    if (_chatScrollRAF) return;
    _chatScrollRAF = true;
    requestAnimationFrame(function () {
      _chatScrollRAF = false;
      updateCheckedPositions();
      scheduleHoverCheck();
    });
  }

  function addFollower(f) { _followers.push(f); }
  function removeFollower(f) {
    var i = _followers.indexOf(f);
    if (i !== -1) _followers.splice(i, 1);
  }

  // 弹簧物理一步积分；返回是否已收敛到目标
  function stepFollower(f) {
    if (!f.el || !f.el.isConnected) { removeFollower(f); return true; }
    var t = f.getTarget ? f.getTarget() : null;
    if (!t) {
      // 目标暂时失效（行刚被移除，等待 removeCheckedEl 清理）：不定位也不移除跟随，防止 rAF 卡死
      return true;
    }
    f.vx = (f.vx + (t.x - f.cx) * f.stiff / f.mass) * f.damp;
    f.vy = (f.vy + (t.y - f.cy) * f.stiff / f.mass) * f.damp;
    f.cx += f.vx;
    f.cy += f.vy;
    f.el.style.left = Math.round(f.cx) + "px";
    f.el.style.top = Math.round(f.cy) + "px";
    return Math.abs(t.x - f.cx) < 0.5 && Math.abs(t.y - f.cy) < 0.5 &&
           Math.abs(f.vx) < 0.5 && Math.abs(f.vy) < 0.5;
  }

  function stepFollowers() {
    var settled = true;
    for (var i = 0; i < _followers.length; i++) {
      if (!stepFollower(_followers[i])) settled = false;
    }
    return settled;
  }

  // 拖动开始时注册/同步所有需物理跟随的浮层（圆圈小质量轻快跟手，工具栏大质量有惯性）
  function syncFollowers() {
    for (var i = 0; i < _checkedEls.length; i++) {
      var c = _checkedEls[i];
      // follower 不存在或已被移出数组（极端情况下被清理）：重建并重新注册，避免圆圈残留原地
      if (!c._fol || _followers.indexOf(c._fol) === -1) {
        // IIFE 捕获本次迭代的行与元素：避免 var 闭包陷阱（所有 getTarget 共享同一个 row 变量，
        // 会全部跟随最后一行导致拖动时圆圈重合）
        (function (row, el) {
          c._fol = {
            el: el,
            mass: 0.5, stiff: 0.09, damp: 0.86,
            cx: 0, cy: 0, vx: 0, vy: 0,
            getTarget: function () {
              // 仅行真正被移除时才失效；行滚出可视区/拖出屏幕时**仍返回坐标**（跟随不断流），
              // 可见性由 clip-path 边缘裁剪独立控制（按元素实际渲染位置计算）——
              // 返回 null 会触发跟随移除导致圆圈残留
              if (!row || !row.isConnected) return null;
              applyEdgeClip(el);
              var p = computeCheckPos(row);
              return { x: p.checkLeft, y: p.top + 5 };
            }
          };
          addFollower(c._fol);
        })(c.row, c.el);
      }
    }
    if (_statusBarEl && !_barFollower) {
      _barFollower = {
        el: _statusBarEl,
        mass: 1.5, stiff: 0.07, damp: 0.82,
        cx: 0, cy: 0, vx: 0, vy: 0,
        getTarget: computeBarPos
      };
      addFollower(_barFollower);
    }
    // 同步初始位置与速度，避免从旧位置跳变
    for (var i = 0; i < _followers.length; i++) {
      var f = _followers[i];
      f.cx = parseFloat(f.el.style.left) || 0;
      f.cy = parseFloat(f.el.style.top) || 0;
      f.vx = 0; f.vy = 0;
    }
  }

  // 拖动跟随手势：rAF 每帧做弹簧物理积分，拖动中平滑追赶、停止后惯性滑行收尾
  function startDragRAF() {
    if (_dragRAF) return;
    updateCheckedPositions();   // 立即进入拖动分支（hover 淡出）
    syncFollowers();            // 注册/同步物理跟随浮层
    var lastKey = _lastChatPosKey;
    var idle = 0;
    function frame() {
      var chat = getChat();
      if (!chat) { cleanupDrag(); return; }
      var rr = chat.getBoundingClientRect();
      var key = (rr.width > 0 && rr.height > 0) ? Math.round(rr.left) + "," + Math.round(rr.top) : "";
      if (!key) { cleanupDrag(); return; }
      if (key !== lastKey) { idle = 0; lastKey = key; }
      else { idle++; }
      var settled = stepFollowers();   // 每帧物理积分（拖动中追赶，停止后滑行收尾）
      if (idle >= 20 && settled) {
        _lastChatPosKey = key;
        cleanupDrag();
        return;
      }
      _dragRAF = requestAnimationFrame(frame);
    }
    _dragRAF = requestAnimationFrame(frame);
  }

  function stopDragRAF() {
    if (_dragRAF) { cancelAnimationFrame(_dragRAF); _dragRAF = null; }
  }

  // 拖动彻底结束：物理已收敛，收尾清理
  function cleanupDrag() {
    _dragMoving = false;
    stopDragRAF();
    endDrag();
  }

  // 滚动/窗口变化时更新常驻圆圈与工具栏位置（轻量轮询）
  window.addEventListener("resize", updateCheckedPositions);
  setInterval(function () {
    // 绑定消息列表滚动容器的 scroll 同步（懒绑定：滚动容器出现后一次性绑定，断开后重新绑定）
    if (_scrollBound && !_scrollBound.isConnected) _scrollBound = null;
    if (!_scrollBound) {
      var sc = getScrollContainer();
      if (sc) {
        sc.addEventListener("scroll", onChatScroll);
        _scrollBound = sc;
      }
    }
    // 兜底：chat 容器被游戏重建后立即重新标记，避免 getChat()=null 导致圆圈/复制按钮永不显示
    ensureChatMarked();
    // 拖动检测：chat 位置变化 → 启动 rAF 高频跟随手势；结束检测在 rAF 帧内完成
    var chat = getChat();
    if (chat) {
      var rr = chat.getBoundingClientRect();
      var key = (rr.width > 0 && rr.height > 0) ? Math.round(rr.left) + "," + Math.round(rr.top) : "";
      if (!key) {
        // 聊天不可见：结束拖动
        if (_dragMoving) { _dragMoving = false; stopDragRAF(); _lastChatPosKey = null; endDrag(); }
      } else {
        if (_lastChatPosKey !== null && key !== _lastChatPosKey && !_dragMoving) {
          _dragMoving = true;
          startDragRAF();
        }
        _lastChatPosKey = key;
      }
    }
    // 非拖动：低频更新常驻位置 + hover 状态机
    if (!_dragMoving &&
        (_checkedEls.length > 0 ||
         (_statusBarEl && _statusBarEl.classList.contains("show")) ||
         (_checkEl && _checkEl.classList.contains("show")) ||
         (_iconEl && _iconEl.style.opacity !== "0"))) {
      updateCheckedPositions();
      // 滚动/移动后刷新 hover：已滚出可视区的行不再显示普通圆圈/复制按钮
      scheduleHoverCheck();
    }
  }, 100);

  function toggleCheck(row) {
    var idx = _checkedSet.indexOf(row);
    if (idx === -1) {
      _checkedSet.push(row);
      _lastCheckedRow = row;
      row.classList.add("tt-row-checked");
      // 立即移出待选预览集合：否则轮询 clearPreview 会无差别移除该行高亮层，
      // 把已转为勾选样式的绿色背景误删（直到下次 applyNameExclude 才重建，造成闪烁）
      var pIdx = _previewRows.indexOf(row);
      if (pIdx !== -1) {
        row.classList.remove("tt-row-preview");
        _previewRows.splice(pIdx, 1);
      }
      _checkedEls.push({ row: row, el: createCheckedEl(row) });
      // 勾选瞬间hover圆圈隐藏+常驻圆圈出现会触发鼠标目标切换：确保图标保持可见（状态机随后统一接管）
      if (_iconEl && _iconEl.style.opacity === "0") { _iconEl.style.pointerEvents = "auto"; _iconEl.style.opacity = "1"; }
    } else {
      _checkedSet.splice(idx, 1);
      row.classList.remove("tt-row-checked");
      // 高亮层不瞬删：批量模式保留复用（下方转预览样式，背景色渐变不闪）；
      // 单选模式无预览态接管 → 淡出移除
      if (!_batchMode) fadeRemoveHighlight(row);
      removeCheckedEl(row);
      if (_lastCheckedRow === row) _lastCheckedRow = _checkedSet.length > 0 ? _checkedSet[_checkedSet.length - 1] : null;
      // 取消勾选：标记待选预览状态（圆圈过渡 + 行淡绿背景），仅批量模式需要；
      // 单选模式由状态机忽略，不残留，避免重开消息栏后预览样式错乱
      if (_batchMode) {
        _previewActive = true;
        if (_previewRows.indexOf(row) === -1) {
          row.classList.add("tt-row-preview");
          _previewRows.push(row);
        }
      }
      // 正在与圆圈交互：确保按钮保持显示（状态机随后统一接管）
      showIcon(row);
    }
    applyNameExclude();
    updateCheckDisplay();
    updateStatusBar();
  }

  function showPreview(targetRow) {
    var rows;
    if (_lastCheckedRow && _lastCheckedRow !== targetRow) {
      rows = getRowsBetween(_lastCheckedRow, targetRow);
    } else {
      rows = [targetRow]; // 无起点（或起点即目标）：预览当前消息本身
    }
    // 目标集合（跳过起点与已勾选行——已选行保持勾选样式，不参与待选预览）
    var keep = [];
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      if (r === _lastCheckedRow) continue;
      if (!isChecked(r)) keep.push(r);
    }
    // 差量更新：只动变化的行。范围连续变化（悬停逐行移动）时，共有行的高亮层保留不重建，
    // 避免整段背景反复"消失→淡入"闪烁；新增行淡入、移除行即时清除
    var changed = keep.length !== _previewRows.length;
    if (!changed) {
      for (var i = 0; i < keep.length; i++) {
        if (keep[i] !== _previewRows[i]) { changed = true; break; }
      }
    }
    for (var i = 0; i < _previewRows.length; i++) {
      var old = _previewRows[i];
      if (keep.indexOf(old) === -1) {
        old.classList.remove("tt-row-preview");
        fadeRemoveHighlight(old);
      }
    }
    for (var i = 0; i < keep.length; i++) {
      if (_previewRows.indexOf(keep[i]) === -1) keep[i].classList.add("tt-row-preview");
    }
    _previewRows = keep;
    _previewActive = true;
    if (changed) {
      applyNameExclude(); // 统一创建淡绿高亮层（名字区域联动；共有层复用不重放淡入）
      updateCheckDisplay();
    }
  }

  function clearPreview() {
    for (var i = 0; i < _previewRows.length; i++) {
      _previewRows[i].classList.remove("tt-row-preview");
      fadeRemoveHighlight(_previewRows[i]);
    }
    _previewRows = [];
    _previewActive = false;
    updateCheckDisplay();
  }

  function confirmBatchCheck(targetRow) {
    clearPreview();
    if (!_lastCheckedRow || !targetRow) { toggleCheck(targetRow); return; }
    var rows = getRowsBetween(_lastCheckedRow, targetRow);
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      if (!isChecked(r)) {
        _checkedSet.push(r);
        r.classList.add("tt-row-checked");
        _checkedEls.push({ row: r, el: createCheckedEl(r) });
      }
    }
    _lastCheckedRow = targetRow;
    applyNameExclude();
    updateCheckDisplay();
    updateStatusBar();
  }

  function clearAllChecks() {
    for (var i = 0; i < _checkedEls.length; i++) _checkedEls[i].el.remove();
    _checkedEls = [];
    for (var i = 0; i < _checkedSet.length; i++) {
      fadeRemoveHighlight(_checkedSet[i]);
      _checkedSet[i].classList.remove("tt-row-checked");
    }
    _checkedSet = [];
    _lastCheckedRow = null;
    clearPreview();
    updateCheckDisplay();
    updateStatusBar();
  }

  // 高亮层淡出移除：不再瞬删（背景会突然消失），透明度过渡 0.3s 后再移除节点；
  // 淡出途中行被重新选中/预览时由 attachRowHighlight 取消移除并复位
  function fadeRemoveHighlight(row) {
    var hl = row.querySelector(".tt-row-highlight");
    if (!hl) return;
    hl.style.opacity = "0";
    clearTimeout(hl._rmTimer);
    hl._rmTimer = setTimeout(function () {
      if (hl.style.opacity === "0") hl.remove();
    }, 320);
  }

  // 创建/复用行的绿色高亮层（preview=true 用淡绿）；新建带淡入，复用同步样式：
  // 取消 pending 淡出移除、切换 hl-preview（背景色走 transition 渐变，不瞬变）、复位透明度
  function attachRowHighlight(row, preview) {
    var hl = row.querySelector(".tt-row-highlight");
    if (!hl) {
      hl = document.createElement("div");
      hl.className = "tt-row-highlight" + (preview ? " hl-preview" : "");
      hl.style.opacity = "0";
      row.appendChild(hl);
      void hl.offsetWidth;
    }
    clearTimeout(hl._rmTimer);
    hl.classList.toggle("hl-preview", !!preview);
    hl.style.opacity = "1";
    return hl;
  }

  // 名字开关联动：关闭时绿色高亮层从名字右边缘开始铺（名字+冒号区域保持原本背景，像没选中一样）；
  // 开启时高亮层铺满整行。勾选行与待选行统一处理。复制逻辑同样以 _withNames 为准。
  function applyNameExclude() {
    var rows = _checkedSet.concat(_previewRows);
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      if (!row || !row.isConnected) continue;
      var isChk = row.classList.contains("tt-row-checked");
      var isPrev = !isChk && row.classList.contains("tt-row-preview");
      if (!isChk && !isPrev) continue; // 圆圈预览等无行背景状态：跳过
      // attachRowHighlight 内部统一同步 hl-preview（preview↔checked 背景色渐变，不瞬变）
      var hl = attachRowHighlight(row, isPrev);
      if (_withNames) {
        hl.style.left = "0px";
      } else {
        var end = 0;
        var sender = row.querySelector(".username");
        if (sender) {
          var rowRect = row.getBoundingClientRect();
          var uRect = sender.getBoundingClientRect();
          end = uRect.right - rowRect.left;
          // 名字后紧跟的冒号文本节点 → 一并纳入排除区（露出的背景保持原本状态）
          var sib = sender.nextSibling;
          if (sib && sib.nodeType === 3 && /^[\s]*[:：]/.test(sib.textContent)) {
            var r2 = document.createRange();
            r2.setStart(sib, 0);
            r2.setEnd(sib, sib.length);
            end = r2.getBoundingClientRect().right - rowRect.left;
          }
        }
        hl.style.left = Math.max(0, Math.ceil(end)) + "px";
      }
    }
  }

  // 集中式圆圈状态机：唯一的状态计算+应用入口，杜绝class散落叠加冲突
  // state: hidden | idle | preview | checked
  function applyCheckState(state) {
    var el = _checkEl;
    if (!el) return;
    // 幂等应用：仅当状态变化才触碰class（避免打断进行中的过渡动画）
    if (state === "hidden") {
      if (el.classList.contains("show")) el.classList.remove("show");
    } else {
      if (!el.classList.contains("show")) el.classList.add("show");
    }
    if (state === "preview" && !el.classList.contains("preview")) el.classList.add("preview");
    else if (state !== "preview" && el.classList.contains("preview")) el.classList.remove("preview");
    if (state === "checked" && !el.classList.contains("checked")) el.classList.add("checked");
    else if (state !== "checked" && el.classList.contains("checked")) el.classList.remove("checked");
    el.textContent = state === "checked" ? "✓" : "";
  }

  function computeCheckState() {
    if (!_currentRow) return "hidden";
    if (isChecked(_currentRow)) return "hidden"; // 已选由常驻圆圈显示
    // 待选（中心绿）只在批量模式生效：批量待选=中心绿+边缘发光绿；
    // 单选模式待选=idle+hover（仅边缘发光绿，无中心绿），用作两种模式的视觉区分
    if (_batchMode && _previewActive && _previewRows.indexOf(_currentRow) !== -1) return "preview";
    return "idle";
  }

  function updateCheckDisplay() {
    applyCheckState(computeCheckState());
  }

  function showCheck(row, checkLeft, iconTop) {
    var check = getOrCreateCheck();
    check.title = _L("checkTitle");
    var top = iconTop + 5;
    var token = ++_checkToken;
    // 落位前禁用 left/top 过渡（淡入前精确到位，不做位移动画）；随后恢复走类样式
    var place = function () {
      var saved = check.style.transition;
      check.style.transition = "left 0s, top 0s";
      check.style.left = checkLeft + "px";
      check.style.top = top + "px";
      void check.offsetWidth;
      check.style.transition = saved;
    };
    if (_checkRow && _checkRow !== row) {
      // 切换到新消息：圆圈先在旧位置独立淡出，再到新位置淡入（不做位移动画）
      check.classList.remove("show");
      setTimeout(function () {
        if (token !== _checkToken) return; // 已有更新的切换
        place();
        updateCheckDisplay();
      }, 140);
    } else {
      // 首次显示/恢复：先渲染一帧隐藏态，再淡入（保证从无到有也有动画）
      place();
      check.classList.remove("show");
      setTimeout(function () {
        if (token !== _checkToken) return;
        updateCheckDisplay();
      }, 30);
    }
    _checkRow = row;
  }

  // ---- 多选工具栏（固定在输入栏上方） ----
  function getOrCreateStatusBar() {
    if (_statusBarEl) return _statusBarEl;
    _statusBarEl = document.createElement("div");
    _statusBarEl.className = "tt-multi-bar";
    document.body.appendChild(_statusBarEl);
    return _statusBarEl;
  }

  function getChatInputEl() {
    try {
      var TT = window.TankTrouble;
      if (TT && TT.ChatBox && TT.ChatBox.chatInput && TT.ChatBox.chatInput[0]) return TT.ChatBox.chatInput[0];
    } catch (e) {}
    return null;
  }

  // 计算工具栏目标位置（供 positionMultiBar 与物理跟随共用）
  function computeBarPos() {
    var bar = getOrCreateStatusBar();
    var input = getChatInputEl();
    var left = 8, top = 8;
    if (input) {
      var r = input.getBoundingClientRect();
      left = r.left;
      top = r.top - bar.offsetHeight - 6;
      if (top < 4) top = r.bottom + 6;
    }
    var barW = bar.offsetWidth || 160;
    if (left + barW > window.innerWidth - 4) left = window.innerWidth - barW - 4;
    if (left < 4) left = 4;
    return { x: left, y: top };
  }

  function positionMultiBar() {
    var p = computeBarPos();
    var bar = getOrCreateStatusBar();
    bar.style.left = p.x + "px";
    bar.style.top = p.y + "px";
  }

  function updateStatusBar() {
    var bar = getOrCreateStatusBar();
    var n = _checkedSet.length;
    if (n === 0) { bar.classList.remove("show"); return; }
    var selText = escapeHTML((_L("selected") || "Selected: {0}")).replace("{0}", "<b>" + n + "</b>");
    bar.innerHTML =
      '<span class="tt-mcount">' + selText + '</span>' +
      '<span class="tt-mbtn tt-mbtn-copy" data-act="copy" title="' + escapeHTML(_L("copySelText")) + '">\uD83D\uDCC4</span>' +
      '<span class="tt-mbtn tt-mbtn-name ' + (_withNames ? "on" : "") + '" data-act="name" title="' + escapeHTML(_L("nameToggle")) + '">\uD83D\uDC64</span>' +
      '<span class="tt-mbtn tt-mbtn-batch ' + (_batchMode ? "on" : "") + '" data-act="batch" title="' + escapeHTML(_batchMode ? _L("batchOn") : _L("batchOff")) + '">\u21C5</span>' +
      '<span class="tt-mbtn tt-mbtn-clear" data-act="clear" title="' + escapeHTML(_L("clear")) + '">\u2715</span>';
    positionMultiBar();
    bar.classList.add("show");
  }

  // 工具栏事件委托
  document.addEventListener("click", function (e) {
    if (!_statusBarEl || !_statusBarEl.contains(e.target)) return;
    var btn = e.target.closest(".tt-mbtn");
    if (!btn) return;
    var act = btn.getAttribute("data-act");
    if (act === "copy") copySelected();
    else if (act === "name") { _withNames = !_withNames; updateStatusBar(); applyNameExclude(); }
    else if (act === "batch") { _batchMode = !_batchMode; clearPreview(); updateStatusBar(); scheduleHoverCheck(); }
    else if (act === "clear") clearAllChecks();
  }, true);

  // 复制选中消息：_withNames=true 含发消息者名字；false 只去掉发消息者名字+冒号，保留@提及
  function copySelected() {
    if (_checkedSet.length === 0) return;
    var parts = [];
    for (var i = 0; i < _checkedSet.length; i++) {
      var row = _checkedSet[i];
      var clone = row.cloneNode(true);
      if (!_withNames) {
        var sender = clone.querySelector(".username");
        if (sender) {
          // 去掉紧随发消息者名字后的"冒号+空格"：兼容文本节点与仅含冒号的元素节点
          var sib = sender.nextSibling;
          while (sib) {
            if (sib.nodeType === 3) {
              var m = /^[\s]*[:：][\s]*/.exec(sib.textContent);
              if (m) sib.textContent = sib.textContent.slice(m[0].length);
              if (sib.textContent) break;
              sib.parentNode.removeChild(sib);
              sib = sender.nextSibling;
              continue;
            }
            if (sib.nodeType === 1) {
              if (/^[\s]*[:：][\s]*$/.test(sib.textContent || "")) {
                sib.parentNode.removeChild(sib);
                sib = sender.nextSibling;
                continue;
              }
              break;
            }
            break;
          }
          sender.remove();
        }
      }
      parts.push((clone.textContent || "").trim());
    }
    var txt = parts.join("\n");
    if (!txt) return;
    try { navigator.clipboard.writeText(txt).then(function () { flashStatusBar(); }); }
    catch (ex) {
      var ta = document.createElement("textarea");
      ta.value = txt; ta.style.cssText = "position:fixed;opacity:0;";
      document.body.appendChild(ta); ta.select(); document.execCommand("copy");
      document.body.removeChild(ta); flashStatusBar();
    }
  }

  function flashStatusBar() {
    if (!_statusBarEl) return;
    var oldBorder = _statusBarEl.style.border;
    var oldShadow = _statusBarEl.style.boxShadow;
    // 复制成功：工具栏边缘闪绿（圆角边框+光晕）
    _statusBarEl.style.border = "1px solid rgba(77,255,136,0.9)";
    _statusBarEl.style.boxShadow = "0 0 16px rgba(77,255,136,0.8)";
    setTimeout(function () {
      if (!_statusBarEl) return;
      _statusBarEl.style.border = oldBorder;
      _statusBarEl.style.boxShadow = oldShadow;
    }, 500);
  }

    function getOrCreateMenu() {
      if (_menuEl) return _menuEl;
      _menuEl = document.createElement("div");
      _menuEl.className = "tt-copy-menu";
      _menuEl.style.cssText = "position:fixed;z-index:99999;opacity:0;pointer-events:none;border-radius:6px;background:rgba(255,255,255,0.96);border:1px solid rgba(0,0,0,0.1);box-shadow:0 4px 16px rgba(0,0,0,0.14);padding:4px 0;min-width:140px;font-size:12px;color:#333;";
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
    // 聊天栏正被关闭（chat已不可见）：保存关闭前的hover行，供重新打开消息栏时按原状态恢复
    if (_currentRow && !chatVisible()) _savedHoverRow = _currentRow;
    hideHover();
    // 工具栏在有勾选时保持常驻，只在无勾选时由 updateStatusBar 隐藏
    if (_statusBarEl && _checkedSet.length === 0) { _statusBarEl.classList.remove("show"); }
  }

  function closeMenu() {
    if (_menuEl) { _menuEl.style.opacity = "0"; _menuEl.style.pointerEvents = "none"; }
  }

  function escapeHTML(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  function isIconOrMenu(el) {
    if (!el) return false;
    if (el === _iconEl || el === _menuEl || el === _checkEl || el === _statusBarEl) return true;
    if ((_iconEl && _iconEl.contains(el)) || (_menuEl && _menuEl.contains(el)) ||
        (_checkEl && _checkEl.contains(el)) || (_statusBarEl && _statusBarEl.contains(el))) return true;
    // 常驻圆圈（已选消息）
    for (var i = 0; i < _checkedEls.length; i++) {
      if (el === _checkedEls[i].el) return true;
    }
    return false;
  }

  // 消息区域命中：鼠标坐标是否落在某消息行的范围内（向左扩展 padLeft 覆盖按钮组虚拟区域）
  function getRowAtPoint(x, y, padLeft) {
    padLeft = padLeft || 0;
    var chat = getChat();
    if (!chat) return null;
    var children = chat.children;
    for (var i = 0; i < children.length; i++) {
      var r = children[i];
      if (!r || r.nodeType !== 1 || r === chat) continue;
      var rect = r.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) continue;
      if (x >= rect.left - padLeft && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        // 行被滚动容器裁剪（已滚出可视区，消息不可见）：不命中，
        // 避免普通状态圆圈/复制按钮显示在消息区外面
        if (!rowInScrollView(r)) continue;
        return r;
      }
    }
    return null;
  }

  // 坐标是否落在浮层（图标/圆圈/工具栏/菜单）及其周围扩展区域内——虚拟大范围判定，消除缝隙导致的误消失；
  // pad 12：图标与圆圈之间的空隙、以及按钮组周围的晃动都保持命中，鼠标放空隙上按钮不消失
  function inFloatZone(x, y, pad) {
    pad = pad || 12;
    var els = [_iconEl, _checkEl, _menuEl, _statusBarEl];
    for (var i = 0; i < _checkedEls.length; i++) els.push(_checkedEls[i].el);
    for (var j = 0; j < els.length; j++) {
      var el = els[j];
      if (!el) continue;
      // 已淡出（不可见）的浮层不再阻挡 hover 隐藏，避免按钮残留在消息滚出的区域
      if (el.classList && el.classList.contains("tt-fade")) continue;
      var r = el.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) continue;
      if (x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad) return true;
    }
    return false;
  }

  function rectsOverlap(a, b) {
    return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  }

  // ============ Hover 状态机（唯一判定入口） ============
  // 所有鼠标输入（mousemove 等）只更新坐标并调度本状态机；100ms 轮询也调用它。
  // 显示/隐藏/位置/菜单全部由这里统一推导，杜绝散落逻辑与补丁。

  // 鼠标输入合并：快速移动中稍延迟（防快速扫过消息误显示），停稳后立即判定
  function scheduleHoverCheck() {
    clearTimeout(_hoverCheckTimer);
    var fast = (Date.now() - _lastMouseTime) < 80;
    _hoverCheckTimer = setTimeout(applyHover, fast ? 70 : 10);
  }

  // 单一状态推导：根据鼠标坐标 + 环境（可见性/拖动/浮层）决定 hover 按钮的目标状态
  function applyHover() {
    var chat = getChat();
    if (!chat) return;
    var vis = chatVisible();
    if (!vis) {
      // 消息栏关闭：保存关闭前hover行（供重开恢复），隐藏hover，不清除勾选
      _chatVisibleLast = false;
      if (_currentRow) _savedHoverRow = _currentRow;
      hideHover();
      return;
    }
    var wasHidden = !_chatVisibleLast;
    _chatVisibleLast = true;
    if (wasHidden) {
      // 关闭期间游戏可能重建消息DOM：清理失效勾选与残留预览，避免数量/样式脱节
      pruneChecked();
      clearPreview();
      // 按关闭前状态恢复hover
      if (_savedHoverRow) {
        var sr = _savedHoverRow;
        _savedHoverRow = null;
        if (sr.isConnected && chat.contains(sr)) { showIcon(sr); return; }
      }
    }
    if (_dragMoving) return;   // 拖动中：hover由轮询统一淡出

    // 坐标推导目标状态
    var x = _lastMouseX, y = _lastMouseY;
    var hit = null;
    try { hit = document.elementFromPoint(x, y); } catch (ex) {}
    var row = getRowAtPoint(x, y, 52);
    if (!row && hit) {
      for (var i = 0; i < _checkedEls.length; i++) {
        if (hit === _checkedEls[i].el) { row = _checkedEls[i].row; break; }
      }
    }
    var onFloat = inFloatZone(x, y) || (hit && isIconOrMenu(hit));
    // 菜单开着：鼠标在浮层则保持；否则关闭菜单后按坐标继续判定
    if (_menuEl && _menuEl.style.opacity !== "0") {
      if (onFloat) return;
      closeMenu();
      onFloat = false;
    }
    // 批量预览：鼠标悬停在 hover 圆圈上且该行未勾选 → 预览整段待选范围（上次勾选 → 当前行，
    // 所有行淡绿背景），当前行圆圈进入待选态（整绿）；移开圆圈/悬停已勾选行 → 清除。
    // 悬停消息行本身不触发（只是显示图标+圆圈）；批量关闭不进入此分支（单选待选仅边缘绿）
    if (_batchMode) {
      var onCheckEl = !!(_checkEl && hit === _checkEl);
      if (onCheckEl && row && !isChecked(row)) {
        showPreview(row);
      } else if (_previewActive) {
        clearPreview();
      }
    }
    if (row) {
      showIcon(row);
    } else if (!onFloat) {
      hideHover();
    }
  }

  // 显示某行的复制按钮+圆圈（幂等：同行已显示只更新位置）
  function showIcon(row) {
    if (!row) return;
    if (_dragMoving) return;   // 拖动中：hover按钮由轮询统一淡出
    // 清理拖动/关闭残留的淡出标记，确保图标可正常显示
    if (_iconEl) _iconEl.classList.remove("tt-fade");
    if (_hoverTarget === row && _iconEl && _iconEl.style.opacity !== "0") {
      positionHover(row);
      return;
    }
    var icon = getOrCreateIcon();
    icon.title = _L("title");
    var p = computeCheckPos(row);
    // 可见切换行：CSS left/top 过渡丝滑滑到新位置（ease-out 起步即快，单调无回摆）；
    // 隐藏恢复：禁用过渡瞬移落位，避免从旧位置"飞"过来
    if (icon.style.opacity !== "0") {
      icon.style.left = p.iconLeft + "px";
      icon.style.top = p.top + "px";
    } else {
      var savedTrans = icon.style.transition;
      icon.style.transition = "left 0s, top 0s";
      icon.style.left = p.iconLeft + "px";
      icon.style.top = p.top + "px";
      void icon.offsetWidth;
      icon.style.transition = savedTrans;
    }
    icon.style.pointerEvents = "auto";
    if (_firstShow && !_resizing) { icon.offsetHeight; }
    icon.style.opacity = _resizing ? "0.6" : "1";
    if (_firstShow) _firstShow = false;
    _hoverTarget = row;
    _currentRow = row;
    // 显示小圆圈（与常驻圆圈同一位置）
    showCheck(row, p.checkLeft, p.top);
  }

  // 位置跟随（同行滚动等目标微移）：直接设 left/top，CSS 过渡自动平滑追赶。
  // 禁止在此禁用过渡瞬移——滚动时"行切换滑动/同行跟随瞬移"两种模式交替正是
  // 当初一抖一抖的根源；统一走过渡后连续重定目标=平滑追踪，全程连续
  function positionHover(row) {
    var p = computeCheckPos(row);
    if (_iconEl) {
      _iconEl.style.left = p.iconLeft + "px";
      _iconEl.style.top = p.top + "px";
    }
    if (_checkEl && _checkEl.classList.contains("show")) {
      _checkEl.style.left = p.checkLeft + "px";
      _checkEl.style.top = (p.top + 5) + "px";
    }
  }

  // 隐藏hover状态（图标/圆圈/菜单），不清除勾选与常驻圆圈
  function hideHover() {
    if (_iconEl) { _iconEl.style.opacity = "0"; _iconEl.style.pointerEvents = "none"; }
    if (_menuEl) { _menuEl.style.opacity = "0"; _menuEl.style.pointerEvents = "none"; }
    _hoverTarget = null;
    _currentRow = null;
    _checkRow = null;
    _checkToken++;
    clearPreview();
    if (_checkEl) { _checkEl.classList.remove("show", "preview", "checked"); }
    _menuItems = [];
    _firstShow = true;
  }

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

  // ============ 统一鼠标输入 ============
  // 所有鼠标事件只更新坐标并调度状态机（高频合并防抖），
  // 显示/隐藏/位置/菜单判定全部由 applyHover 统一负责，不再有散落的决策逻辑
  document.addEventListener("mousemove", function (e) {
    _lastMouseX = e.clientX;
    _lastMouseY = e.clientY;
    _lastMouseTime = Date.now();
    if (_dragMoving) return;   // 拖动中：hover由轮询统一接管
    scheduleHoverCheck();
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

    // 阻止浏览器在 textarea 中插入换行：按 Enter 发送时输入框会被清空，
    // 若 keydown 未阻止默认行为，浏览器会在已清空的输入框光标处插入 \n（残留一个空行）
    if (CB.chatInput && CB.chatInput[0]) {
      CB.chatInput.on("keydown", function (e) {
        if (e.which === 13 && !e.shiftKey) e.preventDefault();
      });
    }

    // 通用聊天气泡（错误/拦截提示）：fixed 定位在输入框右侧，注册物理跟随，2秒后自动消失
    function showChatBubble(msg, bgColor, textColor) {
      $(".tt-err-bubble").remove();
      var input = getChatInputEl();
      if (!input) return;
      var r = input.getBoundingClientRect();
      var arrow = $("<span>").css({
        position:"absolute",left:"-6px",top:"50%",transform:"translateY(-50%)",
        width:"0",height:"0",borderTop:"5px solid transparent",
        borderBottom:"5px solid transparent",borderRight:"6px solid " + bgColor
      });
      var bubble = $("<span class='tt-err-bubble'>").text(msg).css({
        position:"fixed",zIndex:"1000000",left:(r.right+8)+"px",top:(r.top+r.height/2)+"px",
        transform:"translateY(-50%)",color:textColor || "#fff",background:bgColor,
        padding:"4px 10px",borderRadius:"4px",fontSize:"12px",fontWeight:"bold",
        whiteSpace:"nowrap",boxShadow:"0 2px 6px rgba(0,0,0,.3)"
      });
      bubble.append(arrow).hide(); $("body").append(bubble);
      // 物理跟随：输入框右侧，拖动消息栏时平滑滑行（中等质量）
      var fol = {
        el: bubble[0],
        mass: 0.8, stiff: 0.08, damp: 0.84,
        cx: parseFloat(bubble[0].style.left) || 0,
        cy: parseFloat(bubble[0].style.top) || 0,
        vx: 0, vy: 0,
        getTarget: function () {
          var inp = getChatInputEl();
          if (!inp) return null;
          var r2 = inp.getBoundingClientRect();
          return { x: r2.right + 8, y: r2.top + r2.height / 2 };
        }
      };
      bubble[0]._fol = fol;
      addFollower(fol);
      // 淡入淡出改用纯 CSS transition：jQuery 的 fadeIn/fadeOut 在此游戏页面静默失效（opacity 停在 0），
      // CSS 过渡不受影响且行为一致
      bubble.css({ display: "block", opacity: "0", transition: "opacity 0.15s ease" });
      void bubble[0].offsetWidth;   // 强制 reflow：让 opacity 0 成为过渡起点
      bubble.css({ opacity: "1" });
      setTimeout(function () {
        bubble.css({ transition: "opacity 0.3s ease", opacity: "0" });
        setTimeout(function () {
          removeFollower(fol);
          bubble.remove();
        }, 300);
      }, 2000);
    }

    // 发送中指示器：SVG 圆圈从一点逐渐画出（头部转动、尾巴拖出、变长到常态），定位在输入区右侧
    function showSendingIndicator() {
      // 移除旧指示器前先注销其物理跟随
      $(".tt-sending-indicator").each(function () { if (this._fol) removeFollower(this._fol); });
      $(".tt-sending-indicator").remove();
      var indicator = $("<span class='tt-sending-indicator'>").css({
        position:"fixed",zIndex:"1000000",left:"-9999px",top:"-9999px",
        width:"18px",height:"18px",display:"block",cursor:"pointer",opacity:"0"
      }).html(
        '<svg class="tt-spin-svg" width="18" height="18" viewBox="0 0 18 18">' +
        '<circle class="tt-spin-circle" cx="9" cy="9" r="7" fill="none" stroke="#2d8f4f" stroke-width="2" stroke-linecap="round" transform="rotate(-90 9 9)"/></svg>'
      );
      $("body").append(indicator);
      indicator.on("mouseenter", showQueueBubble);
      indicator.on("mouseleave", hideQueueBubble);
      // 物理跟随：输入区右侧垂直居中（轻质量跟手）
      var fol = {
        el: indicator[0],
        mass: 0.5, stiff: 0.09, damp: 0.86,
        cx: 0, cy: 0, vx: 0, vy: 0,
        getTarget: function () {
          var inp = getChatInputEl();
          if (!inp) return null;
          var r = inp.getBoundingClientRect();
          return { x: Math.max(4, r.right + 10), y: Math.min(window.innerHeight - 40, r.top + r.height / 2 - 9) };
        }
      };
      indicator[0]._fol = fol;
      addFollower(fol);
      // 先定位再淡入：位置正确后才显示，避免短暂停留在屏幕外不可见
      var t = fol.getTarget();
      if (t) {
        indicator.css({ left: t.x + "px", top: t.y + "px" });
        fol.cx = t.x; fol.cy = t.y;
      } else {
        // 兜底定位：找不到输入框时放到聊天面板右上角，绝不让转圈停留在屏幕外不可见
        var chat = getChat();
        if (chat) {
          var cr = chat.getBoundingClientRect();
          t = { x: Math.max(4, cr.right - 28), y: Math.max(4, cr.top + 10) };
          indicator.css({ left: t.x + "px", top: t.y + "px" });
          fol.cx = t.x; fol.cy = t.y;
        }
      }
      // CSS transition 淡入（jQuery fadeIn 在此游戏页面静默失效，opacity 会停在 0）
      indicator.css({ transition: "opacity 0.12s ease" });
      void indicator[0].offsetWidth;   // 强制 reflow：让 opacity 0 成为过渡起点
      indicator.css({ opacity: "1" });
    }

    function hideSendingIndicator() {
      hideQueueBubble();
      $(".tt-sending-indicator").each(function () { if (this._fol) removeFollower(this._fol); });
      // CSS transition 淡出后移除（jQuery fadeOut 静默失效）
      var ind = $(".tt-sending-indicator");
      if (!ind.length) return;
      ind.css({ transition: "opacity 0.2s ease" });
      void document.body.offsetHeight;
      ind.css({ opacity: "0" });
      setTimeout(function () { ind.remove(); }, 200);
    }

    // 队列气泡：hover 转圈时显示"当前发送 + 待发队列"，快速淡入淡出
    function showQueueBubble() {
      hideQueueBubble();
      var items = [];
      if (_lastSentText) items.push("▸ " + _lastSentText);
      for (var i = 0; i < _sendQueue.length; i++) items.push((i + 1) + ". " + _sendQueue[i]);
      if (items.length === 0) return;
      var q = $("<div class='tt-queue-bubble'>").css({
        position:"fixed",zIndex:"1000000",background:"rgba(0,0,0,0.78)",color:"#fff",
        padding:"6px 10px",borderRadius:"4px",fontSize:"11px",maxWidth:"260px",
        boxShadow:"0 2px 8px rgba(0,0,0,0.35)",wordBreak:"break-all",opacity:"0"
      }).html(items.join("<br>"));
      var ind = $(".tt-sending-indicator");
      if (ind.length) {
        var r = ind[0].getBoundingClientRect();
        q.css({ left: Math.max(4, r.left - 8) + "px", top: (r.bottom + 6) + "px" });
        var qr = q[0].getBoundingClientRect();
        if (qr.right > window.innerWidth - 4) q.css({ left: (window.innerWidth - qr.width - 8) + "px" });
        if (qr.bottom > window.innerHeight - 4) q.css({ top: (r.top - qr.height - 6) + "px" });
      }
      $("body").append(q);
      // CSS transition 淡入（jQuery animate 静默失效）
      q.css({ transition: "opacity 0.12s ease" });
      void q[0].offsetWidth;
      q.css({ opacity: "1" });
    }
    function hideQueueBubble() {
      var q = $(".tt-queue-bubble");
      if (!q.length) return;
      q.css({ transition: "opacity 0.12s ease" });
      void document.body.offsetHeight;
      q.css({ opacity: "0" });
      setTimeout(function () { q.remove(); }, 120);
    }

    CB.sendChat = function () {
      var val = this.chatInput.val();
      if (!val) return origSendChat.apply(this, arguments);
      var parsed = this._parseChat();
      // 不在此清空：等消息成功入队后再清空（拦截/私聊失败时保留用户输入）

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
            // 私聊消息也入队发送（统一队列/条纹移除/重复拦截）
            enqueueText(text);
          } else {
            var lang = settings.lang || "en";
            var isSelf = (notFound && notFound.length === 0);
            var msg = isSelf
              ? (MSG_SELF[lang] || MSG_SELF["en"])
              : (MSG_NO_RECIPIENTS[lang] || MSG_NO_RECIPIENTS["en"]);
            showChatBubble(msg, isSelf ? "#f0c040" : "#e53935", isSelf ? "#333" : "#fff");
          }
        });
        return;
      }

      if (!parsed) return origSendChat.apply(this, arguments);

      var textToSend;
      if (settings.enc && hasNonAscii(parsed)) {
        textToSend = settings.fmt === "v1" ? encodeV1(parsed) : encodeV2(parsed);
        textToSend += V2_VER;
        if (settings.sig) textToSend += " [Chat Unblocker]";
      } else {
        textToSend = parsed;
      }
      enqueueText(textToSend);
    };

    // 入队发送：拦截相邻重复，发送中可继续入队，队列顺序发送
    function enqueueText(text) {
      // 相邻重复拦截：仅拦截"正在进入队列"时与正在发送/待发末尾相同；
      // 消息发出去后即从队列移除，不再拦截；拦截时保留用户输入
      if ((_sendQueue.length > 0 && _sendQueue[_sendQueue.length - 1] === text) ||
          (_isSending && text === _lastSentText)) {
        var lang = settings.lang || "en";
        showChatBubble(DUP_MSG[lang] || DUP_MSG["en"], "#f0c040", "#333");
        return;
      }
      _sendQueue.push(text);
      // 按下回车即清空输入栏（原版行为）：不锁光标，恢复游戏原生退出方式
      // （点击空白/点击消息按钮/Esc/空输入按回车）
      if (CB.chatInput) {
        CB.chatInput.val("");
        // 还原输入框高度（同游戏原版 doReset：val("").outerHeight(16)）：
        // 游戏靠 input 事件自动增高输入框，val("") 不触发 input，不还原会残留多行高度，
        // 发送后看起来像输入框里有个换行
        try { CB.chatInput.outerHeight(16); } catch (e) {}
        // 兜底：若 keydown 默认行为已在清空后的输入框插入 \n，事件循环下一轮清掉
        setTimeout(function () {
          try {
            if (CB.chatInput && CB.chatInput.val() === "\n") CB.chatInput.val("");
          } catch (e) {}
        }, 0);
      }
      if (!_isSending) startSend();
    }

    // 从队列取一条发送；发送完成后 500ms 继续下一条（游戏 _sendChat 异步完成）
    function startSend() {
      if (_sendQueue.length === 0) {
        _isSending = false;
        _lastSentText = "";   // 队列清空：消息已发出，不再拦截重发相同内容
        hideSendingIndicator();
        return;
      }
      var text = _sendQueue.shift();
      _lastSentText = text;
      _isSending = true;
      showSendingIndicator();
      if (!_sendHooked) {
        _sendHooked = true;
        var self = CB;
        var origSend = self._sendChat;
        self._sendChat = function (t) {
          origSend.call(self, t);
          // 代码层面移除游戏发送中条纹（而非 CSS 隐藏）
          if (self.chat) self.chat.removeClass("send");
          // 消息成功发出：恢复输入框可用（不抢焦点，光标随游戏原生命理消失，恢复原生退出方式）
          if (self.chatInput) self.chatInput.prop("disabled", false);
          setTimeout(function () { startSend(); }, 500);
        };
      }
      try {
        CB._sendChat(text);
      } catch (e) {
        // 发送异常：重置状态并隐藏转圈，避免队列/指示器永久卡死
        console.warn("[TT] _sendChat error:", e);
        _isSending = false;
        _lastSentText = "";
        hideSendingIndicator();
      }
    }

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
        _suppressGuard = true;   // 游戏渲染新消息：抑制翻译守卫误报
        var result = orig.apply(this, arguments);
        setTimeout(function () { _suppressGuard = false; }, 200);
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
      _suppressGuard = true;   // 游戏渲染系统消息：抑制翻译守卫误报
      var result = origSys.call(this, p, m, u);
      setTimeout(function () { _suppressGuard = false; }, 200);
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
    // 游戏可能延迟创建 ChatBox（如首次点开消息栏时才初始化）：延长重试窗口到约30秒
    if (n < 150) setTimeout(go, 200);
    else console.warn("[TT] ChatBox not found");
  })();
})();
