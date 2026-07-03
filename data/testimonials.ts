export interface Testimonial {
  quote: string[]
  name: string
  role: string
}

// TODO: Replace with real client testimonials
export const testimonials: Testimonial[] = [
  {
    quote: [
      'Working with Plavovlasa changed how I understand',
      'my own face. She listens before she touches anything.',
      'The result was exactly who I wanted to be.',
    ],
    name: 'Client Name',
    role: 'Role',
  },
]
