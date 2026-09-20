/**
 * Auditoria de contraste WCAG 2.1 AA sobre el DOM renderizado.
 *
 * `contrastEvaluator` esta pensado para pasarse directamente a
 * `page.evaluate()`: recorre los nodos de texto hoja, compone el fondo
 * efectivo subiendo por el arbol y apilando alfas, y compara contra el color
 * real del texto. Entiende oklab(), que es lo que Tailwind v4 genera para las
 * utilidades de opacidad (text-paper/70), asi que medir ahi no es opcional.
 *
 * Devuelve hasta 20 muestras por debajo del minimo exigible.
 */
export const contrastEvaluator = () => {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  /** Convierte OKLab (L 0..1, a, b) a sRGB 0..255 segun CSS Color 4. */
  function oklabToSrgb(L, A, B) {
    const l_ = L + 0.3963377774 * A + 0.2158037573 * B;
    const m_ = L - 0.1055613458 * A - 0.0638541728 * B;
    const s_ = L - 0.0894841775 * A - 1.291485548 * B;
    const l = l_ ** 3, m = m_ ** 3, sn = s_ ** 3;
    let r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * sn;
    let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * sn;
    let b = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * sn;
    const gamma = (v) => {
      const a = 0.055;
      v = v <= 0.0031308 ? 12.92 * v : (1 + a) * Math.pow(Math.max(v, 0), 1 / 2.4) - a;
      return Math.max(0, Math.min(255, Math.round(v * 255)));
    };
    return [gamma(r), gamma(g), gamma(b)];
  }

  /** Resuelve un <color> de CSS a [r,g,b]: hex, rgb(), rgba() u oklab(). */
  function toRgb(color) {
    if (!color) return null;
    const str = String(color).trim();

    const ok = str.match(/^oklab\(\s*([\d.]+)%?\s+(-?[\d.eE+-]+)\s+(-?[\d.eE+-]+)\s*(?:\/\s*([\d.]+%?)\s*)?\)$/i);
    if (ok) {
      const L = ok[1].endsWith("%") ? Number(ok[1]) / 100 : Number(ok[1]);
      return oklabToSrgb(L, Number(ok[2]), Number(ok[3]));
    }
    const rgba = str.match(/^rgba?\(([^)]+)\)$/i);
    if (rgba) {
      const parts = rgba[1].split(/[\s,\/]+/).filter(Boolean);
      const nums = parts.slice(0, 3).map((v) => (v.endsWith("%") ? (Number(v) / 100) * 255 : Number(v)));
      return nums.every((n) => !Number.isNaN(n)) ? nums : null;
    }
    if (str.startsWith("#")) {
      const hex = str.slice(1);
      if (![3, 4, 6, 8].includes(hex.length)) return null;
      const full = hex.length <= 4 ? hex.split("").map((c) => c + c).join("") : hex;
      return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
    }
    // Ultimo recurso: apoyarse en canvas para nombres de color y otras sintaxis.
    ctx.fillStyle = "#000";
    ctx.fillStyle = str;
    const parsed = ctx.fillStyle;
    return parsed === str ? null : toRgb(parsed);
  }

  /** Extrae el canal alfa de un <color> de CSS (1 si es opaco). */
  function alphaOf(color) {
    const str = String(color);
    const slash = str.match(/\/\s*([\d.]+)(%)?\s*\)/);
    if (slash) {
      const value = Number(slash[1]);
      return slash[2] ? value / 100 : value;
    }
    const rgba = str.match(/^rgba?\(\s*[^,]+\s*,\s*[^,]+\s*,\s*[^,]+\s*,\s*([\d.]+)\s*\)$/i);
    return rgba ? Number(rgba[1]) : 1;
  }

  const luminance = (rgb) => {
    const [r, g, b] = rgb.map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  /** Composicion alfa de un color sobre un fondo opaco. */
  const over = (fg, a, bg) => fg.map((c, i) => c * a + bg[i] * (1 - a));

  const out = [];
  const seen = new Set();
  for (const el of document.querySelectorAll("h1, h2, h3, h4, p, a, li, dt, dd, span, address, button, label")) {
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || Number(cs.opacity) < 0.2) continue;
    const text = el.textContent?.trim();
    if (!text || el.children.length > 0) continue;

    // Fondo efectivo: subir hasta encontrar uno opaco, componiendo alfas.
    const stack = [];
    let node = el;
    let base = null;
    while (node && node !== document.documentElement) {
      const bgc = getComputedStyle(node).backgroundColor;
      const rgb = toRgb(bgc);
      const a = alphaOf(bgc);
      if (rgb) {
        if (a >= 0.999) { base = rgb; break; }
        if (a > 0.01) stack.push([rgb, a]);
      }
      node = node.parentElement;
    }
    if (!base) base = [8, 9, 10];
    let bg = base;
    for (let i = stack.length - 1; i >= 0; i--) bg = over(stack[i][0], stack[i][1], bg);

    const fgCss = cs.color;
    const fgRgb = toRgb(fgCss);
    if (!fgRgb) continue;
    const fg = over(fgRgb, alphaOf(fgCss), bg);

    const ratio = (Math.max(luminance(fg), luminance(bg)) + 0.05) /
                  (Math.min(luminance(fg), luminance(bg)) + 0.05);
    const size = parseFloat(cs.fontSize);
    const bold = Number(cs.fontWeight) >= 700;
    const large = size >= 24 || (size >= 18.66 && bold);
    const required = large ? 3 : 4.5;

    if (ratio < required) {
      const key = `${text.slice(0, 30)}|${ratio.toFixed(1)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({
        text: text.slice(0, 42),
        ratio: +ratio.toFixed(2),
        required,
        size: +size.toFixed(1),
        color: fgCss,
        bg: `rgb(${bg.map(Math.round).join(",")})`,
      });
    }
  }
  return out.slice(0, 20);
};
