import { S3Client, ListObjectsV2Command, DeleteObjectCommand } from "@aws-sdk/client-s3";

const client = new S3Client({
  region: "vn-hcm-1",
  endpoint: "https://s3.vn-hcm-1.vietnix.cloud",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  }
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { prefix = '' } = req.query;
      
      const command = new ListObjectsV2Command({
        Bucket: "benchydrop",
        Prefix: prefix,
        Delimiter: '/',
      });

      const response = await client.send(command);
      
      // Files in current directory
      const files = (response.Contents || [])
        .filter(item => item.Key !== prefix) // S3 sometimes returns the folder itself
        .map(item => ({
          key: item.Key,
          size: item.Size,
          lastModified: item.LastModified,
          url: `https://s3.vn-hcm-1.vietnix.cloud/benchydrop/${item.Key}`
        }));
      
      // Subdirectories
      const folders = (response.CommonPrefixes || []).map(p => p.Prefix);

      res.status(200).json({ 
        files, 
        folders 
      });
    } catch (error) {
      console.error("Error listing files", error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } 
  else if (req.method === 'DELETE') {
    try {
      const { key } = req.body;
      if (!key) {
        return res.status(400).json({ error: 'Missing file key' });
      }

      const command = new DeleteObjectCommand({
        Bucket: "benchydrop",
        Key: key,
      });

      await client.send(command);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error deleting file", error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
