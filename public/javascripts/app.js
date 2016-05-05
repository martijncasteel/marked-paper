$(document).on('ready page:load', function(){
  $(window).on('scroll', function(){
    var offset = $(window).height() + $(window).scrollTop();

    if(offset < $(document).height() - 200)
      return;

    // retrieve last title and add placeholder if not already
    var title = $('body > article:last').attr('data-title');

    if(title === undefined)
      return

    $('body').append('<article></article>');

    // retrieve post and replace placeholder
    $.get('posts', { previous: title }, function( data ){
      $('body > article:last').replaceWith(data);
    })

    // remove bind if last post is loaded and placeholder also
    .fail(function() {
      $(window).off('scroll');
    })

  });
});
