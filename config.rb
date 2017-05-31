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

# Set default markdown engine for code highlighting
# https://github.com/middleman/middleman-syntax
set :markdown_engine, :redcarpet
set :markdown, :fenced_code_blocks => true, :smartypants => true
activate :syntax do |syntax|
  syntax.inline_theme = Rouge::Themes::Github.new
  syntax.line_numbers = true
end

# Build-specific configuration
# https://middlemanapp.com/advanced/configuration/#environment-specific-settings
configure :build do
  activate :gzip

  activate :minify_css
  activate :minify_javascript
end
