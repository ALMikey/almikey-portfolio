import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const mechanicsSection = html.match(/<section class="section mechanics visual-section"[\s\S]*?<\/section>/)?.[0] ?? '';

assert.match(mechanicsSection, /<h2 id="mechanics-title">技术能力<\/h2>/);

const groups = [
  ['原版机制', ['数据包', '资源包', '原版机制']],
  ['插件开发', ['Bukkit', 'Spigot', 'PaperMc', 'Folia']],
  ['数据库操作', ['MySql/MariaDb', 'Mongodb', 'Redis']],
  ['操作系统', ['Windows server', 'Linux/发行版', '各类面板服务器']],
  ['Git与版本控制', ['Git 基础操作', 'GitHub 仓库管理', 'Pull Request 协作流程']],
];

const groupRows = [...mechanicsSection.matchAll(/<article class="mechanics-group">([\s\S]*?)<\/article>/g)].map((match) => match[1]);
assert.equal(groupRows.length, groups.length, 'The technical range must contain five supplied groups.');

for (const [index, [title, items]] of groups.entries()) {
  const row = groupRows[index];
  assert.match(row, new RegExp(`<p class="group-title">${title}<\\/p>`), `${title} must preserve its order.`);
  for (const item of items) {
    assert.match(row, new RegExp(`<li>${item}<\\/li>`));
  }
}
