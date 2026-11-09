// scripts/test_runner.cjs
const fs = require('fs');

// Read generated scenarios to test
const rawCode = fs.readFileSync('src/data/aiChatScenarios.ts', 'utf8');

// Run a quick eval in node context
const scenariosMatch = rawCode.match(/export const AI_CHAT_SCENARIOS: ScenarioDefinition\[\] = (\[[\s\S]*?\]);\n\n\/\*\*/);
if (!scenariosMatch) {
  console.error('Failed to parse AI_CHAT_SCENARIOS');
  process.exit(1);
}

const scenarios = eval(scenariosMatch[1]);
console.log('Successfully loaded scenarios count:', scenarios.length);

function matchScenario(userInput, inputNorm) {
  for (const scen of scenarios) {
    if (scen.regex.test(userInput) || scen.regex.test(inputNorm)) {
      const idx = Math.abs(userInput.length + (userInput.charCodeAt(0) || 0)) % scen.responses.length;
      return {
        id: scen.id,
        topic: scen.topic,
        name: scen.name,
        text: scen.responses[idx],
        quickPrompts: scen.quickPrompts,
      };
    }
  }
  return null;
}

function normalizeText(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .trim();
}

const testCases = [
  'tôi buồn quá',
  'áp lực công việc quá',
  'vợ cấm không cho đi đánh cầu',
  'hôm nay bị bán hành ngập mồm',
  'va vợt gãy đôi khung rồi',
  'bị lật sơ mi đau quá',
  'bị vãng lai bùng kèo cay thật',
  'đánh xong đói bụng quá ăn gì đây',
  'trời mưa to quá sao đi',
  'luật giao cầu 1.15m là sao',
  'bé cầu dễ thương ghê',
  'viết code python giúp tôi với'
];

testCases.forEach(tc => {
  const norm = normalizeText(tc);
  const res = matchScenario(tc, norm);
  if (res) {
    console.log(`[PASS] "${tc}" => [${res.topic}] ${res.name} (${res.id})`);
  } else {
    console.log(`[FAIL] "${tc}" => No scenario matched!`);
  }
});
