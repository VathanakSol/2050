import { S3Client, ListObjectsV2Command, DeleteObjectCommand, CopyObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
    try {

        // Check authentication
        // const supabase = await createClient();
        // const { data: { user } } = await supabase.auth.getUser();
        
        // if (!user) {
        //     return NextResponse.json(
        //         { error: 'Unauthorized' },
        //         { status: 401 }
        //     );
        // }
        
        const s3 = new S3Client({
            region: "auto",
            endpoint: process.env.R2_ENDPOINT,
            forcePathStyle: true,
            credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY!,
                secretAccessKey: process.env.R2_SECRET_KEY!,
            },
        });

        // List all objects in the bucket (all public images)
        const listCommand = new ListObjectsV2Command({
            Bucket: process.env.R2_BUCKET!,
        });

        const response = await s3.send(listCommand);

        // Build public URLs for all images
        const images = (response.Contents || [])
            .filter(item => item.Key && item.Key !== "/") // Filter out folder itself
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

export async function DELETE(request: NextRequest) {
    try {
        // Check authentication
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { key } = body;

        if (!key) {
            return NextResponse.json(
                { error: 'Image key is required' },
                { status: 400 }
            );
        }

        const s3 = new S3Client({
            region: "auto",
            endpoint: process.env.R2_ENDPOINT,
            forcePathStyle: true,
            credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY!,
                secretAccessKey: process.env.R2_SECRET_KEY!,
            },
        });

        // Delete the object from R2
        const deleteCommand = new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET!,
            Key: key,
        });

        await s3.send(deleteCommand);

        return NextResponse.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error("Error deleting image:", error);
        return NextResponse.json(
            { error: 'Failed to delete image' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        // Check authentication
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { oldKey, newKey } = body;

        if (!oldKey || !newKey) {
            return NextResponse.json(
                { error: 'Both oldKey and newKey are required' },
                { status: 400 }
            );
        }

        const s3 = new S3Client({
            region: "auto",
            endpoint: process.env.R2_ENDPOINT,
            forcePathStyle: true,
            credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY!,
                secretAccessKey: process.env.R2_SECRET_KEY!,
            },
        });

        // 1. Copy object to new key
        const copyCommand = new CopyObjectCommand({
            Bucket: process.env.R2_BUCKET!,
            CopySource: `${process.env.R2_BUCKET}/${oldKey}`,
            Key: newKey,
        });

        await s3.send(copyCommand);

        // 2. Delete old object
        const deleteCommand = new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET!,
            Key: oldKey,
        });

        await s3.send(deleteCommand);

        return NextResponse.json({ message: 'Image renamed successfully' });
    } catch (error) {
        console.error("Error renaming image:", error);
        return NextResponse.json(
            { error: 'Failed to rename image' },
            { status: 500 }
        );
    }
}