import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ArrowUpDown, X, PackageOpen } from 'lucide-react';
import { productAPI } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import FilterSidebar from '../components/product/FilterSidebar';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [brands, setBrands] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filters state initialized from URL
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
  const [searchKeyword, setSearchKeyword] = useState(searchParams.get('q') || '');
  const [priceRange, setPriceRange] = useState(3000);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch filter metadata on mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const { data } = await productAPI.getFilters();
        if (data.categories) setCategories(data.categories);
        if (data.brands) setBrands(data.brands);
        if (data.priceRange?.max) setPriceRange(data.priceRange.max);
      } catch (err) {
        console.error('Failed to load filter metadata', err);
      }
    };
    fetchMetadata();
  }, []);

  // Sync state if URL searchParams change
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat !== null) setSelectedCategory(cat);
    const q = searchParams.get('q');
    if (q !== null) setSearchKeyword(q);
  }, [searchParams]);

  // Fetch products whenever filters change
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const params = {
          keyword: searchKeyword || undefined,
          category: selectedCategory || undefined,
          brand: selectedBrand || undefined,
          maxPrice: priceRange < 3000 ? priceRange : undefined,
          minRating: minRating > 0 ? minRating : undefined,
          inStock: inStockOnly ? 'true' : undefined,
          sort: sortBy
        };
        const { data } = await productAPI.getProducts(params);
        setProducts(data.products || []);
        setTotalCount(data.total || 0);
      } catch (err) {
        console.error('Failed fetching products', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchFilteredProducts, 150);
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedBrand, searchKeyword, priceRange, minRating, inStockOnly, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setSearchKeyword('');
    setPriceRange(3000);
    setMinRating(0);
    setInStockOnly(false);
    setSortBy('popularity');
    setSearchParams({});
  };

  return (
    <div className="pb-16 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Product Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Showing <span className="font-bold text-slate-800">{products.length}</span> of {totalCount} items
            {selectedCategory && ` in ${selectedCategory}`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-500 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="popularity">Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar + Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <FilterSidebar
            categories={categories}
            brands={brands}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedBrand={selectedBrand}
            onSelectBrand={setSelectedBrand}
            searchKeyword={searchKeyword}
            onSearchChange={setSearchKeyword}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            minRating={minRating}
            onRatingChange={setMinRating}
            inStockOnly={inStockOnly}
            onInStockChange={setInStockOnly}
            onReset={handleResetFilters}
          />
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex bg-slate-950/60 backdrop-blur-sm lg:hidden">
            <div className="w-80 max-w-full bg-white h-full p-6 overflow-y-auto ml-auto relative">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
              <FilterSidebar
                categories={categories}
                brands={brands}
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  setMobileFilterOpen(false);
                }}
                selectedBrand={selectedBrand}
                onSelectBrand={setSelectedBrand}
                searchKeyword={searchKeyword}
                onSearchChange={setSearchKeyword}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
                minRating={minRating}
                onRatingChange={setMinRating}
                inStockOnly={inStockOnly}
                onInStockChange={setInStockOnly}
                onReset={() => {
                  handleResetFilters();
                  setMobileFilterOpen(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="flex-1 w-full">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-96 bg-slate-200/60 rounded-3xl animate-pulse"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                <PackageOpen className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No products found</h3>
              <p className="text-xs text-slate-500 mt-1">
                We couldn't find any products matching your specific filter criteria.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
