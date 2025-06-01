export const getFileType = (filename: string): { type: string; icon: string } => {
  const extension = filename.toLowerCase().split('.').pop() || '';
  
  const fileTypes: Record<string, { type: string; icon: string }> = {
    'txt': { type: 'Plain Text', icon: '📄' },
    'html': { type: 'HTML Document', icon: '🌐' },
    'htm': { type: 'HTML Document', icon: '🌐' },
    'md': { type: 'Markdown', icon: '📝' },
    'markdown': { type: 'Markdown', icon: '📝' },
    'rtf': { type: 'Rich Text Format', icon: '📄' },
    'csv': { type: 'CSV Data', icon: '📊' },
    'json': { type: 'JSON Data', icon: '🔧' },
    'xml': { type: 'XML Document', icon: '📋' },
    'js': { type: 'JavaScript', icon: '⚡' },
    'jsx': { type: 'React JavaScript', icon: '⚛️' },
    'ts': { type: 'TypeScript', icon: '🔷' },
    'tsx': { type: 'React TypeScript', icon: '⚛️' },
    'py': { type: 'Python', icon: '🐍' },
    'java': { type: 'Java', icon: '☕' },
    'cpp': { type: 'C++', icon: '⚙️' },
    'c': { type: 'C', icon: '⚙️' },
    'css': { type: 'CSS Stylesheet', icon: '🎨' },
    'php': { type: 'PHP', icon: '🐘' },
    'rb': { type: 'Ruby', icon: '💎' },
    'go': { type: 'Go', icon: '🚀' },
    'rs': { type: 'Rust', icon: '🦀' },
    'yml': { type: 'YAML Config', icon: '⚙️' },
    'yaml': { type: 'YAML Config', icon: '⚙️' },
    'log': { type: 'Log File', icon: '📜' },
    'ini': { type: 'Config File', icon: '⚙️' },
    'cfg': { type: 'Config File', icon: '⚙️' },
    'conf': { type: 'Config File', icon: '⚙️' }
  };

  return fileTypes[extension] || { type: 'Text Document', icon: '📄' };
};

export const getDocumentStats = (content: string) => {
  if (!content) return { characters: 0, words: 0, lines: 0 };
  
  const characters = content.length;
  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const lines = content.split('\n').length;
  
  return { characters, words, lines };
};

export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
