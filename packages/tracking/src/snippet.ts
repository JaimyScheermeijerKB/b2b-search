/**
 * B2B Visitor tracking snippet
 * Gebruik: b2b.init({ ingestKey: 'xxx', ingestUrl: 'https://...' })
 */

export interface B2BVisitorConfig {
  ingestKey: string;
  ingestUrl: string;
}

export function createSnippetScript(config: B2BVisitorConfig): string {
  return `
(function(){
  var config = ${JSON.stringify(config)};
  var visitorId = (function(){
    try {
      var k = 'b2b_visitor_id';
      var v = localStorage.getItem(k);
      if (!v) { v = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0; return (c==='x'?r:(r&0x3|0x8)).toString(16);
      }); localStorage.setItem(k, v); }
      return v;
    } catch(e) { return 'anon-' + Date.now(); }
  })();
  var SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minuten inactiviteit
  var sessionId = (function(){
    try {
      var k = 'b2b_session_id';
      var tKey = 'b2b_session_at';
      var v = sessionStorage.getItem(k);
      var lastAt = parseInt(sessionStorage.getItem(tKey) || '0', 10);
      var now = Date.now();
      if (!v || (now - lastAt) > SESSION_TIMEOUT_MS) {
        v = 'sess-' + now + '-' + Math.random().toString(36).slice(2);
        sessionStorage.setItem(k, v);
      }
      sessionStorage.setItem(tKey, String(now));
      return v;
    } catch(e) { return 'sess-' + Date.now(); }
  })();
  function send(path, referrer, title) {
    try { sessionStorage.setItem('b2b_session_at', String(Date.now())); } catch(e) {}
    var payload = {
      path: path || window.location.pathname || '/',
      referrer: referrer || document.referrer || '',
      title: title || document.title || '',
      visitor_id: visitorId,
      session_id: sessionId
    };
    var params = new URLSearchParams(window.location.search);
    ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].forEach(function(k) {
      if (params.get(k)) payload[k] = params.get(k);
    });
    var url = config.ingestUrl + (config.ingestUrl.indexOf('?') >= 0 ? '&' : '?') + 'key=' + encodeURIComponent(config.ingestKey);
    navigator.sendBeacon && navigator.sendBeacon(url, JSON.stringify(payload));
  }
  if (document.readyState === 'complete') {
    send();
  } else {
    window.addEventListener('load', function() { send(); });
  }
  var lastPath = window.location.pathname;
  var observer = window.MutationObserver && new MutationObserver(function() {
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname;
      send();
    }
  });
  if (observer && document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  }
  window.addEventListener('popstate', function() { send(); });
})();
`;
}
