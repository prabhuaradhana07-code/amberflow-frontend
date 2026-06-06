import ProductClient from './ProductClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function generateMetadata({ params }) {
  const { slug } = params;
  try {
    const res = await fetch(`${API_URL}/api/products/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return { title: 'Product Not Found' };
    const product = await res.json();

    const imageUrl = product.image_url && product.image_url.startsWith('/uploads/') 
      ? `${API_URL}${product.image_url}` 
      : (product.image_url || 'https://images.unsplash.com/photo-1587049352847-81a56d773c16?w=1200&q=80');

    return {
      title: product.name,
      description: product.description.substring(0, 160),
      openGraph: {
        title: product.name,
        description: product.description.substring(0, 160),
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 600,
            alt: product.name,
          },
        ],
      },
    };
  } catch (error) {
    return { title: 'Product Not Found' };
  }
}

export default function Page() {
  return <ProductClient />;
}
