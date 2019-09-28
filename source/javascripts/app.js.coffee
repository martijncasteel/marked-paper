###
This is where it all the javascript  goes :)

Some javascript to load more posts while scrolling down
on the page. An error is returned after the last post.
###
$(window).on 'scroll', ->
  offset = $(window).height() + $(window).scrollTop()
  if offset < $(document).height() - 300
    return

  if $('body').attr( 'loading' ) != undefined
    return

  # retrieve last url
  o = $('article:not(:has(*)):first')
  url = $(o).attr 'data-url'

  if url == undefined
    $(window).off 'scroll'
    return

  # add state to wait for xhr
  $('body').attr 'loading', ''

  # retrieve article
  $.get(url, (data) ->
    $(o).html( $(data).filter('article').html())
    $('body').removeAttr 'loading'
    return

  ).fail ->
    $(window).off 'scroll'
    return

  return