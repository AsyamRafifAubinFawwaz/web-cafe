import { useState, useMemo, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { ShoppingCart, Plus, Minus, Tag, UtensilsCrossed, CheckCircle2, Search, Trash2, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface MenuItem {
    id: number;
    category_id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    promo?: {
        is_active: boolean;
        discount_value: number;
        discount_type: 'nominal' | 'percentage';
        promo_price: number;
    };
}

interface Category {
    id: number;
    name: string;
}

interface TableOrder {
    id: number;
    table_number: string;
    status: string;
    total_amount: number;
    items?: any[];
}

interface PageProps {
    tableId: number;
    tableNumber: string;
    existingOrder?: TableOrder;
    categories: Category[];
    menus: MenuItem[];
    flash: {
        success?: string;
        error?: string;
    };
}

interface CartItem {
    menu_id: number;
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
}

export default function GuestOrder({ tableId, tableNumber, existingOrder, categories, menus, flash }: PageProps) {
    const [activeCategoryId, setActiveCategoryId] = useState<number | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);

    // Checkout state
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'pay_at_cashier' | 'online_payment'>('pay_at_cashier');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Existing item total for display
    const existingTotal = existingOrder?.total_amount || 0;

    const filteredMenus = useMemo(() => {
        let result = menus;
        if (activeCategoryId !== 'all') {
            result = result.filter(m => m.category_id === activeCategoryId);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.trim().toLowerCase();
            result = result.filter(m =>
                m.name.toLowerCase().includes(q) || m.description?.toLowerCase().includes(q)
            );
        }
        return result;
    }, [activeCategoryId, searchQuery, menus]);

    const cartTotalAmount = useMemo(() => {
        return cart.reduce((total, item) => total + item.subtotal, 0);
    }, [cart]);

    const cartTotalItems = useMemo(() => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    }, [cart]);

    // Auto-close checkout modal if cart becomes empty (e.g. user removed everything inside the modal)
    useEffect(() => {
        if (isCheckoutModalOpen && cart.length === 0) {
            setIsCheckoutModalOpen(false);
        }
    }, [cart, isCheckoutModalOpen]);

    const formatIDR = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const getPrice = (menu: MenuItem) => {
        if (menu.promo?.is_active && menu.promo.promo_price) {
            return menu.promo.promo_price;
        }
        return menu.price;
    };

    const getDiscountPercent = (menu: MenuItem) => {
        if (!menu.promo?.is_active || !menu.promo.promo_price) return 0;
        return Math.round((1 - menu.promo.promo_price / menu.price) * 100);
    };

    const addToCart = (menu: MenuItem) => {
        const price = getPrice(menu);

        setCart(prev => {
            const existing = prev.find(item => item.menu_id === menu.id);
            if (existing) {
                return prev.map(item =>
                    item.menu_id === menu.id
                        ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * price }
                        : item
                );
            }
            return [...prev, {
                menu_id: menu.id,
                name: menu.name,
                quantity: 1,
                price: price,
                subtotal: price
            }];
        });
        toast.success(`${menu.name} ditambahkan!`);
    };

    // Decrease quantity by 1 (removes item entirely once it hits 0)
    const removeFromCart = (menuId: number) => {
        setCart(prev => {
            const existing = prev.find(item => item.menu_id === menuId);
            if (!existing) return prev;

            if (existing.quantity === 1) {
                return prev.filter(item => item.menu_id !== menuId);
            }

            return prev.map(item =>
                item.menu_id === menuId
                    ? { ...item, quantity: item.quantity - 1, subtotal: (item.quantity - 1) * item.price }
                    : item
            );
        });
    };

    // Increase quantity by 1 using the price already locked-in at the cart item (used inside the cart review modal)
    const incrementCartItem = (menuId: number) => {
        setCart(prev => prev.map(item =>
            item.menu_id === menuId
                ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price }
                : item
        ));
    };

    const deleteCartItem = (menuId: number) => {
        setCart(prev => prev.filter(item => item.menu_id !== menuId));
    };

    const getQuantityInCart = (menuId: number) => {
        return cart.find(c => c.menu_id === menuId)?.quantity || 0;
    };

    const handleCheckoutClick = () => {
        if (cart.length === 0) return;
        setIsCheckoutModalOpen(true);
    };

    const submitOrder = () => {
        if (cart.length === 0) return;
        setIsSubmitting(true);

        router.post(`/guest/menu`, {
            table_id: tableId,
            payment_method: paymentMethod,
            items: cart.map(item => ({
                menu_id: item.menu_id,
                quantity: item.quantity,
                subtotal: item.subtotal
            })),
            total_amount: cartTotalAmount
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setCart([]); // Clear cart on success
                setIsCheckoutModalOpen(false);
                setIsSubmitting(false);
                toast.success('Pesanan berhasil dikirim ke dapur!');
            },
            onError: () => {
                setIsSubmitting(false);
                toast.error('Gagal mengirim pesanan. Silakan coba lagi.');
            }
        });
    };

    return (
        <div className="min-h-screen bg-cafe-bg pb-32 font-poppins selection:bg-cafe-primary/10">
            <Head title={`Pesan Meja ${tableNumber}`} />

            {/* Header (shop-style) */}
            <div className="sticky top-0 z-40 bg-cafe-primary pt-2 pb-2 px-4 shadow-lg">
                <div className="max-w-6xl mx-auto flex items-center justify-between text-white">
                    <div className="flex items-center min-w-0">
                        {/* <div className="bg-white/15 p-2.5 rounded-2xl backdrop-blur-md border border-white/10 shrink-0">
                            <UtensilsCrossed className="size-5" />
                        </div> */}
                        <img src="/images/logo-nugas.png" className='w-auto h-16' alt="" />
                        <div className="min-w-0">
                            <p className="font-chewy text-lg tracking-wide leading-none truncate">Nugas Cafe</p>
                            <p className="text-[10px] opacity-80 font-poppins mt-1">Pesan langsung dari meja</p>
                        </div>
                    </div>
                    <div className="bg-white/15 border border-white/10 px-4 py-2 rounded-2xl backdrop-blur-md text-right shrink-0">
                        <p className="text-[9px] uppercase tracking-wider opacity-75 font-bold leading-none">Meja</p>
                        <p className="font-chewy text-lg leading-none mt-1">{tableNumber}</p>
                    </div>
                </div>
            </div>
            {/* Floating search bar overlapping header */}
            <div className="max-w-6xl mx-auto px-4 mt-5 relative z-30">
                <div className="bg-white rounded-2xl shadow-md border border-cafe-secondary/8 flex items-center gap-2.5 px-4 py-3.5">
                    <Search className="size-4 text-cafe-secondary/40 shrink-0" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari menu favoritmu..."
                        className="w-full bg-transparent text-sm font-poppins text-cafe-secondary placeholder:text-cafe-secondary/40 outline-none"
                    />
                </div>
            </div>


            <div className="max-w-6xl mx-auto px-4 mt-5">
                {/* Status or Success Flash */}
                {flash?.success && (
                    <div className="mb-5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-3xl p-4 flex items-start gap-3 shadow-xs">
                        <CheckCircle2 className="size-6 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-bold text-emerald-900 text-sm">Berhasil!</h3>
                            <p className="text-xs text-emerald-800/90 mt-0.5">{flash.success}</p>
                        </div>
                    </div>
                )}

                {/* Info about existing orders */}
                {existingTotal > 0 && cartTotalItems === 0 && existingOrder && (
                    <div className="mb-5 bg-white border border-cafe-secondary/5 rounded-3xl p-4 flex justify-between items-center shadow-xs">
                        <div>
                            <p className="text-[10px] text-cafe-secondary/55 font-bold uppercase tracking-wider">Total Pesanan Saat Ini</p>
                            <p className="font-chewy text-xl text-cafe-secondary mt-0.5">{formatIDR(existingTotal)}</p>
                        </div>
                        <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-3 py-1.5 rounded-full font-poppins uppercase tracking-wider">
                            {existingOrder.status.toUpperCase()}
                        </span>
                    </div>
                )}

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
                    <button
                        onClick={() => setActiveCategoryId('all')}
                        className={`whitespace-nowrap px-5 py-2.5 rounded-full font-poppins font-bold text-xs transition-all duration-300 cursor-pointer ${
                            activeCategoryId === 'all'
                                ? 'bg-cafe-primary text-white shadow-md'
                                : 'bg-white text-cafe-secondary/70 border border-cafe-secondary/10 hover:border-cafe-primary/30'
                        }`}
                    >
                        Semua Menu
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategoryId(cat.id)}
                            className={`whitespace-nowrap px-5 py-2.5 rounded-full font-poppins font-bold text-xs transition-all duration-300 cursor-pointer ${
                                activeCategoryId === cat.id
                                    ? 'bg-cafe-primary text-white shadow-md'
                                    : 'bg-white text-cafe-secondary/70 border border-cafe-secondary/10 hover:border-cafe-primary/30'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Menus Grid - marketplace style cards */}
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                    {filteredMenus.map(menu => {
                        const qty = getQuantityInCart(menu.id);
                        const isPromo = menu.promo?.is_active;
                        const activePrice = getPrice(menu);
                        const discountPercent = getDiscountPercent(menu);

                        return (
                            <div key={menu.id} className="bg-white rounded-2xl shadow-xs border border-cafe-secondary/8 flex flex-col overflow-visible hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 relative group">
                                {/* Image Container */}
                                <div className="relative w-full aspect-square bg-cafe-bg overflow-hidden rounded-t-2xl">
                                    <img src={menu.image} alt={menu.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    {isPromo && (
                                        <div className="absolute top-2 left-2 bg-cafe-primary text-white text-[9px] font-bold px-2 py-1 rounded-full shadow-sm z-10 flex items-center gap-1">
                                            <Tag className="size-2.5" /> {discountPercent > 0 ? `-${discountPercent}%` : 'Promo'}
                                        </div>
                                    )}

                                    {/* Floating add-to-cart button, marketplace style */}
                                    <div className="absolute bottom-2.5 right-2.5 z-10">
                                        {qty === 0 ? (
                                            <button
                                                onClick={() => addToCart(menu)}
                                                className="bg-cafe-primary text-white size-9 rounded-full shadow-md ring-4 ring-white flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
                                            >
                                                <Plus className="size-4" />
                                            </button>
                                        ) : (
                                            <div className="flex items-center gap-1.5 bg-white rounded-full shadow-md ring-4 ring-white border border-cafe-secondary/10 p-1">
                                                <button
                                                    onClick={() => removeFromCart(menu.id)}
                                                    className="bg-cafe-bg text-cafe-secondary size-6 rounded-full flex items-center justify-center active:scale-90 cursor-pointer"
                                                >
                                                    <Minus className="size-3" />
                                                </button>
                                                <span className="font-poppins font-bold text-xs w-4 text-center text-cafe-secondary">{qty}</span>
                                                <button
                                                    onClick={() => addToCart(menu)}
                                                    className="bg-cafe-primary text-white size-6 rounded-full flex items-center justify-center active:scale-90 cursor-pointer"
                                                >
                                                    <Plus className="size-3" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Content details */}
                                <div className="p-3 pt-4 flex-1 flex flex-col gap-1.5">
                                    <h3 className="font-poppins font-bold text-cafe-secondary line-clamp-1 text-sm leading-snug">
                                        {menu.name}
                                    </h3>
                                    <p className="text-[10px] text-cafe-secondary/60 font-poppins line-clamp-2 leading-relaxed min-h-[2.2em]">
                                        {menu.description}
                                    </p>

                                    <div className="mt-auto pt-2 border-t border-cafe-secondary/5 flex flex-col">
                                        {isPromo ? (
                                            <>
                                                <span className="font-chewy text-cafe-primary text-base leading-none">{formatIDR(activePrice)}</span>
                                                <span className="text-[9px] text-cafe-secondary/40 line-through leading-tight mt-1">{formatIDR(menu.price)}</span>
                                            </>
                                        ) : (
                                            <span className="font-chewy text-cafe-secondary text-base leading-none">{formatIDR(activePrice)}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {filteredMenus.length === 0 && (
                        <div className="col-span-2 sm:col-span-3 lg:col-span-4 xl:col-span-5 text-center p-8 bg-white rounded-3xl border border-dashed border-cafe-secondary/20 my-4">
                            <p className="text-cafe-secondary/60 font-poppins text-xs">
                                {searchQuery ? `Tidak ada menu yang cocok dengan "${searchQuery}".` : 'Tidak ada menu di kategori ini.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Sticky Cart Bottom Bar */}
            {cart.length > 0 && (
                <div className="fixed bottom-4 left-0 right-0 px-4 z-50">
                    <button
                        onClick={handleCheckoutClick}
                        className="max-w-md w-full mx-auto bg-cafe-secondary/95 backdrop-blur-md text-white rounded-3xl p-4 shadow-2xl flex items-center justify-between border border-white/10 cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="bg-white/10 p-3 rounded-2xl border border-white/5">
                                    <ShoppingCart className="size-5" />
                                </div>
                                <span className="absolute -top-1.5 -right-1.5 bg-cafe-primary text-white text-[10px] font-bold size-5 rounded-full flex items-center justify-center shadow-sm border border-cafe-secondary">
                                    {cartTotalItems}
                                </span>
                            </div>
                            <div className="text-left">
                                <p className="font-poppins text-[10px] opacity-70 flex items-center gap-1">
                                    Lihat pesanan <ChevronUp className="size-3" />
                                </p>
                                <p className="font-chewy text-xl text-cafe-yellow mt-0.5">{formatIDR(cartTotalAmount)}</p>
                            </div>
                        </div>
                        <span className="bg-cafe-primary text-white font-poppins font-bold px-6 py-3.5 rounded-2xl">
                            Pesan
                        </span>
                    </button>
                </div>
            )}

            {/* Cart Review + Checkout Modal */}
            <Dialog open={isCheckoutModalOpen} onOpenChange={setIsCheckoutModalOpen}>
                <DialogContent className="sm:max-w-lg w-11/12 rounded-3xl p-0 overflow-hidden font-poppins flex flex-col max-h-[85vh]">
                    <DialogHeader className="p-6 pb-3 shrink-0">
                        <DialogTitle className="font-chewy text-2xl text-cafe-secondary tracking-wide">Keranjang Pesanan</DialogTitle>
                        <DialogDescription className="font-poppins text-xs text-cafe-secondary/70">
                            Meja {tableNumber} • {cartTotalItems} item
                        </DialogDescription>
                    </DialogHeader>

                    {/* Item list */}
                    <div className="flex-1 overflow-y-auto px-6 space-y-2.5">
                        {cart.map(item => (
                            <div key={item.menu_id} className="flex items-center justify-between gap-3 bg-cafe-bg/70 rounded-2xl p-3">
                                <div className="min-w-0 flex-1">
                                    <p className="font-bold text-sm text-cafe-secondary truncate">{item.name}</p>
                                    <p className="text-[10px] text-cafe-secondary/55 mt-0.5">{formatIDR(item.price)} / porsi</p>
                                </div>
                                <div className="flex items-center gap-2.5 shrink-0">
                                    <div className="flex items-center gap-1 bg-white rounded-full border border-cafe-secondary/10 p-0.5">
                                        <button
                                            onClick={() => removeFromCart(item.menu_id)}
                                            className="size-6 rounded-full bg-cafe-bg text-cafe-secondary flex items-center justify-center active:scale-90 cursor-pointer"
                                        >
                                            <Minus className="size-3" />
                                        </button>
                                        <span className="text-xs font-bold w-4 text-center text-cafe-secondary">{item.quantity}</span>
                                        <button
                                            onClick={() => incrementCartItem(item.menu_id)}
                                            className="size-6 rounded-full bg-cafe-primary text-white flex items-center justify-center active:scale-90 cursor-pointer"
                                        >
                                            <Plus className="size-3" />
                                        </button>
                                    </div>
                                    <span className="font-chewy text-sm text-cafe-primary w-20 text-right shrink-0">{formatIDR(item.subtotal)}</span>
                                    <button
                                        onClick={() => deleteCartItem(item.menu_id)}
                                        className="text-cafe-secondary/30 hover:text-red-500 transition-colors cursor-pointer shrink-0"
                                        aria-label="Hapus item"
                                    >
                                        <Trash2 className="size-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Payment + confirm */}
                    <div className="p-6 pt-4 border-t border-cafe-secondary/8 shrink-0 space-y-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-cafe-secondary/50">Metode Pembayaran</p>

                        <button
                            type="button"
                            onClick={() => setPaymentMethod('pay_at_cashier')}
                            className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                                paymentMethod === 'pay_at_cashier'
                                    ? 'border-cafe-primary bg-cafe-primary/5 shadow-xs'
                                    : 'border-neutral-200 hover:border-cafe-primary/30 bg-white'
                            }`}
                        >
                            <div className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                paymentMethod === 'pay_at_cashier' ? 'border-cafe-primary' : 'border-neutral-300'
                            }`}>
                                {paymentMethod === 'pay_at_cashier' && <div className="size-2.5 rounded-full bg-cafe-primary" />}
                            </div>
                            <div className="text-left">
                                <p className="font-poppins font-bold text-sm text-cafe-secondary">Bayar di Kasir</p>
                                <p className="text-[10px] text-cafe-secondary/60 font-poppins mt-0.5">Pesan sekarang, bayar nanti di meja kasir</p>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setPaymentMethod('online_payment')}
                            className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                                paymentMethod === 'online_payment'
                                    ? 'border-cafe-primary bg-cafe-primary/5 shadow-xs'
                                    : 'border-neutral-200 hover:border-cafe-primary/30 bg-white'
                            }`}
                        >
                            <div className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                paymentMethod === 'online_payment' ? 'border-cafe-primary' : 'border-neutral-300'
                            }`}>
                                {paymentMethod === 'online_payment' && <div className="size-2.5 rounded-full bg-cafe-primary" />}
                            </div>
                            <div className="text-left">
                                <p className="font-poppins font-bold text-sm text-cafe-secondary">Bayar Online (E-Wallet/Transfer)</p>
                                <p className="text-[10px] text-cafe-secondary/60 font-poppins mt-0.5">Bayar langsung melalui ponsel Anda</p>
                            </div>
                        </button>

                        <div className="flex items-center justify-between pt-1">
                            <span className="text-xs font-bold text-cafe-secondary/60 uppercase tracking-wider">Total</span>
                            <span className="font-chewy text-2xl text-cafe-primary">{formatIDR(cartTotalAmount)}</span>
                        </div>

                        <DialogFooter className="flex-row gap-3 sm:gap-3 pt-1">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCheckoutModalOpen(false)}
                                className="flex-1 rounded-xl h-12 font-poppins font-bold text-cafe-secondary border-neutral-200 cursor-pointer"
                                disabled={isSubmitting}
                            >
                                Batal
                            </Button>
                            <Button
                                type="button"
                                onClick={submitOrder}
                                disabled={isSubmitting || cart.length === 0}
                                className="flex-1 rounded-xl h-12 bg-cafe-primary hover:bg-cafe-primary/95 text-white font-poppins font-bold cursor-pointer"
                            >
                                {isSubmitting ? 'Memproses...' : 'Konfirmasi'}
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}