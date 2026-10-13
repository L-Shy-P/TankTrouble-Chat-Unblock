# 🛡 TankTrouble Chat Unblock

> Browser extension to unlock multi-language chat in TankTrouble.com

<p align="center">
  📖 <a href="docs/INSTALL.md"><b>Install Guide & FAQ</b></a> &nbsp;|&nbsp;
  📋 <a href="#changelog--更新日志"><b>Changelog</b></a>
</p>

<p align="center">
  <b>English</b> &nbsp;|&nbsp;
  <a href="#中文">中文</a> &nbsp;|&nbsp;
  <a href="#日本語">日本語</a> &nbsp;|&nbsp;
  <a href="#한국어">한국어</a> &nbsp;|&nbsp;
  <a href="#русский">Русский</a> &nbsp;|&nbsp;
  <a href="#العربية">العربية</a> &nbsp;|&nbsp;
  <a href="#français">Français</a> &nbsp;|&nbsp;
  <a href="#español">Español</a> &nbsp;|&nbsp;
  <a href="#deutsch">Deutsch</a> &nbsp;|&nbsp;
  <a href="#português">Português</a> &nbsp;|&nbsp;
  <a href="#tiếng-việt">Tiếng Việt</a> &nbsp;|&nbsp;
  <a href="#বাংলা">বাংলা</a>
</p>

> ⚠️ **Update required: v3.1.0** — the 2026-10-09 TankTrouble update broke every older version; only v3.1.0+ works.
> ⚠️ **必须更新到 v3.1.0** — 2026-10-09 的 TankTrouble 更新使所有旧版本失效，仅 v3.1.0 及以后可用。

---

## English

### What It Does
TankTrouble.com blocks non-ASCII characters in chat — Chinese, Japanese, Korean, Arabic, Cyrillic, emoji, and more are rejected by the server. This extension bypasses the restriction by encoding Unicode characters into ASCII-safe `~XXXX` escape sequences before sending, then decoding them back on the receiving end.

### Features
- 🌍 **All writing systems** — CJK, Arabic, Cyrillic, Thai, Hindi, emoji, special symbols
- 🔐 **XOR scrambling** — avoids browser/network sensitive-word filters
- ⏱ **Timeout recovery** — auto-resets UI when server drops the receipt
- 🎛 **Popup panel** with language selector (12 languages)
- 🧲 **Multi-select & batch copy** — check circles, range selection with preview, floating toolbar
- ✍️ **Signature watermark** — non-extension users see `[Chat Unblocker]` tag

