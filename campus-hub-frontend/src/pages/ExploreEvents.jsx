import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ExploreEvents.css';

const ExploreEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    // Simulate API fetch
    const fetchEvents = async () => {
      try {
        // Replace with actual API call
        const mockEvents = [
          {
            id: 1,
            title: "AI Workshop with Google Engineers",
            date: "2025-07-06",
            time: "2:00 PM",
            location: "Computer Lab 3",
            club: "Tech Club",
            status: "upcoming",
            image: "https://source.unsplash.com/random/600x400/?tech",
            description: "Hands-on workshop with Google engineers covering the latest in AI and machine learning."
          },
          
          // More mock events...
        ];
        setEvents(mockEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    if (activeFilter === 'all') return true;
    return event.status === activeFilter;
  });

  if (loading) return <div className="ee-loading">Loading events...</div>;

  return (
    <div className="ee-container">
      <header className="ee-header">
        <h1 className="ee-title">Explore Campus Events</h1>
        <p className="ee-subtitle">Discover and join exciting events happening around campus</p>
        
        <div className="ee-controls">
          <div className="ee-filter-tabs">
            {['all', 'upcoming', 'running'].map(filter => (
              <button
                key={filter}
                className={`ee-filter-tab ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="ee-main">
        {filteredEvents.length > 0 ? (
          <div className="ee-grid">
            {filteredEvents.map(event => (
              <div key={event.id} className="ee-card">
                <div 
                  className="ee-card-image" 
                  style={{ backgroundImage: `url(${event.image})` }}
                >
                  {event.status === 'running' && (
                    <span className="ee-live-badge">
                      <span className="ee-pulse"></span> LIVE NOW
                    </span>
                  )}
                </div>
                <div className="ee-card-content">
                  <div className="ee-card-header">
                    <h3 className="ee-card-title">{event.title}</h3>
                    <span className="ee-card-club">{event.club}</span>
                  </div>
                  
                  <div className="ee-card-meta">
                    <span className="ee-meta-item">
                      <svg className="ee-meta-icon" viewBox="0 0 24 24">
                        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
                        <path d="M12 7v5l3 3"/>
                      </svg>
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })} • {event.time}
                    </span>
                    <span className="ee-meta-item">
                      <svg className="ee-meta-icon" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      {event.location}
                    </span>
                  </div>
                  
                  <p className="ee-card-description">{event.description}</p>
                  
                  <div className="ee-card-actions">
                    <Link 
                      to={`/event-details/${event.id}`} 
                      className="ee-primary-button"
                    >
                      {event.status === 'running' ? 'Join Now' : 'View Details'}
                    </Link>
                    <button className="ee-secondary-button">
                      <svg className="ee-action-icon" viewBox="0 0 24 24">
                        <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/>
                      </svg>
                      Save
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="ee-empty-state">
            <svg className="ee-empty-icon" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
              <path d="M12 18c3.31 0 6-2.69 6-6s-2.69-6-6-6-6 2.69-6 6 2.69 6 6 6zm0-10c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4z"/>
            </svg>
            <h3>No events found</h3>
            <p>Try adjusting your filters or check back later</p>
          </div>
        )}
      </main>

      <footer className="ee-footer">
        <Link to="/" className="ee-back-link">
          <svg className="ee-back-icon" viewBox="0 0 24 24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Back to Dashboard
        </Link>
      </footer>
    </div>
  );
};

export default ExploreEvents;