import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import { images } from './data';
import './index.css';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [loading, setLoading] = useState(true);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorOutlineRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const isScrollingRef = useRef(false);
  const { scrollYProgress } = useScroll();
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    // Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // High-Precision ScrollSpy
    const sections = ['home', 'work', 'about', 'contact'];
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -69% 0px', // A 1% trigger zone at 30% of the viewport height
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (isScrollingRef.current) return; // Ignore during programmatic scroll
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    const moveCursor = (e: MouseEvent) => {
      if (cursorDotRef.current && cursorOutlineRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        cursorOutlineRef.current.animate({
          left: `${e.clientX}px`,
          top: `${e.clientY}px`
        }, { duration: 500, fill: "forwards", easing: "cubic-bezier(0.23, 1, 0.32, 1)" });
      }
    };

    window.addEventListener('mousemove', moveCursor);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, .gallery-item')) {
        document.body.classList.add('hover-active');
        if (target.closest('.gallery-item')) {
          document.body.classList.add('cursor-view');
        }
      } else {
        document.body.classList.remove('hover-active', 'cursor-view');
      }
    };
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      lenis.destroy();
      observer.disconnect();
    };
  }, []);

  const aboutText = "This is Munasib Apurbo, a photographer with a passion for capturing the magic of the world. I am specialized in captivating stories and evoking emotions. I believe that the true joy of photography comes from the journey, not just the destination. So, whether you're an aspiring photographer, an adventure seeker, or simply someone who loves beautiful things, I invite you to join me on this incredible journey. Thank you for visiting my website, and I hope you find inspiration and joy in my work. Let's make some magic together!";

  return (
    <>
      <div className={`shutter-loader ${!loading ? 'shutter-open' : ''}`}>
        <div className="shutter-top">
          <div className="loader-logo-container">
            <img src="/logo.png" alt="Loader Logo" className="loader-logo" />
          </div>
        </div>
        <div className="shutter-bottom">
          <div className="loader-text">MUNASIB APURBO</div>
        </div>
      </div>

      <div className="scroll-progress">
        <motion.div className="progress-bar" style={{ scaleX }} />
      </div>

      <div className="cursor-dot" ref={cursorDotRef}></div>
      <div className="cursor-outline" ref={cursorOutlineRef}></div>
      <div className="grain"></div>

      <nav className="nav-block-container">
        {['home', 'work', 'about', 'contact'].map((item) => (
          <motion.a 
            key={item}
            href={`#${item === 'home' ? '' : item}`} 
            className={`nav-block ${activeSection === item ? 'active' : ''}`}
            whileHover={{ y: -2 }}
            onClick={(e) => {
              e.preventDefault();
              isScrollingRef.current = true;
              setActiveSection(item);
              
              const onScrollComplete = () => {
                setTimeout(() => {
                  isScrollingRef.current = false;
                }, 50);
              };

              if (item === 'home') {
                lenisRef.current?.scrollTo(0, { onComplete: onScrollComplete });
              } else {
                lenisRef.current?.scrollTo(`#${item}`, { onComplete: onScrollComplete });
              }
            }}
          >
            {item}
          </motion.a>
        ))}
      </nav>

      <div className="page-wrapper">
        <section id="home" className="hero-pool-container">
          <motion.span 
            className="section-label"
            initial={{ opacity: 0, x: -20 }}
            animate={!loading ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 1.5 }}
          >
            IDENTITY / VISUAL STORYTELLER
          </motion.span>
          
          <div className="hero-overlay-content">
            <motion.h1 
              className="header-title"
              initial={{ y: 100, opacity: 0 }}
              animate={!loading ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
            >
              MUNASIB<br/>APURBO
            </motion.h1>
          </div>

          <motion.div 
            className="hero-image-wrapper"
            initial={{ scale: 1.1, filter: 'grayscale(100%)', opacity: 0 }}
            animate={!loading ? { scale: 1, filter: 'grayscale(100%)', opacity: 1 } : {}}
            transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          >
            <img 
              src="/photos/pool.jpg" 
              alt="Hero Pool" 
              className="hero-pool-img"
            />
          </motion.div>
        </section>

        <section id="work" className="gallery-section">
          <div className="gallery-container">
            {images.map((img, index) => (
              <motion.div 
                className="gallery-item" 
                key={index}
                style={{ flex: `${img.ratio} 0 auto` }}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: (index % 3) * 0.1 }}
                onClick={() => console.log(`Viewing: ${img.name}`)}
              >
                <motion.img 
                  src={`/photos/${img.name}`} 
                  alt={`Gallery ${index}`} 
                  className="gallery-img" 
                  loading="lazy" 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                />
              </motion.div>
            ))}
          </div>
        </section>

        <section id="about" className="about-section">
          <div className="about-grid">
            <motion.h2 
              className="about-heading"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              BORN TO<br/>CAPTURE
            </motion.h2>
            <div className="about-text">
              {aboutText.split('. ').map((sentence, i) => (
                <div key={i} style={{ overflow: 'hidden', marginBottom: '1.5rem' }}>
                  <motion.p 
                    initial={{ y: 60, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
                  >
                    {sentence}.
                  </motion.p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="contact-section">
          <div className="contact-wrapper">
            <motion.div 
              className="contact-main"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="contact-title">LET'S CREATE<br/><span>SOMETHING</span> TIMELESS</h2>
              <a href="mailto:munasibapurbocontact@gmail.com" className="big-email">
                MUNASIBAPURBOCONTACT@GMAIL.COM
              </a>
            </motion.div>
            
            <div className="contact-bottom">
              <div className="contact-links">
                <motion.a 
                  href="https://www.linkedin.com/in/munasib-apurbo/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ y: -5 }}
                >
                  LINKEDIN
                </motion.a>
                <motion.a 
                  href="https://github.com/MunasibApurbo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ y: -5 }}
                >
                  GITHUB
                </motion.a>
              </div>
              <div className="contact-copyright">
                © {new Date().getFullYear()} MUNASIB APURBO
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default App;
