import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({
  //TODO:
  publicRoutes: ["/", "/:recipes*"],
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
