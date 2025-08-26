import React, { useState, useEffect } from 'react';
import { personalInfo } from '../data/personalInfo.jsx';
import { ExternalLinkIcon } from './Icons.jsx';
import PillLink from './PillLink.jsx';

const Footer = () => {
  const [lastVisitorLocation, setLastVisitorLocation] = useState('...');

  useEffect(() => {
    const fetchLastVisitorLocation = async () => {
      try {
        const response = await fetch('/api/visitor'); 
        if (!response.ok) throw new Error('Failed to fetch visitor data');
        
        const data = await response.json();
        const location = data.location || 'an unknown location';
        setLastVisitorLocation(location);

      } catch (error) {
        console.error("Could not fetch last visitor location:", error);
        setLastVisitorLocation('a galaxy far, far away');
      }
    };
    fetchLastVisitorLocation();
  }, []);

  return (
    <footer className="mt-16 border-t pt-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Connect</h2>
      <div className="flex flex-wrap gap-4 items-center">
        <PillLink href={`mailto:${personalInfo.email}`}>
          {personalInfo.email} <ExternalLinkIcon />
        </PillLink>
        <PillLink href={personalInfo.spotify}>
          Spotify <ExternalLinkIcon />
        </PillLink>
        <PillLink href={personalInfo.github}>
          GitHub <ExternalLinkIcon />
        </PillLink>
        <PillLink href={personalInfo.linkedin}>
          LinkedIn <ExternalLinkIcon />
        </PillLink>
      </div>
      
      <div className="flex justify-between items-center mt-8 text-sm text-gray-500">
        <div className="flex flex-col">
            <span>
                Made with <a href="https://vitejs.dev/" target="_blank" rel="noopener noreferrer" className="font-medium text-gray-700 hover:text-blue-600">Vite</a>
            </span>
            <span>Last visit from {lastVisitorLocation}</span>
        </div>
        <span>&copy; {new Date().getFullYear()} {personalInfo.name}</span>
      </div>
    </footer>
  );
};

export default Footer;