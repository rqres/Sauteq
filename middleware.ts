import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({
  //TODO:
  publicRoutes: ["/api/openai/(.*)"],
  // ["/", "/create-recipe", "/recipe", "/api/openai/(.*)"],
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
