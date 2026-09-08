import React, { useState, useEffect } from 'react';
import { getPosts } from '../data/contentStore';

export function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePost, setActivePost] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getPosts();
      setPosts(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const categories = ['All', 'Medical Devices', 'Digital Health', 'AI in Healthcare', 'Biosignal Processing', 'Clinical Engineering'];

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      post.title.toLowerCase().includes(query) ||
      post.excerpt?.toLowerCase().includes(query) ||
      post.tags?.some((t) => t.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="blog" className="section blog-section" aria-labelledby="blog-heading">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <span className="section-badge">Insights &amp; Publications</span>
          <h2 id="blog-heading" className="section-title">
            Blog &amp; Technical Notes
          </h2>
          <p className="section-subtitle">
            Perspectives at the intersection of building scalable medical devices, digital health systems, biosignal processing, and AI in healthcare.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="blog-controls-bar">
          <div className="category-pill-group" role="tablist" aria-label="Filter posts by category">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
                role="tab"
                aria-selected={selectedCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="search-input-wrapper">
            <input
              type="search"
              className="blog-search-input"
              placeholder="Search articles, tags, concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search articles"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="loading-state text-center">
            <div className="spinner"></div>
            <p>Loading published articles...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="empty-state card text-center p-8">
            <p className="empty-title">No matching articles found</p>
            <p className="empty-desc">Try selecting another category or clearing your search term.</p>
            {searchQuery && (
              <button type="button" className="btn btn-secondary mt-4" onClick={() => setSearchQuery('')}>
                Reset Search
              </button>
            )}
          </div>
        ) : (
          <div className="blog-grid">
            {filteredPosts.map((post) => (
              <article key={post.id} className="blog-card card">
                <div className="blog-card-header">
                  <span className="badge category-badge">{post.category}</span>
                  <span className="reading-time">{post.reading_time || '5 min read'}</span>
                </div>

                <h3 className="blog-card-title">{post.title}</h3>
                <p className="blog-card-excerpt">{post.excerpt}</p>

                {post.tags && post.tags.length > 0 && (
                  <div className="blog-card-tags">
                    {post.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="tag-chip">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="blog-card-footer">
                  <span className="publish-date">
                    {post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                  </span>
                  <button
                    type="button"
                    className="read-article-btn"
                    onClick={() => setActivePost(post)}
                    aria-label={`Read full article: ${post.title}`}
                  >
                    Read Article →
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Modal: Full Article Reader */}
        {activePost && (
          <div className="modal-backdrop" onClick={() => setActivePost(null)} role="dialog" aria-modal="true">
            <div className="modal-dialog article-reader-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-meta">
                  <span className="badge category-badge">{activePost.category}</span>
                  <span className="reading-time">{activePost.reading_time}</span>
                  <span className="publish-date">
                    {activePost.published_at ? new Date(activePost.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                  </span>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setActivePost(null)}
                  aria-label="Close article viewer"
                >
                  ✕
                </button>
              </div>

              <div className="modal-body">
                <h2 className="article-title">{activePost.title}</h2>
                <p className="article-lead-excerpt">{activePost.excerpt}</p>

                <hr className="divider" />

                <div className="article-content-body">
                  {activePost.content.split('\n\n').map((paragraph, idx) => {
                    if (paragraph.startsWith('### ')) {
                      return <h3 key={idx} className="content-h3">{paragraph.replace('### ', '')}</h3>;
                    }
                    if (paragraph.startsWith('1. ') || paragraph.startsWith('2. ') || paragraph.startsWith('3. ')) {
                      return (
                        <p key={idx} className="content-p numbered-item">
                          {paragraph}
                        </p>
                      );
                    }
                    return (
                      <p key={idx} className="content-p">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>

                {activePost.tags && (
                  <div className="modal-tags-footer">
                    <span className="tags-label">Topics:</span>
                    {activePost.tags.map((tag, idx) => (
                      <span key={idx} className="tag-chip">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setActivePost(null)}>
                  Close Article
                </button>
                <a href="#contact" className="btn btn-primary" onClick={() => setActivePost(null)}>
                  Discuss This Topic →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Blog;
