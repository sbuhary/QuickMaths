(function () {
  const icons = {
    "badge-x": ["M6 5h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z", "M9 9l6 6", "M15 9l-6 6"],
    "chart-column": ["M4 20h16", "M7 17V11", "M12 17V5", "M17 17V8"],
    "chevron-left": ["M15.5 5.5 9 12l6.5 6.5"],
    "circle-help": ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M9.6 9.2a2.6 2.6 0 0 1 5 .9c0 1.9-2.6 2.1-2.6 3.9", "M12 17h.01"],
    eraser: ["M4 15.5 12.5 7a2 2 0 0 1 2.8 0l3.7 3.7a2 2 0 0 1 0 2.8L12.5 20H7.8L4 16.2a1 1 0 0 1 0-.7z", "M10 10l6 6", "M3 21h18"],
    flame: ["M12 22a7 7 0 0 0 7-7c0-4.4-3.5-6.1-4.4-11-2.5 1.8-4.2 4.1-4.8 6.7C8.5 9.7 8 8.4 8 7c-2.1 1.7-3 4.2-3 6.7A8.1 8.1 0 0 0 12 22z"],
    "panel-left": ["M4 5h16v14H4z", "M9 5v14"],
    "panel-right": ["M4 5h16v14H4z", "M15 5v14"],
    lock: ["M7 11V8a5 5 0 0 1 10 0v3", "M6 11h12v9H6z", "M12 15v2"],
    pencil: ["M4 20h4.5L19.8 8.7a2.1 2.1 0 0 0 0-3L18.3 4.2a2.1 2.1 0 0 0-3 0L4 15.5V20z", "M13.8 5.7l4.5 4.5"],
    "repeat-2": ["M17 2.5 21 6.5 17 10.5", "M3 11V9a2.5 2.5 0 0 1 2.5-2.5H21", "M7 21.5l-4-4 4-4", "M21 13v2a2.5 2.5 0 0 1-2.5 2.5H3"],
    "rotate-ccw": ["M4 4v6h6", "M5.5 15a7 7 0 1 0 1.9-7.4L4 10"],
    trophy: ["M8 4h8v3a4 4 0 0 1-8 0V4z", "M6 5H3v2a4 4 0 0 0 4 4", "M18 5h3v2a4 4 0 0 1-4 4", "M12 11v5", "M8 20h8", "M10 16h4"],
    "user-cog": ["M15 21v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1", "M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M19 15.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z", "M19 8v1.2", "M19 16.8V18", "M15.5 10l1 .6", "M21.5 16l-1-.6", "M15.5 16l1-.6", "M21.5 10l-1 .6"],
    shield: ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
    sparkles: ["M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z", "M5 3v4", "M3 5h4", "M19 17v4", "M17 19h4"],
    star: ["M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21 7 14.2 2 9.3l6.9-1L12 2z"],
    "trash-2": ["M4 7h16", "M9 7V5h6v2", "M7 7l1 13h8l1-13", "M10 11v5", "M14 11v5"],
    "undo-2": ["M9 7 4 12l5 5", "M5 12h10a4 4 0 1 1 0 8h-1"],
    "volume-2": ["M4 9v6h4l5 4V5L8 9H4z", "M16 8a5 5 0 0 1 0 8", "M19 5a9 9 0 0 1 0 14"],
    "volume-x": ["M4 9v6h4l5 4V5L8 9H4z", "M18 9l4 4", "M22 9l-4 4"],
  };

  function renderIcon(node) {
    const name = node.getAttribute("data-lucide");
    const paths = icons[name];
    if (!paths) return;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2.4");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");
    for (const d of paths) {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", d);
      svg.appendChild(path);
    }
    node.replaceChildren(svg);
  }

  window.lucide = {
    createIcons() {
      document.querySelectorAll("[data-lucide]").forEach(renderIcon);
    },
  };
})();