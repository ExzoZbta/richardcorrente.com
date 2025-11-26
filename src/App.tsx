import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import WaterSphereScene from './WaterSphereScene';
import grainTexture from './assets/img/grain.jpg';


// Shared Layout Component
function Layout({ children }: { children: React.ReactNode }) {
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const nameSectionRef = useRef<HTMLDivElement>(null);
  const richardRef = useRef<HTMLHeadingElement>(null);
  const correnteRef = useRef<HTMLHeadingElement>(null);
  const developerRef = useRef<HTMLSpanElement>(null);
  const designerRef = useRef<HTMLSpanElement>(null);
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
      <div 
        className="grain-overlay"
        style={{ backgroundImage: `url(${grainTexture})` }}
      />
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [bottomPadding, setBottomPadding] = useState(0);
  const [topPadding, setTopPadding] = useState(0);
  const [scrollProgress, setScrollProgress] = useState<{ [key: number]: number }>({});
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

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

  // Project details data
  const projectDetails = [
    {
      name: 'saudade',
      tags: '- VIRTUAL REALITY / EXHIBITION / THESIS -',
      mediaPlaceholder: 'Video/GIF placeholder for saudade'
    },
    {
      name: "'Mode 7' game engine",
      tags: '- PLACEHOLDER / TAGS / HERE -',
      mediaPlaceholder: "Video/GIF placeholder for 'Mode 7' game engine"
    },
    {
      name: 'attack of the clones',
      tags: '- PLACEHOLDER / TAGS / HERE -',
      mediaPlaceholder: 'Video/GIF placeholder for attack of the clones'
    },
    {
      name: 'webzine',
      tags: '- PLACEHOLDER / TAGS / HERE -',
      mediaPlaceholder: 'Video/GIF placeholder for webzine'
    },
    {
      name: 'tool for one',
      tags: '- PLACEHOLDER / TAGS / HERE -',
      mediaPlaceholder: 'Video/GIF placeholder for tool for one'
    },
    {
      name: 'writings in the fog',
      tags: '- PLACEHOLDER / TAGS / HERE -',
      mediaPlaceholder: 'Video/GIF placeholder for writings in the fog'
    },
    {
      name: 'fog animation',
      tags: '- PLACEHOLDER / TAGS / HERE -',
      mediaPlaceholder: 'Video/GIF placeholder for fog animation'
    },
    {
      name: 'emotion synthesizer',
      tags: '- PLACEHOLDER / TAGS / HERE -',
      mediaPlaceholder: 'Video/GIF placeholder for emotion synthesizer'
    },
  ];

  useEffect(() => {
    const updatePadding = () => {
      if (scrollContainerRef.current) {
        const viewportHeight = window.innerHeight;
        // Add padding equal to half viewport height so first/last items can center
        const padding = viewportHeight / 2;
        setTopPadding(padding);
        setBottomPadding(padding);
      }
    };

    updatePadding();
    window.addEventListener('resize', updatePadding);
    return () => window.removeEventListener('resize', updatePadding);
  }, []);

  // Scroll to center first item on initial load
  useEffect(() => {
    if (topPadding > 0 && scrollContainerRef.current) {
      const scrollContainer = scrollContainerRef.current;
      const firstItem = scrollContainer.querySelector('.project-item');
      
      if (firstItem) {
        // Wait for next frame to ensure padding is applied
        requestAnimationFrame(() => {
          const containerRect = scrollContainer.getBoundingClientRect();
          const itemRect = firstItem.getBoundingClientRect();
          const containerCenter = containerRect.height / 2;
          const itemHeight = itemRect.height;
          
          // Scroll so the first item is centered
          const scrollTarget = topPadding - containerCenter + itemHeight / 2;
          scrollContainer.scrollTop = scrollTarget;
        });
      }
    }
  }, [topPadding]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const items = scrollContainer.querySelectorAll('.project-item');
      const containerRect = scrollContainer.getBoundingClientRect();
      const centerY = containerRect.top + containerRect.height / 2;

      const newScrollProgress: { [key: number]: number } = {};

      items.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const itemCenterY = rect.top + rect.height / 2;
        
        // Calculate distance from center of viewport
        const distanceFromCenter = itemCenterY - centerY;
        const maxDistance = containerRect.height / 2;
        
        const progress = Math.max(-1, Math.min(1, distanceFromCenter / maxDistance));
        
        newScrollProgress[index] = progress;
      });

      setScrollProgress(newScrollProgress);
    };

    // Initial calculation
    handleScroll();

    scrollContainer.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const getItemStyle = (index: number) => {
    const progress = scrollProgress[index] || 0;
    
    // Calculate rotation based on progress (-90 to 90 degrees)
    const rotateX = progress * 35; // Reduced angle for subtler effect
    
    const opacity = Math.max(0, 1 - Math.abs(progress) * 0.7);
    
    // Calculate scale (slightly smaller at edges)
    const scale = 1 - Math.abs(progress) * 0.15;
    
    const translateZ = -Math.abs(progress) * 80;
    
    // diagonal movement
    const translateX = progress * -30;

    return {
      transform: `
        perspective(1000px) 
        rotateX(${rotateX}deg) 
        translateZ(${translateZ}px)
        translateX(${translateX}px)
        scale(${scale})
      `,
      opacity,
    };
  };

  return (
    <>
      {/* Project Details Display (behind water sphere) */}
      {hoveredProject !== null && (
        <div className="project-details-container">
          <div className="project-details-content">
            <div className="project-tags">
              {projectDetails[hoveredProject].tags}
            </div>
            <div className="project-media-placeholder">
              {projectDetails[hoveredProject].mediaPlaceholder}
            </div>
          </div>
        </div>
      )}

      <div className="right-panel">
        <div ref={scrollContainerRef} className="scroll-container">
          <div 
            ref={projectListRef}
            className="project-list carousel-list"
            style={{ 
              paddingTop: `${topPadding}px`,
              paddingBottom: `${bottomPadding}px` 
            }}
          >
            {projects.map((project, index) => (
              <div 
                key={index} 
                className="project-item carousel-item"
                style={getItemStyle(index)}
                onMouseEnter={() => setHoveredProject(index)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                {project}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
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