### What's New in v3.1.0
- 🚨 **Major release — only v3.1.0+ works**: the 2026-10-09 TankTrouble update removed the interfaces every older version relied on; all versions up to v2.10.x are no longer usable. Please update
- 🇻🇳 **Vietnamese added** — UI, copy menu and docs now support 12 languages
- 🇧🇩 **Bengali added** — UI, copy menu and docs now support 12 languages
- 📌 **Works on every page — no refresh needed** — the chat box is a global component and the extension now runs on the forum page too; switching between pages (forum ↔ game) applies automatically
- 🔧 **Game rewrite compatibility (2026-10-09)** — the game no longer exposes `window.TankTrouble`: ChatBox is sealed inside an esbuild IIFE closure **with a custom event system** (zero `EventTarget` references in the bundle), so native-API hooking cannot reach it. The chat DOM is unchanged though, and message rendering *and* text-width measurement both go through one SVG.js prototype method — `text(x, y, value, settings)`. The extension hooks it and decodes **before** rendering/measuring (layout and displayed text therefore agree); sending is encoded by intercepting `keydown` in the capture phase **at the document level** (a listener on the input itself would lose the race — the game's handler is registered earlier and would read the unencoded text), which the game's `_parseChat()` reads via `chatInput.val()`
- 🩺 **Diagnostics** — the console logs `[TT] jQuery SVG hook armed @document_start` once the game's jQuery + SVG plugin are up, and `[TT] SVG text hook installed` when the decode hook attaches; the send interceptor logs `[TT] DOM sender armed` once attached (plus `[TT] sender: encoded …` per encoded send). If none of these appear, make sure the extension was reloaded after updating
- 🐛 **Fixed duplicated text in copied messages** — the new build renders every text segment twice (a `fill="none"` stroke layer plus a filled layer), so plain `textContent` extraction returned everything doubled (`Name:Name:messagemessage`). Copy/export now drop the stroke layer first, and the sender name is recognised through the new SVG class (`{playerId}-messageUsername`), so the "include sender names" toggle works again
- 🐛 **Fixed the encoding toggle not refreshing history** — messages are SVG-rendered and the original encoded text is no longer kept in the DOM, so an in-place revert is impossible; the extension now triggers the game's own `_refreshChat()` (which re-renders every message from its array — and therefore re-runs the decode hook) through the resize-handle callback, with a chat open/close cycle as fallback
- 🐛 **Fixed copy/export newlines & wrapped-line garble** — copied text no longer inserts line breaks the sender never typed, and long messages split mid-encoding by wrapping now decode correctly (the renderer stitches the hard-split halves back together)
- 🐛 **Fixed intermittent dead send-hook (Chinese sometimes not sending)** — the keydown interceptor was only attached if the chat input already existed at probe time; otherwise it was never attached while the polling loop had already stopped and the wake-up event had no dispatcher — so the failure lasted until a page reload (English was unaffected: it needs no encoding). Arming is now document-delegated (decided per event target, no input reference) and polling retries at low frequency with no upper limit

### What's New in v2.10.1
- 🐛 **Fixed silent copy truncation** — after selecting many messages, the concatenated text could exceed the browser clipboard write limit (~4 MB, sometimes less) and be silently truncated with no error. Over-length text now automatically switches to the `textarea+execCommand` sync channel (no size cap); if any path fails, the toolbar/button **flashes red** instead of pretending to succeed.
- 🗂 **New "Export as TXT"** — the ⬇ button in the multi-select toolbar downloads the selected records as `chat-export-<timestamp>.txt`. It uses browser file download, completely bypassing the clipboard, so no message is ever lost.

### What's New in v2.10
- 🧲 **Multi-select & batch copy** — hover a message to reveal a check circle on its left; click to select (green row highlight + left green line, preview↔checked cross-fade). In batch mode, hovering another circle previews the whole range between the last selection and the cursor (soft green), and one click selects the entire range. A floating toolbar offers copy / include-sender-names toggle / batch toggle / clear
- 🛡 **Left scrollbar avoidance** — the game's custom scrollbar sits on the left of the message list; the check circle + copy button group detects it at runtime and keeps a full circle-width gap so the scrollbar stays fully draggable
- 🌊 **Silky hover movement** — copy button/circle glide between messages with CSS ease-out; while scrolling the list they smoothly chase the hovered row instead of jittering; persistent checked circles stay frame-synced with their rows
- 🎡 **Language picker refinement** — wheel-style picker with free scroll + snap (one item per wheel notch), edge fade; switching languages animates row heights so the whole popup flows to the new layout instead of jumping
- 🧲 **Physics-based floating UI** — checked circles, multi-select toolbar, error bubbles and the sending indicator all follow the chat bar with rAF spring physics (mass/inertia per element) while dragging
- 🖱️ **Unified hover state machine** — all show/hide/position/menu decisions flow through one `applyHover()` state machine instead of scattered handlers
- 📤 **Sending queue rework** — all messages (public/Chinese/private) go through one queue; you can keep typing while sending; duplicate adjacent messages are blocked with a yellow toast
- 🌀 **Sending indicator** — green SVG arc-spin indicator next to the input (no more black box); hover it to see the queue; fixed z-index layering so it is no longer hidden behind the game panel
- 🐛 **Fade-in via CSS transitions** — jQuery `fadeIn`/`fadeOut` silently fail on the game page (opacity stuck at 0); sending indicator, error toasts and queue bubble now use pure CSS transitions
- 🧹 **No more striped background** — the game's gray diagonal stripe animation is removed at code level (plus CSS backup)
- 🎡 **Language wheel picker** — the Page Language selector is now a wheel: the current language stays pinned to the button while the list scrolls around it (free scroll + snap-to-item, one item per wheel notch), click to jump with animation, edge fade; selection applies on exit and the panel layout morphs smoothly
- 🎞️ **Scroll clip & sync** — checked circles are scroll-synced frame-by-frame via the container's scroll event (no polling lag) and hard-clipped at the list edges by `clip-path` exactly like messages being covered; hover circles / copy buttons no longer appear over invisible rows; dragging the chat bar off-screen no longer piles circles up at the screen edge
- ⌨️ **Native input behavior** — pressing Enter clears the input and drops the focus (original game behavior); the input is re-enabled after the message is sent, keeping all 4 original ways to exit typing (click blank / click chat button / Esc / Enter on empty input)

### What's New in v2.9
- 🌐 **Mirror site expansion** — `beta.tanktrouble.com` now grouped with `cdn.tanktrouble.com` under the Mirror Site toggle; description simplified to "cdn. and beta. prefixed sites"
- 🐛 **Encoding toggle regression fix** — restored `setTimeout` fallback in `_raw` storage so the encoding switch reliably swaps decoded/raw views (regression from v2.5)
- 🐛 **@mention compatibility** — `.username` and `<a>` excluded from `user-select: text` to stop copy extensions breaking @clicks
- 🐛 **New-user init fix** — content.js actively requests `init` from bridge; manifest `matches` covers `*.tanktrouble.com` so `www.`/`beta.` users aren't left without decoding
- 📄 **Install/Update/FAQ** — moved to [docs/INSTALL.md](docs/INSTALL.md)

### What's New in v2.8
- 🪞 **Mirror site toggle** — improved mirror-site switch with refresh prompt; toast dismisses after refresh; fixed rapid-toggle animation glitches
- 🎨 **Visual polish** — custom dropdown overlays, refined action button styles, restored warning toast animations

### What's New in v2.7
- 🎬 **Title fade-in** — title bar fades in (0.55s easeOutExpo) at popup open; switches stay still on startup via `init-lock` class (added in the outermost JS scope before any storage callback), released at 600ms with forced reflow
- 🎞️ **Custom dropdown animation** — Message Format and Page Language use custom dropdown components (replacing native `<select>`); clicking the button toggles `.open` class, which triggers `transform: translateY(-100% → 0)` transition (0.35s easeOutExpo) on the menu container — the entire menu (background + items) slides down together from the button position like a drawer being pulled open; menu is `position: absolute` with `z-index: 100` so it overlays without stretching the panel; inner scroll container uses custom thin scrollbar styling; arrow icon rotates 180°; clicking outside or selecting an item closes the menu
- 🌐 **Error message refinement** — improved error text for "user not found" when @mentioning invalid users
- 🖱️ **Copy menu UX polish** — mouse leave delay increased to 500ms; icon hit area extended with invisible padding to bridge icon↔menu gap; menu closes smoothly only when mouse truly leaves
- 🔩 **Popup layout fix** — long description text in Message Format row now wraps properly without pushing the format selector; shared link URL simplified to repo root
- 🐛 **Copy name fix** — player name copy now strips trailing colon and space
- 🎨 **Tooltip refinement** — copy icon tooltip simplified to "Copy message"

### What's New in v2.6
- 🎛 **Version number toggle** — signature watermark now includes a toggleable version number; with switch on: ` | v2.6 [Chat Unblocker]`; with switch off: ` [Chat Unblocker]` — let non-extension users choose readability or version info
- 📋 **Fluent copy menu** — hover any message to reveal a copy icon; click to copy message text, or hover the icon for a dropdown menu with 3 options: copy text (without names), copy full message (with names), and copy individual player names
- 🌍 **Full i18n support** — copy menu and all labels available in 12 languages (中文 / 日本語 / 한국어 / Русский / العربية / Français / Español / Deutsch / Português / Tiếng Việt / বাংলা / English)
- 🎬 **Microsoft Fluent animations** — elastic cubic-bezier transitions, velocity-aware movement (no jitter during fast mouse), scale-pulse click feedback, and smooth resize/drag following with fade effects
- 🐛 **Fixed text selection visibility** — selected text displays green background + black text; text-shadow and text-stroke suppressed
- 🔧 **Dynamic chat detection** — runtime `CB.chatBody` detection with `CB.chat` fallback; no hardcoded CSS class dependency

### What's New in v2.5
- 🏷️ **Version tag in signature** — V2 messages now include ` | v2.5 [Chat Unblocker]` suffix; non-extension users can see the version number
- 🔄 **V1.2 format compatibility** — V1.2 mode also shows ` | v2.5 [Chat Unblocker]`; legacy users can see version info
- 🔒 **Signature lock for V1.2** — signature switch is locked when V1.2 format is selected; first close attempt triggers a warning animation + red alert
- ⚠️ **Smooth warning animations** — all warning boxes (yellow V1.2 warning, red signature warning) have expand/collapse transitions
- 🎨 **Signature switch feedback** — shake animation on first close attempt; red background when closed; smooth state transitions
- 📦 **Format selector animation** — format and language selectors have smooth expand/collapse animations on panel open

### What's New in v2.4
- 🐛 **Fixed first message toggle bug** — the first received message from others now correctly switches between decoded and raw encoded content when toggling the encoding switch
- 🐛 **Fixed double-click text duplication** — rapid clicking of the encoding toggle no longer causes message text to display doubled
- 🐛 **Fixed message state persistence** — all messages now reliably maintain their display state across toggle operations
- 🏷️ **Signature format reverted** — back to `[Chat Unblocker]` without version number
- 🔄 **Format labels updated** — V2.x and V1.2 format options in settings panel
- 🌐 **Page language label** — new "Page Language" label above the language selector

### What's New in v2.3
- 🐛 **Fixed V1.2 compatibility** — v1 mode now uses correct V1 signature format; v1.2 users can read messages again
- 🔄 **Format switcher** — choose between V2 (`~XXXX`) and V1.2 (`\uXXXX`) encoding
- ⚠️ **V1.2 warning** — warns that some V1.2 character combinations may be blocked by game server
- 🏷️ **Version signature** — V2 messages prefixed with `[Chat Unblocker V2.3]`; V1 messages use original suffix
- 🌐 **V1.2 label** — old format messages display with `[V1.2 Format]` prefix (i18n)

### Install
1. Download or clone this repo
2. Open `chrome://extensions/` in Chrome/Edge
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** → select the extension folder
5. Go to [tanktrouble.com](https://tanktrouble.com) and chat in any language!

### How It Works
```
You type "你好"
  → XOR scramble → ~153a~0839
  → sent as pure ASCII (passes server filter)
  → received by others → decoded back to "你好"
```

> ⚠ Both sender and receiver need the extension to see decoded text. Non-users see raw `~XXXX` codes + a download link.

---

## 中文

### 功能
TankTrouble.com 的聊天系统会拦截非 ASCII 字符——中文、日文、韩文、阿拉伯文、表情符号等都会被服务器拒绝。此扩展在发送前将 Unicode 字符编码为 ASCII 安全的 `~XXXX` 转义序列，接收端自动解码还原。

### 特性
- 🌍 支持所有书写系统
- 🔐 XOR 加扰规避敏感词过滤器
- ⏱ 超时无应答自动恢复 UI
- 🎛 多语言弹出面板（12 种语言）
- 🧲 多选与批量复制（勾选圆圈、范围预览、浮动工具栏）
- ✍️ 未装扩展的玩家会看到 `[Chat Unblocker]` 签名水印

### v3.1.0 更新内容
- 🚨 **大版本发布——仅 v3.1.0+ 可用**：2026-10-09 游戏更新移除了所有旧版依赖的接口，v2.10.x 及更早版本全部失效，请务必更新
- 🇻🇳 **新增越南语** — 界面、复制菜单与文档现支持 12 种语言
- 🇧🇩 **新增孟加拉语** — 界面、复制菜单与文档现支持 12 种语言
- 📌 **全站生效、无需刷新** — 聊天框为全局组件，扩展现在在论坛页同样运行；论坛 ↔ 游戏等页面切换后自动生效，无需刷新
- 🔧 **适配游戏大改（2026-10-09）** — 游戏不再暴露 `window.TankTrouble`：ChatBox 被封在 esbuild IIFE 闭包内**且使用自定义事件系统**（整包 `EventTarget` 引用数为 0），劫持原生事件 API 无法触及。但聊天 DOM 未变，且消息渲染与文字宽度测量走同一个 SVG.js 原型方法 `text(x, y, value, settings)`。扩展劫持该方法，在**渲染与测量之前**完成解码（布局与显示内容因此天然一致）；发送侧在 **document** 捕获阶段拦截 `keydown`（绑在输入框自身上会晚于游戏自己的处理器——游戏先读到未编码文本，中文会被服务器拒收），游戏 `_parseChat()` 会读到编码文本
- 🩺 **诊断日志** — 游戏的 jQuery 与 SVG 插件就绪后，控制台打印 `[TT] jQuery SVG hook armed @document_start`；解码钩子挂载时打印 `[TT] SVG text hook installed`；发送拦截器挂载时打印 `[TT] DOM sender armed`（每次编码发送还会打印 `[TT] sender: encoded …`）。若都没有，请确认扩展在更新后已重新加载
- 🐛 **修复复制文本重复** — 新版游戏对每段文字渲染两遍（`fill="none"` 描边层 + 填充层），直接读 `textContent` 会得到双份（`名字:名字:内容内容`）。复制/导出现在先剔除描边层；发送者名字改用新版 SVG 类名（`{playerId}-messageUsername`）识别，"包含发送者名字"开关恢复有效
- 🐛 **修复编码开关不刷新历史消息** — 消息由 SVG 渲染、DOM 中不再保留原始编码文本，无法就地还原；扩展改为通过 resize 手柄回调触发游戏自身的 `_refreshChat()`（它会从消息数组重新渲染全部消息，因而重跑解码钩子），并以聊天框关闭/重开作为兜底
- 🐛 **修复复制换行与折行乱码** — 复制不再插入发送者没打过的换行符；被折行从编码中间切断的长消息现可正确解码（渲染器会把硬切的两半重新拼合）
- 🐛 **修复发送监听偶发"假死"（中文时好时坏发不出去）** — 旧实现要求探测时聊天输入框已存在才挂载拦截器：若游戏尚未创建输入框，监听不挂载，而轮询已停止、唤醒事件又无人派发——挂载失败即永久失败，只能刷新页面（英文不受影响，因其无需编码）。现改为 document 委托式挂载（按事件目标判定，不依赖输入框引用），未成功时轮询无限期低频重试

### v2.10.1 更新内容
- 🐛 **修复静默复制截断** — 大量勾选消息后复制，拼接文本超长会触发浏览器剪贴板写入上限（约 4MB，特定条件下更小也会静默截断），旧实现失败不报错，表现为"粘贴内容变短/缺失"。超长文本现已自动切换到 `textarea+execCommand` 同步通道（无容量上限）；任一路径失败时工具栏/按钮会**闪红提示**，不再假装成功。
- 🗂 **新增「导出为 TXT」** — 多选工具栏的 ⬇ 按钮一键把选中记录导出成 `chat-export-时间戳.txt` 文件，走浏览器文件下载完全绕开剪贴板，聊天记录一条不缺；导出后状态栏临时显示「已导出 N 条 · M 字符」可对照勾选数量自查完整性。

### v2.10 更新内容
- 🧲 **多选与批量复制** — 悬停消息左侧出现勾选圆圈，点击勾选（行绿底高亮+左缘绿线，待选↔已选颜色渐变过渡）；批量模式下悬停另一条消息的圆圈会预览上次勾选到当前位置的整段范围（淡绿），一次点击勾选整段；浮动工具栏提供 复制选中 / 包含发送者名字开关 / 批量开关 / 清除
- 🛡 **左侧滚动条避让** — 游戏自定义滚动条位于消息列表左侧，勾选圆圈+复制按钮组运行时探测并整体让出一个圆圈宽的间距，滚动条交互不受遮挡
- 🌊 **悬浮移动丝滑** — 复制按钮/圆圈在消息间以 ease-out 平滑滑动；滚动列表时平滑追赶当前悬浮行不再抖动；常驻勾选圆圈与滚动逐帧同步
- 🎡 **语言选择优化** — 轮盘式选择器（自由滚动+停止吸附，滚轮一格一整项），边缘淡出；切换语言时各设置块行高平滑过渡，整个面板流动到新布局而非瞬间跳变
- 🧲 **物理跟随浮层** — 已选圆圈、多选工具栏、错误气泡、发送转圈在拖动消息栏时用 rAF 弹簧物理跟随（按元素大小分配质量/惯性）
- 🖱️ **统一 hover 状态机** — 显示/隐藏/位置/菜单判定全部收敛到单一 `applyHover()` 状态机，不再有散落的事件处理器
- 📤 **发送队列重构** — 所有消息（公聊/中文/私聊）统一走队列；发送中可继续打字；相邻重复消息拦截并弹出黄色提示
- 🌀 **发送转圈指示器** — 输入框右侧绿色 SVG 画弧转圈（去掉黑底）；悬停显示队列；修复层级被游戏面板遮挡问题
- 🐛 **修复淡入淡出失效** — 游戏页面中 jQuery 的 fadeIn/fadeOut 会静默失效（opacity 停在 0），发送转圈、警告气泡、队列气泡改用纯 CSS 过渡
- 🧹 **移除灰白斜条纹** — 代码层面移除游戏发送中条纹（配合 CSS 双保险）
- 🎡 **语言轮盘选择器** — 页面语言改为轮盘：当前语言固定在按钮位置，列表围绕它上下滚动（自由滚动+停止吸附，滚轮一格一整项），点击直达带动画，边缘淡出；退出时生效且面板布局平滑过渡
- 🎞️ **滚动同步与边缘裁剪** — 勾选圆圈随滚动容器 scroll 事件逐帧完全同步（无轮询延迟），滚出列表可视区时被 `clip-path` 硬裁剪（与消息被遮挡行为一致）；不可见区域的 hover 圆圈/复制按钮不再出现；消息栏拖出屏幕时圆圈不再挤到屏幕边缘重叠
- ⌨️ **原生输入行为** — 按回车即清空输入栏并移除光标（原版行为）；消息发出后恢复输入框可用，保留游戏原生 4 种退出输入方式（点击空白/点击消息按钮/Esc/空输入按回车）

### v2.9 更新内容
- 🌐 **镜像站扩展** — `beta.tanktrouble.com` 现与 `cdn.tanktrouble.com` 一并纳入"镜像网站"开关；描述简化为"cdn. 和 beta. 前缀的网站"
- 🐛 **编码开关回归修复** — 恢复 `_raw` 存储的 `setTimeout` 兜底，编码开关可可靠切换解码/原文（v2.5 起的回归）
- 🐛 **@私聊兼容性修复** — `.username` 和 `<a>` 从 `user-select: text` 排除，避免复制扩展破坏 @ 点击
- 🐛 **新用户初始化修复** — content.js 主动请求 init；manifest matches 覆盖 `*.tanktrouble.com`，`www.`/`beta.` 用户也能解码
- 📄 **安装/更新/常见问题** — 移至 [docs/INSTALL.md](docs/INSTALL.md)

### v2.8 更新内容
- 🪞 **镜像网站开关** — 优化镜像站开关与刷新提示；点击刷新后提示消失；修复快速切换时的动画跳变
- 🎨 **视觉体验优化** — 自定义下拉菜单、操作按钮样式、提示栏动画等整体打磨

### v2.7 更新内容
- 🎬 **抽屉式面板启动动画** — 标题栏淡入（0.55秒），内容区通过 `clip-path` 展开（1.5秒 easeOutExpo 缓动），营造"拉帘下降"效果，全程丝滑无像素抖动（单 GPU 合成属性，无布局抖动）；标题栏背景保持实色不透明（"桌沿"效果），仅内容淡入；选择器初始展开；开关通过 `init-lock` 锁定，1700毫秒后释放
- 🌐 **私聊错误优化** — 优化用户不存在时的错误提示描述
- 🖱️ **复制菜单交互打磨** — 增加500ms鼠标离开延迟；提升鼠标检测按钮范围，整体优化复制按钮交互体验。
- 🔩 **面板交互优化** — 在面板内，长描述文本不再挤走选择器；复制的链接统一简化为仓库根路径。
- 🐛 **修复复制名字** — 复制玩家名时自动去除末尾冒号和空格。
- 🎨 **复制提示优化** — 复制图标悬浮的文字改为"复制消息内容"。

### v2.6 更新内容
- 🎛 **版本号显示开关** — 签名水印支持可切换版本号；开关打开：` | v2.6 [Chat Unblocker]`；开关关闭：` [Chat Unblocker]` — 让未装插件的用户选择可读性还是版本信息
- 📋 **Fluent复制菜单** — 鼠标悬停任意消息显示复制图标；点击直接复制消息文字，或悬停图标弹出下拉菜单：复制内容（不含名字）、复制整条（含名字）、复制单个玩家名
- 🌍 **完整多语言** — 复制菜单和所有标签支持10种语言
- 🎬 **微软 Fluent 动画** — 弹性贝塞尔过渡、鼠标速度感知（快速移动不抖动）、点击缩放反馈、拖动/缩放时平滑跟随+淡出
- 🐛 **修复选中文字可见性** — 框选文字绿色背景+黑色文字，阴影和描边被抑制
- 🔧 **动态聊天检测** — 运行时 `CB.chatBody` 检测+ `CB.chat` 回退，不依赖硬编码CSS类名

### v2.5 更新内容
- 🏷️ **签名带版本号** — V2 消息现在包含 ` | v2.5 [Chat Unblocker]` 后缀；未装扩展的玩家也能看到版本号
- 🔄 **V1.2 格式兼容** — V1.2 模式同样显示 ` | v2.5 [Chat Unblocker]`；老版本用户可看到版本信息
- 🔒 **V1.2 签名锁定** — 选择 V1.2 格式时签名开关被锁定；首次尝试关闭会触发警告动画+红色提示
- ⚠️ **警告框平滑动画** — 所有警告框（黄色 V1.2 警告、红色签名警告）都有展开/收起过渡效果
- 🎨 **签名开关反馈** — 首次尝试关闭时抖动动画；关闭后红色背景；状态切换平滑
- 📦 **选择器展开动画** — 格式和语言选择器在面板打开时有平滑的展开动画

### v2.4 更新内容
- 🐛 **修复第一条消息无法切换问题** — 别人发送的第一条消息现在可以在解码内容和原始编码内容之间正确切换
- 🐛 **修复快速双击文字翻倍** — 快速连续点击编码开关不再导致消息文字显示双倍
- 🐛 **修复消息状态持久化** — 所有消息现在在切换操作时都能可靠保持显示状态
- 🏷️ **签名格式改回** — 回到不带版本号的 `[Chat Unblocker]`
- 🔄 **格式标签更新** — 设置面板中显示 V2.x 和 V1.2 格式选项
- 🌐 **页面语言标签** — 语言选择器上方新增"页面语言"标签

### v2.3 更新内容
- 🐛 **修复 V1.2 兼容性** — v1 模式现使用正确的 V1 签名格式；v1.2 用户可正常阅读消息
- 🔄 **格式切换器** — 可选择 V2（`~XXXX`）或 V1.2（`\uXXXX`）编码格式
- ⚠️ **V1.2 警告提示** — 部分 V1.2 字符组合可能被游戏服务器拦截
- 🏷️ **版本签名** — V2 消息前缀 `[Chat Unblocker V2.3]`；V1 消息使用原始后缀
- 🌐 **V1.2 标识** — 旧格式消息显示时带 `[V1.2 格式]` 前缀（多语言）

### 安装
1. 下载或克隆此仓库
2. 打开 `chrome://extensions/`
3. 开启「开发者模式」→「加载已解压的扩展程序」
4. 选择扩展文件夹
5. 去 tanktrouble.com 即可用中文聊天

---

## 日本語

### 概要
TankTrouble.com のチャットは非 ASCII 文字をブロックします。この拡張機能は、Unicode 文字を `~XXXX` 形式の ASCII 安全なエスケープシーケンスにエンコードして送信し、受信側で自動的にデコードします。

### 特徴
- 🌍 すべての文字体系に対応（CJK、アラビア語、キリル文字、絵文字等）
- 🔐 XOR スクランブルでフィルター対策
- ⏱ 応答喪失時の自動 UI 復帰
- 🎛 12 言語対応ポップアップパネル

### v3.1.0 の新機能
- 🚨 **メジャーリリース——動作するのは v3.1.0 以降のみ**：2026-10-09 のゲーム更新で旧版が依存していたインターフェースが削除され、v2.10.x 以前はすべて使用できなくなりました。必ず更新してください
- 🇻🇳 **ベトナム語を追加** — UI・コピーメニュー・ドキュメントが 12 言語対応に
- 🇧🇩 **ベンガル語を追加** — UI・コピーメニュー・ドキュメントが 12 言語対応に
- 📌 **全ページで動作・リロード不要** — チャット欄は全ページ共通のコンポーネントのため、フォーラムでも動作します。フォーラム ↔ ゲームの切り替えも自動で反映されます
- 🔧 **ゲーム大型改修への対応（2026-10-09）** — ゲームは `window.TankTrouble` を公開しなくなりました（ChatBox は esbuild の IIFE クロージャ内に封じられ、**独自イベントシステム**を使用＝バンドル内の `EventTarget` 参照は 0）。ただしチャット DOM は変わらず、メッセージ描画と文字幅測定は同一の SVG.js プロトタイプメソッド `text(x, y, value, settings)` を通ります。拡張はこれをフックし、**描画・測定の前**にデコードするためレイアウトと表示内容が一致します。送信側は **document** のキャプチャ段階で `keydown` を横取りします（入力欄自体に付けると、先に登録されるゲーム側ハンドラがエンコード前のテキストを読んでしまうため）
- 🐛 **送信フックの偶発的な「仮死」を修正（中国語が送れたり送れなかったり）** — 旧実装は探索時点でチャット入力欄が存在する場合のみハンドラを装着しました。入力欄がまだ作成されていなければ装着されず、ポーリングは既に停止し、起床イベントには発火元がないため、リロードするまで復帰できませんでした（英語はエンコード不要のため無影響）。現在は document 委任方式（イベントのターゲットで判定し、入力欄の参照は不要）に変更し、成功するまで低頻度ポーリングを無期限に続行します
- 🐛 **コピーの改行と折り返し部の文字化けを修正** — 送信者が入力していない改行をコピーに挿入しなくなり、折り返しでエンコードの途中で切断された長いメッセージも正しくデコードされます（レンダラーが硬く切れた二つを再び繋ぎ合わせます）

### v2.10.1 の新機能
- 🐛 **コピー切断の無音バグを修正** — 多数のメッセージを選択してコピーすると、連結テキストがブラウザのクリップボード書き込み上限（約4MB、条件によってはそれ未満でも）を超えて無音で切断されることがありました。長文は自動的に `textarea+execCommand` 同期チャネル（容量制限なし）へ切替。どちらの経路も失敗した場合はツールバー/ボタンが**赤く点滅**して知らせます。
- 🗂 **「TXTとして書き出す」を追加** — 多選択ツールバーの ⬇ ボタンで選択した記録を `chat-export-タイムスタンプ.txt` としてダウンロード。クリップボードを完全に回避し、記録が1件も欠けません。

### v2.10 の新機能
- 🧲 **複数選択＆一括コピー** — メッセージにホバーすると左側にチェック円が表示され、クリックで選択（緑ハイライト＋左緑線、プレビュー↔選択済みの色がクロスフェード）。一括モードでは別の円にホバーすると前回の選択から現在位置までの範囲全体（淡緑）をプレビューし、ワンクリックで一括選択。フローティングツールバーに コピー / 送信者名の切替 / 一括切替 / クリア
- 🛡 **左スクロールバー回避** — ゲームのカスタムスクロールバーはメッセージリスト左側にあり、チェック円＋コピーボタンは実行時に検出して円1個分の間隔を確保し、スクロールバーの操作を妨げません
- 🌊 **シルキーなホバー移動** — コピーボタン/円はメッセージ間を ease-out で滑らかに移動；リストスクロール中も現在の行を滑らかに追跡して振動なし；選択済み円はスクロールとフレーム同期
- 🎡 **言語選択の改善** — ホイール式セレクター（自由スクロール＋スナップ、ホイール1ノッチ=1項目）、エッジフェード；言語切替時に行の高さがアニメーションし、パネル全体が新しいレイアウトへ滑らかに流動
- 🧲 **物理追従フローティング UI ＋統一 hover 状態機械** — チャットバーのドラッグ中、フローティング要素は rAF バネ物理で追従；表示/非表示/位置/メニュー判定は単一の `applyHover()` に統一

### v2.9 の新機能
- 🌐 **ミラーサイト拡張** — `beta.tanktrouble.com` が `cdn.tanktrouble.com` と共にミラーサイトスイッチに統合；説明は「cdn. と beta. プレフィックスのサイト」に簡略化
- 🐛 **エンコード切替リグレッション修正** — `_raw` 保存の `setTimeout` フォールバックを復元し、切替が確実に動作（v2.5 からの回帰）
- 🐛 **@メンション互換性** — `.username` と `<a>` を `user-select: text` から除外し、コピ拡張が @ クリックを壊さないように
- 🐛 **新規ユーザー初期化修正** — content.js が bridge に `init` をリクエスト；`matches` が `*.tanktrouble.com` をカバーし `www.`/`beta.` も解決
- 📄 **インストール/更新/FAQ** — [docs/INSTALL.md](docs/INSTALL.md) に移動

### v2.8 の新機能
- 🪞 **ミラーサイトスイッチ** — ミラーサイト切替と更新プロンプトを改善；更新後にプロンプトを非表示；素早い切替時のアニメーション不具合を修正
- 🎨 **視覚体験の最適化** — カスタムドロップダウン、ボタンスタイル、警告アニメーションなどを改善

### v2.7 の新機能
- 🌐 **エラーメッセージ改善** — 無効なユーザーへの@メンション時のエラー文言を改善
- 🖱️ **コピーメニュー UX 改善** — マウス離脱遅延を500msに延長；アイコンの当たり判定に不可視パディングを追加してアイコン↔メニュー間の隙間を埋める；メニューはマウスが本当に離れたときだけスムーズに閉じる
- 🔩 **ポップアップレイアウト修正** — メッセージ形式行の長い説明文が折り返してセレクターを押し出さないように修正；共有リンクをリポジトリルートに統一
- 🐛 **名前コピー修正** — プレイヤー名コピー時に末尾のコロンとスペースを除去
- 🎨 **ツールチップ改良** — コピーアイコンのツールチップを「メッセージをコピー」に簡略化

### v2.6 の新機能
- 🎛 **バージョン番号切替** — 署名にバージョン番号の表示/非表示を追加；オンで ` | v2.6 [Chat Unblocker]`、オフで ` [Chat Unblocker]`
- 📋 **Fluent コピーメニュー** — メッセージにホバーでコピーアイコンを表示；クリックでメッセージ本文をコピー、ホバーでメニュー展開（テキストのみ / 全文 / プレイヤー名）
- 🌍 **完全多言語対応** — コピーメニューと全ラベルが10言語対応
- 🎬 **Microsoft Fluent アニメーション** — 弾力ベジェ曲線、マウス速度検知、クリック拡大フィードバック、リサイズ追従＋フェード
- 🐛 **テキスト選択の可視性修正** — 選択文字が緑背景＋黒文字で表示
- 🔧 **動的チャット検出** — 実行時 `CB.chatBody` 検出＋ `CB.chat` フォールバック

### v2.5 の新機能
- 🏷️ **署名にバージョン番号** — V2 メッセージに ` | v2.5 [Chat Unblocker]` サフィックスを追加；未インストールユーザーにもバージョンが見える
- 🔄 **V1.2 形式互換** — V1.2 モードでも ` | v2.5 [Chat Unblocker]` を表示；レガシーユーザーもバージョン情報を確認可能
- 🔒 **V1.2 署名ロック** — V1.2 形式選択時に署名スイッチがロック；初回クローズ試行で警告アニメーション＋赤色アラート
- ⚠️ **警告ボックスの滑らかなアニメーション** — 全警告ボックス（黄色 V1.2 警告、赤色署名警告）に展開/収縮トランジション
- 🎨 **署名スイッチのフィードバック** — 初回クローズ試行時にシェイクアニメーション；クローズ後赤色背景；状態切替が滑らかに
- 📦 **セレクター展開アニメーション** — パネルオープン時にフォーマットと言語セレクターが滑らかに展開

### v2.4 の新機能
- 🐛 **最初のメッセージ切替バグ修正** — 他人から送信された最初のメッセージが、エンコード切替時にデコード済み内容と生エンコード内容の間で正しく切替可能に
- 🐛 **ダブルクリック文字重複修正** — エンコード切替ボタンの連続クリックでメッセージ文字が二重表示されなくなりました
- 🐛 **メッセージ状態永続化修正** — 全メッセージが切替操作時に表示状態を確実に維持
- 🏷️ **署名形式の復元** — バージョン番号なしの `[Chat Unblocker]` に戻りました
- 🔄 **形式ラベル更新** — 設定パネルに V2.x と V1.2 形式オプション
- 🌐 **ページ言語ラベル** — 言語セレクターの上に「ページ言語」ラベル追加

### v2.2 の新機能
- ✅ **V1.2 形式の互換性** — 古い `\uXXXX` メッセージを自動検出・デコード
- 🔄 **形式スイッチャー** — V2.2（`~XXXX`）と V1.2（`\uXXXX`）を選択可能
- ⚠️ **V1.2 警告** — 一部の V1.2 文字列はゲームサーバーにブロックされる可能性
- 🏷️ **バージョン署名** — メッセージは `[Chat Unblocker V2.2]` で始まる
- 🌐 **V1.2 ラベル** — 旧形式メッセージに `[V1.2 形式]` プレフィックス（多言語）

### インストール
1. リポジトリをダウンロード
2. `chrome://extensions/` を開く
3. デベロッパーモード → パッケージ化されていない拡張機能を読み込む

---

## 한국어

### 설명
TankTrouble.com 채팅은 비ASCII 문자를 차단합니다. 이 확장 프로그램은 유니코드 문자를 ASCII 안전 `~XXXX` 형식으로 인코딩하여 전송하고, 수신 측에서 자동으로 디코딩합니다.

### 기능
- 🌍 모든 문자 체계 지원 (한글, 한자, 가나, 아랍어, 이모지 등)
- 🔐 XOR 스크램블로 필터 우회
- ⏱ 응답 없을 시 UI 자동 복구
- 🎛 다국어 패널 (12 개 언어)

### v3.1.0 업데이트 내용
- 🚨 **메이저 릴리스 — v3.1.0 이상만 작동**: 2026-10-09 게임 업데이트로 구버전이 의존하던 인터페이스가 제거되어 v2.10.x 이하는 모두 사용할 수 없게 되었습니다. 반드시 업데이트하세요
- 🇻🇳 **베트남어 추가** — UI, 복사 메뉴, 문서가 이제 12개 언어를 지원합니다
- 🇧🇩 **벵골어 추가** — UI, 복사 메뉴, 문서가 이제 12개 언어를 지원합니다
- 📌 **모든 페이지에서 작동·새로고침 불필요** — 채팅창이 전역 컴포넌트라 포럼 페이지에서도 작동합니다. 포럼 ↔ 게임 전환도 자동으로 적용됩니다
- 🔧 **게임 대개편 대응 (2026-10-09)** — 게임이 더 이상 `window.TankTrouble`을 노출하지 않습니다(ChatBox는 esbuild IIFE 클로저에 봉인되고 **자체 이벤트 시스템**을 사용 — 번들 내 `EventTarget` 참조 0회). 하지만 채팅 DOM은 그대로이며, 메시지 렌더링과 텍스트 폭 측정이 동일한 SVG.js 프로토타입 메서드 `text(x, y, value, settings)`를 거칩니다. 확장은 이를 후킹해 **렌더링·측정 이전**에 디코딩하므로 레이아웃과 표시 내용이 일치합니다. 전송 측은 **document** 캡처 단계에서 `keydown`을 가로챕니다(입력창 자체에 달면 먼저 등록되는 게임 핸들러가 인코딩되지 않은 텍스트를 읽게 되기 때문입니다)
- 🐛 **전송 훅의 간헐적 「가사 상태」 수정(중국어가 될 때도 안 될 때도 있음)** — 예전 구현은 탐색 시점에 채팅 입력란이 이미 있을 때만 핸들러를 장착했습니다. 게임이 아직 입력란을 만들지 않았다면 장착되지 않았고, 폴링은 이미 멈췄으며, 깨우기 이벤트에는 보내는 쪽이 없어 새로고침 전까지 복구되지 않았습니다(영어는 인코딩이 필요 없어 무영향). 이제 document 위임 방식(이벤트 대상으로 판정, 입력란 참조 불필요)으로 장착하며, 성공할 때까지 저빈도 폴링을 무기한 계속합니다
- 🐛 **복사 줄바꿈 및 줄바꿈 지점의 문자 깨짐 수정** — 발신자가 입력하지 않은 줄바꿈을 복사 결과에 더 이상 넣지 않으며, 줄바꿈으로 인코딩 중간에 잘린 긴 메시지도 이제 올바르게 디코딩됩니다(렌더러가 강제로 잘린 두 조각을 다시 이어 붙입니다)

### v2.10.1 업데이트 내용
- 🐛 **복사 잘림 무음 버그 수정** — 많은 메시지를 선택해 복사하면 연결된 텍스트가 브라우저 클립보드 쓰기 한도(약 4MB, 조건에 따라 더 적게도)를 초과해 소리 없이 잘렸습니다. 긴 텍스트는 자동으로 `textarea+execCommand` 동기 채널(용량 제한 없음)로 전환됩니다. 어떤 경로든 실패하면 툴바/버튼이 **빨갛게 깜빡여** 알려줍니다.
- 🗂 **「TXT로 내보내기」추가** — 다중 선택 툴바의 ⬇ 버튼으로 선택한 기록을 `chat-export-타임스탬프.txt`로 다운로드합니다. 클립보드를 완전히 우회해 기록이 하나도 빠지지 않습니다.

### v2.10 업데이트 내용
- 🧲 **다중 선택 및 일괄 복사** — 메시지에 마우스를 올리면 왼쪽에 체크 원이 나타나고 클릭으로 선택(초록 하이라이트+왼쪽 초록선, 미리보기↔선택 색상 크로스페이드). 일괄 모드에서 다른 원에 마우스를 올리면 마지막 선택부터 현재 위치까지 전체 범위(연초록)를 미리보기하고 한 번의 클릭으로 일괄 선택. 플로팅 툴바에서 복사 / 발신자 이름 포함 토글 / 일괄 토글 / 지우기
- 🛡 **왼쪽 스크롤바 회피** — 게임의 커스텀 스크롤바는 메시지 목록 왼쪽에 있으며, 체크 원+복사 버튼이 런타임에 감지하여 원 1개 폭의 간격을 확보, 스크롤바 조작을 가리지 않음
- 🌊 **매끄러운 호버 이동** — 복사 버튼/원이 메시지 간 ease-out으로 부드럽게 이동; 목록 스크롤 중에도 현재 행을 부드럽게 추적해 떨림 없음; 상시 체크 원은 스크롤과 프레임 동기화
- 🎡 **언어 선택 개선** — 휠 방식 셀렉터(자유 스크롤+스냅, 휠 1칸=1항목), 가장자리 페이드; 언어 전환 시 행 높이가 애니메이션되어 패널 전체가 새 레이아웃으로 부드럽게 흐름
- 🧲 **물리 추종 플로팅 UI + 통합 hover 상태 머신** — 채팅바 드래그 중 플로팅 요소가 rAF 스프링 물리로 추종; 표시/숨김/위치/메뉴 판정이 단일 `applyHover()`로 통일

### v2.9 업데이트 내용
- 🌐 **미러 사이트 확장** — `beta.tanktrouble.com`이 `cdn.tanktrouble.com`과 함께 미러 사이트 스위치에 통합; 설명은 "cdn. 및 beta. 접두사 사이트"로 간소화
- 🐛 **인코딩 토글 회귀 수정** — `_raw` 저장의 `setTimeout` 폴백 복원, 토글이 안정적으로 동작 (v2.5부터 회귀)
- 🐛 **@멘션 호환성** — `.username`/`<a>`를 `user-select: text`에서 제외, 복사 확장이 @ 클릭을 망가뜨리지 않게
- 🐛 **신규 사용자 초기화 수정** — content.js가 bridge에 `init` 요청; `matches`가 `*.tanktrouble.com`을 덮어 `www.`/`beta.`도 해결
- 📄 **설치/업데이트/FAQ** — [docs/INSTALL.md](docs/INSTALL.md)로 이동

### v2.8 업데이트 내용
- 🪞 **미러 사이트 스위치** — 미러 사이트 토글 및 새로고침 안내 개선; 새로고침 후 안내 자동 닫힘; 빠른 전환 시 애니메이션 버그 수정
- 🎨 **시각 경험 최적화** — 커스텀 드롭다운, 버튼 스타일, 경고 애니메이션 등 UI 개선

### v2.7 업데이트 내용
- 🌐 **오류 메시지 개선** — 유효하지 않은 사용자 @멘션 시 오류 문구 개선
- 🖱️ **복사 메뉴 UX 개선** — 마우스 이탈 지연을 500ms로 증가; 아이콘 감지 영역에 보이지 않는 패딩 추가로 아이콘↔메뉴 간극 제거; 메뉴는 마우스가 실제로 떠날 때만 부드럽게 닫힘
- 🔩 **팝업 레이아웃 수정** — 메시지 형식 행의 긴 설명이 줄바꿈되어 선택기를 밀어내지 않도록 수정; 공유 링크를 저장소 루트로 통일
- 🐛 **이름 복사 수정** — 플레이어 이름 복사 시 끝의 콜론과 공백 제거
- 🎨 **툴팁 개선** — 복사 아이콘 툴팁을 "메시지 복사"로 간소화

### v2.6 업데이트 내용
- 🎛 **버전 번호 토글** — 서명에 버전 번호 표시/숨김 추가; 켜면 ` | v2.6 [Chat Unblocker]`, 끄면 ` [Chat Unblocker]`
- 📋 **Fluent 복사 메뉴** — 메시지에 마우스를 올리면 복사 아이콘 표시; 클릭 시 메시지 본문 복사, 호버 시 메뉴 확장(텍스트만 / 전체 / 플레이어 이름)
- 🌍 **완전한 다국어 지원** — 복사 메뉴와 모든 라벨이 10개 언어 지원
- 🎬 **Microsoft Fluent 애니메이션** — 탄력 있는 베지어 곡선, 마우스 속도 감지, 클릭 확대 피드백, 크기 조절 시 추적+페이드
- 🐛 **텍스트 선택 가시성 수정** — 선택된 텍스트가 녹색 배경+검은색 텍스트로 표시
- 🔧 **동적 채팅 감지** — 런타임 `CB.chatBody` 감지 + `CB.chat` 폴백

### v2.5 업데이트 내용
- 🏷️ **서명에 버전 번호** — V2 메시지에 ` | v2.5 [Chat Unblocker]` 접미사 추가; 미설치 사용자도 버전 확인 가능
- 🔄 **V1.2 형식 호환** — V1.2 모드에서도 ` | v2.5 [Chat Unblocker]` 표시; 레거시 사용자도 버전 정보 확인 가능
- 🔒 **V1.2 서명 잠금** — V1.2 형식 선택 시 서명 스위치 잠금; 첫 번째 닫기 시도 시 경고 애니메이션 + 빨간색 알림
- ⚠️ **경고창 부드러운 애니메이션** — 모든 경고창 (노란색 V1.2 경고, 빨간색 서명 경고) 에展开/收起 전환 효과
- 🎨 **서명 스위치 피드백** — 첫 번째 닫기 시도 시 쉐이크 애니메이션; 닫힌 후 빨간색 배경; 상태 전환 부드럽게
- 📦 **선택기展开 애니메이션** — 패널 열릴 때 형식 및 언어 선택기 부드러운展开 효과

### v2.4 업데이트 내용
- 🐛 **첫 번째 메시지 전환 버그 수정** — 다른 사용자가 보낸 첫 번째 메시지가 인코딩 전환 시 디코딩된 내용과 원시 인코딩 내용 간에 올바르게 전환됨
- 🐛 **더블클릭 텍스트 중복 수정** — 인코딩 토글 버튼을 빠르게 연속 클릭해도 메시지 텍스트가 두 배로 표시되지 않음
- 🐛 **메시지 상태 지속성 수정** — 모든 메시지가 전환 작업 시 표시 상태를 안정적으로 유지
- 🏷️ **서명 형식 복원** — 버전 번호 없는 `[Chat Unblocker]` 로 복귀
- 🔄 **형식 라벨 업데이트** — 설정 패널에 V2.x 및 V1.2 형식 옵션
- 🌐 **페이지 언어 라벨** — 언어 선택기 위에 "페이지 언어" 라벨 추가

### v2.2 업데이트 내용
- ✅ **V1.2 형식 호환** — 이전 `\uXXXX` 메시지 자동 감지 및 디코딩
- 🔄 **형식 전환기** — V2.2(`~XXXX`) 와 V1.2(`\uXXXX`) 중 선택 가능
- ⚠️ **V1.2 경고** — 일부 V1.2 문자 조합은 게임 서버에 차단될 수 있음
- 🏷️ **버전 서명** — 메시지가 `[Chat Unblocker V2.2]` 로 시작
- 🌐 **V1.2 라벨** — 이전 형식 메시지에 `[V1.2 형식]` 접두사 표시 (다국어)

### 설치
1. 저장소 다운로드
2. `chrome://extensions/` 열기
3. 개발자 모드 → 압축해제된 확장 로드

---

## Русский

### Описание
Чат TankTrouble.com блокирует не-ASCII символы. Расширение кодирует Unicode в ASCII-безопасные `~XXXX` последовательности перед отправкой и декодирует их при получении.

### Возможности
- 🌍 Поддержка всех письменностей (кириллица, CJK, арабица, эмодзи)
- 🔐 XOR-скремблирование для обхода фильтров
- ⏱ Автовосстановление UI при потере ответа
- 🎛 Многоязычная панель (12 языков)

### Новое в v3.1.0
- 🚨 **Крупный релиз — работает только v3.1.0 и новее**: обновление игры от 2026-10-09 удалило интерфейсы, на которые опирались все старые версии; всё до v2.10.x больше не работает. Пожалуйста, обновитесь
- 🇻🇳 **Добавлен вьетнамский язык** — интерфейс, меню копирования и документация теперь на 12 языках
- 🇧🇩 **Добавлен бенгальский язык** — интерфейс, меню копирования и документация теперь на 12 языках
- 📌 **Работает на всех страницах — без перезагрузки** — чат глобальный, поэтому расширение работает и на форуме; переходы между страницами (форум ↔ игра) применяются автоматически
- 🔧 **Совместимость с крупным обновлением игры (2026-10-09)** — игра больше не предоставляет `window.TankTrouble`: ChatBox заперт внутри IIFE-замыкания esbuild **с собственной системой событий** (в бандле 0 ссылок на `EventTarget`), поэтому перехват нативных API до него не достаёт. Однако DOM чата не изменился, а отрисовка сообщений и измерение ширины текста идут через один и тот же метод прототипа SVG.js — `text(x, y, value, settings)`. Расширение перехватывает его и декодирует **до отрисовки и измерения**; отправка кодируется перехватом `keydown` на фазе захвата **на уровне document** (обработчик игры регистрируется раньше и прочитал бы некодированный текст, если слушать само поле ввода)
- 🐛 **Исправлен периодический «сон» перехватчика отправки (китайский уходил через раз)** — обработчик навешивался только если поле ввода уже существовало в момент проверки; если игра ещё не создала его, слушатель не навешивался, а опрос уже был остановлен и у события-пробуждения не было отправителя — сбой держался до перезагрузки страницы (английский не затронут: ему не нужно кодирование). Теперь навешивание делегировано на document (определяется по цели события, без ссылки на поле), а опрос повторяет попытки с низкой частотой без ограничения — до успеха
- 🐛 **Исправлены переносы строк и «кракозябры» на переносе при копировании** — в скопированный текст больше не вставляются переносы, которых отправитель не набирал; длинные сообщения, разрезанные переносом посреди кодирования, теперь корректно декодируются (рендерер склеивает две принудительно разрезанные половины обратно)

### Новое в v2.10.1
- 🐛 **Исправлена тихая обрезка при копировании** — при копировании множества сообщений склеенный текст превышал лимит записи в буфер обмена (~4МБ, иногда меньше) и молча обрезался. Длинный текст теперь автоматически идёт через синхронный канал `textarea+execCommand` (без ограничения объёма); при любом сбое панель/кнопка **мигает красным** вместо притворного успеха.
- 🗂 **Новое: «Экспорт в TXT»** — кнопка ⬇ на панели множественного выбора скачивает выбранные записи в `chat-export-<timestamp>.txt` через загрузку файла, полностью минуя буфер обмена, — ни одна запись не теряется.

### Новое в v2.10
- 🧲 **Мультивыбор и пакетное копирование** — при наведении на сообщение слева появляется круг-чекбокс, клик выбирает (зелёная подсветка строки + зелёная линия слева, предпросмотр↔выбрано плавный переход цвета). В пакетном режиме наведение на другой круг предварительно показывает весь диапазон от прошлого выбора до курсора (бледно-зелёный), один клик выбирает диапазон целиком. Плавающая панель: копировать / переключатель имён отправителей / пакетный переключатель / очистить
- 🛡 **Обход левого скроллбара** — кастомный скроллбар игры находится слева от списка сообщений; круг-чекбокс и кнопка копирования обнаруживают его на лету и оставляют зазор в ширину круга, скроллбар полностью доступен
- 🌊 **Шёлковое движение при наведении** — кнопка копирования/круг плавно скользят между сообщениями (ease-out); при прокрутке списка плавно догоняют текущую строку без дрожания; постоянные круги синхронны с прокруткой покадрово
- 🎡 **Улучшение выбора языка** — селектор-колесо (свободная прокрутка + прилипание, одна насечка = один пункт), затухание по краям; смена языка анимирует высоты строк, вся панель перетекает в новый макет
- 🧲 **Физическое следование + единый hover-автомат** — при перетаскивании панели чата плавающие элементы следуют на rAF-пружинах; все решения показать/скрыть/позиция/меню — единый `applyHover()`

### Новое в v2.9
- 🌐 **Расширение зеркала** — `beta.tanktrouble.com` теперь вместе с `cdn.tanktrouble.com` под переключателем зеркала; описание упрощено до "сайты с префиксом cdn. и beta."
- 🐛 **Регресс переключателя кодирования** — восстановлен `setTimeout`-фолбэк хранения `_raw`, переключатель надёжно меняет декодированный/сырой вид (регрессия с v2.5)
- 🐛 **Совместимость @упоминаний** — `.username` и `<a>` исключены из `user-select: text`, копирующие расширения больше не ломают @клики
- 🐛 **Инициализация новых пользователей** — content.js сам запрашивает `init` у bridge; `matches` покрывает `*.tanktrouble.com`, `www.`/`beta.` тоже работают
- 📄 **Установка/обновление/FAQ** — перенесено в [docs/INSTALL.md](docs/INSTALL.md)

### Новое в v2.8
- 🪞 **Переключатель зеркала** — улучшен переключатель зеркала и подсказка обновления; подсказка исчезает после обновления; исправлены сбои анимации при быстром переключении
- 🎨 **Визуальные улучшения** — кастомные выпадающие списки, стили кнопок, анимации предупреждений

### Новое в v2.7
- 🌐 **Улучшение сообщений об ошибках** — улучшен текст ошибки для несуществующих пользователей при @упоминании
- 🖱️ **Улучшение UX меню копирования** — задержка скрытия 500мс; невидимый padding для устранения зазора между иконкой и меню; меню плавно закрывается только при реальном уходе курсора
- 🔩 **Исправление макета панели** — длинный текст в строке формата сообщений переносится, не сдвигая селектор; ссылка унифицирована до корня репозитория
- 🐛 **Исправление копирования имени** — копирование имени игрока удаляет двоеточие и пробел в конце
- 🎨 **Улучшение подсказки** — подсказка иконки упрощена до «Копировать сообщение»

### Новое в v2.6
- 🎛 **Переключатель версии** — подпись включает опциональный номер версии; вкл: ` | v2.6 [Chat Unblocker]`, выкл: ` [Chat Unblocker]`
- 📋 **Fluent меню копирования** — наведите на сообщение → иконка копирования; клик — копия текста, ховер — меню (только текст / всё / имя)
- 🌍 **Полная i18n поддержка** — меню и все метки на 12 языках
- 🎬 **Microsoft Fluent анимации** — упругие кривые Безье, детекция скорости мыши, пульсация при клике, следование при ресайзе
- 🐛 **Видимость выделения текста** — выделение: зелёный фон + чёрный текст
- 🔧 **Динамическое обнаружение чата** — `CB.chatBody` + fallback `CB.chat`

### Новое в v2.5
- 🐛 **Исправлена ошибка переключения первого сообщения** — первое полученное сообщение теперь корректно переключается между декодированным и исходным закодированным содержимым
- 🐛 **Исправлено удвоение текста при двойном клике** — быстрое нажатие кнопки переключения больше не вызывает удвоение текста сообщения
- 🐛 **Исправлено сохранение состояния сообщений** — все сообщения теперь надёжно сохраняют состояние отображения при переключении
- 🏷️ **Возврат формата подписи** — обратно к `[Chat Unblocker]` без номера версии
- 🔄 **Обновлены метки форматов** — опции V2.x и V1.2 в панели настроек
- 🌐 **Метка языка страницы** — новый ярлык «Язык страницы» над селектором языка

### Новое в v2.2
- ✅ **Совместимость с V1.2** — автоматическое обнаружение и декодирование старых `\uXXXX` сообщений
- 🔄 **Переключатель формата** — выбор между V2.2 (`~XXXX`) и V1.2 (`\uXXXX`)
- ⚠️ **Предупреждение V1.2** — некоторые комбинации V1.2 могут блокироваться сервером
- 🏷️ **Версия подписи** — сообщения начинаются с `[Chat Unblocker V2.2]`
- 🌐 **Метка V1.2** — старые сообщения отображаются с префиксом `[V1.2 Формат]` (i18n)

### Установка
1. Скачайте репозиторий
2. Откройте `chrome://extensions/`
3. Режим разработчика → Загрузить распакованное расширение

---

## العربية

### الوصف
دردشة TankTrouble.com تحظر الأحرف غير ASCII. هذا الملحق يقوم بتشفير Unicode إلى تسلسلات `~XXXX` الآمنة ASCII قبل الإرسال، ويفك تشفيرها عند الاستلام.

### الميزات
- 🌍 دعم جميع أنظمة الكتابة (العربية، CJK، السيريلية، الإيموجي)
- 🔐 تشفير XOR لتجاوز الفلاتر
- ⏱ استرداد تلقائي للواجهة
- 🎛 لوحة متعددة اللغات (12 لغات)

### الجديد في v3.1.0
- 🚨 **إصدار رئيسي — يعمل فقط v3.1.0 فأحدث**: تحديث اللعبة بتاريخ 2026-10-09 أزال الواجهات التي كانت تعتمد عليها كل الإصدارات القديمة؛ كل ما قبل v2.10.x لم يعد يعمل. يرجى التحديث
- 🇻🇳 **إضافة اللغة الفيتنامية** — الواجهة وقائمة النسخ والمستندات تدعم الآن 12 لغة
- 🇧🇩 **إضافة اللغة البنغالية** — الواجهة وقائمة النسخ والمستندات تدعم الآن 12 لغة
- 📌 **يعمل في كل الصفحات — دون تحديث** — صندوق الدردشة عام، لذا تعمل الإضافة في صفحة المنتدى أيضًا؛ والتنقل بين الصفحات (المنتدى ↔ اللعبة) يُطبَّق تلقائيًا
- 🔧 **التوافق مع التحديث الشامل للعبة (2026-10-09)** — لم تعد اللعبة تُعرّف `window.TankTrouble`: أصبح ChatBox محصورًا داخل إغلاق esbuild IIFE **بنظام أحداث خاص** (صفر إشارات إلى `EventTarget`)، لذا لا تصل إليه اعتراضات الـ API الأصلية. لكن DOM الدردشة لم يتغير، ويتم رسم الرسائل وقياس عرض النص عبر نفس دالة النموذج SVG.js — `text(x, y, value, settings)`. تعترض الإضافة هذه الدالة وتفك الترميز **قبل الرسم والقياس**؛ أما الإرسال فيُرمَّز باعتراض `keydown` في مرحلة الالتقاط **على مستوى document** (ربط المستمع بالحقل نفسه يخسر السباق — معالج اللعبة يُسجَّل أولاً وسيقرأ النص غير المُرمَّز)
- 🐛 **إصلاح «تعطُّل» حارس الإرسال المتقطِّع (الصينية تُرسَل أحيانًا ولا تُرسَل أحيانًا)** — كان الحارس يُثبَّت فقط إذا وُجد حقل إدخال الدردشة لحظة الفحص؛ وإن لم تكن اللعبة قد أنشأته بعد فلا يُثبَّت، بينما يكون الاستقصاء قد توقف أصلًا وحدث الاستيقاظ بلا مُرسِل — فيبقى الخلل حتى إعادة تحميل الصفحة (الإنجليزية لا تتأثر لعدم حاجتها إلى ترميز). الآن يُثبَّت الحارس بالتوكيل على document (يُحكَم حسب هدف الحدث، دون الحاجة إلى مرجع الحقل)، ويستمر الاستقصاء بمعدل منخفض وبلا حد حتى النجاح
- 🐛 **إصلاح فواصل الأسطر والرموز المشوّهة عند النسخ** — لم تُدرَج فواصل أسطر في النص المنسوخ لم يكتبها المُرسِل، والرسائل الطويلة التي يقطعها الالتفاف في منتصف الترميز تُفَكّ الآن بشكل صحيح (يقوم المُصيّر بإلصاق النصفين المقطوعين قسرًا مرة أخرى)

### الجديد في v2.10.1
- 🐛 **إصلاح اقتطاع النسخ الصامت** — عند نسخ رسائل كثيرة، قد يتجاوز النص المجمّع حدّ الكتابة في الحافظة (~4 م.ب، وأقل في بعض الحالات) فيُقتطع بصمت. يتم الآن تحويل النص الطويل تلقائيًا إلى قناة `textarea+execCommand` المتزامنة (بلا حدّ للحجم)؛ وعند فشل أي مسار يومض الشريط/الزر **بالأحمر** بدلاً من الادعاء بالنجاح.
- 🗂 **إضافة «تصدير كـ TXT»** — زر ⬇ في شريط التحديد المتعدد يحمّل السجلات المحددة كملف `chat-export-<time>.txt` عبر تنزيل الملف، متجاوزًا الحافظة تمامًا، فلا تُفقد أي رسالة.

### الجديد في v2.10
- 🧲 **تحديد متعدد ونسخ دفعي** — عند التمرير فوق رسالة يظهر دائرة تحديد على يسارها، والنقر يحددها (تمييز أخضر + خط أخضر يسار، انتقال لوني سلس بين المعاينة والمحدد). في الوضع الدفعي، التمرير فوق دائرة أخرى يعاين النطاق كاملاً من آخر تحديد إلى المؤشر (أخضر فاتح)، ونقرة واحدة تحدد النطاق بالكامل. شريط عائم: نسخ / تبديل أسماء المرسلين / تبديل دفعي / مسح
- 🛡 **تجنب شريط التمرير الأيسر** — شريط التمرير المخصص للعبة على يسار قائمة الرسائل؛ دائرة التحديد وزر النسخ يكشفانه وقت التشغيل ويتركان فجوة بعرض دائرة كاملة فلا يُحجب الشريط
- 🌊 **حركة انسيابية عند التمرير** — زر النسخ/الدائرة ينزلق بين الرسائل بـ ease-out؛ أثناء تمرير القائمة يلاحقان الصف الحالي بسلاسة دون اهتزاز؛ دوائر التحديد الدائمة متزامنة مع التمرير إطاراً بإطار
- 🎡 **تحسين اختيار اللغة** — محدد بعجلة (تمرير حر + التصاق، درجة واحدة = عنصر واحد)، تلاشي الحواف؛ تبديل اللغة يحرّك ارتفاعات الأسطر فتتدفق اللوحة كاملة إلى التخطيط الجديد
- 🧲 **واجهات عائمة بفيزياء + آلة حالات hover موحدة** — أثناء سحب شريط الدردشة تتبع العناصر العائمة فيزياء نوابض rAF؛ كل قرارات الإظهار/الإخفاء/الموضع/القائمة في `applyHover()` واحدة

### الجديد في v2.9
- 🌐 **توسيع المرآة** — `beta.tanktrouble.com` الآن مع `cdn.tanktrouble.com` تحت مفتاح المرآة؛ الوصف مبسط إلى "مواقع ببادئة cdn. و beta."
- 🐛 **إصلاح ارتداد مفتاح الترميز** — استعادة احتياطي `setTimeout` لتخزين `_raw`، المفتاح يبدل الموثوق (ارتداد من v2.5)
- 🐛 **توافق @الإشارة** — استثناء `.username` و`<a>` من `user-select: text`، امتدادات النسخ لم تعد تعطل @
- 🐛 **إصلاح تهيئة المستخدم الجديد** — content.js يطلب `init` من bridge؛ `matches` يغطي `*.tanktrouble.com`، `www.`/`beta.` يعملون أيضاً
- 📄 **تثبيت/تحديث/الأسئلة الشائعة** — نقل إلى [docs/INSTALL.md](docs/INSTALL.md)

### الجديد في v2.8
- 🪞 **مفتاح الموقع المرآة** — تحسين مفتاح الموقع المرآة وتلميح التحديث؛ يختفي التلميح بعد التحديث؛ إصلاح مشاكل الرسوم المتحركة عند التبديل السريع
- 🎨 **تحسين المظهر** — قوائم منسدلة مخصصة، أنماط أزرار، رسوم تحذير متحركة

### الجديد في v2.7
- 🌐 **تحسين رسائل الخطأ** — تحسين نص الخطأ للإشارة @ إلى مستخدمين غير موجودين
- 🖱️ **تحسين تجربة قائمة النسخ** — تأخير الإخفاء 500ms؛ مساحة غير مرئية لسد الفجوة بين الأيقونة والقائمة؛ القائمة تغلق بسلاسة فقط عند مغادرة المؤشر فعلياً
- 🔩 **إصلاح تخطيط اللوحة** — النص الطويل في صف تنسيق الرسالة يلتف دون دفع المحدد؛ رابط المشاركة موحد إلى جذر المستودع
- 🐛 **إصلاح نسخ الاسم** — نسخ اسم اللاعب يزيل النقطتين والمسافة في النهاية
- 🎨 **تحسين التلميح** — تلميح أيقونة النسخ مبسط إلى «نسخ الرسالة»

### الجديد في v2.6
- 🎛 **تبديل رقم الإصدار** — التوقيع يتضمن رقم إصدار قابل للتبديل؛ تشغيل: ` | v2.6 [Chat Unblocker]`، إيقاف: ` [Chat Unblocker]`
- 📋 **قائمة نسخ Fluent** — مرر فوق الرسالة لإظهار أيقونة النسخ؛ انقر لنسخ النص، مرر للأعلى للقائمة (نص فقط / الكل / الاسم)
- 🌍 **دعم كامل متعدد اللغات** — القائمة وجميع التسميات بـ 12 لغة
- 🎬 **رسوم Microsoft Fluent المتحركة** — منحنيات بيزيه مرنة، كشف سرعة الفأرة، نبضة عند النقر، تتبع عند تغيير الحجم
- 🐛 **رؤية تحديد النص** — التحديد: خلفية خضراء + نص أسود
- 🔧 **كشف ديناميكي للدردشة** — `CB.chatBody` + احتياطي `CB.chat`

### الجديد في v2.5
- 🐛 **إصلاح خطأ تبديل الرسالة الأولى** — الرسالة الأولى المستلمة تتبدل الآن بشكل صحيح بين المحتوى المفكوك والمحتوى المشفر الخام
- 🐛 **إصلاح تكرار النص عند النقر المزدوج** — النقر السريع على زر التبديل لم يعد يسبب تكرار نص الرسالة
- 🐛 **إصلاح استمرار حالة الرسائل** — جميع الرسائل تحافظ الآن على حالة العرض بشكل موثوق
- 🏷️ **إعادة تنسيق التوقيع** — العودة إلى `[Chat Unblocker]` بدون رقم إصدار
- 🔄 **تحديث ملصقات التنسيق** — خيارات V2.x و V1.2 في لوحة الإعدادات
- 🌐 **ملصق لغة الصفحة** — ملصق جديد "لغة الصفحة" فوق محدد اللغة

### الجديد في v2.2
- ✅ **التوافق مع تنسيق V1.2** — الكشف التلقائي وفك ترميز رسائل `\uXXXX` القديمة
- 🔄 **مبدل التنسيق** — اختيار بين V2.2 (`~XXXX`) و V1.2 (`\uXXXX`)
- ⚠️ **تحذير V1.2** — بعض تركيبات V1.2 قد تحظرها لعبة الخادم
- 🏷️ **توقيع الإصدار** — الرسائل تبدأ بـ `[Chat Unblocker V2.2]`
- 🌐 **ملصق V1.2** — الرسائل القديمة تعرض مع البادئة `[V1.2 تنسيق]` (متعدد اللغات)

### التثبيت
1. حمل المستودع
2. افتح `chrome://extensions/`
3. وضع المطور → تحميل ملحق غير مضغوط

---

## Français

### Description
Le chat de TankTrouble.com bloque les caractères non-ASCII. Cette extension encode les caractères Unicode en séquences `~XXXX` (compatibles ASCII) avant l'envoi, puis les décode à la réception.

### Fonctionnalités
- 🌍 Tous les systèmes d'écriture (CJK, arabe, cyrillique, emoji)
- 🔐 Brouillage XOR anti-filtre
- ⏱ Récupération automatique de l'IU
- 🎛 Panneau multilingue (12 langues)

### Nouveautés v3.1.0
- 🚨 **Version majeure — seul v3.1.0+ fonctionne** : la mise à jour du jeu du 2026-10-09 a supprimé les interfaces dont dépendaient toutes les anciennes versions ; tout jusqu'à v2.10.x est inutilisable. Veuillez mettre à jour
- 🇻🇳 **Ajout du vietnamien** — interface, menu de copie et documentation désormais en 12 langues
- 🇧🇩 **Ajout du bengali** — interface, menu de copie et documentation désormais en 12 langues
- 📌 **Fonctionne sur toutes les pages — sans actualisation** — la boîte de chat est globale, l'extension tourne donc aussi sur le forum ; les changements de page (forum ↔ jeu) s'appliquent automatiquement
- 🔧 **Compatibilité avec la refonte du jeu (2026-10-09)** — le jeu n'expose plus `window.TankTrouble` : ChatBox est enfermé dans une fermeture IIFE esbuild **avec son propre système d'événements** (zéro référence à `EventTarget`), donc le hooking des API natives ne peut pas l'atteindre. Le DOM du chat est inchangé et le rendu des messages comme la mesure de largeur passent par une même méthode du prototype SVG.js — `text(x, y, value, settings)`. L'extension la détourne et décode **avant** rendu/mesure ; l'envoi est encodé en interceptant `keydown` en phase de capture **au niveau du document** (un écouteur sur le champ lui-même perdrait la course — le gestionnaire du jeu s'enregistre avant et lirait le texte non encodé)
- 🐛 **Corrigé l'« engourdissement » intermittent du hook d'envoi (le chinois partait par intermittence)** — l'ancien code n'attachait l'écouteur que si le champ de saisie existait déjà lors du sondage ; si le jeu ne l'avait pas encore créé, l'écouteur n'était jamais attaché alors que le sondage était déjà arrêté et que l'événement de réveil n'avait aucun émetteur — la panne durait jusqu'au rechargement de la page (l'anglais n'était pas touché, sans besoin d'encodage). L'attachement est désormais délégué au document (décidé selon la cible de l'événement, sans référence au champ) et le sondage réessaie à basse fréquence, sans limite
- 🐛 **Correction des sauts de ligne et du texte corrompu aux retours à la ligne** — la copie n'insère plus de sauts de ligne que l'expéditeur n'a tapés, et les messages longs coupés au milieu de l'encodage par le retour à la ligne se décodent désormais correctement (le moteur recolle les deux moitiés coupées de force)

