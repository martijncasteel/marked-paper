# `marked-paper`

`Marked-paper` is a minimalistic markdown blog using javascript. As for now only the back-end is implemented and I have yet to start on the client side javascript. This blog has no obstructing or ugly buttons and pagers, therefore some javascript has to be implemented to load more posts once scrolling down.

The back-end is made using `express.js` build on `nodejs` and the idea behind it was to create a simple blogging platform for one user familiar with markdown. A typical blog file is formatted using a header with some required parameters; title and date. But can has more attributes with the same `([a-z-]+):` format.

```markdown
title: This is a sample post
date: 14 April 2016

additional: Utrecht, the Netherlands
---
Lorem ipsum dolar set amit
```

A changed `.md` file or created `.md` within the posts directory (containing at least the `---` will be [parsed](https://github.com/chjj/marked) into html and the header will be added to the `.posts` file. Than the website will render this post, a new post will always be added last, so if you want to change the order, you'll have to do so in the `.posts`.

Jade cannot include files dynamically, the html is read into a variable in the controller and passed as string to the template. I do not have noticed significantly changes in response time but this might affect it using large blogposts. I started this project to find out how nodejs worked and find some tricky parts of it but I like thejavascript idea behind it. It will still be easier to build a blog using php, but less fun!
