/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

export const pageRedirects = new Map([
  ['/slack-invite',                   'https://join.slack.com/t/lit-and-friends/shared_invite/zt-llwznvsy-LZwT13R66gOgnrg12PUGqw'],
  ['/msg/dev-mode',                   '/docs/tools/development/#development-and-production-builds'],
  // TODO(sorvell) https://github.com/lit/lit.dev/issues/455
  ['/msg/multiple-versions',          '/docs/tools/requirements/'],
  ['/msg/polyfill-support-missing',   '/docs/tools/requirements/#polyfills'],
  ['/msg/class-field-shadowing',      '/docs/components/properties/#avoiding-issues-with-class-fields'],
  // TODO(aomarks) Should we add something specifically about this issue?
  ['/msg/change-in-update',           '/docs/components/properties/#when-properties-change'],
  ['/msg/deprecated-import-path',     '/docs/releases/upgrade/#update-packages-and-import-paths'],
  ['/msg/removed-api',                '/docs/releases/upgrade/#litelement'],
  ['/msg/renamed-api',                '/docs/releases/upgrade/#update-to-renamed-apis'],
  ['/msg/undefined-attribute-value',  '/docs/releases/upgrade/#litelement'],
  ['/msg/request-update-promise',     '/docs/releases/upgrade/#litelement'],
  ['/msg/expression-in-template',     '/docs/templates/expressions/#invalid-locations'],
  ['/msg/expression-in-textarea',     '/docs/templates/expressions/#invalid-locations'],
  // Relocated pages
  ['/docs/libraries/localization',    '/docs/localization/overview/'],
  ['/blog/feed.xml',                  '/blog/atom.xml'],
  // Urls not ending with '/' violate CSP policies.
  ['/docs/releases/release-notes/1.3.0.html', '/docs/releases/release-notes/1.3.0/'],
  ['/docs/releases/release-notes/1.2.0.html', '/docs/releases/release-notes/1.2.0/'],
  // `.0` is treated as a file extension, ensure it resolves correctly.
  ['/docs/releases/release-notes/1.3.0',      '/docs/releases/release-notes/1.3.0/'],
  ['/docs/releases/release-notes/1.2.0',      '/docs/releases/release-notes/1.2.0/']
].map(([path, redir]) => [
  // Trailing slashes are required because this redirect map is consulted after
  // standard lit.dev path canonicalization.
  path.match(/\/[^\/\.]+$/) ? path + '/' : path,
  redir,
]));

export const oldLitHtmlSiteRedirects = new Map([
  ['/',                          '/'],

  ['/guide',                     '/docs/v1/lit-html/introduction/'],
  ['/guide/getting-started',     '/docs/v1/lit-html/getting-started/'],
  ['/guide/writing-templates',   '/docs/v1/lit-html/writing-templates/'],
  ['/guide/styling-templates',   '/docs/v1/lit-html/styling-templates/'],
  ['/guide/rendering-templates', '/docs/v1/lit-html/rendering-templates/'],
  ['/guide/creating-directives', '/docs/v1/lit-html/creating-directives/'],
  ['/guide/template-reference',  '/docs/v1/lit-html/template-reference/'],
  ['/guide/concepts',            '/docs/v1/lit-html/concepts/'],
  ['/guide/tools',               '/docs/v1/lit-html/tools/'],
  ['/guide/community',           '/docs/v1/resources/community/'],

  ['/api/index.html',                                            '/docs/v1/api/lit-html/templates/'],
  ['/api/globals.html',                                          '/docs/v1/api/lit-html/templates/'],
  ['/api/classes/_lib_shady_render_.templateresult.html',        '/docs/v1/api/lit-html/templates/#TemplateResult'],
  ['/api/classes/_lit_html_.attributecommitter.html',            '/docs/v1/api/lit-html/custom-directives/#AttributeCommitter'],
  ['/api/classes/_lit_html_.attributepart.html',                 '/docs/v1/api/lit-html/custom-directives/#AttributePart'],
  ['/api/classes/_lit_html_.booleanattributepart.html',          '/docs/v1/api/lit-html/custom-directives/#BooleanAttributePart'],
  ['/api/classes/_lit_html_.defaulttemplateprocessor.html',      '/docs/v1/api/lit-html/custom-directives/#DefaultTemplateProcessor'],
  ['/api/classes/_lit_html_.eventpart.html',                     '/docs/v1/api/lit-html/custom-directives/#EventPart'],
  ['/api/classes/_lit_html_.nodepart.html',                      '/docs/v1/api/lit-html/custom-directives/#NodePart'],
  ['/api/classes/_lit_html_.propertycommitter.html',             '/docs/v1/api/lit-html/custom-directives/#PropertyCommitter'],
  ['/api/classes/_lit_html_.propertypart.html',                  '/docs/v1/api/lit-html/custom-directives/#PropertyPart'],
  ['/api/classes/_lit_html_.svgtemplateresult.html',             '/docs/v1/api/lit-html/templates/#SVGTemplateResult'],
  ['/api/classes/_lit_html_.template.html',                      '/docs/v1/api/lit-html/custom-directives/#Template'],
  ['/api/classes/_lit_html_.templateinstance.html',              '/docs/v1/api/lit-html/custom-directives/#TemplateInstance'],
  ['/api/classes/_lit_html_.templateresult.html',                '/docs/v1/api/lit-html/templates/#TemplateResult'],
  ['/api/interfaces/_lib_shady_render_.shadyrenderoptions.html', '/docs/v1/api/lit-html/shady/#ShadyRenderOptions'],
  ['/api/interfaces/_lit_html_.part.html',                       '/docs/v1/api/lit-html/custom-directives/#Part'],
  ['/api/interfaces/_lit_html_.renderoptions.html',              '/docs/v1/api/lit-html/templates/#RenderOptions'],
  ['/api/interfaces/_lit_html_.templateprocessor.html',          '/docs/v1/api/lit-html/custom-directives/#TemplateProcessor'],
  ['/api/modules/_lib_shady_render_.html',                       '/docs/v1/api/lit-html/shady/'],
  ['/api/modules/_lit_html_.html',                               '/docs/v1/api/lit-html/templates/'],
]);