### Nouveautés v2.10.1
- 🐛 **Correction de la troncature silencieuse** — en copiant de nombreux messages, le texte concaténé pouvait dépasser la limite d'écriture du presse-papiers (~4 Mo, parfois moins) et être tronqué sans erreur. Le texte long bascule maintenant automatiquement vers le canal synchrone `textarea+execCommand` (sans limite de taille) ; en cas d'échec, la barre/le bouton **clignote en rouge** au lieu de faire semblant de réussir.
- 🗂 **Nouveau « Exporter en TXT »** — le bouton ⬇ de la barre de sélection multiple télécharge les messages sélectionnés en `chat-export-<horodatage>.txt` via le téléchargement de fichier, contournant totalement le presse-papiers, aucune perte.

### Nouveautés v2.10
- 🧲 **Sélection multiple et copie par lot** — survolez un message pour révéler un cercle de sélection à gauche ; cliquez pour sélectionner (surbrillance verte + ligne verte à gauche, fondu enchaîné prévisualisation↔sélection). En mode lot, survoler un autre cercle prévisualise toute la plage du dernier choix au curseur (vert clair), un clic sélectionne la plage entière. Barre flottante : copier / bascule noms d'expéditeurs / bascule lot / effacer
- 🛡 **Évitement de la barre de défilement gauche** — la barre personnalisée du jeu est à gauche de la liste ; le cercle + le bouton copie la détectent à l'exécution et gardent un espace d'une largeur de cercle, la barre reste utilisable
- 🌊 **Déplacement soyeux au survol** — le bouton/le cercle glissent entre les messages en ease-out ; pendant le défilement ils rattrapent la ligne survolée en douceur sans trembler ; les cercles persistants restent synchronisés image par image
- 🎡 **Amélioration du sélecteur de langue** — sélecteur en roue (défilement libre + aimantation, un cran = un élément), fondu des bords ; changer la langue anime les hauteurs de lignes, tout le panneau coule vers la nouvelle mise en page
- 🧲 **UI flottante physique + machine à états hover unifiée** — pendant le déplacement de la barre de chat, les éléments flottants suivent en physique à ressort rAF ; toutes les décisions passent par un seul `applyHover()`

