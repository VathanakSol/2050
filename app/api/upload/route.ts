import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";

export async function POST(req: Request) {
    const form = await req.formData();
    const file = form.get("file") as File;

    // Use the original filename from the File object (which includes the custom name)
    // The frontend already creates a new File object with the custom name
    const originalFilename = file.name;
    
    // Sanitize the filename to ensure it's safe for storage
    const sanitizedFilename = originalFilename
        .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace unsafe chars with underscore
        .replace(/^\.+/, '') // Remove leading dots
        .replace(/\.+$/, '') // Remove trailing dots
        .substring(0, 100); // Limit length

    // If sanitization results in empty filename, use fallback
    const baseFilename = sanitizedFilename || `image_${uuid().slice(0, 8)}`;
    
    // Ensure we have an extension
    const ext = originalFilename.split(".").pop() || 'jpg';
    const filenameWithoutExt = baseFilename.replace(/\.[^/.]+$/, '');
    
    // R2 client
    const s3 = new S3Client({
        region: "auto",               // R2 always uses "auto"
        endpoint: process.env.R2_ENDPOINT,  // e.g. https://<accountid>.r2.cloudflarestorage.com
        forcePathStyle: true,
        credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY!,
            secretAccessKey: process.env.R2_SECRET_KEY!,
        },
    });

    // Check for filename conflicts and generate unique filename if needed
    let finalKey = `uploads/${filenameWithoutExt}.${ext}`;
    let counter = 1;
    
    while (true) {
        try {
            // Check if file already exists
            await s3.send(new HeadObjectCommand({
                Bucket: process.env.R2_BUCKET!,
                Key: finalKey,
            }));
            
            // If we reach here, file exists, so create a new name
            finalKey = `uploads/${filenameWithoutExt}_${counter}.${ext}`;
            counter++;
        } catch (error) {
            // File doesn't exist, we can use this key
            break;
        }
    }

    // Convert File → Buffer
    const arrayBuf = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);

    // Upload (NO ACL allowed on R2)
    await s3.send(
        new PutObjectCommand({
            Bucket: process.env.R2_BUCKET!,
            Key: finalKey,
            Body: buffer,
            ContentType: file.type,
        })
    );

    // Build Public URL (R2.dev or custom domain)
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${finalKey}`;

    return Response.json({
        url: publicUrl,
        key: finalKey,
    });
}
