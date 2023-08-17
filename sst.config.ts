import { SSTConfig } from 'sst'
import { Config, NextjsSite } from 'sst/constructs'

export default {
  config(_input) {
    return {
      name: 'recipe-ai',
      region: 'us-east-1',
    }
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const OPENAI_KEY = new Config.Secret(stack, 'OPENAI_KEY')
      const site = new NextjsSite(stack, 'site', {
        bind: [OPENAI_KEY],
        environment: {
          CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY!,
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
            process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
          NEXT_PUBLIC_SUPABASE_ANON_KEY:
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
          NEXT_PUBLIC_DOMAIN_NAME:
            // stack.stage === 'prod'
            'https://d10w1g97siypj3.cloudfront.net',
          //   : 'http://localhost:3000',
        },
        timeout: '50 seconds',
        memorySize: '2048 MB',
      })

      stack.addOutputs({
        SiteUrl: site.url,
      })
    })
  },
} satisfies SSTConfig
