# 📖 Installation & FAQ

> Install guide, update guide, and FAQ for **TankTrouble Chat Unblock**

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

> 🔙 Back to [Main README](../README.md)

---

## English

### 📥 Install
1. Download or clone this repo
2. Open `chrome://extensions/` in Chrome/Edge
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** → select the extension folder
5. Go to [tanktrouble.com](https://tanktrouble.com) and chat in any language!

### 🔄 Update (no re-download needed)
Usually only `content.js` changes. Open [`content.js`](https://raw.githubusercontent.com/L-Shy-P/TankTrouble-Chat-Unblock/master/content.js) → Ctrl+A → Ctrl+C → paste into your local `content.js` → go to `chrome://extensions/` → click ↻ on the extension card. If the changelog mentions `bridge.js`, `popup.js`, or `popup.html`, update those too the same way.

### ❓ FAQ

**Q1: How do I extract the downloaded zip?**
A: Windows: right-click the zip → "Extract All". Mac: double-click the zip. You'll get a folder containing `manifest.json` and other files.

**Q2: Loading shows "manifest.json not found".**
A: You selected the wrong folder. Select the folder that **directly** contains `manifest.json` (the extracted root folder), not its parent or a subfolder.

**Q3: I have both old and new versions installed — will they conflict?**
A: Yes! Go to `chrome://extensions/` and **Remove** the old version (don't just disable). Multiple active versions cause decode chaos.

**Q4: After install, I still can't send Chinese.**
A: Refresh tanktrouble.com (F5 or Ctrl+R). The extension only works on pages loaded after install.

**Q5: After updating files, nothing changed.**
A: Go to `chrome://extensions/` → click "↻" on the extension card → then refresh tanktrouble.com. Both steps required.

**Q6: Does it work on Firefox/Safari?**
A: No. This is a Manifest V3 extension — Chrome, Edge, and other Chromium browsers only.

**Q7: Others can't see my Chinese messages.**
A: They need the extension too. Only extension users see decoded text; non-users see raw `~XXXX` codes (by design).

**Q8: The extension card shows an error icon.**
A: Click it for details. Usually corrupted files or wrong path. Re-download and redo the install steps.

**Q9: How do I report a bug?**
A: 1) Press F12 to open DevTools. 2) Go to Console tab. 3) Look for logs prefixed with `[TT]` or red errors. 4) Right-click → "Save as..." to export, or take a screenshot. 5) Open an issue at [GitHub Issues](https://github.com/L-Shy-P/TankTrouble-Chat-Unblock/issues) with the log + description.

---

## 中文

### 📥 安装
1. 下载或克隆此仓库
2. 打开 `chrome://extensions/`
3. 开启「开发者模式」→「加载已解压的扩展程序」
4. 选择扩展文件夹
5. 去 [tanktrouble.com](https://tanktrouble.com) 即可用中文聊天

### 🔄 更新（无需重新下载）
通常只有 `content.js` 会变动。打开 [`content.js`](https://raw.githubusercontent.com/L-Shy-P/TankTrouble-Chat-Unblock/master/content.js) → 全选复制 → 粘贴替换本地 `content.js` → 打开 `chrome://extensions/` → 点扩展卡片上的 ↻。如果更新日志提到 `bridge.js`、`popup.js` 或 `popup.html`，按同样方式更新。

### ❓ 常见问题

**Q1：下载的zip怎么解压？**
答：Windows 右键 zip →「全部解压缩」；Mac 双击 zip 即可。解压后会得到包含 `manifest.json` 的文件夹。

**Q2：加载时提示「找不到 manifest.json」。**
答：选错文件夹了。必须选**直接**包含 `manifest.json` 的那个文件夹（解压后的根目录），不是父文件夹或子文件夹。

**Q3：新旧两个版本都装了会冲突吗？**
答：会！去 `chrome://extensions/` 把旧版本「移除」（不是禁用），只保留最新版。多个版本同时启用会导致解码混乱。

**Q4：装完扩展还是不能发中文。**
答：刷新 tanktrouble.com 页面（F5 或 Ctrl+R）。扩展只对安装后加载的页面生效。

**Q5：更新文件后没生效。**
答：去 `chrome://extensions/` 点扩展卡片上的「↻」刷新，然后刷新 tanktrouble.com 页面，两步都不能少。

**Q6：Firefox/Safari 能用吗？**
答：不能。本扩展基于 Manifest V3，仅支持 Chrome、Edge 等 Chromium 内核浏览器。

**Q7：别人看不到我发的中文。**
答：对方也需要安装本扩展。只有装了扩展的人才能看到解码后的文字，没装的人看到原始 `~XXXX` 编码（设计如此）。

**Q8：扩展卡片上显示错误图标。**
答：点击错误图标查看详情。通常是文件损坏或路径错误。重新下载仓库，按安装步骤重做。

**Q9：怎么汇报问题？**
答：1) 按 F12 打开开发者工具。2) 切到 Console（控制台）标签。3) 找带 `[TT]` 前缀的日志或红色错误。4) 右键 →「Save as...」导出日志，或截图。5) 去 [GitHub Issues](https://github.com/L-Shy-P/TankTrouble-Chat-Unblock/issues) 提交，附上日志和问题描述。

---

## 日本語

### 📥 インストール
1. リポジトリをダウンロードまたはクローン
2. `chrome://extensions/` を開く
3. **デベロッパーモード** を有効化
4. **パッケージ化されていない拡張機能を読み込む** → フォルダを選択
5. [tanktrouble.com](https://tanktrouble.com) で多言語チャット！

### 🔄 更新（再ダウンロード不要）
通常は `content.js` のみ変更。[`content.js`](https://raw.githubusercontent.com/L-Shy-P/TankTrouble-Chat-Unblock/master/content.js) を開く → 全選択コピー → ローカルの `content.js` に上書き → `chrome://extensions/` → ↻ クリック。更新ログに `bridge.js`、`popup.js`、`popup.html` があれば同様に更新。

### ❓ よくある質問

**Q1: ダウンロードしたzipの解凍方法は？**
A: Windows：右クリック→「すべて展開」。Mac：ダブルクリック。`manifest.json` を含むフォルダが展開されます。

**Q2: 読み込み時に「manifest.json が見つかりません」と表示される。**
A: フォルダ選び間違いです。`manifest.json` を**直接**含むフォルダ（解凍後のルート）を選んでください。親フォルダやサブフォルダではありません。

**Q3: 新旧バージョンを両方入れたまま衝突する？**
A: します！`chrome://extensions/` で旧版を「削除」（無効化ではなく）。複数バージョン同時有効化はデコード混乱の原因。

**Q4: インストール後も日本語を送れない。**
A: tanktrouble.com をリロード（F5 または Ctrl+R）。拡張はインストール後に読み込まれたページにのみ有効。

**Q5: ファイル更新後に反映されない。**
A: `chrome://extensions/` → 拡張カードの「↻」をクリック → tanktrouble.com をリロード。両方必要。

**Q6: Firefox/Safari で使える？**
A: 不可。Manifest V3 ベースで Chrome/Edge などの Chromium 系ブラウザ専用。

**Q7: 他人が私の日本語を見られない。**
A: 相手も拡張が必要。拡張ユーザーのみデコード表示、未導入者は生 `~XXXX` を見ます（仕様）。

**Q8: 拡張カードにエラーアイコンが表示される。**
A: クリックして詳細確認。通常はファイル破損かパス違い。再ダウンロードして手順通りに再インストール。

**Q9: バグを報告するには？**
A: 1) F12 で DevTools を開く。2) Console タブへ。3) `[TT]` プレフィックスのログまたは赤いエラーを探す。4) 右クリック →「Save as...」でエクスポート、またはスクリーンショット。5) [GitHub Issues](https://github.com/L-Shy-P/TankTrouble-Chat-Unblock/issues) でログ＋説明を投稿。

---

## 한국어

### 📥 설치
1. 저장소 다운로드 또는 클론
2. `chrome://extensions/` 열기
3. **개발자 모드** 활성화
4. **압축 해제된 프로그램 로드** → 폴더 선택
5. [tanktrouble.com](https://tanktrouble.com)에서 다국어 채팅!

### 🔄 업데이트 (재다운로드 불필요)
보통 `content.js`만 변경. [`content.js`](https://raw.githubusercontent.com/L-Shy-P/TankTrouble-Chat-Unblock/master/content.js) 열기 → 전체 복사 → 로컬 `content.js`에 붙여넣기 → `chrome://extensions/` → ↻ 클릭. 변경 로그에 `bridge.js`, `popup.js`, `popup.html`이 있으면 동일하게 업데이트.

### ❓ 자주 묻는 질문

**Q1: 다운로드한 zip 압축 풀기는?**
A: Windows: 우클릭 → "압축 풀기". Mac: 더블클릭. `manifest.json` 포함 폴더가 나옵니다.

**Q2: 로드 시 "manifest.json 찾을 수 없음".**
A: 폴더 잘못 선택. `manifest.json`을 **직접** 포함한 폴더(압축 해제 루트) 선택. 상위/하위 폴더 아님.

**Q3: 구/신 버전 둘 다 설치하면 충돌?**
A: 합니다! `chrome://extensions/`에서 구버전 "제거"(비활성화 아님). 다중 버전 활성화는 디코딩 혼란.

**Q4: 설치 후 한국어 안 보내짐.**
A: tanktrouble.com 새로고침(F5 또는 Ctrl+R). 확장은 설치 후 로드된 페이지에만 작동.

**Q5: 파일 업데이트 후 반영 안 됨.**
A: `chrome://extensions/` → 확장 카드 "↻" 클릭 → tanktrouble.com 새로고침. 둘 다 필요.

**Q6: Firefox/Safari 가능?**
A: 불가. Manifest V3 기반, Chrome/Edge 등 Chromium 계열 전용.

**Q7: 타인이 내 한국어 못 봄.**
A: 상대도 확장 필요. 확장 사용자만 디코딩, 미사용자는 원시 `~XXXX` (설계상).

**Q8: 확장 카드에 에러 아이콘.**
A: 클릭해 상세 확인. 보통 파일 손상/경로 오류. 재다운로드 후 재설치.

**Q9: 버그 신고는?**
A: 1) F12로 DevTools 열기. 2) Console 탭으로. 3) `[TT]` 접두 로그나 빨간 에러 찾기. 4) 우클릭 → "Save as..." 내보내기 또는 스크린샷. 5) [GitHub Issues](https://github.com/L-Shy-P/TankTrouble-Chat-Unblock/issues)에 로그+설명 제출.

---

## Русский

### 📥 Установка
1. Скачайте или клонируйте репозиторий
2. Откройте `chrome://extensions/`
3. Включите **режим разработчика**
4. **Загрузить распакованное** → выберите папку
5. Откройте [tanktrouble.com](https://tanktrouble.com) и общайтесь!

### 🔄 Обновление (без перекачки)
Обычно меняется только `content.js`. Откройте [`content.js`](https://raw.githubusercontent.com/L-Shy-P/TankTrouble-Chat-Unblock/master/content.js) → Ctrl+A → Ctrl+C → вставьте в локальный `content.js` → `chrome://extensions/` → ↻. Если в журнале упоминаются `bridge.js`, `popup.js`, `popup.html` — обновите их так же.

### ❓ Частые вопросы

**Q1: Как распаковать скачанный zip?**
A: Windows: ПКМ по zip → "Извлечь всё". Mac: двойной клик. Получите папку с `manifest.json`.

**Q2: При загрузке "manifest.json не найден".**
A: Выбрана не та папка. Выбирайте ту, что содержит `manifest.json` **напрямую** (корневая после распаковки), а не родительскую/подпапку.

**Q3: Установлены старая и новая версии — конфликт?**
A: Да! В `chrome://extensions/` "Удалить" старую (не просто отключить). Несколько активных версий = хаос декодирования.

**Q4: После установки не могу писать на русском/китайском.**
A: Обновите tanktrouble.com (F5 или Ctrl+R). Расширение работает только на страницах, загруженных после установки.

**Q5: После обновления файлов ничего не изменилось.**
A: `chrome://extensions/` → нажмите "↻" на карточке расширения → обновите tanktrouble.com. Оба шага обязательны.

**Q6: Работает в Firefox/Safari?**
A: Нет. Это Manifest V3 — только Chrome, Edge и др. Chromium-браузеры.

**Q7: Другие не видят мой текст.**
A: Им тоже нужно расширение. Только пользователи расширения видят декодированный текст, остальные — сырые `~XXXX` (по дизайну).

**Q8: На карточке расширения значок ошибки.**
A: Кликните для деталей. Обычно файл повреждён или путь неверный. Скачайте заново и переустановите.

**Q9: Как сообщить об ошибке?**
A: 1) F12 → DevTools. 2) Вкладка Console. 3) Ищите логи с `[TT]` или красные ошибки. 4) ПКМ → "Save as..." экспорт или скриншот. 5) Откройте issue на [GitHub Issues](https://github.com/L-Shy-P/TankTrouble-Chat-Unblock/issues) с логом и описанием.

---

## العربية

### 📥 التثبيت
1. نزّل أو استنسخ المستودع
2. افتح `chrome://extensions/`
3. فعّل **وضع المطور**
4. **تحميل غير مضغوط** → اختر المجلد
5. افتح [tanktrouble.com](https://tanktrouble.com)!

### 🔄 التحديث (بدون إعادة تحميل)
عادة يتغير `content.js` فقط. افتح [`content.js`](https://raw.githubusercontent.com/L-Shy-P/TankTrouble-Chat-Unblock/master/content.js) → نسخ الكل → الصق في `content.js` المحلي → `chrome://extensions/` → ↻.

### ❓ الأسئلة الشائعة

**Q1: كيف أفرض ملف zip الذي حملته؟**
A: ويندوز: زر أيمن → "استخراج الكل". ماك: نقر مزدوج. ستحصل على مجلد يحوي `manifest.json`.

**Q2: عند التحميل تظهر "manifest.json غير موجود".**
A: اخترت المجلد الخطأ. اختر المجلد الذي يحوي `manifest.json` **مباشرة** (المجلد الجذر بعد فك الضغط)، وليس المجلد الأب أو الفرعي.

**Q3: لدي نسختان قديمة وحديثة — تعارض؟**
A: نعم! في `chrome://extensions/` "أزل" النسخة القديمة (لا تكتفِ بالتعطيل). وجود عدة نسخ نشطة يسبب فوضى في فك الترميز.

**Q4: بعد التثبيت لا أستطيع الكتابة بالعربية.**
A: حدّث tanktrouble.com (F5 أو Ctrl+R). الإضافة تعمل فقط على الصفحات المحمّلة بعد التثبيت.

**Q5: بعد تحديث الملفات لم يحدث شيء.**
A: `chrome://extensions/` → اضغط "↻" على بطاقة الإضافة → حدّث tanktrouble.com. الخطوتان ضروريتان.

**Q6: هل تعمل على Firefox/Safari؟**
A: لا. هذا امتداد Manifest V3 — Chrome و Edge وغيرها من Chromium فقط.

**Q7: الآخرون لا يرون نصي.**
A: يحتاجون الإضافة أيضًا. فقط مستخدمو الإضافة يرون النص المفكوك، غيرهم يرى رموز `~XXXX` (تصميم مقصود).

**Q8: أيقونة خطأ على بطاقة الإضافة.**
A: انقر للتفاصيل. عادة ملف تالف أو مسار خاطئ. أعد التحميل والتثبيت.

**Q9: كيف أبلغ عن خطأ؟**
A: 1) F12 لفتح DevTools. 2) تبويب Console. 3) ابحث عن سجلات `[TT]` أو أخطاء حمراء. 4) زر أيمن → "Save as..." أو لقطة شاشة. 5) افتح issue في [GitHub Issues](https://github.com/L-Shy-P/TankTrouble-Chat-Unblock/issues) مع السجل والوصف.

---

## Français

### 📥 Installation
1. Téléchargez ou clonez ce dépôt
2. Ouvrez `chrome://extensions/`
3. Activez le **mode développeur**
4. **Charger l'extension non empaquetée** → sélectionnez le dossier
5. Allez sur [tanktrouble.com](https://tanktrouble.com) !

### 🔄 Mise à jour (sans retélécharger)
Généralement seul `content.js` change. Ouvrez [`content.js`](https://raw.githubusercontent.com/L-Shy-P/TankTrouble-Chat-Unblock/master/content.js) → Ctrl+A → Ctrl+C → collez dans votre `content.js` local → `chrome://extensions/` → ↻.

### ❓ FAQ

**Q1: Comment décompresser le zip téléchargé ?**
A: Windows : clic droit → "Extraire tout". Mac : double-clic. Vous obtiendrez un dossier contenant `manifest.json`.

**Q2: Le chargement indique "manifest.json introuvable".**
A: Mauvais dossier. Sélectionnez celui qui contient `manifest.json` **directement** (dossier racine après extraction), pas le parent ou un sous-dossier.

**Q3: J'ai l'ancienne et la nouvelle version — conflit ?**
A: Oui ! Dans `chrome://extensions/` "Supprimer" l'ancienne (pas juste désactiver). Plusieurs versions actives = chaos de décodage.

**Q4: Après l'install, je ne peux pas écrire en chinois.**
A: Rafraîchissez tanktrouble.com (F5 ou Ctrl+R). L'extension ne fonctionne que sur les pages chargées après l'installation.

**Q5: Après mise à jour des fichiers, rien ne change.**
A: `chrome://extensions/` → cliquez "↻" sur la carte → rafraîchissez tanktrouble.com. Les deux étapes sont obligatoires.

**Q6: Ça marche sur Firefox/Safari ?**
A: Non. C'est du Manifest V3 — Chrome, Edge et autres navigateurs Chromium uniquement.

**Q7: Les autres ne voient pas mon texte.**
A: Ils ont aussi besoin de l'extension. Seuls les utilisateurs voient le texte décodé ; les autres voient les codes `~XXXX` bruts (par conception).

**Q8: Icône d'erreur sur la carte d'extension.**
A: Cliquez pour les détails. Souvent fichiers corrompus ou mauvais chemin. Retéléchargez et réinstallez.

**Q9: Comment signaler un bug ?**
A: 1) F12 → DevTools. 2) Onglet Console. 3) Cherchez les logs `[TT]` ou erreurs rouges. 4) Clic droit → "Save as..." ou capture d'écran. 5) Ouvrez un issue sur [GitHub Issues](https://github.com/L-Shy-P/TankTrouble-Chat-Unblock/issues) avec le log et la description.

