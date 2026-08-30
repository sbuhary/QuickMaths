(function () {
  const icons = {
    "badge-x": ["M7 7h10v10H7z", "M10 10l4 4", "M14 10l-4 4"],
    "chevron-left": ["M15 18l-6-6 6-6"],
    eraser: ["M7 21h10", "M3 15l8-8 6 6-8 8H5l-2-2z", "M14 10l-6 6"],
    "panel-left": ["M4 5h16v14H4z", "M9 5v14"],
    "panel-right": ["M4 5h16v14H4z", "M15 5v14"],
    pencil: ["M18 2l4 4L8 20H4v-4L18 2z", "M14 6l4 4"],
    "repeat-2": ["M17 2l4 4-4 4", "M3 11V9a3 3 0 0 1 3-3h15", "M7 22l-4-4 4-4", "M21 13v2a3 3 0 0 1-3 3H3"],
    "rotate-ccw": ["M3 12a9 9 0 1 0 3-6.7", "M3 4v6h6"],
    sparkles: ["M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z", "M5 3v4", "M3 5h4", "M19 17v4", "M17 19h4"],
    "trash-2": ["M3 6h18", "M8 6V4h8v2", "M6 6l1 15h10l1-15", "M10 11v6", "M14 11v6"],
    "undo-2": ["M9 14l-4-4 4-4", "M5 10h10a5 5 0 0 1 0 10h-1"],
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
    svg.setAttribute("stroke-width", "2");
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
