'use server';

import { createClient } from '@/lib/supabase/server';

export async function getUserCount(): Promise<number> {
    try {
        const supabase = await createClient();

        // Use the secure RPC function to get the count without exposing individual rows
        const { data, error } = await supabase
            .rpc('get_user_count');

        if (error) {
            console.error('Error fetching user count:', error);
            return 0;
        }

        return Number(data) || 0;
    } catch (error) {
        console.error('Unexpected error in getUserCount:', error);
        return 0;
    }
}

export async function getProfile(userId: string) {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Unexpected error in getProfile:', error);
        return null;
    }
}

export async function updateProfile(userId: string, profileData: { full_name?: string, avatar_url?: string, bio?: string, username?: string }) {
    try {
        const supabase = await createClient();
        const { error } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                ...profileData,
                updated_at: new Date().toISOString()
            });

        if (error) {
            console.error('Error updating profile:', error);
            return { success: false, error };
        }

        return { success: true };
    } catch (error) {
        console.error('Unexpected error in updateProfile:', error);
        return { success: false, error };
    }
}
