import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import WaterSphereScene from './WaterSphereScene';


// Shared Layout Component
function Layout({ children }: { children: React.ReactNode }) {
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const nameSectionRef = useRef<HTMLDivElement>(null);
  const richardRef = useRef<HTMLHeadingElement>(null);
  const correnteRef = useRef<HTMLHeadingElement>(null);
  const developerRef = useRef<HTMLSpanElement>(null);
  const designerRef = useRef<HTMLSpanElement>(null);
  const waterSphereRef = useRef<HTMLDivElement>(null);
  const [correnteLeft, setCorrenteLeft] = useState(0);
  const [developerLeft, setDeveloperLeft] = useState(0);
  const [developerTop, setDeveloperTop] = useState(0);
  const [designerLeft, setDesignerLeft] = useState(0);
  const [designerTop, setDesignerTop] = useState(0);
  const location = useLocation();
  const prevLocationRef = useRef<string>(location.pathname);

  // Set CORRENTE position and wait for fonts
  useEffect(() => {
    
    const initializeCorrentePosition = async () => {
      if (richardRef.current) {
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
        const richardWidth = richardRef.current.offsetWidth;
        setCorrenteLeft(richardWidth);
      }
    };
    initializeCorrentePosition();

    prevLocationRef.current = location.pathname;
  }, [location.pathname]);

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
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        updatePositions();
      });
    });
  }, [correnteLeft]);

  // Update positions on resize
  useEffect(() => {
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
      updatePositions();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [correnteLeft]);

  const isActive = (path: string) => {
    //  show "work" active if coming from about or contact
    if (path === '/') {
      const cameFromAboutOrContact = prevLocationRef.current === '/about' || prevLocationRef.current === '/contact';
      return location.pathname === '/' && cameFromAboutOrContact;
    }
    return location.pathname === path;
  };

  return (
    <div className="App">
      <div className="water-sphere-container">
        <WaterSphereScene />
      </div>
      <div className="container">
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
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              work
            </Link>
            <Link 
              to="/about" 
              className={`nav-link ${isActive('/about') ? 'active' : ''}`}
            >
              about
            </Link>
            <Link 
              to="/contact" 
              className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
            >
              contact
            </Link>
          </nav>
        </div>
        {children}
      </div>
    </div>
  );
}

// Home Page Component
function Home() {
  const projectListRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
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
        const padding = viewportHeight - leftPanelHeight;
        setBottomPadding(padding);
      }
    };

    updatePadding();
    window.addEventListener('resize', updatePadding);
    return () => window.removeEventListener('resize', updatePadding);
  }, []);

  return (
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
  );
}

// About Page Component
function About() {
  return (
    <div className="right-panel">
      {/* content */}
    </div>
  );
}

// Contact Page Component
function Contact() {
  return (
    <div className="right-panel">
      {/* content */}
    </div>
  );
}

// Main App Component
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;