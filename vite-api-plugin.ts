// @ts-nocheck
import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand, CopyObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export default function apiPlugin() {
  return {
    name: 'api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url.startsWith('/api/')) {
          try {
            const client = new S3Client({
              region: "vn-hcm-1",
              endpoint: "https://s3.vn-hcm-1.vietnix.cloud",
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY || 'c50868ad876ffd5555Z3',
                secretAccessKey: process.env.S3_SECRET_KEY || 'HsbseY1srG6hj8cgVDvwpVtEPb6HZ3WkDMWbIJHE',
              }
            });

            if (req.url.startsWith('/api/get-upload-url') && req.method === 'POST') {
              let body = '';
              req.on('data', chunk => body += chunk.toString());
              req.on('end', async () => {
                const { filename, contentType } = JSON.parse(body);
                const key = `products/${Date.now()}_${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
                const command = new PutObjectCommand({
                  Bucket: "benchydrop",
                  Key: key,
                  ContentType: contentType,
                });
                const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
                const publicUrl = `https://s3.vn-hcm-1.vietnix.cloud/benchydrop/${key}`;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ signedUrl, publicUrl }));
              });
              return;
            }

            if (req.url.startsWith('/api/manage-files')) {
              if (req.method === 'GET') {
                const url = new URL(req.url, `http://${req.headers.host}`);
                const prefix = url.searchParams.get('prefix') || '';
                const command = new ListObjectsV2Command({
                  Bucket: "benchydrop",
                  Prefix: prefix,
                  Delimiter: '/',
                });
                const response = await client.send(command);
                const files = (response.Contents || [])
                  .filter(item => item.Key !== prefix)
                  .map(item => ({
                    key: item.Key,
                    size: item.Size,
                    lastModified: item.LastModified,
                    url: `https://s3.vn-hcm-1.vietnix.cloud/benchydrop/${item.Key}`
                  }));
                const folders = (response.CommonPrefixes || []).map(p => p.Prefix);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ files, folders }));
                return;
              } else if (req.method === 'DELETE') {
                let body = '';
                req.on('data', chunk => body += chunk.toString());
                req.on('end', async () => {
                  const { keys } = JSON.parse(body);
                  for (const key of keys) {
                    const command = new DeleteObjectCommand({
                      Bucket: "benchydrop",
                      Key: key,
                    });
                    await client.send(command);
                  }
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: true }));
                });
                return;
              } else if (req.method === 'PUT') {
                let body = '';
                req.on('data', chunk => body += chunk.toString());
                req.on('end', async () => {
                  const { oldKey, newKey } = JSON.parse(body);
                  const copyCmd = new CopyObjectCommand({
                    Bucket: "benchydrop",
                    CopySource: `benchydrop/${encodeURIComponent(oldKey)}`,
                    Key: newKey,
                  });
                  await client.send(copyCmd);
                  const deleteCmd = new DeleteObjectCommand({
                    Bucket: "benchydrop",
                    Key: oldKey,
                  });
                  await client.send(deleteCmd);
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: true, newUrl: `https://s3.vn-hcm-1.vietnix.cloud/benchydrop/${newKey}` }));
                });
                return;
              }
            }

            res.statusCode = 404;
            res.end('Not Found');
          } catch (e) {
            console.error(e);
            res.statusCode = 500;
            res.end('Server Error');
          }
        } else {
          next();
        }
      });
    }
  }
}
