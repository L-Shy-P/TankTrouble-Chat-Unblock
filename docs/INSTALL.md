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

**Q1: Others see my Chinese messages as `~XXXX` gibberish.**
A: The receiver hasn't installed the extension, or has it disabled. Only extension users see decoded text; non-users see raw codes (by design).

**Q2: I can't see others' Chinese messages.**
A: Check that "Enable Encoding" is ON and the extension is enabled. Try toggling it off then on. Refresh the page.

**Q3: A new user installed it but can't decode messages.**
A: Make sure they visit `tanktrouble.com` (not an unrelated domain). Open the browser console (F12) and look for `[TT]` logs — if "ChatBox not found" appears, the game loaded too slowly; refresh. v2.9+ also covers `www.tanktrouble.com` and `beta.tanktrouble.com` automatically.

**Q4: Clicking a player name to @mention doesn't work.**
A: This is usually caused by "万能复制 / 万能粘贴" (universal copy/paste) extensions interfering. Try disabling those on tanktrouble.com. v2.9+ excludes `.username` and links from text-selection to mitigate this.

**Q5: What does "Enable Encoding" toggle do?**
A: When ON, encoded messages are decoded and shown as readable text. When OFF, messages show the raw `~XXXX` codes exactly as the server receives them — useful for seeing what non-extension users see.

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

**Q1：别人看到我发的中文是 `~XXXX` 乱码。**
答：对方没装扩展，或扩展被禁用。只有装了扩展的人才能看到解码后的文字，没装的人看到原始编码（这是设计如此）。

**Q2：我看不到别人发的中文。**
答：检查"启用编码"开关是否开启、扩展是否启用。试着关一次再开，刷新页面。

**Q3：新用户装了扩展但无法解码。**
答：确认访问的是 `tanktrouble.com`（不是无关域名）。打开浏览器控制台（F12）查看 `[TT]` 日志——若出现"ChatBox not found"，说明游戏加载过慢，刷新即可。v2.9+ 已自动覆盖 `www.tanktrouble.com` 和 `beta.tanktrouble.com`。

**Q4：点击玩家名字 @私聊没反应。**
答：通常是"万能复制 / 万能粘贴"等扩展干扰。尝试在 tanktrouble.com 上禁用这些扩展。v2.9+ 已将 `.username` 和链接排除出文本选中以缓解此问题。

**Q5："启用编码"开关有什么用？**
答：开启时，编码消息会被解码成可读文字。关闭时，消息显示原始 `~XXXX` 编码——也就是服务器实际收到的内容，用于查看没装扩展的人看到的样子。

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

**Q1: 送った日本語が `~XXXX` 文字化けで表示される。**
A: 相手が拡張をインストールしていないか無効化しています。拡張ユーザーのみデコード表示されます。

**Q2: 他人の日本語が見えない。**
A: 「エンコードを有効化」が ON か確認。オフ→オン→リロードしてみてください。

**Q3: 新規ユーザーがデコードできない。**
A: `tanktrouble.com` にアクセスしているか確認。F12 コンソールで `[TT]` ログを確認。"ChatBox not found" ならリロード。v2.9+ は `www.` `beta.` も自動対応。

**Q4: プレイヤー名クリックで @ できない。**
A: 「万能コピー」系拡張の干渉が原因。tanktrouble.com で無効化してみてください。v2.9+ で `.username` とリンクをテキスト選択から除外済み。

**Q5: 「エンコードを有効化」の役割は？**
A: ON でデコード表示、OFF で生の `~XXXX` を表示（サーバーが受信する生の形）。

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

**Q1: 보낸 한국어가 `~XXXX` 깨짐으로 표시됨.**
A: 수신자가 확장을 설치하지 않았거나 비활성화함. 확장 사용자만 디코딩됨.

**Q2: 타인의 한국어가 안 보임.**
A: "인코딩 활성화"가 ON인지 확인. 끄기→켜기→새로고침.

**Q3: 신규 사용자가 디코딩 안 됨.**
A: `tanktrouble.com` 접속 확인. F12 콘솔에서 `[TT]` 로그 확인. "ChatBox not found"면 새로고침. v2.9+는 `www.` `beta.` 자동 지원.

**Q4: 플레이어명 클릭 @ 안 됨.**
A: "만능 복사"류 확장 충돌. tanktrouble.com에서 비활성화. v2.9+에서 `.username` 링크 텍스트 선택 제외.

**Q5: "인코딩 활성화" 역할?**
A: ON: 디코딩 표시, OFF: 원시 `~XXXX` 표시.

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

**Q1: Другие видят мой текст как `~XXXX`.**
A: У получателя нет расширения или оно отключено. Декодинг только у пользователей расширения.

