import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function updateSession(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  let sessionUser: Awaited<
    ReturnType<typeof supabase.auth.getUser>
  >["data"]["user"] = null;

  try {
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError) {
      const code = authError.code ?? "";
      const msg = authError.message ?? "";
      const staleSession =
        code === "refresh_token_not_found" ||
        code === "invalid_refresh_token" ||
        /invalid refresh token|refresh token not found/i.test(msg);
      if (staleSession) {
        await supabase.auth.signOut();
      }
    } else {
      sessionUser = authData.user;
    }
  } catch (e) {
    const err = e as { code?: string; message?: string };
    const staleSession =
      err.code === "refresh_token_not_found" ||
      /invalid refresh token|refresh token not found/i.test(err.message ?? "");
    if (staleSession) {
      await supabase.auth.signOut().catch(() => {});
    }
  }

  const pathname = request.nextUrl.pathname;

  const publicPaths = ["/", "/login", "/signup", "/signup/student", "/signup/coach"];
  const isPublic = publicPaths.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );

  if (!sessionUser && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (sessionUser && isPublic) {
    if (pathname === "/") {
      return supabaseResponse;
    }

    const { data: pubProfile } = await supabase
      .from("profiles")
      .select("role, status")
      .eq("id", sessionUser.id)
      .single();

    if (!pubProfile) {
      return supabaseResponse;
    }

    if (pubProfile.status !== "approved") {
      const url = request.nextUrl.clone();
      url.pathname = "/pending";
      return NextResponse.redirect(url);
    }

    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (sessionUser && !isPublic) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, status")
      .eq("id", sessionUser.id)
      .single();

    if (profile && profile.status !== "approved") {
      if (pathname !== "/pending") {
        const url = request.nextUrl.clone();
        url.pathname = "/pending";
        return NextResponse.redirect(url);
      }
      return supabaseResponse;
    }

    if (profile) {
      const roleRoutes: Record<string, string[]> = {
        super_admin: ["/admin"],
        coach: ["/coach"],
        student: ["/student"],
      };

      const roleKey =
        typeof profile.role === "string"
          ? profile.role.trim()
          : String(profile.role);
      const allowed = roleRoutes[roleKey] || [];
      const roleRestricted = ["/admin", "/coach", "/student"];
      const isRoleRoute = roleRestricted.some(
        (r) => pathname === r || pathname.startsWith(r + "/"),
      );

      if (isRoleRoute && !allowed.some((r) => pathname === r || pathname.startsWith(r + "/"))) {
        const url = request.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}
