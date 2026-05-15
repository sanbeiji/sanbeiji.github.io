// Core Global Utilities for Sanbeiji Docs

window.SanbeijiDocs = {
  monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],

  setHTML: function(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  },

  encodeData: function(data) {
    return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  },

  decodeData: function(str) {
    return JSON.parse(decodeURIComponent(escape(atob(str))));
  },

  formatTimestamp: function(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    return `${yyyy}/${mm}/${dd} ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  }
};
