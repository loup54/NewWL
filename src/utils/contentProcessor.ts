
export const cleanRTFContent = (content: string): string => {
  if (!content) return '';
  
  // Remove RTF control codes and formatting
  let cleanedContent = content
    // Remove RTF header and version info
    .replace(/\\rtf\d+/g, '')
    .replace(/\\ansi/g, '')
    .replace(/\\ansicpg\d+/g, '')
    .replace(/\\cocoartf\d+/g, '')
    .replace(/\\deff\d+/g, '')
    .replace(/\\deflang\d+/g, '')
    .replace(/\\uc\d+/g, '')
    .replace(/\\margl\d+/g, '')
    .replace(/\\margr\d+/g, '')
    .replace(/\\margt\d+/g, '')
    .replace(/\\margb\d+/g, '')
    // Remove font table and color table
    .replace(/\\fonttbl[^}]*}/g, '')
    .replace(/\\colortbl[^}]*}/g, '')
    .replace(/\\stylesheet[^}]*}/g, '')
    .replace(/\\info[^}]*}/g, '')
    .replace(/\\generator[^}]*}/g, '')
    // Remove font formatting
    .replace(/\\f\d+/g, '')
    .replace(/\\fs\d+/g, '')
    .replace(/\\cf\d+/g, '')
    .replace(/\\cb\d+/g, '')
    .replace(/\\highlight\d+/g, '')
    .replace(/\\chcbpat\d+/g, '')
    .replace(/\\chcfpat\d+/g, '')
    // Remove paragraph formatting
    .replace(/\\par\b/g, '\n')
    .replace(/\\pard/g, '')
    .replace(/\\pardeftab\d+/g, '')
    .replace(/\\sl\d+/g, '')
    .replace(/\\slmult\d+/g, '')
    .replace(/\\sb\d+/g, '')
    .replace(/\\sa\d+/g, '')
    .replace(/\\fi\d+/g, '')
    .replace(/\\li\d+/g, '')
    .replace(/\\ri\d+/g, '')
    .replace(/\\qc/g, '')
    .replace(/\\ql/g, '')
    .replace(/\\qr/g, '')
    .replace(/\\qj/g, '')
    // Remove text formatting
    .replace(/\\b\b/g, '')
    .replace(/\\b0/g, '')
    .replace(/\\i\b/g, '')
    .replace(/\\i0/g, '')
    .replace(/\\ul\b/g, '')
    .replace(/\\ulnone/g, '')
    .replace(/\\strike\b/g, '')
    .replace(/\\striked\d+/g, '')
    .replace(/\\scaps/g, '')
    .replace(/\\caps/g, '')
    .replace(/\\outl/g, '')
    .replace(/\\shad/g, '')
    // Remove special characters and spacing
    .replace(/\\tab/g, '\t')
    .replace(/\\line/g, '\n')
    .replace(/\\page/g, '\n\n')
    .replace(/\\sect/g, '')
    .replace(/\\sectd/g, '')
    .replace(/\\endash/g, '–')
    .replace(/\\emdash/g, '—')
    .replace(/\\lquote/g, "'")
    .replace(/\\rquote/g, "'")
    .replace(/\\ldblquote/g, '"')
    .replace(/\\rdblquote/g, '"')
    .replace(/\\bullet/g, '•')
    // Remove Unicode sequences
    .replace(/\\u\d+\\?/g, '')
    .replace(/\\u-?\d+/g, '')
    // Remove remaining control words with parameters
    .replace(/\\[a-zA-Z]+\d+/g, '')
    // Remove remaining control words without parameters
    .replace(/\\[a-zA-Z]+/g, '')
    // Remove remaining control symbols
    .replace(/\\[^a-zA-Z\s\n]/g, '')
    // Clean up braces and extra formatting
    .replace(/[{}]/g, '')
    .replace(/\\\\/g, '\\')
    // Clean up whitespace
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    // Final trim
    .trim();

  return cleanedContent;
};
