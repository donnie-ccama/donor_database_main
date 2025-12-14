import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    try {
        // Debug logging
        console.log(`Middleware running for path: ${request.nextUrl.pathname}`)

        // Check env vars
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            console.error('Missing Supabase environment variables in Middleware')
            // Don't crash, just let the request pass but log the error
            // This might prevent a 500 loop if variables are missing
        }

        let response = NextResponse.next({
            request: {
                headers: request.headers,
            },
        })

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return request.cookies.get(name)?.value
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        // Create a new response with cookie set to avoid immutable request headers issue
                        request.cookies.set({ name, value, ...options })
                        response = NextResponse.next({
                            request: { headers: request.headers },
                        })
                        response.cookies.set({ name, value, ...options })
                    },
                    remove(name: string, options: CookieOptions) {
                        request.cookies.set({ name, value: '', ...options })
                        response = NextResponse.next({
                            request: { headers: request.headers },
                        })
                        response.cookies.set({ name, value: '', ...options })
                    },
                },
            }
        )

        // Refresh session if expired
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error) {
            // Log but don't crash on auth error (could be just no session)
            // console.log('Auth check result:', error.message)
        }

        // Define public routes that don't require authentication
        const publicRoutes = ['/login', '/signup', '/callback', '/auth/callback']
        const isPublicRoute = publicRoutes.some(route =>
            request.nextUrl.pathname.startsWith(route)
        )

        // Redirect unauthenticated users to login
        if (!user && !isPublicRoute) {
            const redirectUrl = new URL('/login', request.url)
            redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
            return NextResponse.redirect(redirectUrl)
        }

        // Redirect authenticated users away from auth pages
        if (user && isPublicRoute && !request.nextUrl.pathname.startsWith('/callback')) {
            return NextResponse.redirect(new URL('/', request.url))
        }

        return response
    } catch (e) {
        console.error('Middleware Error:', e)
        // In case of error, return a generic response to avoid total crash loop
        return NextResponse.next()
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, etc.)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
