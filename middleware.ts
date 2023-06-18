import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({
  //TODO:
  publicRoutes: ["/", "/create-recipe", "/recipe", "/api/openai/(.*)"],
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
