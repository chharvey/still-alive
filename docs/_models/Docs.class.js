var Page = require('sitepage').Page

module.exports = (function () {
  // CONSTRUCTOR
  /**
   * A set of static members used for the site style guide.
   * Similar to a utility class.
   * @constructor
   */
  function Docs() {}

  // METHODS

  // STATIC MEMBERS
  /**
   * The style guide site for this project.
   * @type {Page}
   */
  Docs.DOCS = new Page({ name: 'Site Design', url: '/docs/' })
    .title('Portfolio Style Guide')
    .add(new Page({ name: 'Home', url: '/docs/index.html' })
      .description('Site Design Homepage')
    )
    .add(new Page({ name: 'Mathematical Background', url: '/docs/phi.html'}))
    .add(new Page({ name: 'Coding Style', url: '/docs/code.html' })
      .add(new Page({ name: 'Textual Structure', url: '/docs/code.html#textual-structure' })
        .add(new Page({ name: 'Whitespace'               , url: '/docs/code.html#whitespace' }))
        .add(new Page({ name: 'Line Breaks & Line Length', url: '/docs/code.html#line-breaks-line-length' }))
        .add(new Page({ name: 'Indentation'              , url: '/docs/code.html#indentation' }))
        .add(new Page({ name: 'HTML Specifics & Example' , url: '/docs/code.html#html-specifics-example' }))
        .add(new Page({ name: 'CSS Specifics & Example'  , url: '/docs/code.html#css-specifics-example' }))
      )
      .add(new Page({ name: 'Code Formatting', url: '/docs/code.html#code-formatting' })
        .add(new Page({ name: 'HTML Specifics'    , url: '/docs/code.html#html-specifics' }))
        .add(new Page({ name: 'CSS/Less Specifics', url: '/docs/code.html#css-less-specifics' }))
        .add(new Page({ name: 'JS Specifics'      , url: '/docs/code.html#js-specifics' }))
      )
      .add(new Page({ name: 'Accessibility', url: '/docs/code.html#accessibility' }))
      .add(new Page({ name: 'Optimization' , url: '/docs/code.html#optimization' }))
      .add(new Page({ name: 'Commenting'   , url: '/docs/code.html#commenting' })
        .add(new Page({ name: 'Formatting', url: '/docs/code.html#formatting' }))
        .add(new Page({ name: 'Usage'     , url: '/docs/code.html#usage' })
          .add(new Page({ name: 'Architectural', url: '/docs/code.html#architectural' }))
          .add(new Page({ name: 'Structural'   , url: '/docs/code.html#structural' }))
          .add(new Page({ name: 'Developmental', url: '/docs/code.html#developmental' }))
        )
      )
      .add(new Page({ name: 'File Anatomy', url: '/docs/code.html#file-anatomy' })
        .add(new Page({ name: 'CSS Stylesheets', url: '/docs/code.html#css-stylesheets' })
          .add(new Page({ name: 'Repository Metadata'            , url: '/docs/code.html#repository-metadata' }))
          .add(new Page({ name: 'Direct CSS Imports'             , url: '/docs/code.html#direct-css-imports' }))
          .add(new Page({ name: 'Filename'                       , url: '/docs/code.html#filename' }))
          .add(new Page({ name: 'Less Imports'                   , url: '/docs/code.html#less-imports' }))
          .add(new Page({ name: 'Table of Contents'              , url: '/docs/code.html#table-contents' }))
          .add(new Page({ name: 'Section and Subsection Headings', url: '/docs/code.html#section-and-subsection-headings' }))
        )
      )
    )
    .add(new Page({ name: 'Principles', url: '/docs/principles.html' })
      .add(new Page({ name: 'Typeface Scheme' , url: '/docs/principles.html#typeface-scheme' }))
      .add(new Page({ name: 'Color Scheme'    , url: '/docs/principles.html#color-scheme' }))
    )
    .add(new Page({ name: 'Base Typography', url: '/docs/base.html' })
      .description('Bare, unstyled HTML elements. No classes.')
      .add(new Page({ name: 'Grouping Elements', url: '/docs/base.html#grouping-elements' })
        .add(new Page({ name: 'Headings & Paragraphs', url: '/docs/base.html#headings-paragraphs' }))
        .add(new Page({ name: 'Lists'                , url: '/docs/base.html#lists' }))
        .add(new Page({ name: 'Tables'               , url: '/docs/base.html#tables' }))
      )
      .add(new Page({ name: 'Text-Level Elements', url: '/docs/base.html#text-level-elements' })
        .add(new Page({ name: 'Links'        , url: '/docs/base.html#links' }))
        .add(new Page({ name: 'Stress'       , url: '/docs/base.html#stress' }))
        .add(new Page({ name: 'Documentation', url: '/docs/base.html#documentation' }))
        .add(new Page({ name: 'Data'         , url: '/docs/base.html#data' }))
      )
      .add(new Page({ name: 'Forms'               , url: '/docs/base.html#forms' }))
      .add(new Page({ name: 'Embedded Elements'   , url: '/docs/base.html#embedded-elements' }))
      .add(new Page({ name: 'Interactive Elements', url: '/docs/base.html#interactive-elements' }))
    )
    .add(new Page({ name: 'Objects', url: '/docs/obj.html' })
      .add(new Page({ name: 'The Box Object'      , url: '/docs/obj.html#box-object' }))
      .add(new Page({ name: 'The Textbox Object'  , url: '/docs/obj.html#textbox-object' }))
      .add(new Page({ name: 'The Golden Container', url: '/docs/obj.html#golden-container' })
        .add(new Page({ name: 'The Flipped Golden Container', url: '/docs/obj.html#flipped-golden-container' }))
      )
    )
    .add(new Page({ name: 'Typo Components', url: '/docs/comp-typo.html' })
      .description('These are components of a typographical, static nature.')
      .add(new Page({ name: 'The Subhead Component'           , url: '/docs/comp-typo.html#subhead-component' }))
      .add(new Page({ name: 'The Folio Title Component'       , url: '/docs/comp-typo.html#folio-title-component' }))
      .add(new Page({ name: 'The Lede and Drop Cap Components', url: '/docs/comp-typo.html#lede-drop-cap-components' }))
      .add(new Page({ name: 'The Caption Component'           , url: '/docs/comp-typo.html#caption-component' }))
      .add(new Page({ name: 'The Pull Quote Component'        , url: '/docs/comp-typo.html#pull-quote-component' }))
      .add(new Page({ name: 'The Action List Component'       , url: '/docs/comp-typo.html#action-list-component' }))
      .add(new Page({ name: 'The Footnotes List Component'    , url: '/docs/comp-typo.html#footnotes-list-component' }))
      .add(new Page({ name: 'Components for Tables'           , url: '/docs/comp-typo.html#components-for-tables' }))
      .add(new Page({ name: 'The Document Component'          , url: '/docs/comp-typo.html#document-component' })
        .add(new Page({ name: 'Document Meta', url: '/docs/comp-typo.html#document-meta' }))
      )
      .add(new Page({ name: 'Text-Level Components', url: '/docs/comp-typo.html#text-level-components' })
        .add(new Page({ name: 'Acronyms'  , url: '/docs/comp-typo.html#acronyms' }))
        .add(new Page({ name: 'Camo Links', url: '/docs/comp-typo.html#camo-links' }))
      )
      .add(new Page({ name: 'Breadcrumbs', url: '/docs/comp-typo.html#breadcrumbs' }))
    )
    .add(new Page({ name: 'UI Components', url: '/docs/comp-ui.html' })
      .description('These are components of a user-interactive nature.')
      .add(new Page({ name: 'The Alert Component'  , url: '/docs/comp-ui.html#alert-component' }))
      .add(new Page({ name: 'The Label Component'  , url: '/docs/comp-ui.html#label-component' }))
      .add(new Page({ name: 'The Badge Component'  , url: '/docs/comp-ui.html#badge-component' }))
      .add(new Page({ name: 'Text-Level Components', url: '/docs/comp-ui.html#text-level-components' })
        .add(new Page({ name: 'The Key Component', url: '/docs/comp-ui.html#key-component' }))
      )
    )
    .add(new Page({ name: 'Helpers', url: '/docs/help.html' })
      .add(new Page({ name: 'The After* Helpers', url: '/docs/help.html#after-helpers' }))
      .add(new Page({ name: 'crossgrid-lined'   , url: '/docs/help.html#crossgrid-lined' }))
    )
    .add(new Page({ name: 'Atoms', url: '/docs/atom.html' })
      .add(new Page({ name: 'Font Families', url: '/docs/atom.html#font-families' }))
      .add(new Page({ name: 'Font Sizes'   , url: '/docs/atom.html#font-sizes' }))
      .add(new Page({ name: 'Colors'       , url: '/docs/atom.html#colors' }))
    )

  /**
   * Set of fonts used on the site.
   * @type {Object}
   */
  Docs.FONT_SCHEME = {
    base : {
      name    : 'Avenir Next'
    , class   : 'a-ff-base'
    , sample  : 'The quick brown fox jumps over the lazy dog.'
    , similar : [ 'Helvetica Neue' ]
    }
  , heading : {
      name    : 'Optima'
    , class   : 'a-ff-heading'
    , sample  : 'Oh, sphinx of black quartz, judge my vow.'
    , similar : [ 'Seravek' , 'Tahoma' ]
    }
  , prose : {
      name    : 'Baskerville'
    , class   : 'a-ff-prose'
    , sample  : 'The five boxing wizards jump quickly.'
    , similar : [ 'Palatino' , 'Cochin' ]
    }
  , accent : {
      name    : 'Helvetica Neue'
    , class   : 'a-ff-accent'
    , sample  : 'Heavy boxes perform quick waltzes and jigs.'
    , similar : [ 'Helvetica' ]
    }
  , code : {
      name    : 'Menlo'
    , class   : 'a-ff-code'
    , sample  : 'The quick brown fox jumps over the lazy dog.'
    , similar : [ 'Monaco' , 'Andale Mono' ]
    }
  , math : {
      name    : 'Didot'
    , class   : 'a-ff-math'
    , sample  : 'Sixty zippers were quickly picked from the woven jute bag.'
    , similar : [ 'Bodoni 72' , 'Times' ]
    }
  , script : {
      name    : 'Zapfino'
    , class   : 'a-ff-script'
    , sample  : 'The quick brown fox jumps over the lazy dog.'
    }
  }

  /**
   * Set of colors used on the site.
   * @type {Object}
   */
  Docs.COLOR_SCHEME = {
    aperturewhite : {
      name        : 'Aperture White'
    , code_dfn    : 'hsv(217,   5%, 100%)'
    , code_hex    : '#f2f7ff'
    , bg_class    : 'a-bc-aperturewhite'
    , uses        : [ 'body background' ]
    }
  , apertureblack : {
      name        : 'Aperture Black'
    , code_dfn    : 'hsv( 37, 100%,   5%)'
    , code_hex    : '#0d0800'
    , bg_class    : 'a-bc-apertureblack'
    , is_dark     : true
    , uses        : [ 'body text' ]
    }
  , lakesuperior : {
      name        : 'Lake Superior'
    , code_dfn    : 'hsv(247, 100%,  60%)'
    , code_hex    : '#120099'
    , bg_class    : 'a-bc-lakesuperior'
    , is_dark     : true
    , uses        : [ 'major heading text' , 'ledes and drop caps' ]
    }
  , facilityabyss : {
      name        : 'Facility Abyss'
    , code_dfn    : 'hsv(187,  40%,  40%)'
    , code_hex    : '#3d6166'
    , bg_class    : 'a-bc-facilityabyss'
    , is_dark     : true
    , uses        : [ 'minor heading text' ]
    }
  , atlas : {
      name        : 'Atlas'
    , code_dfn    : 'hsv(217, 100%, 100%)'
    , code_hex    : '#0062ff'
    , bg_class    : 'a-bc-atlas'
    , is_dark     : true
    , uses        : [ 'link text' ]
    }
  , pbody : {
      name     : 'P-Body'
    , code_dfn : 'hsv( 37, 100%, 100%)'
    , code_hex : '#ff9d00'
    , bg_class : 'a-bc-pbody'
    , uses     : [ 'hover link text' ]
    }
  , cavescaves : {
      name     : 'Cave’s Caves'
    , code_dfn : 'hsv( 28,  66.6%,  50%)'
    , code_hex : '#80522b'
    , bg_class : 'a-bc-cavescaves'
    , is_dark  : true
    }
  , asbestos : {
      name     : 'Asbestos'
    , code_dfn : 'hsv( 46, 100.0%,  75%)'
    , code_hex : '#bf9300'
    , bg_class : 'a-bc-asbestos'
    }
  , repulsion : {
      name     : 'Repulsion Gel'
    , code_dfn : 'hsv(202,  80.0%, 100%)'
    , code_hex : '#33b4ff'
    , bg_class : 'a-bc-repulsion'
    , uses     : [ 'code/kbd/samp on print' ]
    }
  , propulsion : {
      name     : 'Propulsion Gel'
    , code_dfn : 'hsv( 22,  80.0%, 100%)'
    , code_hex : '#ff7e33'
    , bg_class : 'a-bc-propulsion'
    , uses     : [ 'subheading text' ]
    }
  , deploying : {
      name     : 'Deploying'
    , code_dfn : 'hsv(  7,  80%, 100%)'
    , code_hex : '#ff4b33'
    , bg_class : 'a-bc-deploying'
    , uses     : [ 'Danger components' ]
    }
  , hereye : {
      name     : 'HER Eye'
    , code_dfn : 'hsv( 52,  80%, 100%)'
    , code_hex : '#ffe433'
    , bg_class : 'a-bc-hereye'
    , uses     : [ 'Caution components' ]
    }
  , neurotoxin : {
      name     : 'Neurotoxin'
    , code_dfn : 'hsv( 97,  40%,  80%)'
    , code_hex : '#9acc7a'
    , bg_class : 'a-bc-neurotoxin'
    , uses     : [ 'Success components' ]
    }
  , bridges : {
      name     : 'Bridges of Light'
    , code_dfn : 'hsv(202,  40%, 100%)'
    , code_hex : '#99daff'
    , bg_class : 'a-bc-bridges'
    , uses     : [ 'Info components' ]
    }
  , companion : {
      name     : 'Heart of a Companion'
    , code_dfn : 'hsv(337,  40%, 100%)'
    , code_hex : '#ff99c0'
    , bg_class : 'a-bc-companion'
    , uses     : [ 'Help components' ]
    }
  , vilify : {
      name     : 'Vilify'
    , code_dfn : 'hsv(277, 100%, 100%)'
    , code_hex : '#9d00ff'
    , bg_class : 'a-bc-vilify'
    , uses     : [ 'alert links' ]
    }
  , graylite : {
      name     : 'Aperture Gray Lite'
    , code_dfn : 'mix(mix(@aperturewhite, @apertureblack, 80%), @pbody, 95%)'
    , code_hex : '#c7c5c2'
    , bg_class : 'a-bc-graylite'
    , uses     : [ 'light component default' ]
    }
  , graydark : {
      name     : 'Aperture Gray Dark'
    , code_dfn : 'mix(mix(@apertureblack, @aperturewhite, 80%), @atlas, 95%)'
    , code_hex : '#383a3d'
    , bg_class : 'a-bc-graydark'
    , is_dark  : true
    , uses     : [ 'dark component default' ]
    }
  }

  /**
   * Set of translucent colors, shades and tints, used on the site.
   * @type {Object}
   */
  Docs.TRANS_SCHEME = {
    tintlight : {
      name      : 'Tint Light'
    , code_dfn  : 'fadeout(@aperturewhite, 80%)'
    , code_hexa : 'rgba(#f2f7ff, 0.2)'
    , bg_class  : 'a-bc-tintlight'
    , box_color : Docs.COLOR_SCHEME.apertureblack
    }
  , shadelight : {
      name      : 'Shade Light'
    , code_dfn  : 'fadeout(@apertureblack, 80%)'
    , code_hexa : 'rgba(#0d0800, 0.2)'
    , bg_class  : 'a-bc-shadelight'
    , box_color : Docs.COLOR_SCHEME.aperturewhite
    }
  , tintheavy : {
      name      : 'Tint Heavy'
    , code_dfn  : 'fadeout(@aperturewhite, 20%)'
    , code_hexa : 'rgba(#f2f7ff, 0.8)'
    , bg_class  : 'a-bc-tintheavy'
    , box_color : Docs.COLOR_SCHEME.apertureblack
    }
  , shadeheavy : {
      name      : 'Shade Heavy'
    , code_dfn  : 'fadeout(@apertureblack, 20%)'
    , code_hexa : 'rgba(#0d0800, 0.8)'
    , bg_class  : 'a-bc-shadeheavy'
    , box_color : Docs.COLOR_SCHEME.aperturewhite
    }
  }

  return Docs
})()
