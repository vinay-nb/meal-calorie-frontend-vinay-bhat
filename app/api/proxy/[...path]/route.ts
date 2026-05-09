import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://xpcc.devb.zeak.io";

export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(request, await params);
}

export async function POST(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(request, await params);
}

export async function PUT(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(request, await params);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(request, await params);
}

async function handleProxy(request: Request, params: { path: string[] }) {
  const path = params.path.join("/");
  const url = `${API_BASE}/${path}`;
  
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const headers = new Headers(request.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  // Remove host header to avoid issues with target server
  headers.delete("host");

  try {
    const fetchOptions: RequestInit = {
      method: request.method,
      headers,
    };

    if (request.method !== "GET" && request.method !== "HEAD") {
      fetchOptions.body = await request.clone().arrayBuffer();
    }

    const res = await fetch(url, fetchOptions);
    
    // We can't directly return the response due to streaming/header issues in some cases
    // but NextResponse handles it well usually.
    const data = await res.arrayBuffer();
    
    const responseHeaders = new Headers(res.headers);
    // Remove headers that might cause issues
    responseHeaders.delete("content-encoding");

    return new NextResponse(data, {
      status: res.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json({ message: "Proxy error" }, { status: 502 });
  }
}
