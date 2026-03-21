#!/usr/bin/env node

/**
 * Saikuru Project Skills Management Script
 * Usage: node scripts/skills.mjs <command>
 * Commands: install, list, check, update, help
 * Requires: Node.js 22+
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// Colors for output (ANSI escape codes)
const colors = {
  red: '\x1b[0;31m',
  green: '\x1b[0;32m',
  yellow: '\x1b[1;33m',
  blue: '\x1b[0;34m',
  cyan: '\x1b[0;36m',
  nc: '\x1b[0m', // No Color
};

// Utility function to print colored output
function log(color, message) {
  console.log(`${colors[color]}${message}${colors.nc}`);
}

// Utility function to execute a command
function runCommand(command, options = {}) {
  const { silent = false, cwd = process.cwd() } = options;

  if (!silent) {
    log('cyan', `$ ${command}`);
  }

  try {
    const result = execSync(command, {
      cwd,
      encoding: 'utf8',
      stdio: silent ? 'pipe' : 'inherit',
    });
    return { success: true, output: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Read skills-lock.json and return the list of skills
function readSkillsLock() {
  const projectRoot = process.cwd();
  const skillsLockPath = path.join(projectRoot, 'skills-lock.json');

  if (!fs.existsSync(skillsLockPath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(skillsLockPath, 'utf8');
    const data = JSON.parse(content);
    return Object.keys(data.skills || {});
  } catch (error) {
    log('yellow', `⚠ Failed to read skills-lock.json: ${error.message}`);
    return null;
  }
}

// Command: install
function install() {
  console.log('');
  log('blue', '========================================');
  log('blue', '  Saikuru Skills Setup');
  log('blue', '========================================');
  console.log('');

  // Check if we're in the right directory
  const projectRoot = process.cwd();
  const packageJsonPath = path.join(projectRoot, 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    log('red', 'Error: package.json not found. Please run this script from the project root.');
    process.exit(1);
  }

  // Read skills from skills-lock.json
  log('yellow', 'Step 1: Reading skills-lock.json...');
  const skillsFromLock = readSkillsLock();

  let skillsToInstall;
  let sourceRepo;

  if (skillsFromLock && skillsFromLock.length > 0) {
    skillsToInstall = skillsFromLock;
    sourceRepo = 'vercel-labs/agent-skills';
    log('green', `✓ Found ${skillsToInstall.length} skills in skills-lock.json`);
  } else {
    // Fallback to default skills if skills-lock.json not found or empty
    log('yellow', '⚠ skills-lock.json not found or empty, using default skills');
    skillsToInstall = [
      'vercel-react-native-skills',
      'vercel-composition-patterns',
      'web-design-guidelines',
    ];
    sourceRepo = 'vercel-labs/agent-skills';
  }
  console.log('');

  // Step 1: Remove any existing skills
  log('yellow', 'Step 2: Removing existing skills...');
  runCommand('npx skills remove --all -y', { silent: true });
  log('green', '✓ Existing skills removed');
  console.log('');

  // Step 2: Add skills specifically for Claude Code
  log('yellow', 'Step 3: Adding skills for Claude Code...');

  // Note: We're not using `npx skills experimental_install` because:
  // 1. It's marked as experimental (as the name suggests)
  // 2. We want more control over which agent gets the skills
  // 3. Explicit installation makes the process more transparent and predictable
  const skillFlags = skillsToInstall.map((skill) => `--skill ${skill}`).join(' ');
  const addCommand = ['npx skills add', sourceRepo, '--agent claude-code', skillFlags, '-y'].join(
    ' '
  );

  const addResult = runCommand(addCommand);
  if (!addResult.success) {
    log('red', '✗ Failed to add skills');
    process.exit(1);
  }
  log('green', '✓ Skills added for Claude Code');
  console.log('');

  // Step 3: Create .claude directory and settings files
  log('yellow', 'Step 4: Configuring .claude/settings.json...');
  const claudeDir = path.join(projectRoot, '.claude');

  if (!fs.existsSync(claudeDir)) {
    fs.mkdirSync(claudeDir, { recursive: true });
  }

  // settings.json (project-level settings, committed to git)
  const settingsJsonPath = path.join(claudeDir, 'settings.json');
  const settingsJsonContent = {
    permissions: {
      allow: ['Bash(pnpm run:*)'],
    },
  };

  if (!fs.existsSync(settingsJsonPath)) {
    fs.writeFileSync(settingsJsonPath, JSON.stringify(settingsJsonContent, null, 2));
    log('green', '✓ Created .claude/settings.json');
  } else {
    log('blue', 'ℹ .claude/settings.json already exists');
  }
  console.log('');

  // Step 4: Verify installation
  log('yellow', 'Step 5: Verifying installation...');
  const listResult = runCommand('npx skills list --json', { silent: true });
  if (listResult.success && listResult.output) {
    try {
      const skills = JSON.parse(listResult.output.trim());
      skills.forEach((skill) => {
        log('green', `  ✓ ${skill.name}`);
      });
    } catch (e) {
      // If JSON parsing fails, just run the normal list command
      runCommand('npx skills list');
    }
  } else {
    runCommand('npx skills list');
  }
  console.log('');

  // Completion message
  log('green', '========================================');
  log('green', '  Skills Setup Complete!');
  log('green', '========================================');
  console.log('');
  log('blue', "What's been configured:");
  console.log('  • Skills installed from', sourceRepo);
  console.log('  • Skills mapped to Claude Code agent');
  console.log('  • Skills located in .claude/skills/');
  console.log('');
  log('yellow', 'Next steps:');
  console.log("  1. Restart Claude Code if it's already running");
  console.log('  2. Open /hooks to verify skills are loaded');
  console.log('');
}

// Command: list
function listSkills() {
  runCommand('npx skills list');
}

// Command: check
function check() {
  runCommand('npx skills check');
}

// Command: update
function update() {
  runCommand('npx skills update');
}

// Command: help
function showHelp() {
  console.log('');
  log('blue', 'Saikuru Skills Management');
  console.log('');
  log('yellow', 'Usage:');
  console.log('  pnpm run skills <command>');
  console.log('');
  log('yellow', 'Commands:');
  console.log('  install  - Install and configure skills for Claude Code');
  console.log('  list     - List installed skills');
  console.log('  check    - Check for skill updates');
  console.log('  update   - Update all skills to latest versions');
  console.log('  help     - Show this help message');
  console.log('');
  log('yellow', 'Examples:');
  console.log('  pnpm run skills install');
  console.log('  pnpm run skills list');
  console.log('  pnpm run skills update');
  console.log('');
}

// Main function
function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';

  switch (command) {
    case 'install':
      install();
      break;
    case 'list':
      listSkills();
      break;
    case 'check':
      check();
      break;
    case 'update':
      update();
      break;
    case 'help':
    default:
      showHelp();
      break;
  }
}

// Run
main();
