export default async function sitemap() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  let products = [];
  try {
    const res = await fetch(`${apiUrl}/api/products`, { next: { revalidate: 60 } });
    if (res.ok) {
      products = await res.json();
    }
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
  }

  const productUrls = products.map((product) => ({
    url: `https://amberflow.in/product/${product.slug}`,
    lastModified: new Date(product.updated_at || product.created_at || new Date()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: 'https://amberflow.in',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: 'https://amberflow.in/login',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://amberflow.in/vendor/register',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...productUrls,
  ];
}