**Q2: Не вижу чужой текст.**
A: Проверьте "Включить кодирование" — ON. Выкл→вкл→обновить.

**Q3: Новый пользователь не видит декодирование.**
A: Откройте `tanktrouble.com`. F12 → ищите `[TT]`. "ChatBox not found" → обновите. v2.9+ покрывает `www.` и `beta.`.

**Q4: @упоминание по клику на имя не работает.**
A: Конфликт с расширениями копирования. Отключите их на tanktrouble.com. v2.9+ исключает `.username` из выделения.

**Q5: Что делает "Включить кодирование"?**
A: ON — декодированный текст, OFF — сырые `~XXXX` коды.

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

**Q1: الآخرون يرون نصي كـ `~XXXX`.**
A: الطرف الآخر لا يملك الإضافة أو أوقفها. فك الترميز فقط لمستخدمي الإضافة.

**Q2: لا أرى نص الآخرين.**
A: تأكد أن "تفعيل الترميز" يعمل. أطفئه ثم أعد تشغيله وأعد التحميل.

**Q3: مستخدم جديد لا يرى فك الترميز.**
A: تأكد من زيارة `tanktrouble.com`. F12 → ابحث عن `[TT]`. v2.9+ يدعم `www.` و `beta.`.

**Q4: النقر على الاسم لـ@ لا يعمل.**
A: تعارض مع إضافات النسخ. عطّلها على tanktrouble.com. v2.9+ يستثني `.username`.

**Q5: وظيفة "تفعيل الترميز"؟**
A: يعمل: نص مفكوك، متوقف: رموز `~XXXX` الخام.

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

**Q1: Les autres voient mon texte en `~XXXX`.**
A: Le destinataire n'a pas l'extension ou l'a désactivée.

**Q2: Je ne vois pas le texte des autres.**
A: Vérifiez "Activer l'encodage" — ON. Éteindre→allumer→rafraîchir.

**Q3: Un nouvel utilisateur ne voit pas le décodage.**
A: Visitez `tanktrouble.com`. F12 → cherchez `[TT]`. v2.9+ couvre `www.` et `beta.`.

**Q4: @mention par clic sur le nom ne marche pas.**
A: Conflit avec extensions de copie. Désactivez-les sur tanktrouble.com. v2.9+ exclut `.username`.

**Q5: Rôle de "Activer l'encodage" ?**
A: ON: texte décodé, OFF: codes `~XXXX` bruts.

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

**Q1: Otros ven mi texto como `~XXXX`.**
A: El receptor no tiene la extensión o la desactivó.

**Q2: No veo el texto de otros.**
A: Verifica "Activar codificación" — ON. Apagar→prender→recargar.

**Q3: Un usuario nuevo no ve decodificación.**
A: Visita `tanktrouble.com`. F12 → busca `[TT]`. v2.9+ cubre `www.` y `beta.`.

**Q4: @mención al hacer clic en nombre no funciona.**
A: Conflicto con extensiones de copia. Desactívalas en tanktrouble.com. v2.9+ excluye `.username`.

**Q5: ¿Rol de "Activar codificación"?**
A: ON: texto decodificado, OFF: códigos `~XXXX` crudos.

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

**Q1: Andere sehen meinen Text als `~XXXX`.**
A: Empfänger hat die Erweiterung nicht oder deaktiviert.

**Q2: Ich sehe keinen Text von anderen.**
A: "Kodierung aktivieren" prüfen — AN. Aus→An→Aktualisieren.

**Q3: Neuer Nutzer sieht keine Dekodierung.**
A: `tanktrouble.com` besuchen. F12 → `[TT]` suchen. v2.9+ deckt `www.` und `beta.`.

**Q4: @Erwähnung per Klick auf Name geht nicht.**
A: Konflikt mit Kopier-Erweiterungen. Auf tanktrouble.com deaktivieren. v2.9+ schließt `.username` aus.

**Q5: Rolle von "Kodierung aktivieren"?**
A: AN: dekodierter Text, AUS: rohe `~XXXX`-Codes.

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

**Q1: Outros veem meu texto como `~XXXX`.**
A: O receptor não tem a extensão ou a desativou.

**Q2: Não vejo o texto dos outros.**
A: Verifique "Ativar codificação" — ON. Desligar→ligar→recarregar.

**Q3: Usuário novo não vê decodificação.**
A: Visite `tanktrouble.com`. F12 → busque `[TT]`. v2.9+ cobre `www.` e `beta.`.

**Q4: @menção ao clicar no nome não funciona.**
A: Conflito com extensões de cópia. Desative-as no tanktrouble.com. v2.9+ exclui `.username`.

**Q5: Função de "Ativar codificação"?**
A: ON: texto decodificado, OFF: códigos `~XXXX` brutos.

---

> 🔙 Back to [Main README](../README.md)
