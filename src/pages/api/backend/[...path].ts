import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL não configurada");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const path = Array.isArray(req.query.path)
      ? req.query.path.join("/")
      : (req.query.path ?? "");

    const queryString = new URLSearchParams();

    for (const [key, value] of Object.entries(req.query)) {
      if (key === "path") continue;

      if (Array.isArray(value)) {
        value.forEach((item) => {
          queryString.append(key, item);
        });
      } else if (value !== undefined) {
        queryString.append(key, value);
      }
    }

    const query = queryString.toString();

    const url = `${API_URL}/${path}${query ? `?${query}` : ""}`;

    const headers: HeadersInit = {};

    const contentType = req.headers["content-type"];

    if (contentType) {
      headers["Content-Type"] = contentType;
    }

    if (token?.accessToken) {
      headers["Authorization"] = `Bearer ${token.accessToken}`;
    }

    const response = await fetch(url, {
      method: req.method,
      headers,
      body:
        req.method !== "GET" && req.method !== "HEAD"
          ? JSON.stringify(req.body)
          : undefined,
    });

    const responseBody = await response.text();

    res.status(response.status);

    const responseContentType = response.headers.get("content-type");

    if (responseContentType) {
      res.setHeader("Content-Type", responseContentType);
    }

    res.send(responseBody);
  } catch (error) {
    console.error("Erro no proxy:", error);

    res.status(500).json({
      message: "Erro interno no proxy da API",
    });
  }
}
