
// Required dependencies:
// npm install markdown-it highlight.js
// npm install --save-dev @types/markdown-it

import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css'; // Or any other theme

const md = new MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
               hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
               '</code></pre>';
      } catch (__) {}
    }

    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
});

interface MarkdownRendererProps {
  markdown: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown }) => {
  const htmlContent = md.render(markdown);

  return (
    <div className="prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
};

export default MarkdownRenderer;
