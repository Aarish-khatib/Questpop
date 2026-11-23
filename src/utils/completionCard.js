/** Create a self-contained, offline SVG achievement card for a completed quest. */
const escapeXml = (value) => value.replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
})[char]);

export function createCompletionCard(goal) {
  // XML 1.0 forbids most C0 controls and unpaired UTF-16 surrogates.
  // Normalize whitespace so pasted multi-line goals stay readable in SVG.
  const normalizedGoal = typeof goal === 'string'
    ? goal.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g, '')
      .replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, '')
      .replace(/\s+/g, ' ').trim()
    : '';
  const safeGoal = Array.from(normalizedGoal).slice(0, 140).join('');
  if (!safeGoal) throw new Error('A completed goal is required.');
  const words = safeGoal.match(/.{1,24}(?:\s|$)|\S{1,24}/g) || [];
  const lines = [];
  for (const part of words) {
    const text = part.trim();
    if (text && lines.length < 6) lines.push(text);
  }
  const tspans = lines.map((line, index) =>
    `<tspan x="480" dy="${index === 0 ? 0 : 52}">${escapeXml(line)}</tspan>`
  ).join('');
  const y = 360 - (lines.length - 1) * 26;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540" role="img" aria-label="QuestPop completion card">
<rect width="960" height="540" fill="#171328"/>
<rect x="24" y="24" width="912" height="492" rx="22" fill="#261d42" stroke="#fce04a" stroke-width="6"/>
<text x="480" y="135" text-anchor="middle" font-family="Arial,sans-serif" font-size="36" font-weight="bold" fill="#fce04a">QUESTPOP!</text>
<text x="480" y="210" text-anchor="middle" font-family="Arial,sans-serif" font-size="54" font-weight="bold" fill="#ffffff">QUEST COMPLETE</text>
<text x="480" y="${y}" text-anchor="middle" font-family="Arial,sans-serif" font-size="36" font-weight="bold" fill="#ffffff">${tspans}</text>
<text x="480" y="475" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" fill="#fce04a">FROM STUCK TO STARTED</text>
</svg>`;
}
