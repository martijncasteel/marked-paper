---
title: Tailwindcss
date: 22 Februari 2022
---

It's been a while for me to write a blog post. Last weekend I tried out something new, creating a [simple single page](https://ambernorder.nl) website with tailwindcss. I started off with finding a simple html generator, something like haml for npm. I couldn't find one that worked for me, so I decided to stick with plain html. I'll get back to it.

Offcourse tailwind has a cli for me to generate a css file. I started with using the `--watch` option and developing went quickly keeping the docs nearby. When I tried to use the build command I omitted the input argument and some stuff like google fonts and font awesome were gone. It took me some time to figure out but I added the input argument, unlike [demonstrated](https://tailwindcss.com/docs/optimizing-for-production) on their website.

For the html framework I looked at Nuxt, Next, and Gatsby but all are more than I looked for. I just wanted a simple html generator to write a page short and simple. More or less like [middleman on ruby](https://middlemanapp.com) for nodejs. I didn't like the idea of creating websites that require client-side javascript to render a simple view. Isn't that what html is built for? I thought about creating my own framework for nodejs but I didn't want to spend too much time on it. If you have any suggestions for a better html framework I'd love to hear them!
