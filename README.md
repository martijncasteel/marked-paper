# `marked-paper`
[![Build Status](https://travis-ci.org/martijncasteel/marked-paper.svg?branch=master)](https://travis-ci.org/martijncasteel/marked-paper)
[![Middleman version](https://img.shields.io/badge/middleman-v4.2.1-blue.svg)](https://img.shields.io/badge/middleman-v4.2.1-blue.svg)
[![Dependency Status](https://gemnasium.com/badges/github.com/martijncasteel/marked-paper.svg)](https://gemnasium.com/github.com/martijncasteel/marked-paper)

`Marked-paper` is a minimalistic markdown blog using middleman. My blog has no obstructing or ugly buttons and pagers, therefore some javascript has to be implemented to load more posts once scrolling down.

The back-end is made using [`middleman`](https://middlemanapp.com/) build on [`ruby`](https://www.ruby-lang.org/en/) and the idea behind it was to create a simple blogging platform for one user familiar with markdown. A typical blog file is formatted using a header with some required parameters; title and date.

```markdown
---
title: This is a sample Post
date: 14 April 2016
additional: Utrecht, the Netherlands
---

Writing this is strange. I've started [...]
```
