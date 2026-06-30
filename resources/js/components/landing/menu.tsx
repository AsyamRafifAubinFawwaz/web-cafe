import { Search, Tag, Eye } from 'lucide-react';
import React, { useState, useMemo } from 'react';

interface MenuItem {
    id: number;
    category_id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    is_promo?: boolean;
    promo_price?: number;
}

interface Category {
    id: number;
    type: 'makanan' | 'minuman';
    name: string;
}

// Mock Categories matching DB schema
const categories: Category[] = [
    { id: 1, type: 'minuman', name: 'Espresso Based' },
    { id: 2, type: 'minuman', name: 'Manual Brew' },
    { id: 3, type: 'minuman', name: 'Signature Drinks' },
    { id: 4, type: 'makanan', name: 'Main Course' },
    { id: 5, type: 'makanan', name: 'Snacks & Desserts' },
];

// Mock Menu Items matching DB schema
const menuItems: MenuItem[] = [
    { id: 101, category_id: 1, name: 'Espresso Double', description: 'Ekstraksi ganda dari biji kopi arabika premium dengan crema tebal.', price: 18000, image: 'https://images.unsplash.com/photo-1510707577719-5d6878021d49?w=500&auto=format&fit=crop&q=60' },
    { id: 102, category_id: 1, name: 'Cafe Latte', description: 'Double shot espresso dipadukan dengan susu segar bertekstur lembut.', price: 24000, image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60' },
    { id: 103, category_id: 1, name: 'Cappuccino', description: 'Keseimbangan rasa espresso kental, steamed milk, dan foam susu tebal.', price: 24000, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&auto=format&fit=crop&q=60' },
    { id: 104, category_id: 1, name: 'Caramel Macchiato', description: 'Espresso dengan sirup vanilla wangi, foam susu melimpah, dan saus karamel manis.', price: 28000, image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=500&auto=format&fit=crop&q=60' },
    
    { id: 201, category_id: 2, name: 'V60 Toraja Gayo', description: 'Penyeduhan manual kertas filter dengan profil rasa fruity dan clean body.', price: 22000, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&auto=format&fit=crop&q=60' },
    { id: 202, category_id: 2, name: 'Japanese Iced Drip', description: 'Seduhan manual V60 yang diteteskan langsung di atas es batu, segar & aromatik.', price: 24000, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=60' },
    
    { id: 301, category_id: 3, name: 'Kopi Susu Aren Motrack', description: 'Es kopi susu andalan dengan gula aren murni dan krim kelapa gurih.', price: 20000, image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=500&auto=format&fit=crop&q=60', is_promo: true, promo_price: 15000 },
    { id: 302, category_id: 3, name: 'Matcha Berry Latte', description: 'Uji matcha premium jepang dipadukan susu dan pure strawberry asam manis.', price: 26000, image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60' },
    
    { id: 401, category_id: 4, name: 'Nasi Goreng Kampung', description: 'Nasi goreng bumbu rempah tradisional khas jawa dengan telur mata sapi dan ayam suwir.', price: 32000, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=60' },
    { id: 402, category_id: 4, name: 'Spaghetti Aglio Olio', description: 'Spaghetti dimasak minyak zaitun kental, bawang putih geprek, cabai kering, dan potongan tuna.', price: 35000, image: 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=500&auto=format&fit=crop&q=60' },
    { id: 403, category_id: 4, name: 'Chicken Katsu Curry', description: 'Nasi putih hangat dengan katsu ayam renyah disiram kuah kari jepang gurih berempah.', price: 38000, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&auto=format&fit=crop&q=60', is_promo: true, promo_price: 30000 },

    { id: 501, category_id: 5, name: 'Butter Croissant', description: 'Roti pastry mentega khas prancis yang renyah di luar, berongga lembut di dalam.', price: 18000, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=60' },
    { id: 502, category_id: 5, name: 'Waffle Double Scoop Ice Cream', description: 'Waffle panggang hangat disajikan dengan 2 rasa es krim vanila/cokelat dan sirup cokelat manis.', price: 25000, image: 'https://images.unsplash.com/photo-1562376502-6f769499c886?w=500&auto=format&fit=crop&q=60' },
];

export default function Menu() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeMainType, setActiveMainType] = useState<'makanan' | 'minuman'>('minuman');
    const [activeSubCategoryId, setActiveSubCategoryId] = useState<number | 'all'>('all');
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

    // Filter sub-categories based on active main type (makanan/minuman)
    const filteredSubCategories = useMemo(() => {
        return categories.filter(cat => cat.type === activeMainType);
    }, [activeMainType]);

    // Reset sub-category selection when switching main category type
    const handleMainTypeChange = (type: 'makanan' | 'minuman') => {
        setActiveMainType(type);
        setActiveSubCategoryId('all');
    };

    // Filter items based on search query, main type, and sub-category
    const filteredItems = useMemo(() => {
        return menuItems.filter(item => {
            // Find category
            const category = categories.find(cat => cat.id === item.category_id);

            if (!category) {
return false;
}

            // Check main type (makanan/minuman)
            if (category.type !== activeMainType) {
return false;
}

            // Check sub category if not 'all'
            if (activeSubCategoryId !== 'all' && item.category_id !== activeSubCategoryId) {
return false;
}

            // Check search query
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase());
            
            return matchesSearch;
        });
    }, [searchQuery, activeMainType, activeSubCategoryId]);

    // Helper to format currency
    const formatIDR = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    return (
        <section id="menu" className="bg-cafe-bg py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center max-w-2xl mx-auto">
                    <span className="text-sm font-semibold tracking-wider text-cafe-primary uppercase">
                        Buku Menu Kami
                    </span>
                    <h2 className="mt-2 font-chewy text-4xl sm:text-5xl text-cafe-secondary">
                        Sajian Spesial untuk Menemani Hari Anda
                    </h2>
                    <p className="mt-4 font-poppins text-sm sm:text-base text-cafe-secondary/70">
                        Kami menyediakan aneka macam kopi seduh berkualitas tinggi, minuman non-kopi segar, makanan utama yang mengenyangkan, serta camilan manis pemanja lidah.
                    </p>
                </div>

                {/* Search Bar & Level 1 Categories Filter */}
                <div className="mt-12 flex flex-col md:flex-row gap-6 justify-between items-center bg-cafe-white p-4 rounded-2xl shadow-sm border border-cafe-secondary/5">
                    {/* Level 1 Filter Tabs (makanan / minuman) */}
                    <div className="flex gap-2 w-full md:w-auto">
                        <button
                            onClick={() => handleMainTypeChange('minuman')}
                            className={`flex-1 md:flex-initial px-6 py-3 rounded-xl font-poppins font-bold text-sm transition-all duration-200 ${
                                activeMainType === 'minuman'
                                    ? 'bg-cafe-primary text-white shadow-md shadow-cafe-primary/20'
                                    : 'bg-cafe-bg text-cafe-secondary hover:bg-cafe-secondary/5'
                            }`}
                        >
                            ☕ Kategori Minuman
                        </button>
                        <button
                            onClick={() => handleMainTypeChange('makanan')}
                            className={`flex-1 md:flex-initial px-6 py-3 rounded-xl font-poppins font-bold text-sm transition-all duration-200 ${
                                activeMainType === 'makanan'
                                    ? 'bg-cafe-primary text-white shadow-md shadow-cafe-primary/20'
                                    : 'bg-cafe-bg text-cafe-secondary hover:bg-cafe-secondary/5'
                            }`}
                        >
                            🍔 Kategori Makanan
                        </button>
                    </div>

                    {/* Search Input Box */}
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cafe-secondary/40 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Cari kopi atau makanan..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl font-poppins text-sm bg-cafe-bg border border-cafe-secondary/10 focus:border-cafe-primary focus:outline-none transition-colors"
                        />
                    </div>
                </div>

                {/* Level 2 Sub-Categories Tabs (e.g. Espresso Based, Manual Brew) */}
                <div className="mt-6 flex flex-wrap gap-2 justify-center items-center">
                    <button
                        onClick={() => setActiveSubCategoryId('all')}
                        className={`px-4 py-2 rounded-full font-poppins font-medium text-xs transition-colors ${
                            activeSubCategoryId === 'all'
                                ? 'bg-cafe-secondary text-white'
                                : 'bg-cafe-white text-cafe-secondary/80 border border-cafe-secondary/10 hover:bg-cafe-secondary/5'
                        }`}
                    >
                        Semua Sub-Kategori
                    </button>
                    
                    {filteredSubCategories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveSubCategoryId(cat.id)}
                            className={`px-4 py-2 rounded-full font-poppins font-medium text-xs transition-colors ${
                                activeSubCategoryId === cat.id
                                    ? 'bg-cafe-secondary text-white'
                                    : 'bg-cafe-white text-cafe-secondary/80 border border-cafe-secondary/10 hover:bg-cafe-secondary/5'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Menu Items Grid */}
                {filteredItems.length > 0 ? (
                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredItems.map(item => (
                            <div
                                key={item.id}
                                className="group bg-cafe-white rounded-3xl overflow-hidden shadow-md border border-cafe-secondary/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col justify-between"
                            >
                                {/* Item Image with Zoom & Hover Overlay */}
                                <div className="relative overflow-hidden aspect-[4/3] bg-cafe-secondary/5">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    
                                    {/* Promo Ribbon Badge */}
                                    {item.is_promo && (
                                        <div className="absolute top-4 left-4 bg-cafe-primary text-white font-chewy text-xs px-3 py-1 rounded-full shadow-lg border border-cafe-white flex items-center gap-1">
                                            <Tag className="h-3 w-3" />
                                            Promo Diskon!
                                        </div>
                                    )}

                                    {/* Quick Detail Hover Eye Trigger */}
                                    <div className="absolute inset-0 bg-cafe-secondary/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                                        <button
                                            onClick={() => setSelectedItem(item)}
                                            className="flex items-center gap-2 px-4 py-2 bg-cafe-white text-cafe-secondary rounded-full font-poppins text-xs font-bold shadow-md hover:scale-105 transition-transform"
                                        >
                                            <Eye className="h-4 w-4" />
                                            Lihat Detail
                                        </button>
                                    </div>
                                </div>

                                {/* Item Info */}
                                <div className="p-6 flex-grow flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start gap-2">
                                            <h3 className="font-poppins font-bold text-base text-cafe-secondary group-hover:text-cafe-primary transition-colors">
                                                {item.name}
                                            </h3>
                                            
                                            {/* Subcategory Small Tag */}
                                            <span className="text-[10px] bg-cafe-bg px-2.5 py-1 rounded-full text-cafe-secondary/60 font-semibold font-poppins whitespace-nowrap">
                                                {categories.find(cat => cat.id === item.category_id)?.name}
                                            </span>
                                        </div>
                                        
                                        <p className="mt-2 font-poppins text-xs text-cafe-secondary/70 leading-relaxed line-clamp-2">
                                            {item.description}
                                        </p>
                                    </div>

                                    {/* Prices */}
                                    <div className="mt-6 flex items-center gap-2 border-t border-cafe-secondary/5 pt-4">
                                        {item.is_promo && item.promo_price ? (
                                            <>
                                                <span className="font-chewy text-xl text-cafe-primary">
                                                    {formatIDR(item.promo_price)}
                                                </span>
                                                <span className="font-poppins text-xs text-cafe-secondary/40 line-through">
                                                    {formatIDR(item.price)}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="font-chewy text-xl text-cafe-secondary">
                                                {formatIDR(item.price)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="mt-16 text-center p-8 bg-cafe-white rounded-3xl border border-dashed border-cafe-secondary/15 max-w-md mx-auto">
                        <p className="font-poppins text-sm text-cafe-secondary/60 font-medium">
                            Menu tidak ditemukan. Silakan gunakan kata kunci pencarian lain.
                        </p>
                    </div>
                )}
            </div>

            {/* Modal Detail Item */}
            {selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
                    <div className="bg-cafe-white rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full border border-cafe-secondary/10 relative animate-scale-in">
                        {/* Close button */}
                        <button
                            onClick={() => setSelectedItem(null)}
                            className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black transition-colors"
                        >
                            ✕
                        </button>
                        
                        <img
                            src={selectedItem.image}
                            alt={selectedItem.name}
                            className="h-[250px] w-full object-cover"
                        />

                        <div className="p-6">
                            <span className="text-[10px] bg-cafe-primary/10 px-3 py-1 rounded-full text-cafe-primary font-bold font-poppins uppercase">
                                {categories.find(cat => cat.id === selectedItem.category_id)?.name}
                            </span>
                            
                            <h3 className="mt-3 font-chewy text-2xl text-cafe-secondary">{selectedItem.name}</h3>
                            
                            <p className="mt-3 font-poppins text-sm text-cafe-secondary/80 leading-relaxed">
                                {selectedItem.description}
                            </p>

                            <div className="mt-6 flex justify-between items-center border-t border-cafe-secondary/5 pt-4">
                                <div>
                                    <p className="font-poppins text-2xs text-cafe-secondary/50 uppercase tracking-wider font-bold">Harga</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        {selectedItem.is_promo && selectedItem.promo_price ? (
                                            <>
                                                <span className="font-chewy text-2xl text-cafe-primary">
                                                    {formatIDR(selectedItem.promo_price)}
                                                </span>
                                                <span className="font-poppins text-sm text-cafe-secondary/40 line-through">
                                                    {formatIDR(selectedItem.price)}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="font-chewy text-2xl text-cafe-secondary">
                                                {formatIDR(selectedItem.price)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedItem(null)}
                                    className="px-6 py-3 bg-cafe-secondary text-white font-poppins font-bold text-xs rounded-xl shadow-md hover:bg-cafe-secondary/90 transition-colors"
                                >
                                    Tutup Detail
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
