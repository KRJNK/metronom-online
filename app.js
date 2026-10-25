// Metronom: WebAudio + lookahead scheduler (stabilne tempo).
(function () {
  'use strict';
  var bpmEl = document.getElementById('bpm');
  var btn = document.getElementById('toggle');
  var ctx = null, timer = null, nextT = 0, beat = 0;
  function audio() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function click(when, accent) {
    var c = audio();
    var o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(c.destination);
    o.frequency.value = accent ? 1200 : 800;
    g.gain.setValueAtTime(0.3, when);
    g.gain.exponentialRampToValueAtTime(0.001, when + 0.08);
    o.start(when); o.stop(when + 0.09);
  }
  function tick() {
    var c = audio();
    var interval = 60 / (+bpmEl.value || 100);
    var beats = +document.getElementById('beats').value || 0;
    while (nextT < c.currentTime + 0.15) {
      click(nextT, beats > 0 && beat % beats === 0);
      nextT += interval;
      beat++;
    }
  }
  btn.addEventListener('click', function () {
    if (timer) {
      clearInterval(timer); timer = null;
      btn.textContent = 'Start';
      return;
    }
    audio(); beat = 0; nextT = ctx.currentTime + 0.05;
    timer = setInterval(tick, 40);
    btn.textContent = 'Stop';
  });
  bpmEl.addEventListener('input', function () {
    document.getElementById('bpm-out').textContent = bpmEl.value + ' BPM';
  });
})();
