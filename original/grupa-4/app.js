// ČistoMore — shared logic used across every page of the site.
(function(){
  function safeGet(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function safeSet(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }

  // Apply whichever ocean theme the person picked on the Profil page (demo styler),
  // so the choice follows them from page to page.
  var savedTheme = safeGet("cm-theme");
  if(savedTheme){ document.documentElement.setAttribute("data-theme", savedTheme); }
  window.CM_setTheme = function(theme){
    document.documentElement.setAttribute("data-theme", theme);
    safeSet("cm-theme", theme);
  };
  window.CM_getTheme = function(){ return safeGet("cm-theme") || "ocean"; };

  // Toast helper, available on every page.
  var toastTimer;
  window.showToast = function(msg){
    var t = document.getElementById("toast");
    if(!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ t.classList.remove("show"); }, 2600);
  };
})();
