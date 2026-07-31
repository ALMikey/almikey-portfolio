import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const stylesheet = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

assert.match(html, /<h2 id="capabilities-title">服务端能力<\/h2>/);

const capabilities = [
  ['01', '插件配置', '根据玩法目标协调插件依赖、功能配置与版本兼容性，熟悉主流 Minecraft 插件的配置方式，能够建立稳定且便于持续维护的插件组合。', '精通', '90%'],
  ['02', '插件开发', '根据实际需求设计并开发 Minecraft 服务端插件，能够完成常见功能的编码实现、接口对接、调试测试与后续维护。', '熟悉', '65%'],
  ['03', '玩法功能落地', '根据玩法策划与实际运营目标拆解功能需求，协调插件、配置、脚本及资源内容，将玩法方案完整转化为可实际运行的服务器功能。', '精通', '90%'],
  ['04', '问题定位与调优', '通过日志、性能数据与运行表现定位插件冲突、配置异常及性能瓶颈，并针对具体问题完成修复、优化与稳定性验证。', '熟练', '80%'],
  ['05', '服务器架构与部署', '根据服务器规模规划代理端、子服、数据库与基础运行环境，完成服务部署、更新维护及基础容灾配置。', '熟练', '75%'],
  ['08', '需求分析与技术设计', '将策划需求拆分为明确的功能模块，评估实现成本、技术风险与插件依赖，并制定合理的落地方案。', '熟练', '70%'],
];

const capabilityRows = [...html.matchAll(/<article class="skill-row">([\s\S]*?)<\/article>/g)].map((match) => match[1]);
assert.equal(capabilityRows.length, capabilities.length, 'The capabilities section must contain the six supplied rows.');

for (const [index, [number, title, description, level, progress]] of capabilities.entries()) {
  const row = capabilityRows[index];
  assert.match(row, new RegExp(`<span>${number}<\\/span>`), `${number} must preserve the requested order.`);
  assert.match(row, new RegExp(`<h3>${escapeRegex(title)}<\\/h3>`));
  assert.match(row, new RegExp(`<p>${escapeRegex(description)}<\\/p>`));
  assert.match(row, new RegExp(`<b>${level}<\\/b>`));
  assert.match(row, new RegExp(`<i style="width: ${progress}"><\\/i>`));
}

const levelLabelRule = stylesheet.match(/\.level b\s*\{[^}]*\}/s)?.[0] ?? '';
const skillRowRule = stylesheet.match(/\.skill-row\s*\{[^}]*\}/s)?.[0] ?? '';
const skillHoverRule = stylesheet.match(/\.skill-row:hover\s*\{[^}]*\}/s)?.[0] ?? '';
assert.match(levelLabelRule, /font-size:\s*13\.2px;/, 'Capability level labels must be 20% larger.');
assert.match(skillRowRule, /padding-inline:\s*14px;/, 'Capability rows must keep text clear of the hover accent.');
assert.match(skillHoverRule, /background:\s*rgba\(166, 230, 92, \.12\);/, 'Capability rows must show a selected-state highlight on hover.');
assert.match(skillHoverRule, /box-shadow:\s*inset 3px 0 0 var\(--green\);/, 'Capability rows must show a selected-state accent on hover.');
assert.doesNotMatch(skillHoverRule, /transform\s*:/, 'Capability rows must not pop out on hover.');
