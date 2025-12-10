import React, { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import './App.css';
import WaterSphereScene from './WaterSphereScene';
import grainTexture from './assets/img/grain.jpg';

// Saudade
import overview2 from './assets/img/fragment-tpose.jpg';
import overview22 from './assets/img/fragment-blender.PNG';
import overview23 from './assets/img/fragment-trace.jpg';
import gameplay1 from './assets/img/gameplay1.jpg';
import exhibition1 from './assets/img/exhibition1.jpg';
import sprinting from './assets/vid/sprinting.mp4';
import introVideo from './assets/vid/intro.mp4';
import chaseVideo from './assets/vid/chase.mp4';
import tape2Video from './assets/vid/tape2.mp4';
import coverVideo from './assets/vid/cover.mp4';

// 'Mode 7' game engine
import mode7cover from './assets/vid/mode7cover.mp4';
import gameengine1 from './assets/img/gameengine1.png';
import gameengine2 from './assets/img/gameengine2.png';
import mode7ui from './assets/img/mode7ui.png';
import mode7gameplay from './assets/vid/mode7gameplay.mp4';
import mode7editor from './assets/vid/mode7editor.mp4';

// Attack of the cones
import conesdust from './assets/img/cones-dust.png';
import conesenvironment1 from './assets/img/cones-environment1.png';
import conesenvironment2 from './assets/img/cones-environment2.png';

import { ReactComponent as LinkedInIcon } from './assets/img/linkedin.svg';
import { ReactComponent as GitHubIcon } from './assets/img/github.svg';
import { ReactComponent as EmailIcon } from './assets/img/email.svg';


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
  useLayoutEffect(() => {
    const applyNameScaling = () => {
      if (!richardRef.current || !nameSectionRef.current || !correnteRef.current) return;

      const richardEl = richardRef.current;
      const correnteEl = correnteRef.current;
      const nameSectionEl = nameSectionRef.current;

      richardEl.style.fontSize = '';
      correnteEl.style.fontSize = '';

      const baseFontSize = parseFloat(window.getComputedStyle(richardEl).fontSize);
      const nameSectionWidth = nameSectionEl.offsetWidth;
      const richardWidth = richardEl.offsetWidth;
      const correnteWidth = correnteEl.offsetWidth;
      const totalWidth = richardWidth + correnteWidth;
      const buffer = 0.5;
      const availableWidth = Math.max(0, nameSectionWidth - buffer);

      let scale = 1;
      if (totalWidth > availableWidth && availableWidth > 0) {
        scale = availableWidth / totalWidth;
      }

      const appliedFontSize = scale < 0.999 ? `${baseFontSize * scale}px` : '';
      richardEl.style.fontSize = appliedFontSize;
      correnteEl.style.fontSize = appliedFontSize;

      const finalRichardWidth = richardEl.offsetWidth;
      setCorrenteLeft(finalRichardWidth);
    };

    const handleWindowResize = () => {
      requestAnimationFrame(applyNameScaling);
    };

    const initialize = async () => {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
      applyNameScaling();
    };

    initialize();
    window.addEventListener('resize', handleWindowResize);

    let resizeObserver: ResizeObserver | null = null;
    let resizeTimeout: NodeJS.Timeout | null = null;
    
    if (nameSectionRef.current) {
      resizeObserver = new ResizeObserver(() => {
        // Debounce the resize callback to prevent excessive recalculations
        if (resizeTimeout) {
          clearTimeout(resizeTimeout);
        }
        resizeTimeout = setTimeout(() => {
          requestAnimationFrame(applyNameScaling);
        }, 0);
      });
      resizeObserver.observe(nameSectionRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleWindowResize);
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      resizeObserver?.disconnect();
    };
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
        // Use requestAnimationFrame to ensure DOM has updated
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
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
          });
        });
      }
    };

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        updatePositions();
      }, 16); // ~60fps
    };

    window.addEventListener('resize', handleResize);
    // Also listen for font loading changes
    if (document.fonts) {
      document.fonts.addEventListener('loadingdone', updatePositions);
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      if (document.fonts) {
        document.fonts.removeEventListener('loadingdone', updatePositions);
      }
    };
  }, [correnteLeft]);

  const isActive = (path: string) => {
    //  show "work" active if coming from about or contact
    if (path === '/') {
      const cameFromAboutOrContact = prevLocationRef.current === '/about' || prevLocationRef.current === '/contact';
      return location.pathname === '/' && cameFromAboutOrContact;
    }
    return location.pathname === path;
  };

  // Update prev location ref
  useEffect(() => {
    prevLocationRef.current = location.pathname;
  }, [location.pathname]);

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [bottomPadding, setBottomPadding] = useState(0);
  const [topPadding, setTopPadding] = useState(0);
  const [scrollProgress, setScrollProgress] = useState<{ [key: number]: number }>({});
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const navigate = useNavigate();

  const projects = [
    'saudade',
    "'Mode 7' game engine",
    'attack of the cones',
    'webzine',
    'tool for one',
    'writings in the fog',
    'fog animation',
    'emotion synthesizer',
  ];

  const projectSlugs = [
    'saudade',
    'mode-7-game-engine',
    'attack-of-the-cones',
    'webzine',
    'tool-for-one',
    'writings-in-the-fog',
    'fog-animation',
    'emotion-synthesizer',
  ];

  // Project details with preview videos
  const projectDetails = [
    {
      name: 'saudade',
      tags: '- VIRTUAL REALITY / EXHIBITION / THESIS -',
      media: coverVideo
    },
    {
      name: "'Mode 7' game engine",
      tags: '- 2D+2.5D ENGINE / SYSTEMS / EDITOR TOOLING -',
      media: mode7cover
    },
    {
      name: 'attack of the cones',
      tags: '- 3D GRAPHICS / SYSTEMS / REAL-TIME -',
      mediaPlaceholder: 'Video/GIF placeholder for attack of the cones'
    },
    {
      name: 'webzine',
      tags: '- WEB DESIGN / INTERACTIVE / UI -',
      mediaPlaceholder: 'Video/GIF placeholder for webzine'
    },
    {
      name: 'tool for one',
      tags: '- WEB DESIGN / INTERACTIVE / UI -',
      mediaPlaceholder: 'Video/GIF placeholder for tool for one'
    },
    {
      name: 'writings in the fog',
      tags: '- GRAPHIC DESIGN / BOOK / ILLUSTRATION -',
      mediaPlaceholder: 'Video/GIF placeholder for writings in the fog'
    },
    {
      name: 'fog animation',
      tags: '- 2D+3D MOTION GRAPHICS / ILLUSTRATION -',
      mediaPlaceholder: 'Video/GIF placeholder for fog animation'
    },
    {
      name: 'emotion synthesizer',
      tags: '- KINETIC SCULPTURE / MUSIC / INTERACTIVE -',
      mediaPlaceholder: 'Video/GIF placeholder for emotion synthesizer'
    },
  ];

  useEffect(() => {
    const updatePadding = () => {
      if (scrollContainerRef.current) {
        const viewportHeight = window.innerHeight;
        const padding = viewportHeight / 2;
        setTopPadding(padding);
        setBottomPadding(padding);
      }
    };

    updatePadding();
    window.addEventListener('resize', updatePadding);
    return () => window.removeEventListener('resize', updatePadding);
  }, []);

  useEffect(() => {
    if (topPadding > 0 && scrollContainerRef.current) {
      const scrollContainer = scrollContainerRef.current;
      const firstItem = scrollContainer.querySelector('.project-item');
      
      if (firstItem) {
        requestAnimationFrame(() => {
          const containerRect = scrollContainer.getBoundingClientRect();
          const itemRect = firstItem.getBoundingClientRect();
          const containerCenter = containerRect.height / 2;
          const itemHeight = itemRect.height;
          
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
        
        const distanceFromCenter = itemCenterY - centerY;
        const maxDistance = containerRect.height / 2;
        
        const progress = Math.max(-1, Math.min(1, distanceFromCenter / maxDistance));
        
        newScrollProgress[index] = progress;
      });

      setScrollProgress(newScrollProgress);
    };

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
    
    const rotateX = progress * 35;
    
    const opacity = Math.max(0, 1 - Math.abs(progress) * 0.7);
    
    const scale = 1 - Math.abs(progress) * 0.15;
    
    const translateZ = -Math.abs(progress) * 80;
    
    const translateX = progress * -30;

    const finalOpacity = hoveredProject === index ? 1 : opacity;

    return {
      transform: `
        perspective(1000px) 
        rotateX(${rotateX}deg) 
        translateZ(${translateZ}px)
        translateX(${translateX}px)
        scale(${scale})
      `,
      opacity: finalOpacity,
    };
  };

  return (
    <>
      {/* Project Details Display */}
      {hoveredProject !== null && (
        <div className="project-details-container">
          <div className="project-details-content">
            <div className="project-tags">
              {projectDetails[hoveredProject].tags}
            </div>
            <div className="project-media-placeholder">
              {projectDetails[hoveredProject].media ? (
                <video
                  src={projectDetails[hoveredProject].media}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="project-preview-video"
                />
              ) : (
                projectDetails[hoveredProject].mediaPlaceholder
              )}
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
                data-text={project}
                style={getItemStyle(index)}
                onMouseEnter={() => setHoveredProject(index)}
                onMouseLeave={() => setHoveredProject(null)}
                onClick={() => navigate(`/project/${projectSlugs[index]}`)}
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
      <div className="about-container">
        <div className="about-content">
          <p className="about-paragraph">
            I'm Richard Corrente, a developer and artist who likes building things that pull people in worlds you can step inside&nbsp;of, imprinting moments that hopefully stick with&nbsp;you forever.
          </p>
          <p className="about-paragraph">
            I recently graduated from Yale with a B.A. in Computing and the Arts, where I spent most of my time working in VR, game and web design, creative coding, software engineering, and interactive&nbsp;media.
          </p>
          <p className="about-paragraph">
            I'm especially interested in the mechanics behind immersion, specifically how atmosphere, movement, audio, and narrative can impact the way someone feels in a&nbsp;space.
          </p>
          <p className="about-paragraph">
            I ultimately want to create the most memorable experiences&nbsp;possible.
          </p>
          <p className="about-paragraph">
            In my free time, I enjoy working out and playing video games.<br></br>Also, a huge One Piece&nbsp;fan.
          </p>
        </div>
      </div>
    </div>
  );
}

// Contact Page Component
function Contact() {
  return (
    <div className="right-panel">
      <div className="contact-container">
        <div className="contact-content">
          <a 
            href="https://www.linkedin.com/in/richardco/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="contact-link"
          >
            <LinkedInIcon className="contact-icon" />
            <span className="contact-text">linkedin.com/in/richardco</span>
          </a>
          
          <a 
            href="https://github.com/ExzoZbta" 
            target="_blank" 
            rel="noopener noreferrer"
            className="contact-link"
          >
            <GitHubIcon className="contact-icon" />
            <span className="contact-text">github.com/ExzoZbta</span>
          </a>
          
          <a 
            href="mailto:rcorrente@aya.yale.edu"
            className="contact-link"
          >
            <EmailIcon className="contact-icon" />
            <span className="contact-text">rcorrente@aya.yale.edu</span>
          </a>
        </div>
      </div>
    </div>
  );
}

type LazyVideoProps = {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  controls?: boolean;
  muted?: boolean;
  fillContainer?: boolean;
};

function LazyVideo({
  src,
  poster,
  autoPlay = true,
  loop = true,
  controls = false,
  muted = true,
  fillContainer = true,
}: LazyVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasLoadedSource = useRef(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const videoEl = videoRef.current;
    if (!container || !videoEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!videoEl) return;
          if (entry.isIntersecting) {
            if (!hasLoadedSource.current) {
              videoEl.src = src;
              videoEl.load();
              hasLoadedSource.current = true;
            }
            if (autoPlay) {
              const playPromise = videoEl.play();
              if (playPromise) {
                playPromise.catch(() => {});
              }
            }
          } else if (hasLoadedSource.current) {
            videoEl.pause();
          }
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      videoEl.pause();
    };
  }, [src, autoPlay]);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const handleLoadedData = () => setIsReady(true);
    videoEl.addEventListener('loadeddata', handleLoadedData);
    return () => {
      videoEl.removeEventListener('loadeddata', handleLoadedData);
    };
  }, []);

  return (
    <div ref={containerRef} className="project-content-image">
      <video
        ref={videoRef}
        className={`project-image project-video ${fillContainer ? 'project-video-fill' : ''}`}
        poster={poster}
        playsInline
        muted={muted}
        loop={loop}
        controls={controls}
        preload="none"
        tabIndex={-1}
      />
      {!isReady && <div className="video-placeholder" aria-hidden="true" />}
    </div>
  );
}

