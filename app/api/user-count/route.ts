import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
    try {
        const supabase = await createClient();

        // Count all profiles in the profiles table
        const { count, error } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error('Error fetching user count from profiles:', error);
            return NextResponse.json({ count: 0, error: 'Failed to fetch user count' }, { status: 500 });
        }

        return NextResponse.json({ 
            count: count || 0,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Unexpected error in user count API:', error);
        return NextResponse.json({ count: 0, error: 'Internal server error' }, { status: 500 });
    }
}