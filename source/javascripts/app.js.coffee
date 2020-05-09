###
This is where it all the javascript  goes :)

Some javascript to load more posts while scrolling down
on the page. When no data-url is no longer present the
last page has been reached.
###
window.loading = false

document.addEventListener 'scroll', () ->

  if (window.scrollY || window.pageYOffset) + window.innerHeight < document.body.offsetHeight - 300  
    return
  
  if window.loading
    return
  
  window.loading = true
  
  article = document.querySelector 'article[data-url]'
  
  if article == null || !article.hasAttribute 'data-url'
    return
 
  url = article.getAttribute 'data-url'
  
  if url == undefined
    return

  request = new XMLHttpRequest()
  request.open 'GET', url, true
  request.responseType = 'document'

  request.onload = -> 
    if this.status == 200
      article.removeAttribute 'data-url'
      window.loading = false
 
      article.innerHTML = this.response.querySelector('article').innerHTML
    
  request.send()
