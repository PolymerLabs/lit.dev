const markdownIt = require('markdown-it');
const pluginTOC = require('eleventy-plugin-nesting-toc');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItAttrs = require('markdown-it-attrs');
const slugifyLib = require('slugify');
const path = require('path');
const eleventyNavigationPlugin = require('@11ty/eleventy-navigation');
const {playgroundPlugin} = require('./playground-plugin/plugin.js');
const htmlMinifier = require('html-minifier');

// Use the same slugify as 11ty for markdownItAnchor. It's similar to Jekyll,
// and preserves the existing URL fragments
const slugify = (s) => slugifyLib(s, {lower: true});

module.exports = function (eleventyConfig) {
  // https://github.com/JordanShurmer/eleventy-plugin-toc#readme
  eleventyConfig.addPlugin(pluginTOC, {
    tags: ['h2', 'h3'],
    wrapper: 'div',
    wrapperClass: '',
  });
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(playgroundPlugin);
  eleventyConfig.addPassthroughCopy('site/css');
  eleventyConfig.addPassthroughCopy({
    'node_modules/codemirror/lib/codemirror.css': './css/codemirror.css',
  });
  eleventyConfig.addPassthroughCopy('site/images/**/*');
  eleventyConfig.addPassthroughCopy('api/**/*');
  eleventyConfig.addPassthroughCopy({'site/_includes/projects': 'samples'});
  eleventyConfig.addPassthroughCopy({
    'node_modules/code-sample-editor/typescript-worker.js':
      './typescript-worker.js',
  });
  eleventyConfig.addPassthroughCopy({
    'node_modules/code-sample-editor/service-worker.js': './service-worker.js',
  });

  const md = markdownIt({html: true, breaks: true, linkify: true})
    .use(markdownItAttrs)
    .use(markdownItAnchor, {slugify, permalink: false});
  eleventyConfig.setLibrary('md', md);

  eleventyConfig.addFilter('removeExtension', function (url) {
    const extension = path.extname(url);
    return url.substring(0, url.length - extension.length);
  });

  eleventyConfig.addCollection('guide', function (collection) {
    // Order the 'guide' collection by filename, which includes a number prefix.
    // We could also order by a frontmatter property
    // console.log(
    //   'guide',
    //   collection.getFilteredByGlob('site/guide/**')
    //     .map((f) => `${f.inputPath}, ${f.fileSlug}, ${f.data.slug}, ${f.data.slug.includes('/')}`));

    return (
      collection
        .getFilteredByGlob('site/guide/**')
        // .filter((f) => !f.data.slug?.includes('/'))
        .sort(function (a, b) {
          if (a.fileSlug == 'guide') {
            return -1;
          }
          if (a.fileSlug < b.fileSlug) {
            return -1;
          }
          if (b.fileSlug < a.fileSlug) {
            return 1;
          }
          return 0;
        })
    );
  });

  eleventyConfig.addTransform('htmlMinify', function (content, outputPath) {
    if (!outputPath.endsWith('.html')) {
      return content;
    }
    const minified = htmlMinifier.minify(content, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true,
    });
    return minified;
  });

  return {
    dir: {input: 'site', output: '_site'},
    htmlTemplateEngine: 'njk',
  };
};
