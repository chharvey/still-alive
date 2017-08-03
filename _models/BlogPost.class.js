var Page = require('sitepage').Page

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
      is_complete: /** @type {boolean} */ statuses.indexOf(BlogPost.Status.COMPLETE) >= 0,
      is_released: /** @type {boolean} */ statuses.indexOf(BlogPost.Status.RELEASED) >= 0,
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
   * Print the document metadata for this blog post.
   * @return {string} an HTML string .c-Document__Meta component
   */
  renderDocMeta() {
    return `
      <dl class="c-Document__Meta">
        <dt>Author</dt>
        <dd itemprop="author" itemscope="" itemtype="http://schema.org/Person">
          <a href="//chharvey.github.io/" rel="author" itemprop="url">
            <span itemprop="name">
              <span itemprop="givenName">Christopher</span>
              <span itemprop="additionalName">H.</span>
              <span itemprop="familyName">Harvey</span>
            </span>
          </a>
        </dd>
        <dt>Description</dt>
        <dditemprop="description">${this.description()}</dd>
        <dt>Keywords</dt>
        ${this.keywords().map((kwd) => `<dd itemprop="keywords">${kwd}</dd>`)}
        <dt>Version History</dt>
        ${this.getTimeStampsAll().map(function (revision, index) {
          let itemprop_val = ''
          let label = ''
          if (revision.is_complete) {
            itemprop_val += 'dateCreated '
            label += `<span class="o-Textbox c-Label c-Label--cshn -ml-1">Completed</span>`
          }
          if (revision.is_released) {
            itemprop_val += 'datePublished'
            label += `<span class="o-Textbox c-Label c-Label--skss -ml-1">Released</span>`
          }
          if (index === this.getTimestampsAll().length-1) {
            itemprop_val += ' dateModified'
            label += `<span class="o-Textbox c-Label c-Label--dang -ml-1">Latest</span>`
          }
          return `
            <dd class="update">
              <time datetime=${revision.datetime}${(itemprop_val) ? ' itemprop="itemprop_val"' : ''}>
                MMM DD, YYYY <span class="tod">HH:MM</span>
              </time>
              ${label}
            </dd>
          `
        }, this)}
      </dl>
    `
  }

  /**
   * Print an alert to readers of this blog posts, indicating its status.
   * @return {string} an HTML string status alert for this blog post
   */
  renderStatusAlert() {
    let statusmap = {} // cannot make object literals with non-string keys
    statusmap[BlogPost.Status.DRAFT   ] = { sfx: 'dang', text: 'This document is a work in progress.' }
    statusmap[BlogPost.Status.COMPLETE] = { sfx: 'cshn', text: 'This document is in the final stages of comple\u00adtion.' } // U+00ad &shy; soft hyphen
    statusmap[BlogPost.Status.RELEASED] = { sfx: 'skss', text: 'This document is ready for implemen\u00adtation.' } // U+00ad &shy; soft hyphen
    return `
      <p class="o-GoldenContainer__Content__SideMinor o-Box c-Alert c-Alert--${statusmap[this.status()].sfx}"
        itemprop="creativeWorkStatus" itemscope="" itemtype=${this.status()}>
        ${statusmap[this.status()].text}
      </p>
    `
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
