// Consistency checks for the World2 plugin packages. Node only, no dependencies.
import {readFileSync,readdirSync,statSync} from 'node:fs';
import {join} from 'node:path';
import assert from 'node:assert/strict';

const MCP_URL='https://world2.co/mcp';
const json=p=>JSON.parse(readFileSync(p,'utf8'));
const walk=d=>readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(d,e.name)):[join(d,e.name)]);
const png=p=>{const b=readFileSync(p);assert.equal(b.subarray(1,4).toString('ascii'),'PNG',p);return [b.readUInt32BE(16),b.readUInt32BE(20),b.length]};

const market=json('.claude-plugin/marketplace.json');
assert.equal(market.name,'world2');
assert.deepEqual(market.plugins.map(p=>[p.name,p.source]),[['world2','./plugins/world2']]);

const claude=json('plugins/world2/.claude-plugin/plugin.json');
assert.equal(claude.name,'world2');
assert.match(claude.version,/^\d+\.\d+\.\d+$/);
assert.equal(claude.privacyPolicyUrl,'https://world2.co/privacy/');
assert.deepEqual(json('plugins/world2/.mcp.json'),{mcpServers:{world2:{type:'http',url:MCP_URL}}});
const [iw,ih,isize]=png(join('plugins/world2',claude.icon));
assert.ok(iw===ih&&iw>=512&&iw<=2048&&isize<2*1024*1024,'Claude icon: square PNG 512-2048 px, under 2 MB');

const openai=json('openai/world2/plugin.json');
assert.equal(openai.$schema,'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json');
assert.equal(openai.name,'world2');
const ui=openai.extensions['com.openai'].interface;
assert.ok(ui.displayName.length<=30&&ui.shortDescription.length<=30,'display name and subtitle at most 30 characters');
assert.ok(ui.longDescription.length<=4000&&openai.description.length<=4000);
assert.ok(ui.defaultPrompt.length<=3&&ui.defaultPrompt.every(p=>p.length<=128));
for(const key of ['websiteURL','supportURL','privacyPolicyURL','termsOfServiceURL'])assert.match(ui[key],/^https:\/\/world2\.co(\/|$)/,key);
const [ow,oh]=png(join('openai/world2',ui.logo));
assert.ok(ow===oh&&ow>=48&&ow<=4096,'OpenAI logo: square, 48-4096 px');
const server=json('openai/world2/mcp.json').mcpServers.world2;
assert.equal(server.type,'streamable-http');
assert.equal(server.url,MCP_URL);
assert.deepEqual(server.extensions['com.openai'].auth,{type:'oauth',client:{mode:'dcr'}});
assert.equal(server.headers,undefined);

const skill=readFileSync('plugins/world2/skills/world2/SKILL.md','utf8');
assert.equal(readFileSync('openai/world2/skills/world2/SKILL.md','utf8'),skill,'both packages ship the same Skill');
assert.match(skill,/^---\nname: world2\ndescription: [^\n]+\n---\n/);
assert.doesNotMatch(skill,/\.mjs|install|--sync|w2p_|w2r_|SKILL\.md|registry\.json/);
for(const dir of ['plugins/world2','openai/world2'])
 for(const f of walk(dir))assert.doesNotMatch(f,/\.(m?js|cjs|ts|sh|py|exe)$/,f+' must not be executable code');
assert.ok(statSync('LICENSE').size>0);
console.log('World2 plugin packages: all checks passed');
