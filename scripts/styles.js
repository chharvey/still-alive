///////////////////////////////////////////////////////////////////////////////
// Front-end script to control the vertical rhythm styling of elements
///////////////////////////////////////////////////////////////////////////////


/**
 * Compensates for changes of pullquote line height.
 *
 * The line-height of pull quotes and pull quote sources is by default the amount
 * such that the font-size * line-height equals 1 vru. In CSS, the line-height is
 * multiplied by a coefficient to increase vertical spacing between lines.
 *
 * This function compensates for the shift in vertical rhythm by adding a negative margin-top.
 */
function pullquoteLines() {
  var project = {
    px_per_rem: 16
  , line_height: 1.5
  , vru: function () { return this.px_per_rem * this.line_height }
  }
  $('.c-Pullquote').each(function () {
    var vrus = $(this).height() / project.vru()
    $(this).css('margin-top','') // removes any inline style
    if (vrus !== parseInt(vrus)) {
      $(this).css('margin-top', parseFloat($(this).css('margin-top')) - 0.5*project.vru())
    }
  })
}

/**
 * Adjusts the bottom spacing of a `.Table`.
 * Subtracts margin-bottom, or adds padding-bottom to tables to compensate for horizontal borders.
 * ONLY USE THIS FUNCTION ON TABLES WITH HORIZONTAL BORDERS.
 * If number of h-borders (n_rows + 1) is 0–11, 24–35, etc., then subtract at most 11px from margin-bottom, thereby pulling subsequent elements upward.
 * If number of h-borders is 12-23, 36-47, etc., then add at most 12px to padding-bottom, thereby pushing subsequent elements downward.
 * CHANGED: 2015-05-13: temporarily commenting out as generic tables no longer have borders.
 *                      may use components later which may need this function.
 */
function tableSpacing() {
  /*
   * Algorithm:
   * for each table:
   * take the number of rows (x)
   * add 12
   * mod 24
   * subtract 12
   * negate.
   * function notation: g(x) = -(f(x+12)-12) where f(x) = MOD(x,24)
   * function transformation: MOD(x,24) translated left 12 and down 12, then flipped vertically.
   * if g(x) <= 0, then margin-bottom that number
   * else, padding-bottom that number.
   *
   * Notes:
   * [1] n_rowgroups++ once more for the last border, if there is one
   * [2] n_rowgroups++ once more again for a caption if it exists:
   *     (this is for the border-top of the `caption` Element,
   *     not the border-bottom of the `.c-Caption--before` Component)
   */
  var px_per_line = project.px_per_rem * project.line_height;
  var px_per_line_half = px_per_line / 2;
  $('.Table').each(function () {
    var n_rowgroups = 0
    $(this).find('.Rowgroup').each(function () {
      n_rowgroups++
    })
    if ($(this).find('.Rowgroup')[0] != null)     n_rowgroups++ // *[1]
    if ($(this).find('caption')[0]   != null)     n_rowgroups++ // *[2]
    var btm = -(((n_rowgroups + px_per_line_half) % px_per_line) - px_per_line_half)
    if (btm <= 0) {
      $(this).css('margin-top','') // removes any previous inline style
      $(this).css('margin-top',parseFloat($(this).css('margin-top'))+btm)
    } else {
      $(this).css('padding-top','') // removes any previous inline style
      $(this).css('padding-top',parseFloat($(this).css('padding-top'))+btm)
    }
    // var n_rows = 0
    // $(this).find('tr').each(function () {
    //   n_rows++
    // })
    // n_rows++ // once more for the last border
    // var btm = -(((n_rows + px_per_line_half) % px_per_line) - px_per_line_half)
    // if (btm <= 0) $(this).css('margin-bottom', btm)
    // else          $(this).css('padding-bottom', btm)
  });
}
function tableSpacing2() {
  // fixes vertical spacing for normal, unclassed table elements. this is due to the fact that
  // each cell (th or td) has a vertical padding of `(0.25 * @g-vru)`
  // (that is, `0.25 * project.line_height` in javascript), which totals to be 0.5.
  // thus if there are an odd number of rows in the table, the margin needs to be offset by
  // 0.5.
  var px_per_line = project.px_per_rem * project.line_height
    , px_per_line_half = px_per_line / 2
  $('table').each(function () {
    var n_rows = 0
    $(this).find('tr').each(function () {
      n_rows++
    })
    if (n_rows % 2 == 1) {
      $(this).css('margin-top', -1 * px_per_line_half)
    }
  })
}

/**
 * Adds delimiters to LaTeX expressions.
 * Inline uses parentheses and block uses brackets.
 */
function mathJax() {
  $('.js-mt').prepend('\\(').append('\\)')
  $('.js-mb').prepend('\\[').append('\\]')
}

$(document).ready(function () {
  pullquoteLines()
  tableSpacing2()
  mathJax()
})
$(window).resize(function () {
  pullquoteLines()
})