### Nouveautés v2.9
- 🌐 **Extension du miroir** — `beta.tanktrouble.com` désormais avec `cdn.tanktrouble.com` sous l'interrupteur miroir ; description simplifiée en « sites préfixés cdn. et beta. »
- 🐛 **Régression du commutateur d'encodage** — restauration du fallback `setTimeout` pour `_raw`, le commutateur bascule fiable (régression depuis v2.5)
- 🐛 **Compatibilité @mention** — `.username` et `<a>` exclus de `user-select: text`, les extensions de copie ne cassent plus @
- 🐛 **Init nouvel utilisateur** — content.js demande `init` au bridge ; `matches` couvre `*.tanktrouble.com`, `www.`/`beta.` fonctionnent aussi
- 📄 **Installation/maj/FAQ** — déplacé vers [docs/INSTALL.md](docs/INSTALL.md)

### Nouveautés v2.8
- 🪞 **Interrupteur site miroir** — amélioration du switch miroir et de l'invite de rafraîchissement ; l'invite disparaît après rafraîchissement ; correction des bugs d'animation lors de basculements rapides
- 🎨 **Expérience visuelle** — menus déroulants personnalisés, styles de boutons, animations d'avertissement

### Nouveautés v2.7
- 🌐 **Amélioration des messages d'erreur** — texte d'erreur amélioré pour les utilisateurs inexistants lors des @mentions
- 🖱️ **Amélioration UX du menu de copie** — délai de masquage porté à 500ms ; zone de détection étendue avec padding invisible pour combler l'écart icône↔menu ; le menu se ferme uniquement lorsque la souris quitte vraiment
- 🔩 **Correction de la mise en page** — le texte long dans la ligne Format s'enroule sans pousser le sélecteur ; lien de partage unifié à la racine du dépôt
- 🐛 **Correction copie du nom** — la copie du nom du joueur supprime les deux-points et l'espace final
- 🎨 **Affinement de l'infobulle** — infobulle simplifiée en « Copier le message »

### Nouveautés v2.6
- 🎛 **Bascule du numéro de version** — signature avec numéro de version optionnel ; activé : ` | v2.6 [Chat Unblocker]`, désactivé : ` [Chat Unblocker]`
- 📋 **Menu de copie Fluent** — survolez un message pour l'icône de copie ; clic = copie du texte, survol = menu (texte seul / tout / nom)
- 🌍 **Support i18n complet** — menu et toutes les étiquettes en 12 langues
- 🎬 **Animations Microsoft Fluent** — courbes de Bézier élastiques, détection de vitesse, pulsation au clic, suivi au redimensionnement
- 🐛 **Visibilité de la sélection** — sélection : fond vert + texte noir
- 🔧 **Détection dynamique du chat** — `CB.chatBody` + fallback `CB.chat`

### Nouveautés v2.5
- 🐛 **Correction du bug de basculement du premier message** — le premier message reçu bascule désormais correctement entre le contenu décodé et le contenu encodé brut
- 🐛 **Correction de la duplication de texte au double-clic** — cliquer rapidement sur le bouton de basculement ne duplique plus le texte du message
- 🐛 **Correction de la persistance de l'état des messages** — tous les messages conservent désormais leur état d'affichage de manière fiable
- 🏷️ **Retour au format de signature** — retour à `[Chat Unblocker]` sans numéro de version
- 🔄 **Mise à jour des étiquettes de format** — options V2.x et V1.2 dans le panneau des paramètres
- 🌐 **Étiquette de langue de la page** — nouvelle étiquette « Langue de la page » au-dessus du sélecteur de langue

### Nouveautés v2.2
- ✅ **Compatibilité V1.2** — détection et décodage automatiques des anciens messages `\uXXXX`
- 🔄 **Sélecteur de format** — choix entre V2.2 (`~XXXX`) et V1.2 (`\uXXXX`)
- ⚠️ **Avertissement V1.2** — certaines combinaisons V1.2 peuvent être bloquées par le serveur
- 🏷️ **Signature de version** — les messages commencent par `[Chat Unblocker V2.2]`
- 🌐 **Étiquette V1.2** — les anciens messages affichent `[V1.2 Format]` (i18n)

### Installation
1. Télécharger le dépôt
2. Ouvrir `chrome://extensions/`
3. Mode développeur → Charger l'extension non empaquetée

---

## Español

### Descripción
El chat de TankTrouble.com bloquea caracteres no-ASCII. Esta extensión codifica Unicode en secuencias `~XXXX` seguras para ASCII antes de enviar, y las decodifica al recibir.

