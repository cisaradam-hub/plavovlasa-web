export type ProjectLayout = 'left' | 'right' | 'full' | 'split'

export interface Project {
  number: string
  title: string
  category: string
  description: string
  imageSrc: string
  imageSrc2?: string
  imageAlt: string
  imageAlt2?: string
  layout: ProjectLayout
}

// TODO: Replace all images and content with real project photography and details
export const projects: Project[] = [
  {
    number: '01',
    title: 'The Architecture of Light',
    category: 'Editorial Campaign',
    description: 'A study in natural illumination and the geometry of shadow on skin.',
    imageSrc: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1200&q=85',
    imageAlt: 'Editorial portrait — the architecture of light',
    layout: 'left',
  },
  {
    number: '02',
    title: 'Faces in Transition',
    category: 'Film Production',
    description: 'Character transformation across eight scenes. The work beneath the work.',
    imageSrc: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1200&q=85',
    imageAlt: 'Film production — faces in transition',
    layout: 'right',
  },
  {
    number: '03',
    title: 'Private Ceremony',
    category: 'Private Client',
    description: 'Intimate work for a deeply personal occasion. Presence over spectacle.',
    imageSrc: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1400&q=85',
    imageAlt: 'Private ceremony — intimate editorial',
    layout: 'full',
  },
  {
    number: '04',
    title: 'The Editorial Space',
    category: 'Collaboration',
    description: 'A long-form collaboration with photographer and poet.',
    imageSrc: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=900&q=85',
    imageSrc2: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=700&q=85',
    imageAlt: 'Editorial space — primary image',
    imageAlt2: 'Editorial space — secondary image',
    layout: 'split',
  },
]
