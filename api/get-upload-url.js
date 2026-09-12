import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { filename, contentType } = req.body;

    if (!filename || !contentType) {
      return res.status(400).json({ error: 'Missing filename or contentType' });
    }

    const client = new S3Client({
      region: "vn-hcm-1",
      endpoint: "https://s3.vn-hcm-1.vietnix.cloud",
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
      }
    });

    const key = `products/${Date.now()}_${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    const command = new PutObjectCommand({
      Bucket: "benchydrop",
      Key: key,
      ContentType: contentType,
    });

    const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
    const publicUrl = `https://s3.vn-hcm-1.vietnix.cloud/benchydrop/${key}`;

    res.status(200).json({ signedUrl, publicUrl });
  } catch (error) {
    console.error("Error generating signed URL", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
