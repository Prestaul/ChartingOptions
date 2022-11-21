const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

export function measureText(text, font = '400 12px sans-serif') {
  ctx.font = font;
  return ctx.measureText(text);
}
