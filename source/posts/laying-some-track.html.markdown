---
title: Laying some track
date: 5 May 2016
additional: Choo choo!
description: I created a membership administration application in Ruby on Rails. You are able to adminstrate memberships, groups, activities, and more. You can find the source code on github.
---

Study association [Sticky](https://www.svsticky.nl) is based in Utrecht and is for all IT students on the Utrecht University. Within the association there was a member registration application build in PHP, however, that one started to fall apart. PHP is a language that is great for creating simple applications such as a blog or whatever not too complex, for a larger application with a complex database you would want to at least use a framework.

For the new member registration application together with a few we started to build it in Rails, hence the _laying some tracks_, you get it?! I always try out new languages to find out what works for me. Within Rails the Model-View-Controller paradigm is enforced, it is developed for large applications with complex databases, didn't I mention this earlier?

<a href='/laying-some-track/constipated-koala.mp4'>
  <video autoplay playsinline muted loop poster='/laying-some-track/login.png'>
    <source src='/laying-some-track/constipated-koala.mp4' type='video/mp4' />
    <img src='/laying-some-track/login.png' alt='login' />
    <span>Muted video of constipated-koala showing some basic features</span>
  </video>
</a>

Building a Rails application is quite easy, I would really recommend reading the [getting started](http://guides.rubyonrails.org/getting_started.html) guide and creating the simple blog, Ruby is easy, it is well documented and readable, one of the easiest languages I have done in a while. Just start programming, as long as your database design is solid improvements can always be done. There are some awesome libraries, so called gems, for Rails such as; [haml], [rabl], [devise], and [paperclip], and probably a few more.

[constipated-koala] is open-sourced and is for associations to track their members, groups, and activities. I'm actually quite happy with it, my first lines of code aren't the best, but they do work. I have implemented some cool features; it is now an OAuth provider for members and has integration with an online payment provider. However, at the moment I cannot open-source it yet since I used some licensed stylesheet but certainly something you will be able to use for your association.

[haml]: http://haml.info/
[rabl]: https://github.com/nesquena/rabl
[devise]: https://github.com/plataformatec/devise
[paperclip]: https://github.com/thoughtbot/paperclip

[constipated-koala]: https://github.com/svsticky/constipated-koala

[login]: /laying-some-track/login.png
[members]: /laying-some-track/members.png
[activities]: /laying-some-track/activities.png
