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
   * @param  {BlogPost.STATUS=} s the status to set
   * @return {(BlogPost|BlogPost.STATUS)} this blog post || the status of this blog post
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
   * @param {Array<BlogPost.STATUS>=} statuses any status changes to the document at this timestamp
   * @return {BlogPost} this blog post
   */
  addTimestamp(datetime, statuses = []) {
    this._history.push({
      datetime   : /** @type {Date} */    datetime,
      is_complete: /** @type {boolean} */ statuses.indexOf(BlogPost.STATUS.COMPLETE) >= 0,
      is_released: /** @type {boolean} */ statuses.indexOf(BlogPost.STATUS.RELEASED) >= 0,
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
   * A set of possible statuses for a post.
   * @enum {string}
   */
  static get STATUS() {
    return {
      /** The post is currently being written, with major changes possible. */ DRAFT   : 'Draft',
      /** The post is ready for review, with only minor changes possible.   */ COMPLETE: 'Complete',
      /** The post has been published. Only essential edits may be made.    */ RELEASED: 'Released',
    }
  }
}
