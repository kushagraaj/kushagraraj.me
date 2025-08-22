import React from 'react';
import { personalInfo } from '../data/personalInfo.jsx';
import { projects } from '../data/projects.jsx';
import { SoundIcon, ExternalLinkIcon, SparkleIcon } from './Icons.jsx';

const MainContent = ({ isLoading, handleRefineBio, handleGenerateIdea }) => {
  return (
    <>
      {/* --- Intro Section --- */}
      <section className="mb-12">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">{personalInfo.name}</h1>
          <button onClick={() => {
              const audio = new Audio(personalInfo.pronunciationAudio);
              audio.play().catch(e => console.error("Error playing audio:", e));
            }} 
            className="text-gray-500 hover:text-gray-900" 
            aria-label="Pronounce name">
            <SoundIcon />
          </button>
        </div>
        <p className="mt-4 text-gray-600 leading-relaxed">{personalInfo.bio}</p>
        <div className="mt-4 flex items-center gap-4">
            <span className="text-sm text-gray-500">Availability:</span>
            <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">{personalInfo.availability}</span>
            
        </div>
      </section>

      {/* --- Where Section --- */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Where</h2>
        {/* This div is the main container for the map and all animated elements */}
        <div className="relative w-full h-64 rounded-lg overflow-hidden">
          {/* The map background image */}
          <div 
            className="absolute inset-0 bg-center"
            style={{ 
              backgroundImage: `url('/pune-map.png')`,
              backgroundSize: '150%'
            }}
            aria-label="Map of Pune, IN"
          ></div>

          {/* Animated Cloud Image */}
          <img 
            src="/cloud.webp" 
            alt="Animated cloud" 
            className="absolute top-0 left-0 w-80 h-auto opacity-50 animate-cloud-drift"
          />
          
          {/* Airplane Animation Container */}
          <div className="absolute bottom-8 animate-airplane-fly" style={{ left: 'calc(33.3333% - 70px)' }}>
            {/* This inner div handles the static rotation */}
            <div style={{ transform: 'rotate(90deg)' }}>
              {/* Airplane Shadow Image */}
              <img 
                src="/plane-shadow.webp" 
                alt="Airplane shadow" 
                className="absolute top-2 left-2 w-10 h-auto opacity-20"
              />
              {/* Airplane Image */}
              <img 
                src="/plane.webp" 
                alt="Animated airplane" 
                className="relative w-10 h-auto"
              />
            </div>
          </div>

          {/* Blinking Blue Dot*/}
          <div className="absolute top-[180px] left-[370px] -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-2 border-blue-500 animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          {/* Wikipedia Link */}
          <a href="https://en.wikipedia.org/wiki/Pune" target="_blank" rel="noopener noreferrer" className="absolute bottom-2 right-2 bg-white/75 backdrop-blur-sm text-xs text-gray-800 font-semibold px-2 py-1 rounded-md hover:bg-white transition-colors">
            Pune, India
          </a>
        </div>
      </section>
      
      {/* --- Projects Section --- */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Projects</h2>
        <div className="space-y-6">
          {projects.map(p => (
            <div key={p.title}>
              <p className="text-gray-500 text-sm">{p.year}</p>
              <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-base font-medium text-gray-900 hover:text-blue-600 transition-colors duration-200">{p.title} <ExternalLinkIcon /></a>
              <p className="text-gray-600">{p.description}</p>
              {p.isFuture && (
                <button onClick={handleGenerateIdea} disabled={isLoading} className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed">
                    <SparkleIcon /> Naya Idea Generate Karein
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default MainContent;
