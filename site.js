/* ============================================================
   安陵図書館  共通スクリプト（site.js）
   全ページで読み込んでいます。
   ------------------------------------------------------------
   もくじ
     1. 文字サイズ（標準 / 大）の切り替え
     2. スマホ用メニューの開け閉め
     3. 流れる写真（つなぎ目なくループ・停止ボタン）
     4. 開館時間の「本日」・年間行事の「今月」の印
   ============================================================ */
(function () {
  var root = document.documentElement;

  /* ---------- 1. 文字サイズ（標準 / 大）を切り替えて記憶する ---------- */
  var KEY = 'anryo-font-size';
  var setSize = function (size) {
    root.classList.toggle('fs-l', size === 'l');
    document.querySelectorAll('.fs-btn').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.fs === size));
    });
  };
  var saved = 'm';
  try { saved = localStorage.getItem(KEY) || 'm'; } catch (e) {}
  setSize(saved);
  document.querySelectorAll('.fs-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      setSize(b.dataset.fs);
      try { localStorage.setItem(KEY, b.dataset.fs); } catch (e) {}
    });
  });

  /* ---------- 2. スマホ用メニュー（Escキーでも閉じる） ---------- */
  var menuBtn = document.querySelector('.menu-btn');
  var nav = document.getElementById('gnav');
  if (menuBtn && nav) {
    var txt = menuBtn.querySelector('.menu-txt');
    var setOpen = function (open) {
      menuBtn.setAttribute('aria-expanded', String(open));
      root.classList.toggle('menu-open', open);
      if (txt) txt.textContent = open ? '閉じる' : 'メニュー';   // ✏ ボタンの文字
      if (open) { var first = nav.querySelector('a'); if (first) first.focus(); }
    };
    menuBtn.addEventListener('click', function () {
      setOpen(menuBtn.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('menu-open')) { setOpen(false); menuBtn.focus(); }
    });
  }

  /* ---------- 3. 流れる写真 ---------- */
  var track = document.querySelector('.strip-track');
  var toggle = document.querySelector('.strip-toggle');
  if (track) {
    // 同じ並びを複製して、つなぎ目なくループさせる
    Array.prototype.slice.call(track.children).forEach(function (li) {
      track.appendChild(li.cloneNode(true));
    });
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var setPaused = function (paused) {
      track.classList.toggle('is-paused', paused);
      if (toggle) {
        toggle.setAttribute('aria-pressed', String(paused));
        toggle.querySelector('.lbl').textContent = paused ? '写真を動かす' : '写真の動きを止める';   // ✏ ボタンの文字
      }
    };
    setPaused(!!reduce);
    if (toggle) toggle.addEventListener('click', function () {
      setPaused(!track.classList.contains('is-paused'));
    });
  }

  /* ---------- 4. 今日の曜日・今月の行事に印（HTMLの data-day / data-m を使う） ---------- */
  var now = new Date();
  var d = document.querySelector('.hours-table tr[data-day="' + now.getDay() + '"]');
  if (d) d.classList.add('is-today');
  var m = document.querySelector('.calendar li[data-m="' + (now.getMonth() + 1) + '"]');
  if (m) m.classList.add('is-now');
})();
