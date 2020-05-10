# `marked-paper`
![middleman](https://github.com/martijncasteel/marked-paper/workflows/middleman/badge.svg?branch=master&event=push)
[![Middleman version](https://img.shields.io/badge/middleman-v4.3.6-blue.svg)](https://img.shields.io/badge/middleman-v4.3.6-blue.svg)

`Marked-paper` is a minimalistic markdown blog using middleman. My blog has no obstructing or ugly buttons and pagers, therefore some javascript is implemented to load more posts once scrolling down to the end of the page.

The back-end is made using [`middleman`](https://middlemanapp.com/) build on [`ruby`](https://www.ruby-lang.org/en/) and the idea behind it was to create a simple blogging platform for one user familiar with markdown. A typical blog file is formatted using frontmatter with some required parameters; title and date.

```markdown
---
title: This is a sample Post
date: 14 April 2016
additional: Utrecht, the Netherlands
---

Writing this is strange. I've started [...]
```
