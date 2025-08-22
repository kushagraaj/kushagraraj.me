import React from 'react';
import { GithubIcon, LinkedinIcon } from './Icons'; 

 const PillLink = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-block bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-300 transition-colors duration-200">
      {children}
    </a>
  );
export default PillLink;