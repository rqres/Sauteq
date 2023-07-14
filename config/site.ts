export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: 'RecipeAI',
  description: 'Create mouthwatering recipes',
  addl: 'Taking the guesswork out of cooking',
  mainNav: [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'History',
      href: '/history',
    },
  ],
  links: {
    github: 'https://github.com/rqres',
  },
}
