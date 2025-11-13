import React, { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const projectListRef = useRef<HTMLDivElement>(null);
  const [bottomPadding, setBottomPadding] = useState(0);

  const projects = [
    'saudade',
    "'Mode 7' game engine",
    'attack of the clones',
    'webzine',
    'tool for one',
    'writings in the fog',
    'fog animation',
    'emotion synthesizer',
  ];

  useEffect(() => {
    const updatePadding = () => {
      if (leftPanelRef.current && projectListRef.current) {
        const leftPanelHeight = leftPanelRef.current.offsetHeight;
        const viewportHeight = window.innerHeight;
        // padding to align last item with bottom of navbar
        const padding = viewportHeight - leftPanelHeight;
        setBottomPadding(padding);
      }
    };

    updatePadding();
    window.addEventListener('resize', updatePadding);
    return () => window.removeEventListener('resize', updatePadding);
  }, []);

  return (
    <div className="App">
      <div className="container">
        {/* Name and Navigation */}
        <div ref={leftPanelRef} className="left-panel">
          <div className="name-section">
            <div className="name-row">
              <h1 className="name">RICHARD</h1>
              <span className="role">developer</span>
            </div>
            <div className="name-row">
              <span className="role">designer</span>
              <h1 className="name">CORRENTE</h1>
            </div>
          </div>
          <nav className="navigation">
            <a href="#work" className="nav-link">work</a>
            <a href="#about" className="nav-link">about</a>
            <a href="#contact" className="nav-link">contact</a>
          </nav>
        </div>

        {/* Scrolling List */}
        <div className="right-panel">
          <div className="scroll-container">
            <div 
              ref={projectListRef}
              className="project-list"
              style={{ paddingBottom: `${bottomPadding}px` }}
            >
              {projects.map((project, index) => (
                <div key={index} className="project-item">
                  {project}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
