// early-hook.js — MAIN world, document_start
//
// 2026-10-09 游戏大改适配（第二版）
// ─────────────────────────────────────────────
// 背景：游戏从 GWT/DWR 迁移到 esbuild 打包的 IIFE 闭包后：
//   ① 不再暴露 window.TankTrouble（ChatBox 封在闭包内，且用的是**自定义事件系统**
//      —— 全包 EventTarget 引用数为 0，故劫持原生 addEventListener 无效，第一版方案作废）；
//   ② 聊天消息改由 SVG 渲染：`$("<div class='chatMessage'>").svg({...})` → `g.text(x, y, 文本, 属性)`。
//
// 突破口：文字**渲染**与文字**宽度测量**走的是同一个 SVG.js 原型方法
//   text(x, y, value, settings)
//   （measureSVGText 内部同样是 svgMeasurementHelper.text(0, 100, e, t).getComputedTextLength()）
// 因此劫持该原型方法、在文本进入渲染与测量之前替换为解码后的文本，
// 布局（逐词测量 + 手动换行定位）与最终显示内容天然保持一致。
//
// 分工：本脚本只负责"底层拦截 + 转发文本"，真正的编解码由 content.js 注册的
//   window.__TT_DECODE__(text) -> string 完成（消息只在进入对局后产生，届时 content.js 早已就绪）。
(function () {
  "use strict";
  if (window.__TT_EARLY_HOOK__) return;
  window.__TT_EARLY_HOOK__ = true;

  var _installed = false;

  function install() {
    if (_installed) return;
    var jq = window.jQuery;
    if (!jq || !jq.fn || typeof jq.fn.svg !== "function") return;   // jQuery 或 svg 插件尚未加载
    _installed = true;

    var origSvg = jq.fn.svg;
    var protoHooked = false;

    jq.fn.svg = function () {
      var ret = origSvg.apply(this, arguments);
      // svg("get") 返回 SVG.js 画布实例；其实例共享同一原型 → 只包装一次即可覆盖全部消息
      if (!protoHooked && arguments[0] === "get" && ret && typeof ret.text === "function") {
        var proto = Object.getPrototypeOf(ret);
        if (proto && typeof proto.text === "function") {
          protoHooked = true;
          var origText = proto.text;
          // ── 超长词硬切的"欠账"状态机（2026-10-12 修复"换行处编码截断乱码"）──
          // 游戏排版对无空格长词（我们的 ~XXXX 编码整串=一个词）会从【字符中间】
          // slice 硬切成两段渲染（bundle 实证：k.splice(N+1,0,{word:word.slice(se)})）。
          // 两段各自送进解码器 → 半截 ~XX 无法解码 → 换行处显示乱码。
          // 对策：片段结尾若残留"半截转义序列"（~[0-9a-f]{0,3} 或 \u[0-9a-f]{1,3}），
          // 先吞下记为欠账，拼到下一片段开头一起解码——两段合读即完整文本。
          // 状态按 SVG 实例存（WeakMap）：每条消息新建画布实例 → 消息间天然隔离；
          // 同一片段被描边层+填充层连续调用两次（输入相同）→ 复用上次输出（计数 n 消歧：
          // 连续第 3 次同输入=真的重复词，按新片段处理）；
          // 测量 helper 与渲染画布各自独立走同一切片序列 → 测量与渲染解码结果一致，布局不错位。
          var _st = new WeakMap();
          proto.text = function () {
            var args = Array.prototype.slice.call(arguments);
            // 定位文本参数（对齐 SVG.js 的 _args(["x","y","value"]) 变体规则）：
            //   text(x, y, value, settings) → 索引 2
            //   text(value[, settings])     → 索引 0
            var vi = -1;
            if (args.length >= 3 && typeof args[2] === "string") vi = 2;
            else if (args.length >= 1 && typeof args[0] === "string") vi = 0;
            if (vi < 0) return origText.apply(this, args);
            var fn = window.__TT_DECODE__;
            if (typeof fn !== "function") return origText.apply(this, args);
            var raw = args[vi];
            var st = _st.get(this);
            if (!st) { st = { in: null, out: null, debt: "", joined: false, n: 0 }; _st.set(this, st); }
            var out, joined;
            if (raw === st.in && st.n === 1) {          // 描边/填充重复调用：原样复用
              st.n = 2;
              out = st.out; joined = st.joined;
            } else {
              st.n = 1;
              var s = raw;
              joined = st.debt !== "";
              if (joined) { s = st.debt + s; st.debt = ""; }
              var m = s.match(/(?:~[0-9a-fA-F]{0,3}|\\u[0-9a-fA-F]{1,3})$/);
              if (m) { st.debt = m[0]; s = s.slice(0, s.length - m[0].length); }
              try { out = fn(s); if (typeof out !== "string") out = s; } catch (e) { out = s; }
              st.in = raw; st.out = out; st.joined = joined;
            }
            args[vi] = out;
            var ret2 = origText.apply(this, args);
            // 续片标记：复制/导出据此"无分隔直拼"（插空格或换行都会腰斩编码串/原文词）
            if (joined) {
              try {
                var node = (ret2 && ret2.node) ? ret2.node : ret2;
                if (node && node.setAttribute) node.setAttribute("data-tt-join", "1");
              } catch (e) {}
            }
            return ret2;
          };
          // 测量 helper 复用同一实例：clear()（每次测量前游戏必调）时重置其状态，
          // 防止上一条消息遗留的欠账污染下一条消息的首个测量。
          if (typeof proto.clear === "function") {
            var origClear = proto.clear;
            proto.clear = function () {
              try { _st.delete(this); } catch (e) {}
              return origClear.apply(this, arguments);
            };
          }
          try { console.log("[TT] SVG text hook installed (decode-on-render armed)"); } catch (e) {}
        }
      }
      return ret;
    };

    try { console.log("[TT] jQuery SVG hook armed @document_start (v3.1.0)"); } catch (e) {}
  }

  // jQuery 与 svg 插件由页面脚本加载 → 轮询等待就绪（最多约 60 秒）
  var tries = 0;
  (function waitReady() {
    tries++;
    install();
    if (!_installed && tries < 1200) setTimeout(waitReady, 50);
    // 静默/降级输出：Chrome 会把 content script 的 warn 记入扩展错误面板（并按页面 URL 归档），
    // 论坛等无聊天区的页面不应因此留下记录，故此处用 log 级。
    else if (!_installed) { try { console.log("[TT] jQuery/svg plugin not present on this page — decode hook idle"); } catch (e) {} }
  })();
})();