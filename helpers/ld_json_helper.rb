module LdJsonHelper

  def ld_json
    graph = [
      {
        "@type": "WebSite",
        "@id": "https://martijncasteel.nl",
        "url": "https://martijncasteel.nl",
        "name": "Martijn Casteel",
        "description": "IT encounters, programming, and Artificial Intelligence blog",
        "publisher": { "@id": "https://martijncasteel.nl" }
      },
      {
        "@type": "Person",
        "@id": "https://martijncasteel.nl",
        "name": "Martijn Casteel",
        "url": "https://martijncasteel.nl",
        "jobTitle": "IT Professional & product owner",
        "knowsAbout": ["Computer Science", "Technical Artificial Intelligence", "Programming"],
        "sameAs": ["https://www.linkedin.com/in/martijncasteel/"]
      },
      {
        "@type": "WebPage",
        "@id": "https://martijncasteel.nl",
        "url": "https://martijncasteel.nl",
        "name": current_page.data.title || "Martijn Casteel - What is it all about?",
        "isPartOf": { "@id": "https://martijncasteel.nl" },
        "about": { "@id": "https://martijncasteel.nl" }
      }
    ]

    { "@context" => "https://schema.org", "@graph" => graph }.to_json
  end

  def ld_json_article
    return unless is_blog_article?

    article_url = "https://martijncasteel.nl#{current_article.url}"

    graph = [
      {
        "@type": "BreadcrumbList",
        "@id": "#{article_url}#breadcrumb",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://martijncasteel.nl" },
          { "@type": "ListItem", "position": 2, "name": current_article.title, "item": article_url }
        ]
      },
      {
        "@type": "BlogPosting",
        "@id": "#{article_url}#blogpost",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://martijncasteel.nl",
          "url": "https://martijncasteel.nl",
          "name": "Martijn Casteel"
        },
        "headline": current_article.title,
        "description": current_article.data.description,
        "datePublished": current_article.date.to_time.iso8601,
        "dateModified": current_article.data.updated_at ? Time.parse(current_article.data.updated_at).iso8601 : current_article.date.to_time.iso8601,
        "mainEntityOfPage": article_url,
        "author": {
          "@type": "Person",
          "name": "Martijn Casteel",
          "url": "https://martijncasteel.nl"
        },
        "publisher": {
          "@type": "Person",
          "name": "Martijn Casteel",
          "url": "https://martijncasteel.nl"
        }
      }
    ]

    if current_article.data.image.present?
      graph[1]["image"] = "https://martijncasteel.nl/#{current_article.data.image}"
    end

    { "@context" => "https://schema.org", "@graph" => graph }.to_json
  end

end