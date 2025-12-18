import { NextRequest, NextResponse } from 'next/server';

const AUTHORIZED_EMAIL = 'vathanaksol1605@gmail.com';

export async function POST(request: NextRequest) {
    try {
        const { email, page } = await request.json();

        if (!email) {
            return NextResponse.json(
                { authorized: false, error: 'Email is required' },
                { status: 400 }
            );
        }

        // Check if the user's email is authorized and accessing manage-images page
        const isAuthorized = email === AUTHORIZED_EMAIL && page === 'manage-images';

        return NextResponse.json({ authorized: isAuthorized });
    } catch (error) {
        console.error('Error checking admin authorization:', error);
        return NextResponse.json(
            { authorized: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}