### Características
- 🌍 Todos los sistemas de escritura (CJK, árabe, cirílico, emoji)
- 🔐 Ofuscación XOR anti-filtro
- ⏱ Recuperación automática de IU
- 🎛 Panel multilingüe (12 idiomas)

### Novedades v3.1.0
- 🚨 **Versión mayor — solo funciona v3.1.0+**: la actualización del juego del 2026-10-09 eliminó las interfaces de las que dependían todas las versiones anteriores; todo hasta v2.10.x ya no funciona. Actualiza, por favor
- 🇻🇳 **Añadido el vietnamita** — interfaz, menú de copia y documentación ahora en 12 idiomas
- 🇧🇩 **Añadido el bengalí** — interfaz, menú de copia y documentación ahora en 12 idiomas
- 📌 **Funciona en todas las páginas — sin recargar** — el chat es global, así que la extensión también funciona en el foro; el cambio entre páginas (foro ↔ juego) se aplica automáticamente
- 🔧 **Compatibilidad con la reescritura del juego (2026-10-09)** — el juego ya no expone `window.TankTrouble`: ChatBox queda sellado en un cierre IIFE de esbuild **con su propio sistema de eventos** (cero referencias a `EventTarget`), así que el hooking de APIs nativas no lo alcanza. El DOM del chat no cambió, y tanto el renderizado como la medición de ancho pasan por el mismo método del prototipo SVG.js — `text(x, y, value, settings)`. La extensión lo intercepta y decodifica **antes** de renderizar/medir; el envío se codifica interceptando `keydown` en fase de captura **a nivel de document** (un listener en el propio campo perdería la carrera — el manejador del juego se registra antes y leería el texto sin codificar)
- 🐛 **Corregido el «letargo» intermitente del hook de envío (el chino se enviaba a ratos)** — el código antiguo solo conectaba el listener si el campo de entrada ya existía al sondear; si el juego aún no lo había creado, el listener nunca se conectaba mientras el sondeo ya se había detenido y el evento de aviso no tenía emisor — el fallo persistía hasta recargar la página (el inglés no se veía afectado, pues no necesita codificación). Ahora la conexión se delega a document (se decide según el objetivo del evento, sin referencia al campo) y el sondeo reintenta a baja frecuencia, sin límite
- 🐛 **Corregidos los saltos de línea y el texto corrupto en los ajustes de línea** — la copia ya no inserta saltos de línea que el remitente no escribió, y los mensajes largos cortados a mitad de la codificación por el ajuste de línea ahora se decodifican correctamente (el motor vuelve a unir las dos mitades cortadas a la fuerza)

### Novedades v2.10.1
- 🐛 **Corregido el recorte silencioso al copiar** — al copiar muchos mensajes, el texto concatenado podía superar el límite de escritura del portapapeles (~4 MB, a veces menos) y recortarse sin error. El texto largo ahora pasa automáticamente al canal síncrono `textarea+execCommand` (sin límite de tamaño); si cualquier vía falla, la barra/el botón **parpadea en rojo** en lugar de fingir éxito.
- 🗂 **Nuevo « Exportar como TXT »** — el botón ⬇ de la barra de selección múltiple descarga los mensajes seleccionados como `chat-export-<marca de tiempo>.txt` mediante descarga de archivo, evitando por completo el portapapeles.

### Novedades v2.10
- 🧲 **Selección múltiple y copia por lotes** — al pasar el cursor sobre un mensaje aparece un círculo de selección a la izquierda; clic para seleccionar (resaltado verde + línea verde a la izquierda, fundido cruzado vista previa↔seleccionado). En modo por lotes, pasar sobre otro círculo previsualiza todo el rango entre la última selección y el cursor (verde suave), un clic selecciona el rango completo. Barra flotante: copiar / alternar nombres de remitentes / alternar lote / limpiar
- 🛡 **Evitación de la barra de desplazamiento izquierda** — la barra personalizada del juego está a la izquierda de la lista; el círculo + el botón de copia la detectan en tiempo de ejecución y dejan un hueco del ancho de un círculo, la barra sigue siendo arrastrable
- 🌊 **Movimiento sedoso al pasar el cursor** — el botón/el círculo se deslizan entre mensajes con ease-out; al desplazar la lista persiguen suavemente la fila actual sin vibrar; los círculos persistentes van sincronizados fotograma a fotograma
- 🎡 **Mejora del selector de idioma** — selector tipo rueda (desplazamiento libre + imán, una muesca = un elemento), fundido en los bordes; cambiar el idioma anima las alturas de las filas y todo el panel fluye al nuevo diseño
- 🧲 **UI flotante física + máquina de estados hover unificada** — al arrastrar la barra de chat los elementos flotantes siguen con física de resorte rAF; todas las decisiones pasan por un único `applyHover()`

### Novedades v2.9
- 🌐 **Expansión del espejo** — `beta.tanktrouble.com` ahora con `cdn.tanktrouble.com` bajo el interruptor espejo; descripción simplificada a "sitios con prefijo cdn. y beta."
- 🐛 **Regresión del conmutador de codificación** — restaurado el fallback `setTimeout` para `_raw`, el conmutador alterna fiable (regresión desde v2.5)
- 🐛 **Compatibilidad @mención** — `.username` y `<a>` excluidos de `user-select: text`, las extensiones de copia ya no rompen @
- 🐛 **Init nuevo usuario** — content.js pide `init` al bridge; `matches` cubre `*.tanktrouble.com`, `www.`/`beta.` también funcionan
- 📄 **Instalación/actualización/FAQ** — movido a [docs/INSTALL.md](docs/INSTALL.md)

### Novedades v2.8
- 🪞 **Interruptor de sitio espejo** — mejora del switch de espejo y aviso de actualización; el aviso desaparece tras actualizar; corrección de animaciones al cambiar rápido
- 🎨 **Experiencia visual** — menús desplegables personalizados, estilos de botones, animaciones de advertencia

### Novedades v2.7
- 🌐 **Mejora de mensajes de error** — texto de error mejorado para usuarios inexistentes al @mencionar
- 🖱️ **Mejora UX del menú de copia** — retardo de ocultación a 500ms; área de detección ampliada con padding invisible para eliminar el hueco icono↔menú; el menú solo se cierra cuando el ratón realmente sale
- 🔩 **Corrección del diseño del panel** — el texto largo en la fila Formato se ajusta sin empujar el selector; enlace compartido unificado a la raíz del repositorio
- 🐛 **Corrección copia de nombre** — copiar nombre de jugador elimina los dos puntos y espacio final
- 🎨 **Refinamiento del tooltip** — tooltip del icono simplificado a «Copiar mensaje»

### Novedades v2.6
- 🎛 **Alternancia de número de versión** — firma con número de versión opcional; activado: ` | v2.6 [Chat Unblocker]`, desactivado: ` [Chat Unblocker]`
- 📋 **Menú de copia Fluent** — pasa el ratón sobre un mensaje para el icono de copia; clic = copiar texto, hover = menú (solo texto / todo / nombre)
- 🌍 **Soporte i18n completo** — menú y todas las etiquetas en 12 idiomas
- 🎬 **Animaciones Microsoft Fluent** — curvas Bézier elásticas, detección de velocidad, pulsación al clic, seguimiento al redimensionar
- 🐛 **Visibilidad de selección de texto** — selección: fondo verde + texto negro
- 🔧 **Detección dinámica del chat** — `CB.chatBody` + fallback `CB.chat`

### Novedades v2.5
- 🐛 **Corregido el bug de alternancia del primer mensaje** — el primer mensaje recibido ahora cambia correctamente entre contenido decodificado y contenido codificado crudo
- 🐛 **Corregida la duplicación de texto al hacer doble clic** — hacer clic rápido en el botón de alternancia ya no duplica el texto del mensaje
- 🐛 **Corregida la persistencia del estado de los mensajes** — todos los mensajes ahora mantienen su estado de visualización de manera confiable
- 🏷️ **Restaurado formato de firma** — de vuelta a `[Chat Unblocker]` sin número de versión
- 🔄 **Etiquetas de formato actualizadas** — opciones V2.x y V1.2 en el panel de configuración
- 🌐 **Etiqueta de idioma de la página** — nueva etiqueta "Idioma de la página" sobre el selector de idioma

### Novedades v2.2
- ✅ **Compatibilidad con V1.2** — detección y decodificación automática de mensajes `\uXXXX` antiguos
- 🔄 **Selector de formato** — elegir entre V2.2 (`~XXXX`) y V1.2 (`\uXXXX`)
- ⚠️ **Advertencia V1.2** — algunas combinaciones V1.2 pueden ser bloqueadas por el servidor
- 🏷️ **Firma de versión** — los mensajes comienzan con `[Chat Unblocker V2.2]`
- 🌐 **Etiqueta V1.2** — mensajes antiguos muestran `[V1.2 Formato]` (i18n)

### Instalación
1. Descargar el repositorio
2. Abrir `chrome://extensions/`
3. Modo desarrollador → Cargar extensión desempaquetada

---

## Deutsch

### Beschreibung
Der Chat von TankTrouble.com blockiert nicht-ASCII Zeichen. Diese Erweiterung kodiert Unicode als ASCII-sichere `~XXXX` Sequenzen vor dem Senden und dekodiert sie beim Empfang.

### Funktionen
- 🌍 Alle Schriftsysteme (CJK, Arabisch, Kyrillisch, Emoji)
- 🔐 XOR-Verschlüsselung gegen Filter
- ⏱ Automatische UI-Wiederherstellung
- 🎛 Mehrsprachiges Panel (12 Sprachen)

### Neu in v3.1.0
- 🚨 **Großes Release — nur v3.1.0+ funktioniert**: das Spiel-Update vom 2026-10-09 entfernte die Schnittstellen, auf die alle älteren Versionen angewiesen waren; alles bis v2.10.x ist unbrauchbar. Bitte aktualisieren
- 🇻🇳 **Vietnamesisch hinzugefügt** — UI, Kopiermenü und Doku jetzt in 12 Sprachen
- 🇧🇩 **Bengalisch hinzugefügt** — UI, Kopiermenü und Doku jetzt in 12 Sprachen
- 📌 **Funktioniert auf allen Seiten — ohne Neuladen** — das Chat-Fenster ist global, daher läuft die Erweiterung auch im Forum; Seitenwechsel (Forum ↔ Spiel) greifen automatisch
- 🔧 **Kompatibilität mit dem großen Spiel-Update (2026-10-09)** — das Spiel stellt `window.TankTrouble` nicht mehr bereit: ChatBox liegt in einer esbuild-IIFE-Closure **mit eigenem Event-System** (null `EventTarget`-Referenzen im Bundle), ist also per Native-API-Hooking nicht erreichbar. Das Chat-DOM blieb jedoch unverändert, und Nachrichten-Rendering und Textbreiten-Messung laufen über dieselbe SVG.js-Prototypmethode — `text(x, y, value, settings)`. Die Erweiterung hakt sie ab und dekodiert **vor** Rendering/Messung; das Senden wird per `keydown`-Abfangen in der Capture-Phase **auf Dokumentebene** kodiert (ein Listener direkt am Eingabefeld würde das Rennen verlieren — der Handler des Spiels registriert sich zuerst und läse den unkodierten Text)
- 🐛 **Intervallweise «toter» Sende-Hook behoben (Chinesisch ging mal, mal nicht)** — früher wurde der Listener nur angehängt, wenn das Chat-Eingabefeld beim Prüfen bereits existierte; hatte das Spiel es noch nicht erstellt, wurde er nie angehängt, während die Abfrageschleife schon gestoppt war und das Wecksignal keinen Absender hatte — der Fehler blieb bis zum Neuladen der Seite (Englisch war nicht betroffen, es braucht keine Kodierung). Jetzt wird per document-Delegation angehängt (anhand des Ereignisziels entschieden, ohne Feld-Referenz) und die Abfrage versucht es dauerhaft in niedriger Frequenz
- 🐛 **Zeilenumbrüche und verstümmelter Text an Umbrochen behoben** — das Kopieren fügt keine Umbrüche mehr ein, die der Absender nie getippt hat, und lange Nachrichten, die mitten in der Kodierung umgebrochen werden, dekodieren jetzt korrekt (der Renderer fügt die hart durchtrennten Hälften wieder zusammen)

### Neu in v2.10.1
- 🐛 **Stilles Abschneiden beim Kopieren behoben** — beim Kopieren vieler Nachrichten konnte der zusammengefügte Text das Schreiblimit der Zwischenablage (~4 MB, manchmal weniger) überschreiten und still abgeschnitten werden. Langer Text wechselt jetzt automatisch auf den synchronen `textarea+execCommand`-Kanal (ohne Größenlimit); schlägt ein Pfad fehl, **blinkt die Leiste/der Knopf rot**, statt Erfolg vorzutäuschen.
- 🗂 **Neu: „Als TXT exportieren“** — der ⬇-Knopf der Mehrfachauswahl lädt die ausgewählten Nachrichten als `chat-export-<Zeitstempel>.txt` per Dateidownload herunter und umgeht die Zwischenablage komplett.

### Neu in v2.10
- 🧲 **Mehrfachauswahl & Stapelkopie** — beim Hovern einer Nachricht erscheint links ein Auswahlkreis, Klick wählt aus (grüne Hervorhebung + grüne Linie links, weicher Farbübergang Vorschau↔ausgewählt). Im Stapelmodus zeigt das Hovern eines anderen Kreises den gesamten Bereich von der letzten Auswahl bis zum Cursor (hellgrün) als Vorschau, ein Klick wählt den ganzen Bereich. Schwebende Leiste: Kopieren / Absendernamen umschalten / Stapel umschalten / Leeren
- 🛡 **Ausweichen vor der linken Scrollleiste** — die eigene Scrollleiste des Spiels liegt links von der Liste; Kreis + Kopierknopf erkennen sie zur Laufzeit und halten einen Kreis breiten Abstand, die Leiste bleibt bedienbar
- 🌊 **Seidiges Hover-Bewegen** — Knopf/Kreis gleiten zwischen Nachrichten mit ease-out; beim Scrollen der Liste holen sie sanft zur aktuellen Zeile auf ohne Zittern; dauerhafte Kreise bleiben bildsynchron
- 🎡 **Verbesserter Sprachwähler** — Rad-Wähler (freies Scrollen + Einrasten, eine Raste = ein Eintrag), Rand-Ausblendung; beim Sprachwechsel werden Zeilenhöhen animiert, das ganze Panel fließt ins neue Layout
- 🧲 **Physikalisch schwebende UI + einheitliche Hover-Zustandsmaschine** — beim Ziehen der Chat-Leiste folgen schwebende Elemente mit rAF-Federphysik; alle Entscheidungen laufen über ein einziges `applyHover()`

### Neu in v2.9
- 🌐 **Spiegel-Erweiterung** — `beta.tanktrouble.com` nun mit `cdn.tanktrouble.com` unter dem Spiegelschalter; Beschreibung vereinfacht zu „Sites mit cdn. und beta. Präfix"
- 🐛 **Regression Kodierungsschalter** — `setTimeout`-Fallback für `_raw` wiederhergestellt, Schalter schaltet zuverlässig (Regression seit v2.5)
- 🐛 **@Erwähnung Kompatibilität** — `.username` und `<a>` aus `user-select: text` ausgeschlossen, Kopier-Erweiterungen brechen @ nicht mehr
- 🐛 **Neu-Nutzer-Init** — content.js fordert `init` von bridge; `matches` deckt `*.tanktrouble.com`, `www.`/`beta.` funktionieren auch
- 📄 **Installation/Update/FAQ** — verschoben nach [docs/INSTALL.md](docs/INSTALL.md)

### Neu in v2.8
- 🪞 **Spiegelseiten-Schalter** — verbesserter Mirror-Switch und Aktualisierungshinweis; Hinweis verschwindet nach Refresh; Animationsfehler bei schnellem Umschalten behoben
- 🎨 **Visuelle Optimierung** — benutzerdefinierte Dropdowns, Button-Stile, Warnanimations

### Neu in v2.7
- 🌐 **Fehlermeldungen verbessert** — Fehlertext für ungültige Benutzer bei @Erwähnungen optimiert
- 🖱️ **Kopiermenü UX verbessert** — Ausblendeverzögerung auf 500ms erhöht; unsichtbares Padding überbrückt die Lücke Icon↔Menü; Menü schließt nur, wenn die Maus wirklich verlässt
- 🔩 **Popup-Layout korrigiert** — langer Text in der Format-Zeile umbricht ohne den Selektor zu verschieben; Teilen-Link auf Repository-Root vereinheitlicht
- 🐛 **Namenskopie korrigiert** — Spielername-Kopie entfernt Doppelpunkt und Leerzeichen am Ende
- 🎨 **Tooltip verbessert** — Icon-Tooltip vereinfacht zu «Nachricht kopieren»

### Neu in v2.6
- 🎛 **Versionsnummer-Umschalter** — Signatur mit optionaler Versionsnummer; an: ` | v2.6 [Chat Unblocker]`, aus: ` [Chat Unblocker]`
- 📋 **Fluent Kopiermenü** — über Nachricht hovern für Kopier-Icon; Klick = Text kopieren, Hover = Menü (nur Text / alles / Name)
- 🌍 **Vollständige i18n-Unterstützung** — Menü und alle Labels in 12 Sprachen
- 🎬 **Microsoft Fluent Animationen** — elastische Bézier-Kurven, Mausgeschwindigkeitserkennung, Klick-Puls, Verfolgung bei Größenänderung
- 🐛 **Textauswahl-Sichtbarkeit** — Auswahl: grüner Hintergrund + schwarzer Text
- 🔧 **Dynamische Chat-Erkennung** — `CB.chatBody` + Fallback `CB.chat`

### Neu in v2.5
- 🐛 **Umschaltfehler der ersten Nachricht behoben** — die erste empfangene Nachricht wechselt jetzt korrekt zwischen dekodiertem und rohem kodiertem Inhalt
- 🐛 **Textverdopplung bei Doppelklick behoben** — schnelles Klicken auf die Umschalttaste verdoppelt den Nachrichtentext nicht mehr
- 🐛 **Nachrichtenzustand-Persistenz behoben** — alle Nachrichten behalten jetzt ihren Anzeigestatus zuverlässig bei
- 🏷️ **Signaturformat wiederhergestellt** — zurück zu `[Chat Unblocker]` ohne Versionsnummer
- 🔄 **Formatetiketten aktualisiert** — V2.x- und V1.2-Formatoptionen im Einstellungsfenster
- 🌐 **Seitensprachen-Etikett** — neues Etikett „Seitensprache" über dem Sprachwähler

### Neu in v2.2
- ✅ **V1.2-Kompatibilität** — automatische Erkennung und Dekodierung alter `\uXXXX` Nachrichten
- 🔄 **Formatumschalter** — Wahl zwischen V2.2 (`~XXXX`) und V1.2 (`\uXXXX`)
- ⚠️ **V1.2-Warnung** — manche V1.2-Kombinationen können vom Server blockiert werden
- 🏷️ **Versions-Signatur** — Nachrichten beginnen mit `[Chat Unblocker V2.2]`
- 🌐 **V1.2-Kennzeichnung** — alte Nachrichten zeigen `[V1.2 Format]` Präfix (i18n)

### Installation
1. Repository herunterladen
2. `chrome://extensions/` öffnen
3. Entwicklermodus → Entpackte Erweiterung laden

---

## Português

### Descrição
O chat do TankTrouble.com bloqueia caracteres não-ASCII. Esta extensão codifica Unicode em sequências `~XXXX` seguras para ASCII antes de enviar, e as decodifica ao receber.

### Funcionalidades
- 🌍 Todos os sistemas de escrita (CJK, árabe, cirílico, emoji)
- 🔐 Embaralhamento XOR anti-filtro
- ⏱ Recuperação automática da UI
- 🎛 Painel multilíngue (12 idiomas)

