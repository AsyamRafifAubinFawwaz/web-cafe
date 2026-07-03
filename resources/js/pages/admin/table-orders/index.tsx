import { useState, useEffect } from 'react';
import { Head, usePage, router, Link } from '@inertiajs/react';
import { 
    Search, 
    X, 
    UtensilsCrossed,
    ChefHat,
    CheckCheck,
    CreditCard,
    Eye,
    QrCode
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';


import type { TableOrder, PaginatedCollection } from '@/types';

interface PageProps {
    tableOrders: PaginatedCollection<TableOrder>;
    filters: {
        search?: string;
    };
    flash: {
        success?: string;
        error?: string;
    };
}

export default function TableOrdersIndex() {
    const { tableOrders, filters, flash } = usePage<any>().props as PageProps;

    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [qrUrl, setQrUrl] = useState('');
    const [qrTableNumber, setQrTableNumber] = useState('');

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleSearchAndFilter = (searchVal = searchTerm) => {
        router.get(
            '/admin/table-orders',
            { 
                search: searchVal || undefined
            },
            { preserveState: true, replace: true }
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearchAndFilter(searchTerm);
    };

    const handleResetSearch = () => {
        setSearchTerm('');
        handleSearchAndFilter('');
    };

    const handleUpdateStatus = (id: number, status: string, label: string) => {
        const order = tableOrders.data.find(o => o.id === id);
        if (!order) return;

        router.put(`/admin/table-orders/${id}`, { 
            ...order,
            status: status 
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`Status pesanan diupdate ke: ${label}`);
            },
            onError: (errs) => {
                if (errs.error) {
                    toast.error(errs.error);
                } else {
                    toast.error('Gagal memperbarui status pesanan.');
                }
            }
        });
    };

    const formatRupiah = (num: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        }).format(num);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-900/30">Pending</Badge>;
            case 'cooking':
                return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/20 dark:text-orange-300 dark:border-orange-900/30">Memasak</Badge>;
            case 'served':
                return <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/20 dark:text-sky-300 dark:border-sky-900/30">Disajikan</Badge>;
            case 'paid':
                return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-900/30">Lunas</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <>
            <Head title="Manajemen Table Orders" />

            <div className="flex flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Pesanan Meja (QR Order)</h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                        Pantau pesanan mandiri dari meja pelanggan secara real-time.
                    </p>
                </div>

                {/* Actions & Search Bar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between bg-white dark:bg-neutral-900/50 p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
                    <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md w-full">
                        <Input
                            placeholder="Cari nomor meja..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-8 h-9 dark:bg-neutral-950/40"
                        />
                        <Search className="absolute left-3 top-2.5 size-4 text-neutral-400" />
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={handleResetSearch}
                                className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                            >
                                <X className="size-4" />
                            </button>
                        )}
                    </form>
                </div>

                {/* Table Section */}
                <div className="bg-white dark:bg-neutral-900/50 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs overflow-hidden">
                    {tableOrders.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4">
                            <div className="size-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500 mb-4">
                                <UtensilsCrossed className="size-6" />
                            </div>
                            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">Pesanan Kosong</h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center mt-1 max-w-xs">
                                Saat ini belum ada pesanan meja aktif.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-neutral-50/50 dark:bg-neutral-900/30">
                                        <TableRow>
                                            <TableHead className="w-[60px]">No</TableHead>
                                            <TableHead>Nomor Meja</TableHead>
                                            <TableHead>Metode Pembayaran</TableHead>
                                            <TableHead>Total Harga</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right w-[200px]">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {tableOrders.data.map((order, idx) => {
                                            return (
                                                <TableRow key={order.id} className="hover:bg-neutral-50/30 dark:hover:bg-neutral-900/10">
                                                    <TableCell className="font-medium text-neutral-500">
                                                        {(tableOrders.current_page - 1) * tableOrders.per_page + idx + 1}
                                                    </TableCell>
                                                    <TableCell className="font-bold text-neutral-900 dark:text-neutral-100 text-lg">
                                                        {order.table?.table_number || '-'}
                                                    </TableCell>
                                                    <TableCell className="text-neutral-700 dark:text-neutral-300">
                                                        {order.payment_method === 'pay_at_cashier' ? 'Bayar di Kasir' : 'Pembayaran Online'}
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {formatRupiah(order.total_amount)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {getStatusBadge(order.status)}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <Link href={`/admin/table-order-items?table_order_id=${order.id}`}>
                                                                <Button
                                                                    size="icon"
                                                                    variant="outline"
                                                                    className="size-8 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                                                    title="Lihat Menu Pesanan"
                                                                >
                                                                    <Eye className="size-4" />
                                                                </Button>
                                                            </Link>

                                                            {order.status !== 'paid' && (
                                                                <Button
                                                                    size="icon"
                                                                    variant="outline"
                                                                    onClick={() => {
                                                                        setQrTableNumber(order.table_number);
                                                                        setQrUrl(`${window.location.origin}/order/${order.id}`);
                                                                        setIsQrModalOpen(true);
                                                                    }}
                                                                    className="size-8 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                                                    title="Tampilkan QR Code"
                                                                >
                                                                    <QrCode className="size-4" />
                                                                </Button>
                                                            )}
                                                            
                                                            {order.status === 'pending' && (
                                                                <Button
                                                                    size="icon"
                                                                    onClick={() => handleUpdateStatus(order.id, 'cooking', 'Memasak')}
                                                                    className="size-8 bg-orange-600 hover:bg-orange-700 text-white shadow-xs"
                                                                    title="Mulai Dimasak"
                                                                >
                                                                    <ChefHat className="size-4" />
                                                                </Button>
                                                            )}

                                                            {order.status === 'cooking' && (
                                                                <Button
                                                                    size="icon"
                                                                    onClick={() => handleUpdateStatus(order.id, 'served', 'Disajikan')}
                                                                    className="size-8 bg-sky-600 hover:bg-sky-700 text-white shadow-xs"
                                                                    title="Tandai Disajikan"
                                                                >
                                                                    <CheckCheck className="size-4" />
                                                                </Button>
                                                            )}

                                                            {order.status === 'served' && (
                                                                <Button
                                                                    size="icon"
                                                                    onClick={() => handleUpdateStatus(order.id, 'paid', 'Lunas')}
                                                                    className="size-8 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                                                                    title="Tandai Sudah Bayar"
                                                                >
                                                                    <CreditCard className="size-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination Controls */}
                            {tableOrders.last_page > 1 && (
                                <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/30 dark:bg-neutral-900/20">
                                    <div className="text-xs text-neutral-500">
                                        Menampilkan <span className="font-medium">{(tableOrders.current_page - 1) * tableOrders.per_page + 1}</span> sampai <span className="font-medium">{Math.min(tableOrders.current_page * tableOrders.per_page, tableOrders.total)}</span> dari <span className="font-medium">{tableOrders.total}</span> hasil
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {tableOrders.links.map((link, i) => (
                                            <Button
                                                key={i}
                                                variant={link.active ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => {
                                                    if (link.url) {
                                                        router.get(link.url, {}, { preserveState: true });
                                                    }
                                                }}
                                                disabled={!link.url}
                                                className={`h-8 min-w-[32px] px-2 text-xs ${
                                                    link.active
                                                        ? 'bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200'
                                                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Modal QR Code */}
            <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center">QR Code Pemesanan</DialogTitle>
                        <DialogDescription className="text-center">
                            Meja {qrTableNumber}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-white rounded-xl mx-auto my-4 border">
                        <QRCodeSVG 
                            value={qrUrl} 
                            size={200}
                            level="H"
                            includeMargin={true}
                        />
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-neutral-500 mb-2">Scan QR di atas untuk memesan menu, atau akses link:</p>
                        <code className="text-xs bg-neutral-100 dark:bg-neutral-800 p-2 rounded block break-all">
                            {qrUrl}
                        </code>
                    </div>
                    <DialogFooter className="sm:justify-center mt-4">
                        <Button type="button" onClick={() => setIsQrModalOpen(false)}>
                            Tutup
                        </Button>
                        <Button type="button" variant="outline" onClick={() => {
                            window.open(qrUrl, '_blank');
                        }}>
                            Buka Link Pemesanan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

TableOrdersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Table Orders',
            href: '/admin/table-orders',
        },
    ],
};
