import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingBag, Truck, Phone, Zap } from 'lucide-react';
import { getAllProducts, getFeaturedProducts } from '../data/products';
import { Product, PRODUCT_CATEGORIES } from '../types/Product';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [allProducts, featured] = await Promise.all([
          getAllProducts(),
          getFeaturedProducts()
        ]);
        
        setProducts(allProducts);
        setFeaturedProducts(featured);
        setFilteredProducts(allProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  useEffect(() => {
    let filtered = products;
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, products]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(prevCategory => prevCategory === category ? '' : category);
  };
  
  const features = [
    {
      icon: <ShoppingBag className="h-8 w-8 text-white" />,
      title: 'Quality Products',
      description: 'All our products are carefully selected and quality checked'
    },
    {
      icon: <Truck className="h-8 w-8 text-white" />,
      title: 'Fast Delivery',
      description: 'Free delivery on orders above ₹100'
    },
    {
      icon: <Zap className="h-8 w-8 text-white" />,
      title: 'Special Discounts',
      description: 'Get discounts and coupons on orders above ₹300'
    },
    {
      icon: <Phone className="h-8 w-8 text-white" />,
      title: '24/7 Support',
      description: 'Customer support available round the clock'
    }
  ];
  
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-indigo-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl font-extrabold text-white tracking-tight"
              >
                Your One-Stop <br />
                <span className="text-orange-400">Warehouse Solution</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-4 text-lg text-indigo-100 max-w-xl"
              >
                Quality products delivered to your doorstep. Explore our wide range of inventory and enjoy hassle-free ordering.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-8 flex flex-wrap gap-4"
              >
                <a
                  href="#products"
                  className="btn btn-accent"
                >
                  Shop Now
                </a>
                <a
                  href="#features"
                  className="btn bg-white text-indigo-600 hover:bg-gray-100"
                >
                  Learn More
                </a>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="mt-10 md:mt-0 md:w-1/2"
            >
              <img
                src="https://images.pexels.com/photos/6169659/pexels-photo-6169659.jpeg?auto=compress&cs=tinysrgb&w=1280"
                alt="Warehouse interior"
                className="rounded-lg shadow-xl"
              />
            </motion.div>
          </div>
        </div>
        
        {/* Wave pattern */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
            <path
              fill="#F9FAFB"
              fillOpacity="1"
              d="M0,64L60,80C120,96,240,128,360,128C480,128,600,96,720,80C840,64,960,64,1080,69.3C1200,75,1320,85,1380,90.7L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>
      
      {/* Features Section */}
      <section id="features" className="py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose Us
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              We provide the best warehouse management services with a focus on quality, speed, and customer satisfaction.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Featured Products</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white shadow rounded-lg p-4 animate-pulse">
                  <div className="h-48 bg-gray-300 rounded mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2 w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2 w-full"></div>
                  <div className="h-10 bg-gray-300 rounded mt-4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* All Products */}
      <section id="products" className="py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4 md:mb-0">Our Products</h2>
            
            <div className="w-full md:w-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full md:w-64"
                />
              </div>
            </div>
          </div>
          
          {/* Categories */}
          <div className="mb-8 flex flex-wrap gap-2">
            {PRODUCT_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white shadow rounded-lg p-4 animate-pulse">
                  <div className="h-48 bg-gray-300 rounded mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2 w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2 w-full"></div>
                  <div className="h-10 bg-gray-300 rounded mt-4"></div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No products found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                }}
                className="mt-4 btn btn-primary"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-indigo-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to Start Shopping?
          </h2>
          <p className="mt-4 text-xl text-indigo-100 max-w-2xl mx-auto">
            Join thousands of satisfied customers and experience our quality products and services today.
          </p>
          <div className="mt-8">
            <a
              href="#products"
              className="btn bg-white text-indigo-600 hover:bg-gray-100"
            >
              Explore Products
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;