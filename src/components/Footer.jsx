// src/components/Footer.jsx
import React, { useState, useEffect } from 'react';
import { personalInfo } from '../data/personalInfo.jsx';
import { ExternalLinkIcon } from './Icons.jsx';
import PillLink from './PillLink.jsx';

const Footer = () => {
  const [visitorLocation, setVisitorLocation] = useState('...');

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error('Failed to fetch location');
        const data = await response.json();
        setVisitorLocation(`${data.city}, ${data.country_code}`);
      } catch (error) {
        console.error("Could not fetch visitor location:", error);
        setVisitorLocation('your location');
      }
    };
    fetchLocation();
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
            <span>Last visit from {visitorLocation}</span>
        </div>
        <span>&copy; {new Date().getFullYear()} {personalInfo.name}</span>
      </div>
    </footer>
  );
};

export default Footer;