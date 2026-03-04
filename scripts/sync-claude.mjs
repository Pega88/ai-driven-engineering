import fs from 'fs';
import path from 'path';

const COMMANDS_DIR = path.join(process.cwd(), 'commands', 'engineering');
const CLAUDE_PLUGIN_DIR = path.join(process.cwd(), '.claude-plugin');
const CLAUDE_COMMANDS_DIR = path.join(CLAUDE_PLUGIN_DIR, 'commands');
const PLUGIN_JSON_PATH = path.join(CLAUDE_PLUGIN_DIR, 'plugin.json');

// Ensure output directory exists
if (!fs.existsSync(CLAUDE_COMMANDS_DIR)) {
  fs.mkdirSync(CLAUDE_COMMANDS_DIR, { recursive: true });
}

// 1. Copy GEMINI.md to CLAUDE.md
const geminiMdPath = path.join(process.cwd(), 'GEMINI.md');
const claudeMdPath = path.join(process.cwd(), 'CLAUDE.md');
if (fs.existsSync(geminiMdPath)) {
  fs.copyFileSync(geminiMdPath, claudeMdPath);
  console.log('✅ Copied GEMINI.md to CLAUDE.md');
}

// 2. Parse TOML files and create Markdown files
const files = fs.readdirSync(COMMANDS_DIR).filter(file => file.endsWith('.toml'));
const commandPaths = [];

for (const file of files) {
  const filePath = path.join(COMMANDS_DIR, file);
  const content = fs.readFileSync(filePath, 'utf-8');

  // Extract description (e.g. description = "...")
  const descMatch = content.match(/description\s*=\s*"([^"]+)"/);
  const description = descMatch ? descMatch[1] : "";

  // Extract prompt block (handles prompt="""...""")
  const promptMatch = content.match(/prompt\s*=\s*"""([\s\S]*?)"""/);
  
  if (promptMatch && promptMatch[1]) {
    const promptText = promptMatch[1].trim();
    const basename = path.basename(file, '.toml');
    const mdFileName = `${basename}.md`;
    const mdFilePath = path.join(CLAUDE_COMMANDS_DIR, mdFileName);
    
    // Construct the file with Claude's YAML frontmatter
    let fileContent = "";
    if (description) {
      fileContent += `---\ndescription: ${description}\n---\n\n`;
    }
    fileContent += promptText;
    
    fs.writeFileSync(mdFilePath, fileContent);
    console.log(`✅ Converted ${file} to ${mdFileName} (with frontmatter)`);
    
    // Add to the list of commands for plugin.json
    commandPaths.push(`./.claude-plugin/commands/${mdFileName}`);
  } else {
    console.warn(`⚠️ Could not extract prompt from ${file}`);
  }
}

// 3. Update plugin.json
if (fs.existsSync(PLUGIN_JSON_PATH)) {
  const pluginJson = JSON.parse(fs.readFileSync(PLUGIN_JSON_PATH, 'utf-8'));
  pluginJson.commands = commandPaths;
  fs.writeFileSync(PLUGIN_JSON_PATH, JSON.stringify(pluginJson, null, 2));
  console.log('✅ Updated plugin.json with new commands');
} else {
  console.error(`❌ ${PLUGIN_JSON_PATH} not found.`);
}