// Image Carousel Component
function ImageCarousel({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({
    isDragging: false,
    hasDragged: false,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    startTime: 0,
    dragDirection: null as 'horizontal' | 'vertical' | null,
  });

  const scrollToIndex = useCallback((index: number) => {
    const container = carouselRef.current;
    if (!container) return;
    const clamped = Math.max(0, Math.min(index, images.length - 1));
    container.scrollTo({
      left: clamped * container.clientWidth,
      behavior: 'smooth'
    });
  }, [images.length]);

  const goToNext = useCallback(() => {
    scrollToIndex(currentIndex + 1);
  }, [currentIndex, scrollToIndex]);

  const goToPrev = useCallback(() => {
    scrollToIndex(currentIndex - 1);
  }, [currentIndex, scrollToIndex]);

  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    const handleScroll = () => {
      const width = container.clientWidth;
      if (!width) return;
      const newIndex = Math.round(container.scrollLeft / width);
      setCurrentIndex(newIndex);
    };

    handleScroll();
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const container = carouselRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
      if (!isInViewport) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = carouselRef.current;
    if (!container) return;
    
    const target = e.target as HTMLElement;
    if (target.closest('.carousel-arrow')) {
      return;
    }
    
    dragState.current = {
      isDragging: true,
      hasDragged: false,
      startX: e.clientX,
      startY: e.clientY,
      scrollLeft: container.scrollLeft,
      startTime: Date.now(),
      dragDirection: null,
    };
  };

  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!dragState.current.isDragging) return;
      
      const diffX = e.clientX - dragState.current.startX;
      const diffY = e.clientY - dragState.current.startY;
      
      if (dragState.current.dragDirection === null) {
        const absX = Math.abs(diffX);
        const absY = Math.abs(diffY);
        
        // Need at least 8px of movement to determine direction
        if (absX > 8 || absY > 8) {
          if (absX > absY * 2) {
            dragState.current.dragDirection = 'horizontal';
            container.classList.add('is-dragging');
            e.preventDefault();
          } else {
            dragState.current.dragDirection = 'vertical';
            dragState.current.isDragging = false;
            return;
          }
        } else {
          return;
        }
      }
      
      // Only handle horizontal drags
      if (dragState.current.dragDirection === 'horizontal') {
        if (Math.abs(diffX) > 5) {
          dragState.current.hasDragged = true;
        }
        
        container.scrollLeft = dragState.current.scrollLeft - diffX;
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!dragState.current.isDragging) return;
      
      if (dragState.current.dragDirection !== 'horizontal') {
        dragState.current.isDragging = false;
        return;
      }
      
      dragState.current.isDragging = false;
      container.classList.remove('is-dragging');

      const width = container.clientWidth;
      if (!width) return;
      
      const dragDistance = Math.abs(container.scrollLeft - dragState.current.scrollLeft);
      const dragDuration = Date.now() - dragState.current.startTime;
      const velocity = dragDistance / dragDuration;
   
      const MINIMUM_DRAG_THRESHOLD = 15;
      if (dragDistance < MINIMUM_DRAG_THRESHOLD) {
        scrollToIndex(currentIndex);
        return;
      }

      const rawIndex = container.scrollLeft / width;
      const fraction = rawIndex - Math.floor(rawIndex);
      const direction = Math.sign(container.scrollLeft - dragState.current.scrollLeft);

      let targetIndex = currentIndex;
      
      const isQuickSwipe = velocity > 0.3;
      const threshold = isQuickSwipe ? 0.05 : 0.08;
      
      if (direction > 0 && (fraction > threshold || isQuickSwipe)) {
        targetIndex = currentIndex + 1;
      } else if (direction < 0 && (fraction < (1 - threshold) || isQuickSwipe)) {
        targetIndex = currentIndex - 1;
      }

      scrollToIndex(targetIndex);
    };

    document.addEventListener('pointermove', handlePointerMove, { capture: true, passive: false });
    document.addEventListener('pointerup', handlePointerUp, { capture: true });
    document.addEventListener('pointercancel', handlePointerUp, { capture: true });
    
    return () => {
      document.removeEventListener('pointermove', handlePointerMove, { capture: true });
      document.removeEventListener('pointerup', handlePointerUp, { capture: true });
      document.removeEventListener('pointercancel', handlePointerUp, { capture: true });
    };
  }, [scrollToIndex, currentIndex]);

  return (
    <div className="project-carousel-shell">
      <div 
        className="project-carousel-container"
        ref={carouselRef}
        tabIndex={0}
      >
        <div 
          className="project-carousel-track"
          onPointerDown={handlePointerDown}
        >
          {images.map((img, idx) => (
            <div key={idx} className="project-carousel-slide">
              <img src={img} alt={`Slide ${idx + 1}`} className="project-image" draggable={false} />
            </div>
          ))}
        </div>
      </div>

      {currentIndex > 0 && (
        <button 
          className="carousel-arrow carousel-arrow-left" 
          onClick={goToPrev}
          aria-label="Previous image"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
      
      {currentIndex < images.length - 1 && (
        <button 
          className="carousel-arrow carousel-arrow-right" 
          onClick={goToNext}
          aria-label="Next image"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      <div className="carousel-counter">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}

// Project Content Data
const projectContentData: { [key: string]: any } = {
  'saudade': {
    title: 'saudade',
    date: '2024-2025',
    tools: ['Unity3D (OpenXR)', 'C#', 'Blender', 'Adobe Premiere Pro'],
    skills: ['Game design', 'Game development', 'VR'],
    projectUrl: 'https://github.com/ExzoZbta/saudade-vr',
    content: [
      { type: 'video', src: coverVideo },
      { type: 'divider' },
      { type: 'tools-skills' },
      { type: 'section-title', text: 'OVERVIEW' },
      { type: 'paragraph', text: 'Saudade is a VR psychological horror experience investigating how immersion can be engineered through atmosphere, dynamic mechanics, and environmental storytelling.' },
      { type: 'video', src: introVideo, poster: overview2 },
      { type: 'paragraph', text: 'Built around a dynamic "figure of horror," the game uses heuristic-based AI to observe and dynamically react to player behavior creating a relationship defined by tension and unpredictability.' },
      { type: 'carousel', images: [overview2, overview22, overview23] },
      { type: 'paragraph', text: 'By prioritizing mood, sound, spatial disorientation, and adaptive threat over traditional jump scares, Saudade serves as an in-depth exploration of immersive game design, demonstrating how VR can heighten emotional and cognitive engagement.' },
      { type: 'section-title', text: 'GAMEPLAY' },
      { type: 'paragraph', text: 'To complete the game, the player must avoid \'The Fragment\' and escape Saudade Memory Rehabilitation Center. However, before escape, the player must collect and watch 3 VHS tapes. Upon collecting all 3 tapes, the player completes the game.' },
      { type: 'image', src: gameplay1 },
      { type: 'paragraph', text: 'Each tape depicts the interactions between a father (the recorder), his wife, and his young daughter.' },
      { type: 'video', src: tape2Video },
      { type: 'paragraph', text: 'To evade \'The Fragment,\' the player can hide under beds and in lockers scattered throughout the facility. If the player is caught, all progress is lost as they respawn in Patient #023\'s room—where the player woke up.' },
      { type: 'paragraph', text: 'The player can only see \'The Fragment\' by looking into the reflection of a handheld mirror. Otherwise, the player must rely on sound cues emitted by the entity\'s movements or actions.' },
      { type: 'video', src: chaseVideo },
      { type: 'section-title', text: 'EXHIBITION & NARRATIVE' },
      { type: 'paragraph', text: 'Saudade was publicly showcased as an interactive VR installation, presented as a standalone playable environment within a physical exhibition space. The space featured a VCR and a CRT TV, which played the VHS tapes recorded by the father.' },
      { type: 'image', src: exhibition1 },
      { type: 'video', src: sprinting, fillContainer: false },
    ]
  },
  'mode-7-game-engine': {
    title: "'Mode 7' game engine",
    date: '2024',
    tools: ['Dlang', 'Python', 'SDL2'],
    skills: ['Engine development', 'Systems architecture', 'API design', 'UI tooling'],
    projectUrl: 'https://github.com/ExzoZbta/cortex-crusaders',
    content: [
      { type: 'video', src: mode7cover },
      { type: 'divider' },
      { type: 'tools-skills' },
      { type: 'section-title', text: 'OVERVIEW' },
      { type: 'paragraph', text: 'Developed with Archit Kumar and Sachin Thakrar, the Mode 7 game engine is a 2D/2.5D hybrid game engine created to explore modern engine architecture and low-level rendering techniques.' },
      { type: 'image', src: mode7ui },
      { type: 'paragraph', text: 'The engine features a custom renderer capable of generating psuedo-3D environments from 2D textures, supported by a full component-based framework for sprites, collisions, animation, scripting, and scene logic.' },
      { type: 'paragraph', text: 'Backed by a modular resource manager and a hierarchical scene tree visualizer, enabling efficient object organization and real-time content manipulation.' },
      { type: 'section-title', text: 'UI TOOLING' },
      { type: 'video', src: mode7editor },
      { type: 'paragraph', text: 'Equipped with a Python editor allowing for scenes, objects, and components to be created and modified while the game is running.' },
      { type: 'paragraph', text: 'The engine is designed to be extensible, allowing for easy integration of new features and systems.' },
      { type: 'section-title', text: 'GAMEPLAY' },
      { type: 'paragraph', text: 'Alongside the engine, we developed a small playable demo featuring a Mode7 world, animated characters, collectible systems, procedural spawns, and bitmap-font UI.' },
      { type: 'video', src: mode7gameplay },
      { type: 'carousel', images: [gameengine1, gameengine2] },
      { type: 'paragraph', text: 'The project ultimately served as a deep dive into graphics programming, engine tooling, and architectural design, teaching us the nuances of building interactive systems from the ground up.' },

    ]
  },
  'attack-of-the-cones': {
    title: 'attack of the cones',
    date: '2025',
    tools: ['Dlang', 'OpenGL', 'SDL2'],
    skills: ['Real-time particles & lighting', 'Instanced rendering', 'Scene graphs'],
    projectUrl: 'https://github.com/ExzoZbta/attack-of-the-cones',
    content: [
      { type: 'image', placeholder: 'project image/video' },
      { type: 'divider' },
      { type: 'tools-skills' },
      { type: 'section-title', text: 'OVERVIEW' },
      { type: 'paragraph', text: 'Developed with Archit Kumar, Attack of the Cones is a real-time 3D graphics application showcasing modern rendering pipelines and  high-performance techniques. The project implements instanced rendering to efficiently draw thousands of objects, each with unique per-instance transformations and animations. ' },
      { type: 'paragraph', text: 'Integrates a hierarchical scene graph system to manage complex object relationships, enabling structured transformations and efficient real-time rendering.' },
      { type: 'carousel', images: [conesenvironment1, conesenvironment2] },
      { type: 'paragraph', text: 'A dynamic lighting system supports movable point lights, emissive cubes, and closest-point calculations for illumination effects.' },
      { type: 'image', placeholder: 'insert video of lighting system' },
      { type: 'paragraph', text: 'To improve environmental depth, I engineered a multi-layered particle and dust system driven by player-centered logic and variable density fields.' },
      { type: 'image', src: conesdust },
      { type: 'paragraph', text: 'A custom material pipeline supports diffuse, specular, and normal mapping across multiple material types under various lighting conditions.' },
    ]
  },
  'webzine': {
    title: 'webzine',
    date: '2024',
    tools: ['Placeholder Tool'],
    skills: ['Placeholder Skill'],
    projectUrl: 'https://exzozbta.github.io/interactive/project-1/final/terminal/terminal.html',
    content: [
      { type: 'image', placeholder: 'project image/video' },
      { type: 'divider' },
      { type: 'tools-skills' },
      { type: 'section-title', text: 'OVERVIEW' },
      { type: 'paragraph', text: 'Project content coming soon...' },
      { type: 'image', placeholder: 'project image/video' }
    ]
  },
  'tool-for-one': {
    title: 'tool for one',
    date: '2024',
    tools: ['Placeholder Tool'],
    skills: ['Placeholder Skill'],
    projectUrl: 'https://exzozbta.github.io/interactive/project-2/final/index.html',
    content: [
      { type: 'image', placeholder: 'project image/video' },
      { type: 'divider' },
      { type: 'tools-skills' },
      { type: 'section-title', text: 'OVERVIEW' },
      { type: 'paragraph', text: 'Project content coming soon...' },
      { type: 'image', placeholder: 'project image/video' }
    ]
  },
  'writings-in-the-fog': {
    title: 'writings in the fog',
    date: '2025',
    tools: ['Placeholder Tool'],
    skills: ['Placeholder Skill'],
    projectUrl: '#',
    content: [
      { type: 'image', placeholder: 'project image/video' },
      { type: 'divider' },
      { type: 'tools-skills' },
      { type: 'section-title', text: 'OVERVIEW' },
      { type: 'paragraph', text: 'Project content coming soon...' },
      { type: 'image', placeholder: 'project image/video' }
    ]
  },
  'fog-animation': {
    title: 'fog animation',
    date: '2025',
    tools: ['Placeholder Tool'],
    skills: ['Placeholder Skill'],
    projectUrl: '#',
    content: [
      { type: 'image', placeholder: 'project image/video' },
      { type: 'divider' },
      { type: 'tools-skills' },
      { type: 'section-title', text: 'OVERVIEW' },
      { type: 'paragraph', text: 'Project content coming soon...' },
      { type: 'image', placeholder: 'project image/video' }
    ]
  },
  'emotion-synthesizer': {
    title: 'emotion synthesizer',
    date: '2023',
    tools: ['Placeholder Tool'],
    skills: ['Placeholder Skill'],
    projectUrl: 'https://github.com/lucysun118/laughing-octo-fiesta',
    content: [
      { type: 'image', placeholder: 'project image/video' },
      { type: 'divider' },
      { type: 'tools-skills' },
      { type: 'section-title', text: 'OVERVIEW' },
      { type: 'paragraph', text: 'Project content coming soon...' },
      { type: 'image', placeholder: 'project image/video' }
    ]
  }
};

function ProjectContent() {
  const { projectSlug } = useParams<{ projectSlug: string }>();
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);

  const projectData = projectSlug ? projectContentData[projectSlug] : null;

  if (!projectData) {
    return <div>Project not found</div>;
  }

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="project-overlay">
      <div className="project-overlay-background" onClick={handleClose} />
      <div className="project-content-container" ref={contentRef}>
        <div 
          className="project-grain-overlay"
          style={{ backgroundImage: `url(${grainTexture})` }}
        />
        <div className="project-content-scroll">
          <button className="project-close-button" onClick={handleClose} aria-label="Close">
            <div className="close-sphere">
              <div className="close-sphere-water">
                <WaterSphereScene 
                  radius={2.0} 
                  segments={96} 
                  captureBackground={false}
                  className="close-sphere-canvas"
                />
              </div>
            </div>
          </button>

          <div className="project-content-inner">
            {/* Header with Date and Title */}
            <div className="project-header">
              <div className="project-header-top">
                <span className="project-date">{projectData.date}</span>
                {projectData.projectUrl && projectData.projectUrl !== '#' ? (
                  <a href={projectData.projectUrl} className="project-github-link" target="_blank" rel="noopener noreferrer">
                    <span className="project-visit">visit project</span>
                    {projectData.projectUrl.includes('github.com') && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    )}
                  </a>
                ) : (
                  <span className="project-visit">visit project</span>
                )}
              </div>
              <h1 className="project-title">{projectData.title}</h1>
            </div>

            {/* Content Items */}
            {projectData.content.map((item: any, index: number) => {
              if (item.type === 'image') {
                return (
                  <div key={index} className="project-content-image">
                    {item.src ? (
                      <img src={item.src} alt={`Project content ${index}`} className="project-image" draggable={false} />
                    ) : (
                      <span className="project-image-placeholder">{item.placeholder}</span>
                    )}
                  </div>
                );
              } else if (item.type === 'video') {
                if (item.src) {
                  return (
                    <LazyVideo
                      key={index}
                      src={item.src}
                      poster={item.poster}
                      autoPlay={item.autoPlay ?? true}
                      loop={item.loop ?? true}
                      controls={item.controls ?? false}
                      muted={item.muted ?? true}
                      fillContainer={item.fillContainer ?? true}
                    />
                  );
                }
                return (
                  <div key={index} className="project-content-image">
                    <span className="project-image-placeholder">{item.placeholder}</span>
                  </div>
                );
              } else if (item.type === 'carousel') {
                return <ImageCarousel key={index} images={item.images} />;
              } else if (item.type === 'divider') {
                return <div key={index} className="project-divider" />;
              } else if (item.type === 'tools-skills') {
                return (
                  <div key={index} className="project-tools-skills">
                    {projectData.tools.map((tool: string, toolIndex: number) => (
                      <span key={`tool-${toolIndex}`} className="project-tag">{tool}</span>
                    ))}
                    <span className="project-separator">|</span>
                    {projectData.skills.map((skill: string, skillIndex: number) => (
                      <span key={`skill-${skillIndex}`} className="project-tag">{skill}</span>
                    ))}
                  </div>
                );
              } else if (item.type === 'section-title') {
                return (
                  <h2 key={index} className="project-section-title">{item.text}</h2>
                );
              } else if (item.type === 'paragraph') {
                return (
                  <p key={index} className="project-paragraph">{item.text}</p>
                );
              }
              return null;
            })}

          </div>
        </div>
      </div>
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
        <Route path="/project/:projectSlug" element={<><Layout><Home /></Layout><ProjectContent /></>} />
      </Routes>
    </Router>
  );
}

export default App;