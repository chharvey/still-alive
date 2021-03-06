const Page    = require('sitepage').Page
const xjs     = require('extrajs')
const Element = require('extrajs-dom').Element
const View    = require('extrajs-view')

/**
 * A blog post article.
 * @module
 */
module.exports = class BlogPost extends Page {
  /**
   * Construct a new BlogPost object.
   * @param {string} name the name of this page
   * @param {string} url  the url of this page
   */
  constructor(name, url) {
    super({ name: name, url: url })
    this._status = null
    this._history = []
  }

  /**
   * Set or get the status of this blog post.
   * @see BlogPost.status
   * @param  {BlogPost.Status=} s the status to set
   * @return {(BlogPost|BlogPost.Status)} this blog post || the status of this blog post
   */
  status(s) {
    if (arguments.length >= 1) {
      ;
    } else return this._status
    this._status = s
    return this
  }

  /**
   * Add a timestamp to this post’s revision history.
   * @param {Date} datetime the date and/or time of revision
   * @param {Array<BlogPost.Status>=} statuses any status changes to the document at this timestamp
   * @return {BlogPost} this blog post
   */
  addTimestamp(datetime, statuses = []) {
    this._history.push({
      datetime   : /** @type {Date} */    datetime,
      is_complete: /** @type {boolean} */ statuses.includes(BlogPost.Status.COMPLETE),
      is_released: /** @type {boolean} */ statuses.includes(BlogPost.Status.RELEASED),
    })
    return this
  }

  /**
   * Get all the timestamps of this post.
   * @return {Array<Object>} an array of timestamp objects, each of the format {datetime:Date, is_complete:boolean, is_released:boolean}
   */
  getTimestampsAll() {
    return this._history.slice()
  }

  /**
   * @summary Render this blog post in HTML.
   * @see BlogPost.VIEW
   * @type {View}
   */
  get view() {
    /**
     * @summary This view object is a set of functions returning HTML output
     * @description Available displays:
     * - `BlogPost#view()` - default display
     * - `BlogPost#view.docMeta()` - document meta component
     * - `BlogPost#view.statusAlert()` - alert indicating this post’s status
     * @namespace BlogPost.VIEW
     * @type {View}
     */
    /**
     * Default display. Takes no arguments.
     * @summary Call `BlogPost#view()` to render this display.
     * @function BlogPost.VIEW.default
     * @returns {string} HTML output
     */
    return new View(null, this)
      /**
       * Return a <dl.c-Document__Meta> component, the document metadata for this blog post.
       * @summary Call `BlogPost#view.docMeta()` to render this display.
       * @function BlogPost.VIEW.docMeta
       * @returns {string} HTML output
       */
      .addDisplay(function docMeta() {
        return new Element('dl').class('c-Document__Meta').addContent([
          new Element('dt').addContent(`Author`),
          new Element('dd').attr({ itemprop:'author', itemscope:'', itemtype:'http://schema.org/Person' }).addContent([
            new Element('a').attr({ href:'//chharvey.github.io/', rel:'author', itemprop:'url' }).addContent([
              new Element('span').attr('itemprop','name').addContent([
                new Element('span').attr('itemprop','givenName').addContent(`Christopher`),
                new Element('span').attr('itemprop','additionalName').addContent(`H.`),
                new Element('span').attr('itemprop','familyName').addContent(`Harvey`),
              ])
            ])
          ]),
          new Element('dt').addContent(`Description`),
          new Element('dd').attr('itemprop','description').addContent(this.description()),
          new Element('dt').addContent(`Keywords`),
          ...this.keywords().map((kwd) => new Element('dd').attr('itemprop','keywords').addContent(kwd)),
          new Element('dt').addContent(`Version History`),
          ...this._history.map((revision,index) =>
            new Element('dd').class('update').addContent([
              new Element('time')
                .attr({
                  datetime: revision.datetime,
                  itemprop: [
                    (revision.is_complete)             ? 'dateCreated'   : '',
                    (revision.is_released)             ? 'datePublished' : '',
                    (index === this._history.length-1) ? 'dateModified'  : '',
                  ].join(' ').trim() || null,
                })
                .addContent([
                  `${xjs.Date.format(revision.datetime, 'j M Y')} `,
                  new Element('span').class('tod').addContent(xjs.Date.format(revision.datetime, 'H:i')),
                ]),
            ]).addContent((function (revision, index) {
              // REVIEW INDENTATAION
                /**
                 * Generates a label for “Completed”, “Released”, or “Latest”.
                 * @private
                 * @param  {string} type exactly one of `'cshn'`, `'skss'`, or `'dang'`
                 * @return {Element} a <span> element label
                 */
                function label(type) {
                  return new Element('span').class('o-Textbox c-Label -ml-1')
                    .addClass(`c-Label--${type}`)
                    .addContent(({
                      cshn: `Completed`,
                      skss: `Released`,
                      dang: `Latest`,
                    })[type] || ``)
                }
                return [
                  (revision.is_complete)             ? label('cshn') : null,
                  (revision.is_released)             ? label('skss') : null,
                  (index === this._history.length-1) ? label('dang') : null,
                ]
            }).call(this, revision, index))
          ),
        ]).html()
      })
      /**
       * Return a <p.c-Alert> component indicating this blog post’s status.
       * If this blog post has no status set, the empty string `''` is returned.
       * @summary Call `BlogPost#view.statusAlert()` to render this display.
       * @function BlogPost.VIEW.statusAlert
       * @returns {string} HTML output
       */
      .addDisplay(function statusAlert() {
        if (!this.status()) return ''
        let statusmap = {
          [BlogPost.Status.DRAFT   ]: { sfx: 'dang', text: 'This document is a work in progress.' },
          [BlogPost.Status.COMPLETE]: { sfx: 'cshn', text: 'This document is in the final stages of comple\u00adtion.' }, // U+00ad &shy; soft hyphen
          [BlogPost.Status.RELEASED]: { sfx: 'skss', text: 'This document is ready for implemen\u00adtation.' }, // U+00ad &shy; soft hyphen
        }
        return new Element('p').class('o-GoldenContainer__Content__SideMinor o-Box c-Alert')
          .addClass(`c-Alert--${statusmap[this.status()].sfx}`)
          .addContent(statusmap[this.status()].text)
          .html()
      })
  }


  /**
   * A set of possible statuses for a post.
   * @enum {string}
   */
  static get Status() {
    return {
      /** The post is currently being written, with major changes possible. */ DRAFT   : 'Draft',
      /** The post is ready for review, with only minor changes possible.   */ COMPLETE: 'Complete',
      /** The post has been published. Only essential edits may be made.    */ RELEASED: 'Released',
    }
  }
}
