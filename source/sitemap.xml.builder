xml.instruct!
xml.urlset 'xmlns' => "http://www.sitemaps.org/schemas/sitemap/0.9" do
  site_url = 'https://martijncasteel.nl'

  xml.url do
    xml.loc site_url
    xml.lastmod blog.articles.first.date.iso8601 unless blog.articles.empty?
    xml.changefreq 'monthly'
  end

  blog.articles.each do |article|
    next if article.data.sitemap == false

    xml.url do
      xml.loc URI.join(site_url, article.url)
      xml.lastmod article.date.to_time.iso8601
      xml.changefreq article.data.changefreq || 'never'
    end
  end
end
