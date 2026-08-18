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
  <a href="#português">Português</a>
</p>

---

## English

### What It Does
TankTrouble.com blocks non-ASCII characters in chat — Chinese, Japanese, Korean, Arabic, Cyrillic, emoji, and more are rejected by the server. This extension bypasses the restriction by encoding Unicode characters into ASCII-safe `~XXXX` escape sequences before sending, then decoding them back on the receiving end.

### Features
- 🌍 **All writing systems** — CJK, Arabic, Cyrillic, Thai, Hindi, emoji, special symbols
- 🔐 **XOR scrambling** — avoids browser/network sensitive-word filters
- ⏱ **Timeout recovery** — auto-resets UI when server drops the receipt
- 🎛 **Popup panel** with language selector (10 languages)
- 🧲 **Multi-select & batch copy** — check circles, range selection with preview, floating toolbar
- ✍️ **Signature watermark** — non-extension users see `[Chat Unblocker]` tag

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
- 🌍 **Full i18n support** — copy menu and all labels available in 10 languages (中文 / 日本語 / 한국어 / Русский / العربية / Français / Español / Deutsch / Português / English)
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
- 🎛 多语言弹出面板（10 种语言）
- 🧲 多选与批量复制（勾选圆圈、范围预览、浮动工具栏）
- ✍️ 未装扩展的玩家会看到 `[Chat Unblocker]` 签名水印

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
- 🎛 10 言語対応ポップアップパネル

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
- 🎛 다국어 패널 (10 개 언어)

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
- 🎛 Многоязычная панель (10 языков)

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
- 🌍 **Полная i18n поддержка** — меню и все метки на 10 языках
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
- 🎛 لوحة متعددة اللغات (10 لغات)

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
- 🌍 **دعم كامل متعدد اللغات** — القائمة وجميع التسميات بـ 10 لغات
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
- 🎛 Panneau multilingue (10 langues)

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
- 🌍 **Support i18n complet** — menu et toutes les étiquettes en 10 langues
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
- 🎛 Panel multilingüe (10 idiomas)

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
- 🌍 **Soporte i18n completo** — menú y todas las etiquetas en 10 idiomas
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
- 🎛 Mehrsprachiges Panel (10 Sprachen)

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
- 🌍 **Vollständige i18n-Unterstützung** — Menü und alle Labels in 10 Sprachen
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
- 🎛 Painel multilíngue (10 idiomas)

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
- 🌍 **Suporte i18n completo** — menu e todos os rótulos em 10 idiomas
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

## License

MIT © 2026 L_Shy_P

## Changelog / 更新日志

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
- 🌍 **Full i18n** — copy menu and labels in 10 languages
- 🌍 **完整 i18n** — 复制菜单和标签支持 10 语言
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
- 🇷🇺 Мгновенное переключение отображения + исправлено мерцание + проверка версий + "Стабильная" на 10 языках
- 🇸🇦 تبديل فوري لعرض الرسائل + إصلاح وميض النافذة + فحص الإصدارات + "مستقر" متعدد اللغات
- 🇫🇷 Basculement instantané + correction du scintillement + vérification de version + "Stable" i18n
- 🇪🇸 Cambio instantáneo + arreglo de parpadeo + verificación de versión + "Estable" i18n
- 🇩🇪 Sofortige Umschaltung + Flackern behoben + Versionsprüfung + "Stabil" i18n
- 🇵🇹 Troca instantânea + correção de flicker + verificação de versão + "Estável" i18n

---

## How to Update / 更新方法

📖 See [docs/INSTALL.md](docs/INSTALL.md) for the update guide in all 10 languages.
📖 查看 [docs/INSTALL.md](docs/INSTALL.md) 获取 10 语言的更新教程。

## Links

- 🔗 [GitHub Repository](https://github.com/L-Shy-P/TankTrouble-Chat-Unblock)
- 🎮 [TankTrouble.com](https://tanktrouble.com)
