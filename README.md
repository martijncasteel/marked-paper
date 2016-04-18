# `marked-paper`

`Marked-paper` is a minimalistic markdown blog using javascript. As for now only the back-end is implemented and I have yet to start on the client side javascript. This blog removes obstructing and ugly buttons and pagers, therefore some javascript has to be implemented to load more posts once scrolling down.

The back-end is made using `express.js` build on nodejs. The idea behind it was to create a simple blogging platform for one user familiar with markdown. A typical blog file is formatted using a header with some required parameters; title and date. A changed `.md` file or created `.md` (contains at least the `---` will be parsed into html and the header will be added to the `.posts` file. 

```markdown
title: This is a sample post
date: 14 April 2016

additional: Utrecht, the Netherlands
---
Lorem ipsum dolar set amit
```
Because jade cannot include files dynamically the html is read in the controller and parsed as text to the template. I do not have noticed significantly changes in response time but this might affect it using large blogposts. I started this project to find out how nodejs worked and fund some tricky parts of it but I like it. It will still be easier to build a blog using php, but less fun!
