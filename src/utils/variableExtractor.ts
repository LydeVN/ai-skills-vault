import type { SkillVariable } from '../types/skill';

/**
 * Extracts all unique {{variable_name}} occurrences from a template string
 */
export function extractVariables(content: string): SkillVariable[] {
  const regex = /\{\{([a-zA-Z0-9_\s]+)\}\}/g;
  const matches = new Set<string>();
  let match;

  while ((match = regex.exec(content)) !== null) {
    const rawName = match[1].trim();
    if (rawName) {
      matches.add(rawName);
    }
  }

  return Array.from(matches).map(name => ({
    name,
    label: formatVariableLabel(name),
    defaultValue: '',
    description: `Value for ${name}`,
  }));
}

/**
 * Turns snake_case or camelCase into Title Case label
 */
function formatVariableLabel(name: string): string {
  return name
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

/**
 * Replaces {{variable}} placeholders with corresponding values
 */
export function compileTemplate(content: string, values: Record<string, string>): string {
  let result = content;
  for (const [key, val] of Object.entries(values)) {
    const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
    result = result.replace(regex, val || `{{${key}}}`);
  }
  return result;
}