export const oldLitElementSiteRedirects = new Map([
  ['/',                 '/'],

  ['/guide',            '/docs/v1/'],
  ['/guide/start',      '/docs/v1/getting-started/'],
  ['/guide/templates',  '/docs/v1/components/templates/'],
  ['/guide/styles',     '/docs/v1/components/styles/'],
  ['/guide/properties', '/docs/v1/components/properties/'],
  ['/guide/events',     '/docs/v1/components/events/'],
  ['/guide/lifecycle',  '/docs/v1/components/lifecycle/'],
  ['/guide/decorators', '/docs/v1/components/decorators/'],
  ['/guide/publish',    '/docs/v1/tools/publish/'],
  ['/guide/use',        '/docs/v1/tools/use/'],
  ['/guide/build',      '/docs/v1/tools/build/'],
  ['/guide/community',  '/docs/v1/resources/community/'],

  ['/try',              '/tutorial/'],
  ['/try/create',       '/tutorial/'],
  ['/try/properties',   '/tutorial/'],
  ['/try/logic',        '/tutorial/'],
  ['/try/events',       '/tutorial/'],
  ['/try/style',        '/tutorial/'],

  ['/api/index.html',                                                       '/docs/v1/api/lit-element/LitElement/'],
  ['/api/globals.html',                                                     '/docs/v1/api/lit-element/LitElement/'],
  ['/api/classes/_lib_updating_element_.updatingelement.html',              '/docs/v1/api/lit-element/UpdatingElement/#UpdatingElement'],
  ['/api/classes/_lit_element_.cssresult.html',                             '/docs/v1/api/lit-element/styles/#CSSResult'],
  ['/api/classes/_lit_element_.litelement.html',                            '/docs/v1/api/lit-element/LitElement/#LitElement'],
  ['/api/classes/_lit_element_.svgtemplateresult.html',                     '/docs/v1/api/lit-html/templates/#SVGTemplateResult'],
  ['/api/classes/_lit_element_.templateresult.html',                        '/docs/v1/api/lit-html/templates/#TemplateResult'],
  ['/api/classes/_lit_element_.updatingelement.html',                       '/docs/v1/api/lit-element/UpdatingElement/#UpdatingElement'],
  ['/api/interfaces/_lib_updating_element_.complexattributeconverter.html', '/docs/v1/api/lit-element/UpdatingElement/#ComplexAttributeConverter'],
  ['/api/interfaces/_lib_updating_element_.haschanged.html',                '/docs/v1/api/lit-element/UpdatingElement/#HasChanged'],
  ['/api/interfaces/_lib_updating_element_.propertydeclaration.html',       '/docs/v1/api/lit-element/UpdatingElement/#PropertyDeclaration'],
  ['/api/interfaces/_lib_updating_element_.propertydeclarations.html',      '/docs/v1/api/lit-element/UpdatingElement/#PropertyDeclarations'],
  ['/api/interfaces/_lit_element_.complexattributeconverter.html',          '/docs/v1/api/lit-element/UpdatingElement/#ComplexAttributeConverter'],
  ['/api/interfaces/_lit_element_.cssresultarray.html',                     '/docs/v1/api/lit-element/styles/#CSSResultArray'],
  ['/api/interfaces/_lit_element_.haschanged.html',                         '/docs/v1/api/lit-element/UpdatingElement/#HasChanged'],
  ['/api/interfaces/_lit_element_.internalpropertydeclaration.html',        '/docs/v1/api/lit-element/decorators/#InternalPropertyDeclaration'],
  ['/api/interfaces/_lit_element_.propertydeclaration.html',                '/docs/v1/api/lit-element/UpdatingElement/#PropertyDeclaration'],
  ['/api/interfaces/_lit_element_.propertydeclarations.html',               '/docs/v1/api/lit-element/UpdatingElement/#PropertyDeclarations'],
  ['/api/modules/_lib_updating_element_.html',                              '/docs/v1/api/lit-element/UpdatingElement/'],
  ['/api/modules/_lit_element_.html',                                       '/docs/v1/api/lit-element/LitElement/'],
]);
