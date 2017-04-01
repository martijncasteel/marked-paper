# Activate and configure extensions
# https://middlemanapp.com/advanced/configuration/#configuring-extensions

activate :blog do |blog|

end

activate :directory_indexes

activate :autoprefixer do |prefix|
  prefix.browsers = 'last 2 versions'
end

# Layouts
# https://middlemanapp.com/basics/layouts/
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

# With alternative layout
# page '/path/to/file.html', layout: 'other_layout'

# Proxy pages
# https://middlemanapp.com/advanced/dynamic-pages/
['tom', 'dick', 'harry'].each do |name|
  proxy "/#{name}", '/post.html.haml', :locals => { :name => name }
end

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
  ignore '/post.html.haml'

  activate :minify_css
  activate :minify_javascript
end
