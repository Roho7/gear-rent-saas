import { Database } from "@/packages/supabase.types";
import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const createClientComponentClient = () =>
  createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const createMiddlewareClient = (
  request: NextRequest,
  response: NextResponse,
) =>
  createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => {
        return request.cookies.getAll().map((cookie) => ({
          name: cookie.name,
          value: cookie.value,
        }));
      },
      setAll: (cookies) => {
        cookies.forEach(({ name, value, ...options }) => {
          request.cookies.set({ name, value, ...options });
          response.cookies.set({ name, value, ...options });
        });
      },
    },
  });

const createServerSideClient = (cookies: ReadonlyRequestCookies) =>
  createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => {
        return cookies.getAll().map((cookie) => ({
          name: cookie.name,
          value: cookie.value,
        }));
      },
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, ...options }) => {
          cookies.set({ name, value, ...options });
        });
      },
    },
  });

export const createServerComponentClient = (
  { cookies }: { cookies: ReadonlyRequestCookies },
) => createServerSideClient(cookies);

export const createRouteHandlerClient = (
  { cookies }: { cookies: ReadonlyRequestCookies },
) => createServerSideClient(cookies);

export const createServerActionClient = (
  { cookies }: { cookies: ReadonlyRequestCookies },
) => createServerSideClient(cookies);

export const supabaseAdminClient = () =>
  createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export type ServerActionGenericType<T> = {
  status: boolean;
  data: T | null;
  error: string | null;
};
