# QNCE Experimental Development Configuration

## Terminal Commands
- Always use `isBackground: false` for npm run dev
- Use foreground mode to avoid directory navigation issues
- Terminal working directory should be explicitly set

## VS Code Tasks
- Development server: Foreground mode with proper cwd
- Build commands: Foreground mode for better error visibility
- Type checking: Foreground mode with TypeScript problem matcher

## Best Practices
1. Use `run_in_terminal` with `isBackground: false` for all npm commands
2. Use `run_vs_code_task` for structured build processes
3. Always verify directory with `pwd` before running commands
4. Use explicit `cd` commands when necessary

## Current Setup
- Main workspace: /Users/ball/VSE-WS/
- Experimental repo: /Users/ball/VSE-WS/qnce-experimental/
- Dev server: http://localhost:3000 (foreground mode)
