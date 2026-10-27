// site content

export type Project = {
  name: string
  description: string
  url: string
  year: string
  tags: string[]
}

export const site = {
  name: 'kushagra',
  pronunciation: '/kushagra.mp3',
  title: 'kushagra',
  description: 'sophomore studying ai and building at tangent kyte. less ceremony, more shipping.',
  url: 'https://kushagraraj.vercel.app',

  // {work} renders as a link to site.work
  intro: [
    "i'm a sophomore studying artificial intelligence and building at {work}. i use ai to move from idea to execution, combining technical fundamentals with fast iteration to ship thoughtful products that work in the real world. less ceremony, more shipping.",
  ],

  location: {
    label: 'Pune, India',
    short: 'Pune, IN',
    url: 'https://en.wikipedia.org/wiki/Pune',
    timeZone: 'Asia/Kolkata',
    tz: 'IST',
    lat: 18.5204,
    lon: 73.8567,
  },

  work: { name: 'tangent kyte', url: 'https://tangent-kyte.github.io/www/' },

  email: 'hi@kushagraraj.me',
  socials: {
    github: { username: 'kushagraaj', url: 'https://github.com/kushagraaj' },
    linkedin: {
      username: 'kushagraaj',
      url: 'https://www.linkedin.com/in/kushagraaj/',
      headline: 'Computer Science student · Competitive programming · Web development',
    },
  },

  projects: [
    {
      name: 'Portfolio v2',
      description:
        'A component-driven site built with React, Vite and Tailwind CSS, designed around fast static delivery, accessible markup and a content-first layout.',
      url: 'https://kushagraraj.vercel.app',
      year: '2025',
      tags: ['react', 'vite', 'tailwind css'],
    },
    {
      name: 'Color Converter',
      description:
        'A lightweight developer utility that converts RGB channel values into packed integer and hexadecimal formats, with bounded 0–255 inputs for each channel.',
      url: 'https://kushagraaj.github.io/color-converter/',
      year: '2021',
      tags: ['javascript', 'html', 'css'],
    },
    {
      name: 'Mito',
      description:
        'A multipurpose Discord bot reaching 200k+ users, spanning moderation, music streaming, levelling and image commands. Built in TypeScript with MongoDB persistence; open source with 15+ stars.',
      url: 'https://github.com/kushagraaj/Mito',
      year: '2021',
      tags: ['typescript', 'discord.js', 'mongodb', 'lavalink'],
    },
    {
      name: 'Portfolio v1',
      description:
        'The first iteration, built with Next.js and Chakra UI. An early study in server rendering, reusable component systems and continuous deployment.',
      url: 'https://github.com/kushagraaj',
      year: '2020',
      tags: ['next.js', 'chakra ui'],
    },
  ] as Project[],
} as const

export type Site = typeof site
