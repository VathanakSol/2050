'use server';

import { prisma } from '@/lib/prisma';

export async function getResources() {
    try {
        const resources = await (prisma as any).resource.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        return resources;
    } catch (error) {
        console.error('Error fetching resources:', error);
        return [];
    }
}
