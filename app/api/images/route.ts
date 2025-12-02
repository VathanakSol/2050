import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";

export async function GET() {
    try {
        const s3 = new S3Client({
            region: "auto",
            endpoint: process.env.R2_ENDPOINT,
            forcePathStyle: true,
            credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY!,
                secretAccessKey: process.env.R2_SECRET_KEY!,
            },
        });

        // List all objects in the uploads folder
        const listCommand = new ListObjectsV2Command({
            Bucket: process.env.R2_BUCKET!,
            Prefix: "uploads/",
        });

        const response = await s3.send(listCommand);

        // Build public URLs for all images
        const images = (response.Contents || [])
            .filter(item => item.Key && item.Key !== "uploads/") // Filter out folder itself
            .map(item => ({
                url: `${process.env.R2_PUBLIC_URL}/${item.Key}`,
                key: item.Key,
                lastModified: item.LastModified,
                size: item.Size,
            }))
            .sort((a, b) => {
                // Sort by most recent first
                return (b.lastModified?.getTime() || 0) - (a.lastModified?.getTime() || 0);
            });

        return Response.json({ images });
    } catch (error) {
        console.error("Error fetching images:", error);
        return Response.json({ images: [] });
    }
}