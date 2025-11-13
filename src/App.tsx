import React, { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const projectListRef = useRef<HTMLDivElement>(null);
  const nameSectionRef = useRef<HTMLDivElement>(null);
  const richardRef = useRef<HTMLHeadingElement>(null);
  const correnteRef = useRef<HTMLHeadingElement>(null);
  const developerRef = useRef<HTMLSpanElement>(null);
  const designerRef = useRef<HTMLSpanElement>(null);
  const [bottomPadding, setBottomPadding] = useState(0);
  const [correnteLeft, setCorrenteLeft] = useState(0);
  const [developerLeft, setDeveloperLeft] = useState(0);
  const [developerTop, setDeveloperTop] = useState(0);
  const [designerLeft, setDesignerLeft] = useState(0);
  const [designerTop, setDesignerTop] = useState(0);

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

  // Set CORRENTE position and wait for fonts
  useEffect(() => {
    const initializeCorrentePosition = async () => {
      if (richardRef.current) {
        // Wait for fonts to be ready
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }
        
        // Wait for layout to be ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const richardWidth = richardRef.current.offsetWidth;
        setCorrenteLeft(richardWidth);
      }
    };

    initializeCorrentePosition();
  }, []);

  // Calculate role positions after CORRENTE is positioned
  useEffect(() => {
    if (correnteLeft === 0) return;

    const updatePositions = () => {
      if (
        richardRef.current && 
        correnteRef.current && 
        developerRef.current && 
        designerRef.current &&
        nameSectionRef.current
      ) {
        // Get bounding boxes relative to name-section
        const nameSectionRect = nameSectionRef.current.getBoundingClientRect();
        const richardRect = richardRef.current.getBoundingClientRect();
        const correnteRect = correnteRef.current.getBoundingClientRect();
        
        // Calculate centers
        const richardCenterX = richardRect.left - nameSectionRect.left + richardRect.width / 2;
        const richardCenterY = richardRect.top - nameSectionRect.top + richardRect.height / 2;
        
        const correnteCenterX = correnteRect.left - nameSectionRect.left + correnteRect.width / 2;
        const correnteCenterY = correnteRect.top - nameSectionRect.top + correnteRect.height / 2;
        
        const developerWidth = developerRef.current.offsetWidth;
        setDeveloperLeft(richardCenterX - developerWidth / 2);
        setDeveloperTop(correnteCenterY);
        
        const designerWidth = designerRef.current.offsetWidth;
        setDesignerLeft(correnteCenterX - designerWidth / 2);
        setDesignerTop(richardCenterY);
      }
    };

    // ensure DOM updated
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        updatePositions();
      });
    });
  }, [correnteLeft]);

  // padding and resize handling
  useEffect(() => {
    const updatePadding = () => {
      if (leftPanelRef.current && projectListRef.current) {
        const leftPanelHeight = leftPanelRef.current.offsetHeight;
        const viewportHeight = window.innerHeight;
        const padding = viewportHeight - leftPanelHeight;
        setBottomPadding(padding);
      }
    };

    const updatePositions = () => {
      if (
        richardRef.current && 
        correnteRef.current && 
        developerRef.current && 
        designerRef.current &&
        nameSectionRef.current &&
        correnteLeft > 0
      ) {
        const nameSectionRect = nameSectionRef.current.getBoundingClientRect();
        const richardRect = richardRef.current.getBoundingClientRect();
        const correnteRect = correnteRef.current.getBoundingClientRect();
        
        const richardCenterX = richardRect.left - nameSectionRect.left + richardRect.width / 2;
        const richardCenterY = richardRect.top - nameSectionRect.top + richardRect.height / 2;
        
        const correnteCenterX = correnteRect.left - nameSectionRect.left + correnteRect.width / 2;
        const correnteCenterY = correnteRect.top - nameSectionRect.top + correnteRect.height / 2;
        
        const developerWidth = developerRef.current.offsetWidth;
        setDeveloperLeft(richardCenterX - developerWidth / 2);
        setDeveloperTop(correnteCenterY);
        
        const designerWidth = designerRef.current.offsetWidth;
        setDesignerLeft(correnteCenterX - designerWidth / 2);
        setDesignerTop(richardCenterY);
      }
    };

    const handleResize = () => {
      updatePadding();
      updatePositions();
    };

    updatePadding();
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [correnteLeft]);

  return (
    <div className="App">
      <div className="container">
        
        {/* Name and Navigation */}
        <div ref={leftPanelRef} className="left-panel">
          <div ref={nameSectionRef} className="name-section">
            <div className="name-row first-row">
              <h1 ref={richardRef} className="name">RICHARD</h1>
            </div>
            <div className="name-row second-row" style={{ marginLeft: `${correnteLeft}px` }}>
              <h1 ref={correnteRef} className="name">CORRENTE</h1>
            </div>
            <span 
              ref={developerRef} 
              className="role developer-role"
              style={{ 
                position: 'absolute',
                left: `${developerLeft}px`,
                top: `${developerTop}px`,
                transform: 'translateY(-50%)'
              }}
            >
              developer
            </span>
            <span 
              ref={designerRef} 
              className="role designer-role"
              style={{ 
                position: 'absolute',
                left: `${designerLeft}px`,
                top: `${designerTop}px`,
                transform: 'translateY(-50%)'
              }}
            >
              designer
            </span>
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