### Novidades v3.1.0
- 🚨 **Versão principal — só o v3.1.0+ funciona**: a atualização do jogo de 2026-10-09 removeu as interfaces das quais todas as versões antigas dependiam; tudo até o v2.10.x não funciona mais. Atualize, por favor
- 🇻🇳 **Vietnamita adicionado** — interface, menu de cópia e documentação agora em 12 idiomas
- 🇧🇩 **Bengali adicionado** — interface, menu de cópia e documentação agora em 12 idiomas
- 📌 **Funciona em todas as páginas — sem recarregar** — o chat é global, então a extensão também funciona no fórum; a troca entre páginas (fórum ↔ jogo) é aplicada automaticamente
- 🔧 **Compatibilidade com a reescrita do jogo (2026-10-09)** — o jogo não expõe mais `window.TankTrouble`: o ChatBox fica selado numa closure IIFE do esbuild **com sistema de eventos próprio** (zero referências a `EventTarget` no bundle), então o hooking de APIs nativas não o alcança. O DOM do chat, porém, não mudou, e a renderização das mensagens e a medição de largura passam pelo mesmo método do protótipo SVG.js — `text(x, y, value, settings)`. A extensão o intercepta e decodifica **antes** de renderizar/medir; o envio é codificado interceptando `keydown` na fase de captura **no nível do document** (um listener no próprio campo perderia a corrida — o handler do jogo se registra antes e leria o texto não codificado)
- 🐛 **Corrigido o «congelamento» intermitente do hook de envio (o chinês ora enviava, ora não)** — o código antigo só conectava o listener se o campo de entrada já existisse no momento da sondagem; se o jogo ainda não o tivesse criado, o listener nunca era conectado, enquanto a sondagem já havia parado e o evento de despertar não tinha emissor — a falha permanecia até recarregar a página (o inglês não era afetado, pois não precisa de codificação). Agora a conexão é delegada ao document (decidida pelo alvo do evento, sem referência ao campo) e a sondagem tenta novamente em baixa frequência, sem limite
- 🐛 **Corrigidos quebras de linha e texto corrompido nas quebras de linha** — a cópia não insere mais quebras de linha que o remetente não digitou, e mensagens longas cortadas no meio da codificação pela quebra agora são decodificadas corretamente (o renderizador junta novamente as duas metades cortadas à força)

### Novidades v2.10.1
- 🐛 **Corrigido o corte silencioso ao copiar** — ao copiar muitas mensagens, o texto concatenado podia exceder o limite de escrita da área de transferência (~4MB, às vezes menos) e ser cortado sem erro. Texto longo agora muda automaticamente para o canal síncrono `textarea+execCommand` (sem limite de tamanho); se qualquer caminho falhar, a barra/o botão **pisca em vermelho** em vez de fingir sucesso.
- 🗂 **Novo « Exportar como TXT »** — o botão ⬇ da barra de seleção múltipla baixa as mensagens selecionadas como `chat-export-<timestamp>.txt` pelo download de arquivo, contornando totalmente a área de transferência.

### Novidades v2.10
- 🧲 **Seleção múltipla e cópia em lote** — ao passar o cursor sobre uma mensagem aparece um círculo de seleção à esquerda; clique para selecionar (realce verde + linha verde à esquerda, transição suave pré-visualização↔selecionado). No modo lote, passar sobre outro círculo pré-visualiza todo o intervalo entre a última seleção e o cursor (verde suave), um clique seleciona o intervalo inteiro. Barra flutuante: copiar / alternar nomes dos remetentes / alternar lote / limpar
- 🛡 **Desvio da barra de rolagem esquerda** — a barra personalizada do jogo fica à esquerda da lista; o círculo + o botão de cópia a detectam em tempo de execução e mantêm um espaço da largura de um círculo, a barra continua arrastável
- 🌊 **Movimento sedoso no hover** — o botão/o círculo deslizam entre mensagens com ease-out; ao rolar a lista perseguem suavemente a linha atual sem tremer; os círculos persistentes ficam sincronizados quadro a quadro
- 🎡 **Seletor de idioma melhorado** — seletor em roda (rolagem livre + ímã, um entalhe = um item), desvanecimento nas bordas; trocar o idioma anima as alturas das linhas e todo o painel flui para o novo layout
- 🧲 **UI flutuante física + máquina de estados hover unificada** — ao arrastar a barra de chat os elementos flutuantes seguem com física de mola rAF; todas as decisões passam por um único `applyHover()`

### Novidades v2.9
- 🌐 **Expansão do espelho** — `beta.tanktrouble.com` agora com `cdn.tanktrouble.com` sob o interruptor espelho; descrição simplificada para "sites com prefixo cdn. e beta."
- 🐛 **Regressão do interruptor de codificação** — restaurado o fallback `setTimeout` para `_raw`, o interruptor alterna confiavelmente (regressão desde v2.5)
- 🐛 **Compatibilidade @menção** — `.username` e `<a>` excluídos de `user-select: text`, extensões de cópia não quebram mais @
- 🐛 **Init novo usuário** — content.js pede `init` ao bridge; `matches` cobre `*.tanktrouble.com`, `www.`/`beta.` também funcionam
- 📄 **Instalação/atualização/FAQ** — movido para [docs/INSTALL.md](docs/INSTALL.md)

### Novidades v2.8
- 🪞 **Interruptor do site espelho** — melhoria do switch de espelho e aviso de atualização; aviso some após atualizar; correção de animação ao alternar rapidamente
- 🎨 **Experiência visual** — menus suspensos personalizados, estilos de botões, animações de aviso

### Novidades v2.7
- 🌐 **Mensagens de erro melhoradas** — texto de erro melhorado para usuários inexistentes ao @mencionar
- 🖱️ **Melhoria UX do menu de cópia** — atraso de ocultação para 500ms; área de detecção ampliada com padding invisível para eliminar a lacuna ícone↔menu; menu fecha apenas quando o mouse realmente sai
- 🔩 **Correção do layout do painel** — texto longo na linha Formato quebra sem empurrar o seletor; link compartilhado unificado para a raiz do repositório
- 🐛 **Correção cópia de nome** — cópia do nome do jogador remove dois-pontos e espaço final
- 🎨 **Refinamento do tooltip** — tooltip do ícone simplificado para «Copiar mensagem»

### Novidades v2.6
- 🎛 **Alternância de número de versão** — assinatura com número de versão opcional; ligado: ` | v2.6 [Chat Unblocker]`, desligado: ` [Chat Unblocker]`
- 📋 **Menu de cópia Fluent** — passe o mouse sobre a mensagem para o ícone de cópia; clique = copiar texto, hover = menu (apenas texto / tudo / nome)
- 🌍 **Suporte i18n completo** — menu e todos os rótulos em 12 idiomas
- 🎬 **Animações Microsoft Fluent** — curvas Bézier elásticas, detecção de velocidade, pulsação ao clicar, rastreamento ao redimensionar
- 🐛 **Visibilidade da seleção de texto** — seleção: fundo verde + texto preto
- 🔧 **Detecção dinâmica do chat** — `CB.chatBody` + fallback `CB.chat`

### Novidades v2.5
- 🐛 **Corrigido bug de alternância da primeira mensagem** — a primeira mensagem recebida agora alterna corretamente entre conteúdo decodificado e conteúdo codificado bruto
- 🐛 **Corrigida duplicação de texto ao clicar duas vezes** — clicar rapidamente no botão de alternância não duplica mais o texto da mensagem
- 🐛 **Corrigida persistência do estado das mensagens** — todas as mensagens agora mantêm seu estado de exibição de forma confiável
- 🏷️ **Formato de assinatura restaurado** — de volta a `[Chat Unblocker]` sem número de versão
- 🔄 **Rótulos de formato atualizados** — opções V2.x e V1.2 no painel de configurações
- 🌐 **Rótulo de idioma da página** — novo rótulo "Idioma da página" acima do seletor de idioma

### Novidades v2.2
- ✅ **Compatibilidade com V1.2** — detecção e decodificação automática de mensagens `\uXXXX` antigas
- 🔄 **Seletor de formato** — escolha entre V2.2 (`~XXXX`) e V1.2 (`\uXXXX`)
- ⚠️ **Aviso V1.2** — algumas combinações V1.2 podem ser bloqueadas pelo servidor
- 🏷️ **Assinatura de versão** — mensagens começam com `[Chat Unblocker V2.2]`
- 🌐 **Rótulo V1.2** — mensagens antigas exibem `[V1.2 Formato]` (i18n)

### Instalação
1. Baixar o repositório
2. Abrir `chrome://extensions/`
3. Modo desenvolvedor → Carregar extensão descompactada

---

## Tiếng Việt

### Mô tả
Chat của TankTrouble.com chặn ký tự không phải ASCII — tiếng Trung, Nhật, Hàn, Ả Rập, emoji… đều bị máy chủ từ chối. Tiện ích này mã hóa Unicode thành chuỗi `~XXXX` an toàn ASCII trước khi gửi, và tự giải mã khi nhận.

### Tính năng
- 🌍 Hỗ trợ mọi hệ chữ viết (CJK, Ả Rập, Kirin, Thái, Hindi, emoji, ký hiệu đặc biệt)
- 🔐 Xáo trộn XOR để né bộ lọc từ nhạy cảm
- ⏱ Tự khôi phục giao diện khi máy chủ không gửi biên nhận
- 🎛 Bảng popup đa ngôn ngữ (12 ngôn ngữ)
- 🧲 Chọn nhiều & sao chép hàng loạt — vòng tròn chọn, xem trước vùng chọn, thanh công cụ nổi
- ✍️ Người chơi chưa cài tiện ích sẽ thấy dấu `[Chat Unblocker]`

### Có gì mới trong v3.1.0
- 🚨 **Bản phát hành lớn — chỉ v3.1.0 trở lên hoạt động**: bản cập nhật game ngày 2026-10-09 đã xóa các giao diện mà mọi phiên bản cũ dựa vào; toàn bộ v2.10.x trở về trước đều không còn dùng được. Hãy cập nhật ngay
- 🇻🇳 **Thêm tiếng Việt** — giao diện, menu sao chép và tài liệu nay hỗ trợ đủ 12 ngôn ngữ
- 🇧🇩 **Thêm tiếng Bengal** — giao diện, menu sao chép và tài liệu nay hỗ trợ đủ 12 ngôn ngữ
- 📌 **Hoạt động trên mọi trang — không cần tải lại** — khung chat là thành phần toàn cục nên tiện ích cũng chạy trên trang diễn đàn; việc chuyển trang (diễn đàn ↔ game) được áp dụng tự động
- 🔧 **Tương thích với bản viết lại của game (2026-10-09)** — game không còn lộ `window.TankTrouble`: ChatBox bị niêm phong trong closure IIFE của esbuild **với hệ thống sự kiện riêng** (không một tham chiếu `EventTarget` nào trong gói), nên không thể hook API gốc. Nhưng DOM chat không đổi, và cả việc vẽ tin nhắn lẫn đo độ rộng chữ đều đi qua cùng một phương thức prototype của SVG.js — `text(x, y, value, settings)`. Tiện ích hook phương thức đó và giải mã **trước khi vẽ/đo**; phía gửi mã hóa bằng cách chặn `keydown` ở pha capture **cấp document** (gắn listener vào chính ô nhập sẽ thua cuộc — handler của game đăng ký trước và sẽ đọc văn bản chưa mã hóa), rồi `_parseChat()` của game đọc qua `chatInput.val()`
- 🩺 **Nhật ký chẩn đoán** — console in `[TT] jQuery SVG hook armed @document_start` khi jQuery + plugin SVG của game sẵn sàng, `[TT] SVG text hook installed` khi hook giải mã gắn xong; bộ chặn gửi in `[TT] DOM sender armed` khi gắn xong (mỗi tin gửi mã hóa còn in `[TT] sender: encoded …`). Nếu không thấy gì, hãy chắc rằng tiện ích đã được tải lại sau khi cập nhật
- 🐛 **Sửa văn bản sao chép bị lặp** — bản game mới vẽ mỗi đoạn chữ hai lần (lớp viền `fill="none"` + lớp tô), nên đọc `textContent` cho ra gấp đôi (`Tên:Tên:nội dungnội dung`). Sao chép/xuất nay loại lớp viền trước; tên người gửi được nhận diện qua class SVG mới (`{playerId}-messageUsername`), công tắc "kèm tên người gửi" hoạt động trở lại
- 🐛 **Sửa công tắc mã hóa không làm mới lịch sử** — tin nhắn do SVG vẽ, văn bản mã hóa gốc không còn trong DOM nên không thể hoàn nguyên tại chỗ; tiện ích nay kích hoạt `_refreshChat()` của chính game (vẽ lại toàn bộ từ mảng tin nhắn — nhờ đó hook giải mã chạy lại) qua callback của tay nắm resize, kèm phương án dự phòng đóng/mở cửa sổ chat
- 🐛 **Sửa lỗi bộ chặn gửi "chết" ngẫu nhiên (tiếng Trung lúc gửi được, lúc không)** — bản cũ chỉ gắn listener nếu ô nhập đã tồn tại lúc dò tìm; nếu game chưa tạo ô nhập thì listener không bao giờ được gắn trong khi vòng dò đã dừng và sự kiện đánh thức không có ai phát — lỗi kéo dài đến khi tải lại trang (tiếng Anh không bị ảnh hưởng vì không cần mã hóa). Nay việc gắn được ủy thác cho document (quyết định theo mục tiêu sự kiện, không cần tham chiếu ô nhập) và vòng dò thử lại ở tần số thấp vô thời hạn
- 🐛 **Sửa lỗi thừa ký tự xuống dòng và ký tự bị cắt nát ở chỗ ngắt dòng** — bản sao chép không còn chèn ký tự xuống dòng mà người gửi không hề gõ, và các tin nhắn dài bị ngắt dòng cắt giữa chuỗi mã hóa nay giải mã đúng (bộ dựng hình nối lại hai nửa bị cắt cứng)

### Có gì mới trong v2.10.1
- 🐛 **Sửa lỗi cắt âm thầm khi sao chép** — khi sao chép nhiều tin, văn bản nối có thể vượt giới hạn ghi clipboard (~4MB, đôi khi thấp hơn) và bị cắt âm thầm. Văn bản dài nay tự chuyển sang kênh đồng bộ `textarea+execCommand` (không giới hạn dung lượng); nếu mọi đường đều thất bại, thanh/nút **nhấp nháy đỏ** thay vì giả vờ thành công.
- 🗂 **Thêm「Xuất thành TXT」** — nút ⬇ trên thanh chọn nhiều tải các tin đã chọn thành tệp `chat-export-<dấu thời gian>.txt`, đi đường tải tệp hoàn toàn bỏ qua clipboard, không mất tin nào.

### Có gì mới trong v2.10
- 🧲 **Chọn nhiều & sao chép hàng loạt** — di chuột qua tin nhắn sẽ hiện vòng tròn chọn bên trái; nhấp để chọn (nền xanh + vạch xanh bên trái, chuyển mượt giữa xem trước↔đã chọn). Trong chế độ hàng loạt, di chuột qua vòng tròn khác sẽ xem trước cả khoảng từ lần chọn trước đến con trỏ (xanh nhạt), nhấp một lần chọn cả khoảng. Thanh công cụ nổi: sao chép / bật-tắt tên người gửi / bật-tắt hàng loạt / xóa
- 🛡 **Né thanh cuộn bên trái** — thanh cuộn tùy chỉnh của game nằm bên trái danh sách; vòng tròn + nút sao chép tự dò lúc chạy và giữ khoảng cách một vòng tròn, thanh cuộn vẫn kéo được
- 🌊 **Chuyển động hover mượt** — nút/vòng tròn trượt giữa các tin theo ease-out; khi cuộn chúng bám theo dòng hiện tại không rung; vòng tròn thường trú đồng bộ từng khung hình
- 🎡 **Cải tiến bộ chọn ngôn ngữ** — bộ chọn dạng bánh xe (cuộn tự do + hít, một nấc = một mục), mờ dần ở mép; đổi ngôn ngữ làm chiều cao các dòng chuyển động và cả bảng chảy sang bố cục mới
- 🧲 **Giao diện nổi theo vật lý + máy trạng thái hover hợp nhất** — khi kéo thanh chat, các phần tử nổi bám theo bằng vật lý lò xo rAF; mọi quyết định đi qua một `applyHover()` duy nhất

### Có gì mới trong v2.9
- 🌐 **Mở rộng trang gương** — `beta.tanktrouble.com` nay cùng `cdn.tanktrouble.com` dưới công tắc gương; mô tả rút gọn thành "trang có tiền tố cdn. và beta."
- 🐛 **Sửa hồi quy công tắc mã hóa** — khôi phục fallback `setTimeout` cho `_raw`, công tắc đổi qua lại đáng tin cậy (hồi quy từ v2.5)
- 🐛 **Tương thích @nhắc tên** — `.username` và `<a>` bị loại khỏi `user-select: text`, tiện ích sao chép không còn phá @
- 🐛 **Khởi tạo người dùng mới** — content.js chủ động xin `init` từ bridge; `matches` phủ `*.tanktrouble.com`, `www.`/`beta.` cũng chạy
- 📄 **Cài đặt/cập nhật/FAQ** — chuyển sang [docs/INSTALL.md](docs/INSTALL.md)

### Có gì mới trong v2.8
- 🪞 **Công tắc trang gương** — cải tiến công tắc gương và nhắc cập nhật; nhắc biến mất sau khi cập nhật; sửa hoạt ảnh khi bật/tắt nhanh
- 🎨 **Trải nghiệm hình ảnh** — menu thả xuống tùy chỉnh, kiểu nút, hoạt ảnh cảnh báo

### Có gì mới trong v2.7
- 🌐 **Thông báo lỗi tốt hơn** — cải thiện văn bản lỗi khi @nhắc người không tồn tại
- 🖱️ **Cải tiến UX menu sao chép** — độ trễ ẩn 500ms; vùng nhận diện mở rộng với padding vô hình để xóa khoảng trống icon↔menu; menu chỉ đóng khi chuột thật sự rời
- 🔩 **Sửa bố cục bảng** — chữ dài ở dòng Định dạng xuống dòng không đẩy bộ chọn; liên kết chia sẻ hợp nhất về gốc kho
- 🐛 **Sửa sao chép tên** — sao chép tên người chơi bỏ dấu hai chấm và khoảng trắng cuối
- 🎨 **Tinh chỉnh tooltip** — tooltip icon rút gọn thành「Sao chép tin nhắn」

### Có gì mới trong v2.6
- 🎛 **Bật/tắt số phiên bản** — chữ ký kèm số phiên bản tùy chọn; bật: ` | v2.6 [Chat Unblocker]`, tắt: ` [Chat Unblocker]`
- 📋 **Menu sao chép Fluent** — di chuột qua tin nhắn để hiện icon sao chép; nhấp = sao chép văn bản, hover = menu (chỉ văn bản / tất cả / tên)
- 🌍 **Hỗ trợ i18n đầy đủ** — menu và mọi nhãn bằng 12 ngôn ngữ
- 🎬 **Hoạt ảnh Microsoft Fluent** — đường cong Bézier đàn hồi, nhận biết tốc độ, nhấp nháy khi nhấp, bám theo khi đổi kích thước
- 🐛 **Hiển thị vùng chọn văn bản** — chọn: nền xanh + chữ đen
- 🔧 **Dò chat động** — `CB.chatBody` + fallback `CB.chat`

### Có gì mới trong v2.5
- 🐛 **Sửa lỗi bật/tắt tin đầu tiên** — tin nhắn đầu tiên nhận được nay đổi đúng giữa nội dung giải mã và văn bản mã hóa gốc
- 🐛 **Sửa lặp văn bản khi nhấp đúp** — nhấp nhanh nút bật/tắt không còn nhân đôi văn bản tin nhắn
- 🐛 **Sửa lưu trạng thái tin nhắn** — mọi tin nhắn nay giữ trạng thái hiển thị đáng tin cậy
- 🏷️ **Khôi phục định dạng chữ ký** — trở lại `[Chat Unblocker]` không kèm số phiên bản
- 🔄 **Cập nhật nhãn định dạng** — tùy chọn V2.x và V1.2 trong bảng cài đặt
- 🌐 **Nhãn ngôn ngữ trang** — nhãn "Ngôn ngữ trang" mới phía trên bộ chọn ngôn ngữ

