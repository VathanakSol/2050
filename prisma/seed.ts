import { PrismaClient } from '@prisma/client';
import mockData from '../data/mockData.json';

import resourcesData from '../data/resources.json';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    for (const item of mockData) {
        const result = await prisma.searchResult.create({
            data: {
                title: item.title,
                description: item.description,
                url: item.url,
                category: item.category,
            },
        });
        console.log(`Created search result with id: ${result.id}`);
    }

    for (const resource of resourcesData) {
        await (prisma as any).resource.create({
            data: resource
        });
        console.log(`Created resource: ${resource.title}`);
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
