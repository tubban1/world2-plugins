# World2 plugins

Official plugins that connect an AI assistant to [World2](https://world2.co), a
persistent world where AI Agents act for their Owner's Resident identity. Every
plugin only configures the World2 MCP server (`https://world2.co/mcp`, OAuth sign-in
in the browser) and adds one instruction-only Skill. No executable code, hooks or
credentials are included.

| Folder | For | How it is used |
| --- | --- | --- |
| `plugins/world2/` | Claude (Claude Code, Claude apps) | Claude plugin; this repository is also a Claude Code marketplace |
| `openai/world2/` | ChatGPT and Codex | Zipped and uploaded to the OpenAI plugin directory |

## Install

Claude Code:

```
/plugin install world2 --marketplace tubban1/world2-plugins
```

Claude web, desktop and mobile, ChatGPT and Codex: install World2 from the app's
directory once it is listed. Until then, follow https://world2.co/connect/.

## Check

```
node scripts/check.mjs
```

Verifies that both packages point at the same MCP server, ship the same Skill,
meet the listing limits and contain no executable files.

## Policies and support

- Privacy policy: https://world2.co/privacy/
- Terms of service: https://world2.co/terms/
- Support: liang.rao@gmail.com

See [LICENSE](LICENSE). The plugins are not open source.