### Có gì mới trong v2.2
- ✅ **Tương thích V1.2** — tự phát hiện và giải mã tin nhắn `\uXXXX` cũ
- 🔄 **Bộ chọn định dạng** — chọn V2.2 (`~XXXX`) hoặc V1.2 (`\uXXXX`)
- ⚠️ **Cảnh báo V1.2** — một số tổ hợp V1.2 có thể bị máy chủ chặn
- 🏷️ **Chữ ký phiên bản** — tin nhắn bắt đầu bằng `[Chat Unblocker V2.2]`
- 🌐 **Nhãn V1.2** — tin nhắn cũ hiển thị `[Định dạng V1.2]`（i18n）

### Cài đặt
1. Tải kho mã nguồn này
2. Mở `chrome://extensions/`
3. Bật Chế độ nhà phát triển → Tải tiện ích chưa đóng gói

---

## বাংলা

### বিবরণ
TankTrouble.com-এর চ্যাট non-ASCII অক্ষর ব্লক করে — চীনা, জাপানি, কোরীয়, আরবি, ইমোজি ইত্যাদি সব সার্ভার প্রত্যাখ্যান করে। এই এক্সটেনশন পাঠানোর আগে Unicode-কে ASCII-নিরাপদ `~XXXX` সিকোয়েন্সে এনকোড করে, আর পাওয়ার সময় স্বয়ংক্রিয়ভাবে ডিকোড করে ফিরিয়ে আনে।

### ফিচার
- 🌍 সব লিপি ব্যবস্থা (CJK, আরবি, সিরিলিক, থাই, হিন্দি, বাংলা, ইমোজি, বিশেষ চিহ্ন)
- 🔐 XOR স্ক্র্যাম্বলিং — সংবেদনশীল-শব্দ ফিল্টার এড়ায়
- ⏱ সার্ভার রসিদ না দিলে UI স্বয়ংক্রিয়ভাবে ফিরে আসে
- 🎛 বহুভাষিক পপআপ প্যানেল (12 ভাষা)
- 🧲 মাল্টি-সিলেক্ট ও ব্যাচ কপি — চেক সার্কেল, প্রিভিউসহ রেঞ্জ সিলেকশন, ফ্লোটিং টুলবার
- ✍️ এক্সটেনশন না থাকা খেলোয়াড়রা `[Chat Unblocker]` ট্যাগ দেখতে পায়

### v3.1.0-এ নতুন
- 🚨 **মেজর রিলিজ — শুধু v3.1.0+ কাজ করে**: 2026-10-09-এর গেম আপডেট পুরোনো সব সংস্করণের নির্ভরশীল ইন্টারফেস সরিয়ে দিয়েছে; v2.10.x পর্যন্ত সব অকার্যকর। দয়া করে আপডেট করুন
- 🇻🇳 **ভিয়েতনামি যুক্ত** — UI, কপি মেনু ও ডকুমেন্টেশন এখন 12 ভাষায়
- 🇧🇩 **বাংলা যুক্ত** — UI, কপি মেনু ও ডকুমেন্টেশন এখন 12 ভাষায়
- 📌 **সব পেজে কাজ করে — রিফ্রেশ লাগে না** — চ্যাট বক্স সর্বত্র উপস্থিত গ্লোবাল কম্পোনেন্ট, তাই এক্সটেনশন ফোরাম পেজেও চলে; পেজ বদল (ফোরাম ↔ গেম) স্বয়ংক্রিয়ভাবে প্রযোজ্য হয়
- 🔧 **গেম রিরাইট সামঞ্জস্য (2026-10-09)** — গেম আর `window.TankTrouble` প্রকাশ করে না: ChatBox esbuild IIFE ক্লোজারে বন্দী **নিজস্ব ইভেন্ট সিস্টেমসহ** (বান্ডলে `EventTarget` রেফারেন্স শূন্য), তাই নেটিভ-API হুকিং পৌঁছায় না। তবে চ্যাট DOM অপরিবর্তিত, আর বার্তা রেন্ডারিং ও টেক্সট প্রস্থ মাপ — দুটোই একই SVG.js প্রোটোটাইপ পদ্ধতি `text(x, y, value, settings)` দিয়ে যায়। এক্সটেনশন সেটি হুক করে **রেন্ডার/মাপের আগেই** ডিকোড করে (তাই লেআউট ও প্রদর্শিত টেক্সট মিলে যায়); পাঠানোর দিকে **document** ধাপের capture ফেজে `keydown` ধরে এনকোড করা হয় (ইনপুটে সরাসরি লাগালে গেমের আগে নিবন্ধিত হ্যান্ডলার এনকোড-হওয়া আগের টেক্সট পড়ে ফেলত), গেমের `_parseChat()` সেটি `chatInput.val()` দিয়ে পড়ে
- 🩺 **নিদর্শন লগ** — গেমের jQuery + SVG প্লাগিন প্রস্তুত হলে কনসোলে `[TT] jQuery SVG hook armed @document_start` ছাপে, ডিকোড হুক লাগলে `[TT] SVG text hook installed` ছাপে; সেন্ড ইন্টারসেপ্টর লাগলে `[TT] DOM sender armed` ছাপে (প্রতি এনকোডেড পাঠানোয় `[TT] sender: encoded …`-ও আসে)। কোনোটিই না দেখলে নিশ্চিত হন আপডেটের পর এক্সটেনশন রিলোড করা হয়েছে
- 🐛 **কপিতে ডুপ্লিকেট টেক্সট ঠিক** — নতুন বিল্ড প্রতিটি টেক্সট অংশ দুবার আঁকে (`fill="none"` স্ট্রোক লেয়ার + ফিল লেয়ার), তাই সাধারণ `textContent` পড়লে সব দ্বিগুণ আসত (`নাম:নাম:বার্তাবার্তা`)। কপি/এক্সপোর্ট এখন স্ট্রোক লেয়ার বাদ দেয়, আর প্রেরকের নাম নতুন SVG ক্লাস (`{playerId}-messageUsername`) দিয়ে চেনে — "প্রেরকের নাম রাখুন" টগল আবার কাজ করে
- 🐛 **এনকোড টগলে হিস্টরি রিফ্রেশ না হওয়া ঠিক** — বার্তা SVG দিয়ে রেন্ডার হয়, মূল এনকোডেড টেক্সট DOM-এ থাকে না, তাই জায়গামতো ফেরানো অসম্ভব; এক্সটেনশন এখন resize-হ্যান্ডল কলব্যাকের মাধ্যমে গেমের নিজের `_refreshChat()` চালু করে (যা বার্তা অ্যারে থেকে সব পুনরায় রেন্ডার করে — ফলে ডিকোড হুক আবার চলে), চ্যাট বন্ধ/খোলা সাইকেল ফলব্যাক হিসেবে
- 🐛 **কপি/এক্সপোর্টে নতুন লাইন ও মোড়া লাইনের গারবল ঠিক** — কপি করা টেক্সটে প্রেরক টাইপ না করা লাইন-ব্রেক আর বসে না, আর লাইন মোড়ার ফলে এনকোডিং-এর মাঝখানে কাটা লম্বা বার্তা এখন সঠিকভাবে ডিকোড হয় (রেন্ডারার জোর করে কাটা দুই অর্ধেক আবার জোড়া দেয়)
- 🐛 **সেন্ড-হুকের অনিয়মিত মৃতাবস্থা ঠিক (চীনা কখনো যায়, কখনো যায় না)** — আগের ইমপ্লিমেন্টেশন probe-এর মুহূর্তে ইনপুট উপস্থিত হলেই শুধু ইন্টারসেপ্টর লাগাত; না হলে সেটি কখনো লাগত না অথচ polling থেমে যেত ও wake-up ইভেন্টের কোনো প্রেরক না থাকত — ফলে পেজ রিলোড না করা পর্যন্ত ভাঙা থাকত (ইংরেজি অবাধিত, কারণ তার এনকোডিং দরকার নেই)। এখন লাগানো document-ডিলিগেটেড (ইভেন্ট টার্গেট অনুযায়ী সিদ্ধান্ত, ইনপুট রেফারেন্স ছাড়াই) আর polling অনির্দিষ্টকাল কম ফ্রিকোয়েন্সিতে চেষ্টা চালিয়ে যায়

### v2.10.1-এ নতুন
- 🐛 **নীরব কপি-কাট ঠিক** — অনেক বার্তা কপি করলে সংযুক্ত টেক্সট ক্লিপবোর্ড লেখার সীমা (~4MB, কখনো কম) পেরিয়ে নীরবে কাটতে পারত। লম্বা টেক্সট এখন স্বয়ংক্রিয়ভাবে `textarea+execCommand` সিঙ্ক চ্যানেলে (আকারসীমা নেই) যায়; যেকোনো পথ ব্যর্থ হলে টুলবার/বাটন **লাল ঝলমল** করে, সাফল্যের ভান করে না।
- 🗂 **«TXT হিসেবে এক্সপোর্ট» যুক্ত** — মাল্টি-সিলেক্ট টুলবারের ⬇ বোতাম নির্বাচিত রেকর্ড `chat-export-<timestamp>.txt` ফাইল নামিয়ে দেয় — ক্লিপবোর্ড পুরোপুরি এড়ায়, কোনো বার্তা হারায় না।

### v2.10-এ নতুন
- 🧲 **মাল্টি-সিলেক্ট ও ব্যাচ কপি** — বার্তার উপর হোভার করলে বাঁ দিকে চেক সার্কেল আসে; ক্লিক = সিলেক্ট (সবুজ হাইলাইট + বাঁ-প্রান্তের সবুজ রেখা, প্রিভিউ↔সিলেক্টড মসৃণ ট্রানজিশন)। ব্যাচ মোডে অন্য সার্কেলে হোভার করলে শেষ সিলেকশন থেকে কার্সর পর্যন্ত পুরো রেঞ্জ প্রিভিউ হয় (হালকা সবুজ), এক ক্লিকে পুরো রেঞ্জ সিলেক্ট। ফ্লোটিং টুলবার: কপি / প্রেরকের নাম টগল / ব্যাচ টগল / ক্লিয়ার
- 🛡 **বাঁ স্ক্রলবার এড়ানো** — গেমের কাস্টম স্ক্রলবার তালিকার বাঁ দিকে; সার্কেল + কপি বোতাম রানটাইমে তা শনাক্ত করে এক সার্কেল-প্রস্থ ফাঁকা রাখে, স্ক্রলবার টানা যায়
- 🌊 **মসৃণ হোভার মুভমেন্ট** — বোতাম/সার্কেল বার্তার মধ্যে ease-out পিচ্ছিল করে; স্ক্রলের সময় কারেন্ট লাইনকে মসৃণভাবে তাড়া করে (জিটার নেই); স্থায়ী সার্কেল ফ্রেম-সিঙ্ক
- 🎡 **ভাষা-নির্বাচক সংশোধন** — হুইল-ধরনের নির্বাচক (এক ঘাঁটি = এক আইটেম), ভাষা বদলালে সারির উচ্চতা অ্যানিমেট হয় — পুরো প্যানেল নতুন লেআউটে প্রবাহিত
- 🧲 **ফিজিক্স-ভিত্তিক ফ্লোটিং UI + একক হোভার স্টেট মেশিন** — চ্যাট বার টানলে ফ্লোটিং এলিমেন্ট rAF স্প্রিং ফিজিক্সে তাড়া করে; সব সিদ্ধান্ত এক `applyHover()` দিয়ে

### v2.9-এ নতুন
- 🌐 **মিরর সাইট প্রসার** — `beta.tanktrouble.com` এখন `cdn.tanktrouble.com`-এর সঙ্গে মিরর টগলের আওতায়; বিবরণ সংক্ষেপ "cdn. ও beta. উপসর্গের সাইট"
- 🐛 **এনকোড টগল রিগ্রেশন** — `_raw`-এর `setTimeout` ফলব্যাক ফিরে এসেছে, টগল নির্ভরযোগ্যভাবে বদলায় (v2.5 থেকে রিগ্রেশন)
- 🐛 **@mention সামঞ্জস্য** — `.username`/`<a>` কে `user-select: text` থেকে বাদ, কপি-এক্সটেনশন আর @ ক্লিক ভাঙে না
- 🐛 **নতুন ব্যবহারকারী init** — content.js bridge-এ `init` চায়; `matches` `*.tanktrouble.com` ঢাকে, `www.`/`beta.`-ও চলে
- 📄 **ইনস্টল/আপডেট/FAQ** — [docs/INSTALL.md](docs/INSTALL.md)-এ সরানো

### v2.8-এ নতুন
- 🪞 **মিরর সাইট টগল** — মিরর সুইচ ও রিফ্রেশ টোস্ট সংস্কার; রিফ্রেশের পর টোস্ট মিলিয়ে যায়; দ্রুত টগলে অ্যানিমেশন ঠিক
- 🎨 **ভিজ্যুয়াল অভিজ্ঞতা** — কাস্টম ড্রপডাউন, বোতাম স্টাইল, সতর্কতা অ্যানিমেশন

### v2.7-এ নতুন
- 🌐 **উন্নত এরর বার্তা** — অনুপস্থিত ব্যবহারকারীকে @ করলে এরর টেক্সট উন্নত
- 🖱️ **কপি মেনু UX** — হাইড-ডিলে 500ms; অনাদৃশ্য padding দিয়ে প্রসারিত শনাক্ত-এলাকা, আইকন↔মেনুর ফাঁক বাতিল; মেনু শুধু সত্যিই বের হলে বন্ধ
- 🔩 **প্যানেল লেআউট ঠিক** — ফরম্যাট সারির লম্বা টেক্সট নির্বাচককে ঠেলে দেয় না; শেয়ারড লিঙ্ক রিপো-রুটে একীভূত
- 🐛 **নাম কপি ঠিক** — খেলোয়াড়ের নাম কপিতে শেষ কোলন/স্পেস বাদ
- 🎨 **টুলটিপ পলিশ** — আইকনের টুলটিপ সরল «বার্তা কপি করুন»

### v2.6-এ নতুন
- 🎛 **সংস্করণ-নম্বর টগল** — স্বাক্ষরে বদলযোগ্য সংস্করণ নম্বর; চালু: ` | v2.6 [Chat Unblocker]`, বন্ধ: ` [Chat Unblocker]`
- 📋 **Fluent কপি মেনু** — বার্তায় হোভারে কপি আইকন; ক্লিক = টেক্সট কপি, হোভার = মেনু (শুধু টেক্সট / সব / নাম)
- 🌍 **সম্পূর্ণ i18n** — মেনু ও সব লেবেল 12 ভাষায়
- 🎬 **Microsoft Fluent অ্যানিমেশন** — ইলাস্টিক কিউবিক-বেজিয়ার, ভেলোসিটি-অ্যাওয়্যার, ক্লিকে পালস, রিসাইজে ট্রেসিং
- 🐛 **টেক্সট-সিলেকশন দৃশ্যমানতা** — সিলেকশনে সবুজ পট + কালো টেক্সট
- 🔧 **ডাইনামিক চ্যাট শনাক্ত** — `CB.chatBody` + ফলব্যাক `CB.chat`

### v2.5-এ নতুন
- 🐛 **প্রথম বার্তার টগল বাগ** — প্রাপ্ত প্রথম বার্তা এখন সঠিকভাবে ডিকোড↔কাঁচা এনকোড বদলায়
- 🐛 **ডাবল-ক্লিকে টেক্সট ডুপ** — দ্রুত টগল ক্লিকে বার্তার টেক্সট দ্বিগুণ হয় না
- 🐛 **বার্তা-স্টেট persist** — সব বার্তা এখন নির্ভরযোগ্যভাবে প্রদর্শন-অবস্থা ধরে রাখে
- 🏷️ **স্বাক্ষর ফরম্যাট ফেরত** — `[Chat Unblocker]` সংস্করণ-নম্বর ছাড়া আগের মতো
- 🔄 **ফরম্যাট লেবেল** — সেটিংস প্যানেলে V2.x ও V1.2 অপশন
- 🌐 **পেজ-ভাষা লেবেল** — ভাষা-নির্বাচকের উপরে নতুন "পৃষ্ঠার ভাষা" লেবেল

### v2.2-এ নতুন
- ✅ **V1.2 সামঞ্জস্য** — পুরোনো `\uXXXX` বার্তা স্বয়ংক্রিয় শনাক্ত ও ডিকোড
- 🔄 **ফরম্যাট নির্বাচক** — V2.2 (`~XXXX`) বনাম V1.2 (`\uXXXX`)
- ⚠️ **V1.2 সতর্কতা** — কিছু V1.2 সংমিশ্রণ সার্ভার ব্লক করতে পারে
- 🏷️ **সংস্করণ স্বাক্ষর** — বার্তা `[Chat Unblocker V2.2]` দিয়ে শুরু
- 🌐 **V1.2 লেবেল** — পুরোনো বার্তায় `[V1.2 ফরম্যাট]` দেখায় (i18n)

### ইনস্টল
1. এই রিপো ডাউনলোড করুন
2. `chrome://extensions/` খুলুন
3. ডেভেলপার মোড → Load unpacked → ফোল্ডার বেছে নিন

---

## License

MIT © 2026 L_Shy_P

## Changelog / 更新日志

> ⛔ **All versions before v3.1.0 are no longer usable** — the 2026-10-09 TankTrouble update removed the interfaces they depend on. Only v3.1.0+ works.
> ⛔ **v3.1.0 之前的所有版本均已失效** — 2026-10-09 的 TankTrouble 更新移除了它们依赖的接口，仅 v3.1.0 及以后可用。

### v3.1.0 — 2026-10-13

**Major — update required / 大版本——必须更新：**
- 🚨 **Only v3.1.0+ works** — all older builds broke with the 2026-10-09 game update; update now. 🇻🇳 **Vietnamese added** — UI, copy menu and docs in 12 languages
- 🚨 **仅 v3.1.0+ 可用** — 2026-10-09 游戏更新使全部旧版本失效，请立即更新。🇻🇳 **新增越南语**——界面、复制菜单与文档支持 12 种语言
- 🇧🇩 **Bengali added** — UI, copy menu and docs now support 12 languages
- 🇧🇩 **新增孟加拉语** — 界面、复制菜单与文档现支持 12 种语言
- 📌 **Full-site coverage — no refresh needed** — the chat box is a global component; the extension now runs on the forum page too, and page switches (forum ↔ game) apply automatically
- 📌 **全站生效、无需刷新** — 聊天框为全局组件；扩展现在在论坛页同样运行，论坛 ↔ 游戏等页面切换自动生效

