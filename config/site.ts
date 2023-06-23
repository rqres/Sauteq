export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: 'RecipeAI',
  description: 'Create delicious recipes with any ingredients',
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
