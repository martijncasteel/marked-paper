xml.instruct!
xml.urlset 'xmlns' => "http://www.sitemaps.org/schemas/sitemap/0.9" do
  site_url = 'https://martijncasteel.com'
  sitemap.resources.select { |article| article.destination_path =~ /\.html/ &&

  article.data.sitemap != false }.each do |article|
    xml.url do
      xml.loc URI.join(site_url, article.url)

      last_mod = if article.path.start_with?('posts/')
        File.mtime(article.source_file).to_time
      else
        Time.now
      end

      xml.lastmod last_mod.iso8601
      xml.changefreq article.data.changefreq || 'never'
    end
  end
end
