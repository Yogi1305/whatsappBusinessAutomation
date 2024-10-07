import React, { useRef, useEffect, useState } from 'react';
import broadcast from '../../assets/slider/broadcast.mp4';
import whatsapp from '../../assets/slider/whatsapp.png';
import flow from '../../assets/slider/flow.mp4';

const defaultSlides = [
  {
    title: "Welcome",
    description: "Scroll down to explore more",
    buttonText: "Learn More",
    buttonColor: "#00ff00",
    image: whatsapp,
  },
  {
    title: "Our Services",
    description: "Discover what we offer",
    buttonText: "Get Started",
    buttonColor: "#0000ff",
    video: broadcast,
  },
  {
    title: "Contact Us",
    description: "Get in touch with our team",
    buttonText: "Contact",
    buttonColor: "#ff0000",
    video: flow,
  }
];

const HeroSlider = ({ slides = defaultSlides }) => {
  const containerRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
      },
      { threshold: 0.5 } // Trigger when 50% of the element is visible
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleWheel = (e) => {
      if (isActive) {
        e.preventDefault();
        const containerWidth = containerRef.current.scrollWidth - containerRef.current.clientWidth;
        const newProgress = scrollProgress + e.deltaY;
        setScrollProgress(Math.max(0, Math.min(newProgress, containerWidth)));
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => window.removeEventListener('wheel', handleWheel);
  }, [isActive, scrollProgress]);

  useEffect(() => {
    if (isActive && containerRef.current) {
      containerRef.current.scrollLeft = scrollProgress;
    }
  }, [isActive, scrollProgress]);

  return (
    <div 
      ref={containerRef}
      className="h-screen overflow-hidden"
      style={{ 
        scrollSnapType: 'x mandatory',
        scrollSnapAlign: 'start',
      }}
    >
      <div 
        className="flex h-full transition-transform duration-300 ease-out"
        style={{ 
          transform: `translateX(-${scrollProgress}px)`,
        }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="flex-shrink-0 w-screen h-screen">
            <div className="container mx-auto px-4 h-full flex flex-col md:flex-row items-center justify-center">
              <div className="md:w-1/3 mb-8 md:mb-0 md:pr-8">
                <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: slide.buttonColor }}>
                  {slide.title}
                </h2>
                <p className="text-xl mb-8 text-white">
                  {slide.description}
                </p>
                <button className="bg-blue-400 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-600 transition duration-300">
                  {slide.buttonText}
                </button>
              </div>
              <div className="md:w-1/3 relative">
                {slide.video ? (
                  <video
                    src={slide.video}
                    className="w-full max-w-lg h-auto rounded-lg"
                    autoPlay
                    loop
                    muted
                  />
                ) : (
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full max-w-lg h-auto rounded-lg"
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;