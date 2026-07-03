import { useState, useMemo } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { ShoppingCart, Plus, Minus, Tag, UtensilsCrossed, CheckCircle2 } from 'lucide-react';
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
    const [cart, setCart] = useState<CartItem[]>([]);
    
    // Checkout state
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'pay_at_cashier' | 'online_payment'>('pay_at_cashier');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Existing item total for display
    const existingTotal = existingOrder?.total_amount || 0;

    const filteredMenus = useMemo(() => {
        if (activeCategoryId === 'all') return menus;
        return menus.filter(m => m.category_id === activeCategoryId);
    }, [activeCategoryId, menus]);

    const cartTotalAmount = useMemo(() => {
        return cart.reduce((total, item) => total + item.subtotal, 0);
    }, [cart]);

    const cartTotalItems = useMemo(() => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    }, [cart]);

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
        <div className="min-h-screen bg-cafe-bg pb-32">
            <Head title={`Pesan Meja ${tableNumber}`} />

            {/* Header */}
            <div className="bg-cafe-primary text-white p-6 rounded-b-[2.5rem] shadow-lg mb-6 sticky top-0 z-40">
                <div className="flex justify-between items-center max-w-md mx-auto">
                    <div>
                        <p className="font-poppins text-sm opacity-80 uppercase tracking-widest font-bold">Meja Anda</p>
                        <h1 className="font-chewy text-4xl">{tableNumber}</h1>
                    </div>
                    <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                        <UtensilsCrossed className="size-8" />
                    </div>
                </div>
            </div>

            <div className="max-w-md mx-auto px-4">
                {/* Status or Success Flash */}
                {flash?.success && (
                    <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-4 flex items-start gap-3">
                        <CheckCircle2 className="size-6 text-emerald-600 shrink-0" />
                        <div>
                            <h3 className="font-bold font-poppins text-emerald-900">Berhasil!</h3>
                            <p className="text-sm font-poppins mt-0.5">{flash.success}</p>
                        </div>
                    </div>
                )}

                {/* Info about existing orders */}
                {existingTotal > 0 && cartTotalItems === 0 && existingOrder && (
                    <div className="mb-6 bg-cafe-white border-2 border-cafe-secondary/10 rounded-2xl p-4 flex justify-between items-center shadow-sm">
                        <div>
                            <p className="font-poppins text-xs text-cafe-secondary/60">Total Pesanan Saat Ini</p>
                            <p className="font-chewy text-xl text-cafe-secondary">{formatIDR(existingTotal)}</p>
                        </div>
                        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-full font-poppins">
                            {existingOrder.status.toUpperCase()}
                        </span>
                    </div>
                )}

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
                    <button
                        onClick={() => setActiveCategoryId('all')}
                        className={`whitespace-nowrap px-5 py-2.5 rounded-full font-poppins font-bold text-sm transition-all duration-300 ${
                            activeCategoryId === 'all'
                                ? 'bg-cafe-secondary text-white shadow-md'
                                : 'bg-cafe-white text-cafe-secondary/70 border border-cafe-secondary/10'
                        }`}
                    >
                        Semua Menu
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategoryId(cat.id)}
                            className={`whitespace-nowrap px-5 py-2.5 rounded-full font-poppins font-bold text-sm transition-all duration-300 ${
                                activeCategoryId === cat.id
                                    ? 'bg-cafe-secondary text-white shadow-md'
                                    : 'bg-cafe-white text-cafe-secondary/70 border border-cafe-secondary/10'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Menus List */}
                <div className="mt-6 flex flex-col gap-4">
                    {filteredMenus.map(menu => {
                        const qty = getQuantityInCart(menu.id);
                        const isPromo = menu.promo?.is_active;
                        const activePrice = getPrice(menu);

                        return (
                            <div key={menu.id} className="bg-cafe-white rounded-3xl p-3 flex gap-4 shadow-sm border border-cafe-secondary/5 items-center relative overflow-hidden">
                                {/* Image */}
                                <div className="h-24 w-24 rounded-2xl bg-cafe-bg shrink-0 overflow-hidden relative">
                                    <img src={menu.image} alt={menu.name} className="h-full w-full object-cover" />
                                    {isPromo && (
                                        <div className="absolute top-0 left-0 bg-cafe-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-br-lg z-10 flex items-center gap-1">
                                            <Tag className="size-2" /> Promo
                                        </div>
                                    )}
                                </div>
                                
                                {/* Details */}
                                <div className="flex-1 min-w-0 py-1">
                                    <h3 className="font-poppins font-bold text-cafe-secondary truncate text-sm">
                                        {menu.name}
                                    </h3>
                                    <div className="mt-1 flex items-center gap-2">
                                        {isPromo ? (
                                            <>
                                                <span className="font-chewy text-cafe-primary text-lg">{formatIDR(activePrice)}</span>
                                                <span className="text-xs text-cafe-secondary/40 line-through">{formatIDR(menu.price)}</span>
                                            </>
                                        ) : (
                                            <span className="font-chewy text-cafe-secondary text-lg">{formatIDR(activePrice)}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="pr-2">
                                    {qty === 0 ? (
                                        <button 
                                            onClick={() => addToCart(menu)}
                                            className="bg-cafe-primary text-white size-8 rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform"
                                        >
                                            <Plus className="size-4" />
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-3 bg-cafe-bg rounded-full p-1 border border-cafe-secondary/10">
                                            <button 
                                                onClick={() => removeFromCart(menu.id)}
                                                className="bg-white text-cafe-secondary size-7 rounded-full flex items-center justify-center shadow-sm active:scale-95"
                                            >
                                                <Minus className="size-3" />
                                            </button>
                                            <span className="font-poppins font-bold text-sm w-4 text-center text-cafe-secondary">{qty}</span>
                                            <button 
                                                onClick={() => addToCart(menu)}
                                                className="bg-cafe-primary text-white size-7 rounded-full flex items-center justify-center shadow-sm active:scale-95"
                                            >
                                                <Plus className="size-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {filteredMenus.length === 0 && (
                        <div className="text-center p-8 bg-cafe-white rounded-3xl border border-dashed border-cafe-secondary/20">
                            <p className="text-cafe-secondary/60 font-poppins text-sm">Tidak ada menu di kategori ini.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Sticky Cart Bottom Bar */}
            {cart.length > 0 && (
                <div className="fixed bottom-4 left-0 right-0 px-4 z-50">
                    <div className="max-w-md mx-auto bg-cafe-secondary text-white rounded-3xl p-4 shadow-2xl flex items-center justify-between border border-white/10 animate-scale-in">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="bg-white/20 p-3 rounded-2xl">
                                    <ShoppingCart className="size-6 text-white" />
                                </div>
                                <span className="absolute -top-2 -right-2 bg-cafe-primary text-white text-xs font-bold size-6 rounded-full flex items-center justify-center shadow-sm">
                                    {cartTotalItems}
                                </span>
                            </div>
                            <div>
                                <p className="font-poppins text-xs opacity-70">Total ({cartTotalItems} item)</p>
                                <p className="font-chewy text-xl text-cafe-primary">{formatIDR(cartTotalAmount)}</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleCheckoutClick}
                            className="bg-cafe-primary text-white font-poppins font-bold px-6 py-3.5 rounded-2xl active:scale-95 transition-transform flex items-center gap-2"
                        >
                            Pesan
                        </button>
                    </div>
                </div>
            )}

            {/* Checkout Modal */}
            <Dialog open={isCheckoutModalOpen} onOpenChange={setIsCheckoutModalOpen}>
                <DialogContent className="sm:max-w-md w-11/12 rounded-3xl p-6">
                    <DialogHeader>
                        <DialogTitle className="font-poppins text-xl font-bold text-cafe-secondary">Pilih Metode Pembayaran</DialogTitle>
                        <DialogDescription className="font-poppins mt-2">
                            Total pesanan Anda adalah <strong className="text-cafe-primary">{formatIDR(cartTotalAmount)}</strong>. Bagaimana Anda ingin membayar?
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-3 py-4">
                        <button
                            type="button"
                            onClick={() => setPaymentMethod('pay_at_cashier')}
                            className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                                paymentMethod === 'pay_at_cashier' 
                                    ? 'border-cafe-primary bg-cafe-primary/5 shadow-sm' 
                                    : 'border-neutral-200 hover:border-cafe-primary/30'
                            }`}
                        >
                            <div className={`size-5 rounded-full border-2 flex items-center justify-center ${
                                paymentMethod === 'pay_at_cashier' ? 'border-cafe-primary' : 'border-neutral-300'
                            }`}>
                                {paymentMethod === 'pay_at_cashier' && <div className="size-2.5 rounded-full bg-cafe-primary" />}
                            </div>
                            <div className="text-left">
                                <p className="font-poppins font-bold text-cafe-secondary">Bayar di Kasir</p>
                                <p className="text-xs text-cafe-secondary/60 font-poppins">Pesan sekarang, bayar nanti di meja kasir</p>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setPaymentMethod('online_payment')}
                            className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                                paymentMethod === 'online_payment' 
                                    ? 'border-cafe-primary bg-cafe-primary/5 shadow-sm' 
                                    : 'border-neutral-200 hover:border-cafe-primary/30'
                            }`}
                        >
                            <div className={`size-5 rounded-full border-2 flex items-center justify-center ${
                                paymentMethod === 'online_payment' ? 'border-cafe-primary' : 'border-neutral-300'
                            }`}>
                                {paymentMethod === 'online_payment' && <div className="size-2.5 rounded-full bg-cafe-primary" />}
                            </div>
                            <div className="text-left">
                                <p className="font-poppins font-bold text-cafe-secondary">Bayar Online (E-Wallet/Transfer)</p>
                                <p className="text-xs text-cafe-secondary/60 font-poppins">Bayar langsung melalui ponsel Anda</p>
                            </div>
                        </button>
                    </div>

                    <DialogFooter className="flex-row gap-3 sm:gap-0 mt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsCheckoutModalOpen(false)}
                            className="flex-1 rounded-xl h-12 font-poppins font-bold text-cafe-secondary border-neutral-200"
                            disabled={isSubmitting}
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            onClick={submitOrder}
                            disabled={isSubmitting}
                            className="flex-1 rounded-xl h-12 bg-cafe-primary text-white font-poppins font-bold hover:bg-cafe-primary/90"
                        >
                            {isSubmitting ? 'Memproses...' : 'Konfirmasi Pesanan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
