# Abstracts

The `abstracts/` folder gathers all Sass tools and helpers used across the project. Every global variable, function, mixin and placeholder should be put in here.

The rule of thumb for this folder is that it should not output a single line of CSS when compiled on its own. These are nothing but Sass helpers.

When working on a very large project with a lot of abstract utilities, it might be interesting to group them by topic rather than type, for instance typography (_typography.scss), 
theming (_theming.scss), etc. Each file contains all the related helpers: variables, functions, mixins, and placeholders.

The `abstracts/` folder might also be called `utilities/` or `helpers/`, depending on what you prefer.
Reference: [Sass Guidelines](https://sass-guidelin.es/) > [Architecture](https://sass-guidelin.es/#architecture) > [Abstracts folder](https://sass-guidelin.es/#abstracts-folder)
