import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { password } = body;

        const deletePassword = process.env.DELETE_PASSWORD;

        if (!deletePassword) {
            console.error("DELETE_PASSWORD environment variable is not set");
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        if (password === deletePassword) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json(
                { error: 'Invalid password' },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error("Error verifying password:", error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
