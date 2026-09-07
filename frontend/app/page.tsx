"use client";

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const statsRef = useRef<HTMLElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }, [isMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) {
        setIsMenuOpen(false);
      }
    };
    const handleResize = () => {
      if (window.innerWidth > 720 && document.body.classList.contains("menu-open")) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (hasAnimated || !statsRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const counts = document.querySelectorAll('.count');
          counts.forEach((count, i) => {
            const el = count as HTMLElement;
            const target = parseFloat(el.getAttribute("data-target") || "0");
            const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
            const duration = 1500 + i * 80;
            const delay = 480 + i * 90;
            
            let startTimestamp: number | null = null;
            
            setTimeout(() => {
              const step = (timestamp: number) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                const current = Math.min(easeProgress * target, target);
                
                el.innerText = current.toFixed(decimals);
                
                if (progress < 1) {
                  window.requestAnimationFrame(step);
                } else {
                  el.innerText = target.toFixed(decimals);
                }
              };
              window.requestAnimationFrame(step);
            }, delay);
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.25 });
    
    observer.observe(statsRef.current);
    
    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <>
      <div className="bg">
        <video className="bg-video" autoPlay muted loop playsInline>
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4" type="video/mp4" />
        </video>
      </div>

      <main className="page">
        <header className="header anim" style={{ '--d': '0s' } as React.CSSProperties}>
          <button className="logo" aria-label="Home">
            <img src="/assets/logo.webp" width="52" height="52" alt="" />
          </button>

          <nav className="nav-pill desktop-nav">
            <a href="#" className="nav-link active">Home</a>
            <a href="#" className="nav-link">Product</a>
            <a href="#" className="nav-link">Case Studies</a>
            <a href="#" className="nav-link">Contact</a>
          </nav>

          <a href="#" className="sign-in desktop-nav">Sign in</a>

          <button 
            className="burger mobile-only" 
            aria-label="Toggle menu" 
            aria-expanded={isMenuOpen}
            onClick={toggleMenu}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </header>

        <section className="hero">
          <div className="trust-row anim" style={{ '--d': '0.05s' } as React.CSSProperties}>
            <div className="avatars">
              <div className="avatar a1"><div className="inner"><i className="fa-brands fa-microsoft"></i></div></div>
              <div className="avatar a2"><div className="inner"><i className="fa-brands fa-amazon"></i></div></div>
              <div className="avatar a3"><div className="inner"><i className="fa-brands fa-google"></i></div></div>
              <div className="trust-pill">Trusted by 2000+ Enterprises</div>
            </div>
          </div>

          <h1 className="headline anim">
            <span className="line" style={{ '--d': '0.12s' } as React.CSSProperties}>Intelligence</span><br/>
            <span className="line" style={{ '--d': '0.3s' } as React.CSSProperties}>Designed To Evolve</span>
          </h1>

          <p className="subhead anim" style={{ '--d': '0.28s' } as React.CSSProperties}>
            Build applications that reason, adapt and collaborate using a modular<br className="desktop-br"/>
            AI platform designed for production.
          </p>

          <div className="cta-wrapper anim pulse" style={{ '--d': '0.4s' } as React.CSSProperties}>
            <a href="#" className="cta">Get Started</a>
          </div>
        </section>

        <footer className="stats" ref={statsRef}>
          <div className="stat anim" style={{ '--d': '0.5s' } as React.CSSProperties}>
            <div className="stat-value"><span className="icon">&lt;</span><span className="count" data-target="120" data-decimals="0">0</span><span className="suffix">ms</span></div>
            <div className="stat-label">Inference Time</div>
          </div>
          <div className="stat anim" style={{ '--d': '0.58s' } as React.CSSProperties}>
            <div className="stat-value"><span className="icon">%</span><span className="count" data-target="99.99" data-decimals="2">0.00</span><span className="suffix">%</span></div>
            <div className="stat-label">Platform Uptime</div>
          </div>
          <div className="stat anim" style={{ '--d': '0.66s' } as React.CSSProperties}>
            <div className="stat-value"><span className="icon">*</span><span className="count" data-target="24" data-decimals="0">0</span><span className="suffix">/7</span></div>
            <div className="stat-label">Autonomous Runtime</div>
          </div>
          <div className="stat anim" style={{ '--d': '0.74s' } as React.CSSProperties}>
            <div className="stat-value"><span className="icon">#</span><span className="count" data-target="2.4" data-decimals="1">0.0</span><span className="suffix">M</span></div>
            <div className="stat-label">Context Windows</div>
          </div>
        </footer>
      </main>

      <div className={`overlay ${isMenuOpen ? '' : 'hidden'}`} onClick={toggleMenu}></div>
      <div className={`mobile-menu ${isMenuOpen ? '' : 'hidden'}`}>
        <nav className="mobile-nav">
          <a href="#" className="mobile-link active" style={{ '--d': '0.05s' } as React.CSSProperties} onClick={toggleMenu}>Home</a>
          <a href="#" className="mobile-link" style={{ '--d': '0.1s' } as React.CSSProperties} onClick={toggleMenu}>Product</a>
          <a href="#" className="mobile-link" style={{ '--d': '0.15s' } as React.CSSProperties} onClick={toggleMenu}>Case Studies</a>
          <a href="#" className="mobile-link" style={{ '--d': '0.2s' } as React.CSSProperties} onClick={toggleMenu}>Contact</a>
        </nav>
        <a href="#" className="mobile-sign-in" style={{ '--d': '0.25s' } as React.CSSProperties} onClick={toggleMenu}>Sign in</a>
      </div>
    </>
  );
}
