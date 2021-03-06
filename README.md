# Brunch with js
This is a technical demo with [Brunch](http://brunch.io/).

Main languages are JavaScript,
[Stylus](http://learnboost.github.com/stylus/) and
[Handlebars](http://handlebarsjs.com/).

## Overview

    config.coffee
    README.md
    /app/
      /assets/
        index.html
        images/
      /lib/
      models/
      styles/
      views/
        templates/
      application.js
      initialize.js
    /test/
    /vendor/
      scripts/
        backbone.js
        jquery.js
        console-helper.js
        underscore.js
      styles/
        normalize.css
        helpers.css

* `config.coffee` contains configuration of the app.
* `app/assets` contains images / static files.
Other `app/` directories could contain files that would be compiled. Languages,
that compile to JS (coffeescript, roy etc.) or js files and located in app are 
automatically wrapped in module closure so they can be loaded by 
`require('module/location')`.
* `app/models` & `app/views` contain base classes of the app.
* `test/` can contains feature & unit tests.
* `vendor/` contains all third-party code. The code wouldn’t be wrapped in
modules, it would be loaded instantly instead.

This all will generate `public/` (by default) directory when `brunch build` or `brunch watch` is executed.

## Other
Versions of software the skeleton uses:

* jQuery 2.0.3
* normalize-css 2.1.2
* Backbone 1.0.0
* lodash 1.3.1
* HTML5Boilerplate 3.0.3