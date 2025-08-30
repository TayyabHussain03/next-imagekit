import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "./dbconnection";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            // Authentication logic
            async authorize(credentials) {
                // Check if email and password are provided
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password");
                }

                try {
                    // Connect to database
                    await connectDB();

                    // Find user by email
                    const user = await User.findOne({
                        email: credentials.email
                    });

                    // Check if user exists
                    if (!user) {
                        throw new Error("No user found with this email");
                    }

                    // Compare provided password with hashed password in database
                    const isValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    // Check if password is valid
                    if (!isValid) {
                        throw new Error("Invalid password");
                    }

                    // Return user object if authentication is successful
                    return {
                        id: user._id.toString(),
                        email: user.email
                    };
                } catch (error) {
                    // Handle any errors that occur during authentication
                    console.error("Authentication error:", error);
                    throw new Error("Authentication failed");
                }
            },
        }),
    ],
    callbacks: {
        // Add user ID to JWT token
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        // You can add session callback here if needed
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
            }
            return session;
        }
    },
    // Custom pages configuration
    pages: {
        signIn: "/login",
        error: "/login",
    },
    // Session configuration
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    // Secret for encryption
    secret: process.env.NEXTAUTH_SECRET,
};