---
title: Optimizing SEO
date: 3 June 2017
---

So optimizing a [website](/), where to start? I googled a lot for tools to evaluate websites. So I found a few websites such as [pagespeed](https://developers.google.com/speed/pagespeed/insights/?hl=nl&url=https%3A%2F%2Fmartijncasteel.com%2F) but I ended up with [nibbler](http://nibbler.silktide.com/en_US/reports/martijncasteel.com), a tool grading on several aspects. Aspects such as accessibility, experience, and marketing.

On the website side I had to make it W3C compliant, which is was not surprisingly. I added a print stylesheet removing some unusable features if someone would print the page, changed some headers and added a robots.txt as you can see on [github](https://github.com/martijncasteel/marked-paper). Eventually I ended up with a pretty good score, leaving me with optimization of the webserver and the images I'm serving.

Adding gzip and minifying the css and javascript decreased the footprint, as well as decreasing the size of the images improved the overall speed. Furthermore adding [turbolinks](https://github.com/turbolinks/turbolinks#turbolinks) to render pages on the browser improved the experience of the user in my opinion. By now I might have overdone it for this simple website, but it is still fun to do. Next step would be to improve my server configuration; adding browser side caching.

```nginx
location ~* \.(?:rss|atom|html)$ {
  expires 1h;
  add_header Cache-Control "public";
}

location ~* \.(?:jpg|jpeg|gif|png|ico|svg)$ {
  expires 1M;
  add_header Cache-Control "public";
}

location ~* \.(?:css|js)$ {
  expires 1y;
  access_log off;
  add_header Cache-Control "public";
}
```

Finally I added my website and sitemap to Google webmasters and wait for it to be crawled. In the end of the day, those good numbers from [nibbler](http://nibbler.silktide.com/en_US/reports/martijncasteel.com) doesn't mean a lot to your visitors. Content is the way to go (and some references won't hurt either).
