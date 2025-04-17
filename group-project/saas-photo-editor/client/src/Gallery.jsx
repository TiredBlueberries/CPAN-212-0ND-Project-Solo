import React, { useState, useEffect } from 'react';


const Gallery = () => {
  const [drawings, setDrawings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDrawings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/drawings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Failed to fetch drawings');
        const data = await response.json();
        setDrawings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDrawings();
  }, []);

  if (loading) return <div>Loading drawings...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="gallery-container">
      <h1>Your Art Gallery</h1>
      <div className="drawings-grid">
        {drawings.map(drawing => (
          <div key={drawing._id} className="drawing-card">
            <img 
              src={drawing.imageData} 
              alt={drawing.title}
              className="drawing-image"
            />
            <div className="drawing-info">
              <h3>{drawing.title}</h3>
              <p>Created: {new Date(drawing.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;