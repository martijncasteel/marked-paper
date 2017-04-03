# # This is where it all goes :)
# # TODO use turbolinks (source)
#
# $(window).on 'scroll', ->
#   offset = $(window).height() + $(window).scrollTop()
#   if offset < $(document).height() - 200
#     return
#
#   # retrieve last title and add placeholder if not already
#   title = $('body > article:last').attr('data-title')
#   if title == undefined
#     return
#
#   $('body').append '<article></article>'
#
#   # retrieve post and replace placeholder
#   $.get('posts', { previous: title }, (data) ->
#     $('body > article:last').replaceWith data
#     return
#   ).fail ->
#     $(window).off 'scroll'
#     return
#   return
