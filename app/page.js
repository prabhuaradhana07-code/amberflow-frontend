import Link from 'next/link';

export default async function Home() {
  // This securely fetches from your live backend!
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const res = await fetch(`${apiUrl}/api/products`, { cache: 'no-store' });
  const products = res.ok ? await res.json() : [];

  return (
    <div className="bg-[#FFFAEF] min-h-screen pb-20">
      
      {/* 1. HERO SECTION */}
      <div className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center text-center overflow-hidden mb-16 shadow-sm">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1587049352847-81a56d773c16?q=80&w=2000')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/10"></div>
        <div className="relative z-10 px-6 max-w-4xl mx-auto -mt-20">
          <span className="text-amber-400 font-bold tracking-[0.3em] uppercase text-sm mb-6 block drop-shadow-md">
            Directly from the Source
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 drop-shadow-xl leading-tight">
            Pure Nature, <br/>Bottled.
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 mb-10 font-light drop-shadow-md max-w-2xl mx-auto">
            Sustainably harvested from deep wild forests and sunlit paddy fields. 100% organic, raw, and unfiltered.
          </p>
        </div>
      </div>

      {/* 2. TRUST BADGES */}
      <div className="flex flex-wrap justify-center gap-8 md:gap-24 max-w-6xl mx-auto px-6 mb-24 border-b border-amber-200 pb-16">
        <div className="flex flex-col items-center text-center max-w-[200px]">
          <span className="text-4xl mb-4">🐝</span>
          <h3 className="font-bold text-amber-900 mb-2">100% Organic</h3>
          <p className="text-sm text-amber-700/80">Ethically sourced from natural environments.</p>
        </div>
        <div className="flex flex-col items-center text-center max-w-[200px]">
          <span className="text-4xl mb-4">🍯</span>
          <h3 className="font-bold text-amber-900 mb-2">Raw & Unfiltered</h3>
          <p className="text-sm text-amber-700/80">Retains all natural pollen and enzymes.</p>
        </div>
      </div>

      {/* 3. SHOP HEADER */}
      <div id="shop" className="text-center mb-16 px-6">
        <h2 className="text-4xl md:text-5xl font-serif text-amber-950 mb-6">Our Golden Collection</h2>
        <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full"></div>
      </div>

      {/* 4. PREMIUM PRODUCT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto px-6">
        {products.map((product) => (
          <Link href={`/product/${product.slug}`} key={product.id} className="group">
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2 border border-amber-100 flex flex-col h-full">
              <div className="h-72 bg-amber-100 flex items-center justify-center relative overflow-hidden">
                <span className="text-8xl drop-shadow-xl transform group-hover:scale-110 transition-transform duration-500">🍯</span>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">{product.name}</h3>
                <p className="text-gray-500 text-sm mb-6 line-clamp-2 flex-grow">{product.description}</p>
                <div className="mt-auto pt-6 border-t border-gray-100">
                  <span className="text-3xl font-extrabold text-amber-900">₹{product.price}</span>
                  <span className="text-sm text-gray-400 font-medium ml-2">/ {product.weight_g}g</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}