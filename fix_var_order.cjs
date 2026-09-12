const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// Move the Notification Logic variables AFTER pendingCount/craftingCount are declared
// Remove the notification block from where it was injected
code = code.replace(
  `const totalRevenue = orders.reduce((s, o) => s + o.total, 0);

  // Notification Center Logics
  const lastBlogDate = blogPosts.length > 0 ? new Date([...blogPosts].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date).getTime() : 0;
  const daysSinceLastBlog = Math.floor((new Date().getTime() - lastBlogDate) / (1000 * 3600 * 24));
  const needsBlogUpdate = daysSinceLastBlog >= 3 || blogPosts.length === 0;
  
  const lowStockProducts = products.filter(p => p.stock <= 3);
  const needsOrderAttention = pendingCount > 0 || craftingCount > 0;
  const needsRevenuePush = todayRevenue < 1000000;
`,
  `const totalRevenue = orders.reduce((s, o) => s + o.total, 0);`
);

// Add the Notification Logic variables AFTER shippingCount is declared
code = code.replace(
  `  const shippingCount = orders.filter(o => o.status === 'Shipping').length;`,
  `  const shippingCount = orders.filter(o => o.status === 'Shipping').length;

  // Notification Center Logics
  const lastBlogDate = blogPosts.length > 0 ? new Date([...blogPosts].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date).getTime() : 0;
  const daysSinceLastBlog = Math.floor((new Date().getTime() - lastBlogDate) / (1000 * 3600 * 24));
  const needsBlogUpdate = daysSinceLastBlog >= 3 || blogPosts.length === 0;
  const lowStockProducts = products.filter(p => p.stock <= 3);
  const needsOrderAttention = pendingCount > 0 || craftingCount > 0;
  const needsRevenuePush = todayRevenue < 1000000;`
);

fs.writeFileSync('src/pages/Admin.tsx', code, 'utf8');
console.log('Done!');
