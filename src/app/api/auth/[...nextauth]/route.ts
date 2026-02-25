import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "demo@auditpal.io" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Demo: Accept any email with password "demo123"
                if (credentials?.password === "demo123" && credentials?.email) {
                    return {
                        id: "1",
                        email: credentials.email,
                        name: credentials.email.split("@")[0],
                    };
                }
                return null;
            }
        })
    ],
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt" as const,
    },
    secret: process.env.NEXTAUTH_SECRET || "auditpal-demo-secret-key-change-in-production",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
