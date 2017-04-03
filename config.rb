# Activate and configure extensions
# https://middlemanapp.com/advanced/configuration/#configuring-extensions

activate :blog do |blog|
  blog.sources = 'posts/{title}.html'
  blog.permalink = '{title}.html'

  blog.layout = 'post'
end

activate :directory_indexes
set :trailing_slash, false

activate :autoprefixer do |prefix|
  prefix.browsers = 'last 2 versions'
end

# Layouts
# https://middlemanapp.com/basics/layouts/
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false
page '/feed.xml', layout: false

# Proxy pages
# https://middlemanapp.com/advanced/dynamic-pages/

# Helpers
# Methods defined in the helpers block are available in templates
# https://middlemanapp.com/basics/helper-methods/

# helpers do
#   def some_helper
#     'Helping'
#   end
# end

# Build-specific configuration
# https://middlemanapp.com/advanced/configuration/#environment-specific-settings

configure :build do
  activate :gzip

  activate :minify_css
  activate :minify_javascript
end