---

## Español

### 📥 Instalación
1. Descarga o clona este repo
2. Abre `chrome://extensions/`
3. Activa el **modo desarrollador**
4. **Cargar descomprimida** → selecciona la carpeta
5. ¡Abre [tanktrouble.com](https://tanktrouble.com)!

### 🔄 Actualización (sin redescargar)
Normalmente solo cambia `content.js`. Abre [`content.js`](https://raw.githubusercontent.com/L-Shy-P/TankTrouble-Chat-Unblock/master/content.js) → Ctrl+A → Ctrl+C → pega en tu `content.js` local → `chrome://extensions/` → ↻.

### ❓ Preguntas frecuentes

**Q1: ¿Cómo descomprimir el zip descargado?**
A: Windows: clic derecho → "Extraer todo". Mac: doble clic. Obtendrás una carpeta con `manifest.json`.

**Q2: Al cargar dice "manifest.json no encontrado".**
A: Elegiste la carpeta equivocada. Selecciona la que contiene `manifest.json` **directamente** (carpeta raíz tras descomprimir), no la padre ni una subcarpeta.

**Q3: Tengo versión vieja y nueva — ¿conflicto?**
A: ¡Sí! En `chrome://extensions/` "Quitar" la vieja (no solo desactivar). Múltiples versiones activas = caos de decodificación.

**Q4: Tras instalar no puedo escribir en chino.**
A: Refresca tanktrouble.com (F5 o Ctrl+R). La extensión solo funciona en páginas cargadas tras la instalación.

**Q5: Tras actualizar archivos no cambia nada.**
A: `chrome://extensions/` → clic en "↻" de la tarjeta → refresca tanktrouble.com. Ambos pasos obligatorios.

**Q6: ¿Funciona en Firefox/Safari?**
A: No. Es Manifest V3 — solo Chrome, Edge y derivados de Chromium.

**Q7: Otros no ven mi texto.**
A: Necesitan la extensión también. Solo los usuarios ven el texto decodificado; el resto ve los códigos `~XXXX` crudos (por diseño).

**Q8: Icono de error en la tarjeta de extensión.**
A: Haz clic para detalles. Suele ser archivo corrupto o ruta incorrecta. Redescarga y reinstala.

**Q9: ¿Cómo reportar un bug?**
A: 1) F12 → DevTools. 2) Pestaña Console. 3) Busca logs `[TT]` o errores rojos. 4) Clic derecho → "Save as..." o captura de pantalla. 5) Abre un issue en [GitHub Issues](https://github.com/L-Shy-P/TankTrouble-Chat-Unblock/issues) con el log y la descripción.

---

## Deutsch

### 📥 Installation
1. Repo herunterladen oder klonen
2. `chrome://extensions/` öffnen
3. **Entwicklermodus** aktivieren
4. **Entpackte Erweiterung laden** → Ordner wählen
5. [tanktrouble.com](https://tanktrouble.com) öffnen!

### 🔄 Aktualisierung (ohne Neudownload)
Meistens ändert sich nur `content.js`. [`content.js`](https://raw.githubusercontent.com/L-Shy-P/TankTrouble-Chat-Unblock/master/content.js) öffnen → Ctrl+A → Ctrl+C → in lokale `content.js` einfügen → `chrome://extensions/` → ↻.

### ❓ Häufige Fragen

**Q1: Wie entpacke ich die heruntergeladene Zip?**
A: Windows: Rechtsklick → "Alle extrahieren". Mac: Doppelklick. Sie erhalten einen Ordner mit `manifest.json`.

**Q2: Beim Laden "manifest.json nicht gefunden".**
A: Falscher Ordner. Wählen Sie den Ordner, der `manifest.json` **direkt** enthält (Root nach dem Entpacken), nicht den übergeordneten oder einen Unterordner.

**Q3: Alte und neue Version installiert — Konflikt?**
A: Ja! Unter `chrome://extensions/` die alte Version "Entfernen" (nicht nur deaktivieren). Mehrere aktive Versionen = Dekodierungschaos.

**Q4: Nach Installation kann ich kein Chinesisch senden.**
A: tanktrouble.com aktualisieren (F5 oder Strg+R). Die Erweiterung wirkt nur auf nach der Installation geladenen Seiten.

**Q5: Nach Datei-Update keine Änderung.**
A: `chrome://extensions/` → auf "↻" der Erweiterungskarte klicken → tanktrouble.com aktualisieren. Beide Schritte nötig.

**Q6: Funktioniert es in Firefox/Safari?**
A: Nein. Manifest V3 — nur Chrome, Edge und andere Chromium-Browser.

**Q7: Andere sehen meinen Text nicht.**
A: Sie brauchen die Erweiterung auch. Nur Nutzer sehen dekodierten Text; andere sehen rohe `~XXXX`-Codes (by Design).

**Q8: Fehlersymbol auf der Erweiterungskarte.**
A: Klicken für Details. Meist beschädigte Dateien oder falscher Pfad. Neu herunterladen und installieren.

**Q9: Wie melde ich einen Bug?**
A: 1) F12 → DevTools. 2) Console-Tab. 3) Suchen Sie nach `[TT]`-Logs oder roten Fehlern. 4) Rechtsklick → "Save as..." oder Screenshot. 5) Issue auf [GitHub Issues](https://github.com/L-Shy-P/TankTrouble-Chat-Unblock/issues) mit Log und Beschreibung öffnen.

---

## Português

### 📥 Instalação
1. Baixe ou clone este repo
2. Abra `chrome://extensions/`
3. Ative o **modo desenvolvedor**
4. **Carregar descompactada** → selecione a pasta
5. Abra [tanktrouble.com](https://tanktrouble.com)!

### 🔄 Atualização (sem baixar de novo)
Geralmente só `content.js` muda. Abra [`content.js`](https://raw.githubusercontent.com/L-Shy-P/TankTrouble-Chat-Unblock/master/content.js) → Ctrl+A → Ctrl+C → cole no seu `content.js` local → `chrome://extensions/` → ↻.

### ❓ Perguntas frequentes

**Q1: Como extrair o zip baixado?**
A: Windows: botão direito → "Extrair tudo". Mac: duplo clique. Você terá uma pasta com `manifest.json`.

**Q2: Ao carregar mostra "manifest.json não encontrado".**
A: Pasta errada. Selecione a que contém `manifest.json` **diretamente** (pasta raiz após extração), não a pai nem subpasta.

**Q3: Tenho versão antiga e nova — conflito?**
A: Sim! Em `chrome://extensions/` "Remover" a antiga (não só desativar). Múltiplas versões ativas = caos de decodificação.

**Q4: Após instalar não consigo enviar chinês.**
A: Atualize tanktrouble.com (F5 ou Ctrl+R). A extensão só funciona em páginas carregadas após a instalação.

**Q5: Após atualizar arquivos nada mudou.**
A: `chrome://extensions/` → clique em "↻" no cartão → atualize tanktrouble.com. Ambos os passos são obrigatórios.

**Q6: Funciona no Firefox/Safari?**
A: Não. É Manifest V3 — apenas Chrome, Edge e outros Chromium.

**Q7: Outros não veem meu texto.**
A: Eles também precisam da extensão. Só usuários veem texto decodificado; outros veem códigos `~XXXX` brutos (por design).

**Q8: Ícone de erro no cartão da extensão.**
A: Clique para detalhes. Geralmente arquivo corrompido ou caminho errado. Baixe novamente e reinstale.

**Q9: Como reportar um bug?**
A: 1) F12 → DevTools. 2) Aba Console. 3) Procure logs `[TT]` ou erros vermelhos. 4) Botão direito → "Save as..." ou captura de tela. 5) Abra uma issue no [GitHub Issues](https://github.com/L-Shy-P/TankTrouble-Chat-Unblock/issues) com o log e a descrição.

---

> 🔙 Back to [Main README](../README.md)
