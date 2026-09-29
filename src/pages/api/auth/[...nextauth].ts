import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface AccessTokenPayload {
  userId?: number;
  role?: string;
}

function decodeAccessToken(token: string): AccessTokenPayload {
  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return {};
    }

    return JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as AccessTokenPayload;
  } catch {
    return {};
  }
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Senha",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          },
        );

        if (!response.ok) {
          return null;
        }

        const data = await response.json();

        const payload = decodeAccessToken(data.accessToken);

        return {
          id: credentials.email,
          email: credentials.email,
          accessToken: data.accessToken,
          role: payload.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;

      if (session.user) {
        session.user.role = token.role;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
});