**Game rewrite compatibility / 游戏大改适配：**
- 🔧 **TankTrouble no longer exposes `window.TankTrouble`** — ChatBox is sealed inside an esbuild IIFE closure with a custom event system, so native-API hooking cannot reach it. The extension now hooks the shared SVG.js prototype method that both renders message text and measures its width (`text(x, y, value, settings)`), decoding before render so layout and content agree; sending is encoded by intercepting `keydown` in the capture phase **at the document level** (a listener on the input itself would lose the race against the game's earlier-registered handler)
- 🔧 **TankTrouble 不再暴露 `window.TankTrouble`** — ChatBox 被封在 esbuild IIFE 闭包内并使用自定义事件系统，劫持原生 API 无法触及。本扩展改为劫持 SVG.js 原型的文字方法（渲染与宽度测量共用 `text(x, y, value, settings)`），在渲染前解码使布局与内容一致；发送侧在 **document** 捕获阶段拦截 `keydown` 完成编码（绑在输入框自身上会晚于游戏自己的处理器，游戏先读到未编码文本导致中文被拒收）
- 🐛 **Fixed duplicated copy text & encoding-toggle refresh** — SVG text is drawn twice (stroke layer + fill layer), so extraction now strips the stroke layer and recognises sender names via the new `{playerId}-messageUsername` class; toggling the encoding switch re-renders history by triggering the game's own `_refreshChat()`
- 🐛 **修复复制文本重复与编码开关刷新** — SVG 文字渲染两遍（描边层 + 填充层），提取时先剔除描边层，并用新版 `{playerId}-messageUsername` 类名识别发送者；切换编码开关时触发游戏自身的 `_refreshChat()` 重绘历史消息
- 🐛 **Fixed intermittent send-interception failure** — arming used to depend on the chat input already existing at probe time; otherwise the keydown interceptor was never attached and no retry path remained (polling had stopped; the wake-up event had no dispatcher), so Chinese sending stayed broken until a page reload. Arming is now document-delegated and polling retries indefinitely
- 🐛 **修复发送拦截偶发失效** — 旧挂载依赖"探测时输入框已存在"；否则拦截器不挂载且无任何重试通道（轮询已停、唤醒事件无人派发），中文发送会一直失效到刷新页面。现改为 document 委托式挂载，轮询无限期重试
- 🐛 **Fixed copy/export newlines & wrapped-line garble** — copied text no longer inserts line breaks the sender never typed, and long messages split mid-encoding by wrapping now decode correctly (the renderer stitches the hard-split halves back together)
- 🐛 **修复复制换行与折行乱码** — 复制不再插入发送者没打过的换行符；被折行从编码中间切断的长消息现可正确解码（渲染器会把硬切的两半重新拼合）

### v2.10.1 — 2026-08-29

**Hotfix / 修复：**
- 🐛 **Fixed silent copy truncation** — over-length concatenated text now switches to the `textarea+execCommand` sync channel (no size cap); any failed path flashes the toolbar/button **red** instead of silently truncating
- 🐛 **修复静默复制截断** — 超长拼接文本自动切换 `textarea+execCommand` 同步通道（无容量上限）；任一路径失败时工具栏/按钮**闪红提示**，不再静默截断
- 🗂 **New "Export as TXT"** — the ⬇ button in the multi-select toolbar downloads the selected records as `chat-export-<timestamp>.txt`, bypassing the clipboard entirely
- 🗂 **新增「导出为 TXT」** — 多选工具栏 ⬇ 按钮把选中记录导出为 `chat-export-时间戳.txt`，完全绕开剪贴板

### v2.10 — 2026-08-18

**Major / 重要更新：**
- 🧲 **Multi-select & batch copy** — check circles on message hover, batch range selection with live preview and cross-fade highlights, floating toolbar (copy / sender names toggle / batch toggle / clear)
- 🧲 **多选与批量复制** — 悬停消息出现勾选圆圈，批量范围选择带实时预览与颜色渐变高亮，浮动工具栏（复制 / 发送者名字开关 / 批量开关 / 清除）
- 🛡 **Left scrollbar avoidance** — runtime detection of the game's left custom scrollbar, buttons keep a circle-width gap
- 🛡 **左侧滚动条避让** — 运行时探测游戏左侧自定义滚动条，按钮组让出一个圆圈宽度
- 🌊 **Silky hover movement** — ease-out glide between messages, smooth chase while scrolling (no jitter), frame-synced persistent circles
- 🌊 **悬浮移动丝滑** — 消息间 ease-out 滑动，滚动时平滑追赶不抖动，常驻圆圈逐帧同步
- 🎡 **Language picker refinement** — wheel-style selector (one item per wheel notch), switching languages animates row heights so the popup flows to the new layout
- 🎡 **语言选择优化** — 轮盘式选择器（滚轮一格一整项），切换语言行高动画过渡，面板流动到新布局
- 🧲 **Physics-based floating UI** — floating elements follow the chat bar with rAF spring physics while dragging
- 🧲 **物理跟随浮层** — 拖动消息栏时浮层用 rAF 弹簧物理跟随
- 📤 **Sending queue rework + indicator** — unified queue for all message types, green SVG arc-spin indicator, pure CSS fades (jQuery fadeIn silently fails on the game page)
- 📤 **发送队列重构 + 指示器** — 全类型消息统一队列，绿色 SVG 弧形转圈，纯 CSS 淡入淡出（游戏页 jQuery fadeIn 静默失效）
- ⌨️ **Native input behavior** — Enter clears input and drops focus; all 4 original ways to exit typing preserved
- ⌨️ **原生输入行为** — 回车清空输入并移除光标；保留游戏原生 4 种退出输入方式

### v2.9 — 2026-08-02

**Major / 重要更新：**
- 🌐 **Mirror site expansion** — `beta.tanktrouble.com` now grouped with `cdn.tanktrouble.com` under the Mirror Site toggle; description simplified to "cdn. and beta. prefixed sites"
- 🌐 **镜像站扩展** — `beta.tanktrouble.com` 现与 `cdn.tanktrouble.com` 一并纳入"镜像网站"开关；描述简化为"cdn. 和 beta. 前缀的网站"
- 🐛 **Encoding toggle fix** — restored `setTimeout` fallback in `_raw` storage so the encoding switch reliably swaps decoded/raw views (regression from v2.5)
- 🐛 **编码开关修复** — 恢复 `_raw` 存储的 `setTimeout` 兜底，编码开关可可靠切换解码/原文（v2.5 起的回归）
- 🐛 **@mention fix** — `.username`/`<a>` excluded from `user-select: text` to stop copy extensions breaking @clicks
- 🐛 **@私聊修复** — `.username`/`<a>` 从 `user-select: text` 排除，避免复制扩展破坏 @ 点击
- 🐛 **New-user init fix** — content.js actively requests `init` from bridge; manifest `matches` covers `*.tanktrouble.com`
- 🐛 **新用户初始化修复** — content.js 主动请求 init；manifest matches 覆盖 `*.tanktrouble.com`
- 📄 **Install/Update/FAQ** — moved to [docs/INSTALL.md](docs/INSTALL.md)
- 📄 **安装/更新/常见问题** — 移至 [docs/INSTALL.md](docs/INSTALL.md)

> ⚠️ **Known issue / 已知问题：** @mention may still occasionally conflict with "万能复制/万能粘贴" extensions — disable them on tanktrouble.com if @clicks fail.
> @私聊仍可能与"万能复制/万能粘贴"扩展偶发冲突——若 @ 点击失效，请在 tanktrouble.com 上禁用这些扩展。

### v2.8 — 2026-07

**Major / 重要更新：**
- 🪞 **Mirror site toggle** — improved mirror-site switch with refresh prompt; toast dismisses after refresh; fixed rapid-toggle animation glitches
- 🪞 **镜像网站开关** — 优化镜像站开关与刷新提示；点击刷新后提示消失；修复快速切换时的动画跳变
- 🎨 **Visual polish** — custom dropdown overlays, refined action button styles, restored warning toast animations
- 🎨 **视觉体验优化** — 自定义下拉菜单、操作按钮样式、提示栏动画等整体打磨

> ⚠️ **Inherited regression / 继承的回归：** Encoding toggle lost raw-view swap (fixed in v2.9). New users on `www.tanktrouble.com` had no decoding (fixed in v2.9).
> 编码开关丢失原文切换（v2.9 修复）。新用户在 `www.tanktrouble.com` 无法解码（v2.9 修复）。

### v2.7 — 2026-07

**Major / 重要更新：**
- 🎬 **Title fade-in** — title bar fades in (0.55s easeOutExpo); switches stay still via `init-lock`
- 🎬 **标题淡入** — 标题栏淡入（0.55s easeOutExpo）；开关通过 `init-lock` 保持静止
- 🎞️ **Custom dropdown animation** — Message Format and Page Language use drawer-style dropdown (0.35s easeOutExpo)
- 🎞️ **自定义下拉动画** — 消息格式和页面语言使用抽屉式下拉（0.35s easeOutExpo）
- 🌐 **Error message refinement** — improved "user not found" error for @mention
- 🌐 **错误消息优化** — 改进 @私聊"用户未找到"的错误文本
- 🖱️ **Copy menu UX** — 500ms leave delay; extended icon hit area
- 🖱️ **复制菜单优化** — 500ms 离开延迟；扩展图标命中区域
- 🔩 **Popup layout fix** — long description wraps without pushing selector
- 🔩 **弹窗布局修复** — 长描述换行而不挤压选择器
- 🐛 **Copy name fix** — strips trailing colon and space
- 🐛 **复制名字修复** — 去除尾部冒号和空格

### v2.6 — 2026-06

**Major / 重要更新：**
- 🎛 **Version number toggle** — signature watermark includes toggleable version number (` | v2.6 [Chat Unblocker]`)
- 🎛 **版本号开关** — 签名水印含可切换版本号（` | v2.6 [Chat Unblocker]`）
- 📋 **Fluent copy menu** — hover message to reveal copy icon; 3 options (text/full/name)
- 📋 **流畅复制菜单** — 悬停消息显示复制图标；3 选项（文本/完整/名字）
- 🌍 **Full i18n** — copy menu and labels in 12 languages
- 🌍 **完整 i18n** — 复制菜单和标签支持 12 语言
- 🎬 **Fluent animations** — elastic cubic-bezier, velocity-aware, scale-pulse
- 🎬 **Fluent 动画** — 弹性贝塞尔曲线、速度感知、缩放脉冲
- 🐛 **Text selection visibility** — green background + black text on selection
- 🐛 **文本选中可见性** — 选中显示绿色背景+黑字
- 🔧 **Dynamic chat detection** — runtime `CB.chatBody` detection
- 🔧 **动态聊天检测** — 运行时 `CB.chatBody` 检测

### v2.5 — 2026-06

**Major / 重要更新：**
- 🏷️ **Version tag in signature** — V2 messages include ` | v2.5 [Chat Unblocker]`
- 🏷️ **签名版本标签** — V2 消息含 ` | v2.5 [Chat Unblocker]`
- 🔄 **V1.2 compatibility** — V1.2 mode shows version suffix
- 🔄 **V1.2 兼容** — V1.2 模式显示版本后缀
- 🔒 **Signature lock for V1.2** — signature locked in V1.2; warning on first close
- 🔒 **V1.2 签名锁定** — V1.2 模式锁定签名；首次关闭触发警告
- ⚠️ **Smooth warning animations** — expand/collapse transitions
- ⚠️ **平滑警告动画** — 展开/收起过渡
- 🎨 **Signature switch feedback** — shake animation, red background
- 🎨 **签名开关反馈** — 抖动动画、红色背景
- 📦 **Format selector animation** — smooth expand/collapse
- 📦 **格式选择器动画** — 平滑展开/收起

> ⚠️ **Regression introduced / 引入的回归：** `storeRaw` lost its `setTimeout` fallback — async-added messages no longer stored `_raw`, breaking the encoding toggle. Fixed in v2.9.
> `storeRaw` 丢失 `setTimeout` 兜底——异步添加的消息不再存储 `_raw`，破坏编码开关。v2.9 修复。

### v2.4 — 2026-05

**Major / 重要更新：**
- 🐛 **First message toggle fix** — first received message correctly switches decoded/raw
- 🐛 **首条消息切换修复** — 首条接收消息正确切换解码/原文
- 🐛 **Double-click duplication fix** — rapid toggle no longer doubles text
- 🐛 **双击重复修复** — 快速切换不再导致文本翻倍
- 🐛 **State persistence fix** — messages maintain display state across toggles
- 🐛 **状态持久化修复** — 消息在切换间保持显示状态
- 🏷️ **Signature reverted** — back to `[Chat Unblocker]` without version
- 🏷️ **签名回退** — 回到无版本号的 `[Chat Unblocker]`
- 🌐 **Page language label** — new label above language selector
- 🌐 **页面语言标签** — 语言选择器上方新标签

### v2.3 — 2026-05

**Major / 重要更新：**
- 🐛 **V1.2 compatibility fix** — v1 mode uses correct V1 signature; v1.2 users can read again
- 🐛 **V1.2 兼容修复** — v1 模式使用正确 V1 签名；v1.2 用户可重新阅读
- 🔄 **Format switcher** — choose V2 (`~XXXX`) or V1.2 (`\uXXXX`)
- 🔄 **格式切换器** — 选择 V2（`~XXXX`）或 V1.2（`\uXXXX`）
- ⚠️ **V1.2 warning** — warns some V1.2 combos may be blocked by server
- ⚠️ **V1.2 警告** — 警告部分 V1.2 组合可能被服务器拦截
- 🏷️ **Version signature** — V2 messages prefixed `[Chat Unblocker V2.3]`
- 🏷️ **版本签名** — V2 消息前缀 `[Chat Unblocker V2.3]`
- 🌐 **V1.2 label** — old format shows `[V1.2 Format]` prefix (i18n)
- 🌐 **V1.2 标签** — 旧格式显示 `[V1.2 格式]` 前缀（i18n）

> ⚠️ **Known issue / 已知问题：** V1.2 format may be blocked by the game server for certain character combinations. Use V2.x for reliability.
> V1.2 格式可能因某些字符组合被游戏服务器拦截。建议使用 V2.x。

### v2.2 — 2026-05-15

**Major / 重要更新：**
- 🇬🇧 Added V1.2 format compatibility — can now receive and decode old `\uXXXX` messages + option to send in either V2.2 (`~XXXX`) or V1.2 (`\uXXXX`) format
- 🇨🇳 新增 V1.2 格式兼容 — 可接收并解码旧的 `\uXXXX` 消息 + 可选择发送格式（V2.2 `~XXXX` 或 V1.2 `\uXXXX`）
- 🇯🇵 V1.2 形式互換を追加 — 古い `\uXXXX` メッセージの受信とデコード + V2.2(`~XXXX`)かV1.2(`\uXXXX`)かを選択可能
- 🇰🇷 V1.2 형식 호환 추가 — 이전 `\uXXXX` 메시지 수신 및 디코딩 + V2.2(`~XXXX`) 또는 V1.2(`\uXXXX`)中选择
- 🇷🇺 Добавлена совместимость с V1.2 — приём и декодирование старых `\uXXXX` сообщений + выбор формата отправки
- 🇸🇦 تمت إضافة التوافق مع تنسيق V1.2 — استقبال وفك ترميز رسائل `\uXXXX` القديمة + اختيار تنسيق الإرسال
- 🇫🇷 Compatibilité V1.2 ajoutée — réception et décodage des anciens messages `\uXXXX` + choix du format d'envoi
- 🇪🇸 Añadida compatibilidad con V1.2 — recepción y decodificación de mensajes `\uXXXX` antiguos + opción de formato
- 🇩🇪 V1.2-Kompatibilität hinzugefügt — Empfang und Dekodierung alter `\uXXXX` Nachrichten + Formatwahl
- 🇧🇷 Adicionada compatibilidade com V1.2 — recebimento e decodificação de mensagens `\uXXXX` antigas + escolha de formato

**Minor / 小更新：**
- 🇬🇧 New signature format `[Chat Unblocker V2.2]` placed at message start + V1.2 messages display with `[V1.2 Format]` prefix + format switcher in popup panel + V1.2 warning about server blocking
- 🇨🇳 新签名格式 `[Chat Unblocker V2.2]` 放在消息开头 + V1.2 消息显示 `[V1.2 格式]` 前缀 + 弹窗新增格式切换器 + V1.2 警告提示
- 🇯🇵 新しい署名形式 `[Chat Unblocker V2.2]` をメッセージ先頭に + V1.2 メッセージには `[V1.2 形式]` プレフィックス + ポップアップに形式スイッチャー + V1.2 警告
- 🇰🇷 새 서명 형식 `[Chat Unblocker V2.2]` 메시지 시작에 배치 + V1.2 메시지는 `[V1.2 형식]` 접두사 표시 + 팝업에 형식 전환기 + V1.2 경고
- 🇷🇺 Новый формат подписи `[Chat Unblocker V2.2]` в начале сообщения + V1.2 сообщения с префиксом `[V1.2 Формат]` + переключатель в панели + предупреждение
- 🇸🇦 تنسيق التوقيع الجديد `[Chat Unblocker V2.2]` في بداية الرسالة + رسائل V1.2 تعرض مع `[V1.2 تنسيق]` + مبدل التنسيق في اللوحة + تحذير
- 🇫🇷 Nouveau format de signature `[Chat Unblocker V2.2]` au début + messages V1.2 avec `[V1.2 Format]` + sélecteur dans le popup + avertissement
- 🇪🇸 Nuevo formato de firma `[Chat Unblocker V2.2]` al inicio + mensajes V1.2 con `[V1.2 Formato]` + selector en panel + advertencia
- 🇩🇪 Neue Signatur `[Chat Unblocker V2.2]` am Anfang + V1.2 Nachrichten mit `[V1.2 Format]` Präfix + Formatumschalter + Warnung
- 🇧🇷 Novo formato de assinatura `[Chat Unblocker V2.2]` no início + mensagens V1.2 com `[V1.2 Formato]` + seletor no popup + aviso

### v2.1 — 2026-05-13

**Major / 重要更新：**
- 🇬🇧 Changed encoding prefix from `\u` to `~` to bypass profanity filter that corrupted certain character combinations
- 🇨🇳 编码前缀由 `\u` 改为 `~`，修复部分字符组合触发敏感词过滤器导致乱码的问题
- 🇯🇵 エンコード prefix を `\u` から `~` に変更、文字化けを修正
- 🇰🇷 인코딩 prefix를 `\u`에서 `~`로 변경, 일부 문자 조합 깨짐 현상 수정
- 🇷🇺 Префикс кодирования изменён с `\u` на `~`, исправлен баг с фильтром
- 🇸🇦 تم تغيير prefix الترميز من `\u` إلى `~` لإصلاح مشكلة تشويه بعض تركيبات الأحرف
- 🇫🇷 Préfixe d'encodage changé de `\u` à `~` pour contourner le filtre
- 🇪🇸 Prefijo de codificación cambiado de `\u` a `~` para evitar el filtro
- 🇩🇪 Kodierungspräfix von `\u` auf `~` geändert
- 🇵🇹 Prefixo de codificação alterado de `\u` para `~`

**Minor / 小更新：**
- 🇬🇧 Toggle now swaps message display instantly (no page reload) + popup no longer flashes on open + version checker added to header + "Stable" label i18n
- 🇨🇳 编码开关即时切换消息显示（不再刷新网页）+ 弹窗打开无闪烁 + 标题栏版本检测 + "稳定版"多语言化
- 🇯🇵 エンコード切替で即時表示更新 + ポップアップ表示の改善 + バージョン検出機能 + 「安定版」多言語化
- 🇰🇷 인코딩 토글 즉시 전환 + 팝업 깜빡임 수정 + 버전 확인 추가 + "안정판" 다국어화
- 🇷🇺 Мгновенное переключение отображения + исправлено мерцание + проверка версий + "Стабильная" на 12 языках
- 🇸🇦 تبديل فوري لعرض الرسائل + إصلاح وميض النافذة + فحص الإصدارات + "مستقر" متعدد اللغات
- 🇫🇷 Basculement instantané + correction du scintillement + vérification de version + "Stable" i18n
- 🇪🇸 Cambio instantáneo + arreglo de parpadeo + verificación de versión + "Estable" i18n
- 🇩🇪 Sofortige Umschaltung + Flackern behoben + Versionsprüfung + "Stabil" i18n
- 🇵🇹 Troca instantânea + correção de flicker + verificação de versão + "Estável" i18n

---

## How to Update / 更新方法

📖 See [docs/INSTALL.md](docs/INSTALL.md) for the update guide in all 12 languages.
📖 查看 [docs/INSTALL.md](docs/INSTALL.md) 获取 12 语言的更新教程。

## Links

- 🔗 [GitHub Repository](https://github.com/L-Shy-P/TankTrouble-Chat-Unblock)
- 🎮 [TankTrouble.com](https://tanktrouble.com)
