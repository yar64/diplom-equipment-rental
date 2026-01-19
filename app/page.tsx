// app/page.tsx - с обновленной цветовой палитрой
'use client';



export default function HomePage() {
  const equipmentCategories = [
    { id: 1, name: 'Аудио оборудование', icon: '🔊', count: 42, color: 'category-audio' },
    { id: 2, name: 'Видео техника', icon: '📹', count: 28, color: 'category-video' },
    { id: 3, name: 'Осветительное оборудование', icon: '💡', count: 35, color: 'category-lighting' },
    { id: 4, name: 'Сценическое оборудование', icon: '🎭', count: 19, color: 'category-stage' },
    { id: 5, name: 'Звуковое оборудование', icon: '🎵', count: 31, color: 'category-sound' },
    { id: 6, name: 'Проекционное оборудование', icon: '📽️', count: 24, color: 'category-projector' },
  ];

  const popularEquipment = [
    { 
      id: 1, 
      name: 'Профессиональный микшерный пульт', 
      price: '1 500₽/день',
      rating: 4.8,
      reviews: 124,
      image: 'mixer'
    },
    { 
      id: 2, 
      name: 'LED панель 55" 4K', 
      price: '2 500₽/день',
      rating: 4.9,
      reviews: 89,
      image: 'led-panel'
    },
    { 
      id: 3, 
      name: 'Прожектор Moving Head', 
      price: '1 800₽/день',
      rating: 4.7,
      reviews: 67,
      image: 'lighting'
    },
    { 
      id: 4, 
      name: 'Акустическая система 2000W', 
      price: '2 200₽/день',
      rating: 4.9,
      reviews: 156,
      image: 'speakers'
    },
  ];

  const features = [
    {
      icon: '🚚',
      title: 'Быстрая доставка',
      description: 'Доставка оборудования в день заказа по Москве'
    },
    {
      icon: '🛡️',
      title: 'Гарантия качества',
      description: 'Все оборудование проходит регулярное обслуживание'
    },
    {
      icon: '⏱️',
      title: 'Гибкая аренда',
      description: 'Аренда от нескольких часов до нескольких месяцев'
    },
    {
      icon: '📞',
      title: 'Техподдержка 24/7',
      description: 'Консультации и помощь на всех этапах аренды'
    },
  ];

  const testimonials = [
    {
      name: 'Александр Петров',
      role: 'Организатор мероприятий',
      text: 'Отличный сервис! Оборудование всегда в идеальном состоянии, доставка вовремя.',
      rating: 5
    },
    {
      name: 'Марина Иванова',
      role: 'Event-менеджер',
      text: 'Работаем с этой компанией уже 2 года. Ни разу не подвели, все оборудование качественное.',
      rating: 5
    },
    {
      name: 'Дмитрий Сидоров',
      role: 'Владелец клуба',
      text: 'Лучшие цены на рынке при отличном качестве оборудования. Рекомендую!',
      rating: 4
    },
  ];

  return (
    <div className="home-page">
      {/* Hero секция */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Аренда профессионального оборудования
              <span className="hero-highlight"> для ваших мероприятий</span>
            </h1>
            <p className="hero-description">
              Всё необходимое для успешного проведения мероприятий: 
              от аудиотехники до осветительного оборудования с доставкой и настройкой
            </p>
            
            <div className="search-container">
              <div className="search-input-group">
                <span className="search-icon">🔍</span>
                <input 
                  type="text" 
                  placeholder="Найдите необходимое оборудование..."
                  className="search-input"
                />
                <button className="search-button">
                  <span>🔍</span>
                  Найти
                </button>
              </div>
              <div className="search-filters">
                <select className="filter-select">
                  <option value="">Все категории</option>
                  <option value="audio">Аудио оборудование</option>
                  <option value="video">Видео техника</option>
                  <option value="lighting">Осветительное оборудование</option>
                </select>
                <select className="filter-select">
                  <option value="">Любая цена</option>
                  <option value="0-1000">до 1000₽/день</option>
                  <option value="1000-3000">1000-3000₽/день</option>
                  <option value="3000+">от 3000₽/день</option>
                </select>
              </div>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">850+</div>
                <div className="stat-label">Единиц оборудования</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">2 400+</div>
                <div className="stat-label">Довольных клиентов</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">98%</div>
                <div className="stat-label">Положительных отзывов</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Категории оборудования */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Категории оборудования</h2>
            <p className="section-description">
              Широкий выбор профессионального оборудования для любых мероприятий
            </p>
          </div>

          <div className="categories-grid">
            {equipmentCategories.map((category) => (
              <div key={category.id} className="category-card">
                <div className={`category-icon ${category.color}`}>
                  <span className="category-emoji">{category.icon}</span>
                </div>
                <div className="category-info">
                  <h3 className="category-name">{category.name}</h3>
                  <p className="category-count">{category.count} позиций</p>
                </div>
                <button className="category-button">
                  Смотреть →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Популярное оборудование */}
      <section className="equipment-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Популярное оборудование</h2>
            <p className="section-description">
              Часто арендуемое нашими клиентами
            </p>
          </div>

          <div className="equipment-grid">
            {popularEquipment.map((item) => (
              <div key={item.id} className="equipment-card">
                <div className={`equipment-image ${item.image}`}></div>
                <div className="equipment-content">
                  <div className="equipment-rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={i} 
                          className={`star ${i < Math.floor(item.rating) ? 'filled' : ''}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="rating-text">{item.rating} ({item.reviews} отзывов)</span>
                  </div>
                  
                  <h3 className="equipment-name">{item.name}</h3>
                  
                  <div className="equipment-price">{item.price}</div>
                  
                  <button className="rent-button">
                    <span>📅</span>
                    Арендовать
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Почему выбирают нас</h2>
            <p className="section-description">
              Мы заботимся о каждом клиенте и обеспечиваем лучший сервис
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Отзывы */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Отзывы клиентов</h2>
            <p className="section-description">
              Что говорят наши клиенты о работе с нами
            </p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-header">
                  <div className="testimonial-rating">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className={`star ${i < testimonial.rating ? 'filled' : ''}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="testimonial-author">
                    <div className="author-avatar"></div>
                    <div>
                      <h4 className="author-name">{testimonial.name}</h4>
                      <p className="author-role">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
                <p className="testimonial-text">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA секция */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Готовы начать аренду?</h2>
            <p className="cta-description">
              Оставьте заявку и наш менеджер свяжется с вами в течение 15 минут
            </p>
            <div className="cta-buttons">
              <button className="cta-button primary">
                <span>📞</span>
                Оставить заявку
              </button>
              <button className="cta-button secondary">
                <span>📍</span>
                Посмотреть на карте
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}