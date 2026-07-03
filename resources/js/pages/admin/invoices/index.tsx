import { useState, useEffect } from 'react';
import { Head, usePage, router, Link } from '@inertiajs/react';
import { 
    Search, 
    X, 
    Check,
    FileText,
    Eye
} from 'lucide-react';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import type { Invoice, PaginatedCollection } from '@/types';

interface PageProps {
    invoices: PaginatedCollection<Invoice>;
    filters: {
        search?: string;
    };
    flash: {
        success?: string;
        error?: string;
    };
}

export default function InvoicesIndex() {
    const { invoices, filters, flash } = usePage<any>().props as PageProps;

    const [searchTerm, setSearchTerm] = useState(filters.search || '');

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
            '/admin/invoices',
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
        // Optimistic UI for status update (requires full object update in Inertia)
        const invoice = invoices.data.find(inv => inv.id === id);
        if (!invoice) return;

        router.put(`/admin/invoices/${id}`, { 
            ...invoice,
            payment_status: status 
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`Status pembayaran diupdate ke: ${label}`);
            },
            onError: (errs) => {
                if (errs.error) {
                    toast.error(errs.error);
                } else {
                    toast.error('Gagal memperbarui status pembayaran.');
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
            case 'unpaid':
                return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-900/30">Unpaid</Badge>;
            case 'paid':
                return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-900/30">Paid</Badge>;
            case 'cancelled':
                return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-300 dark:border-red-900/30">Cancelled</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <>
            <Head title="Manajemen Invoice" />

            <div className="flex flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Invoice Tagihan</h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                        Kelola tagihan reservasi dan status pembayaran pelanggan.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between bg-white dark:bg-neutral-900/50 p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
                    <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md w-full">
                        <Input
                            placeholder="Cari nomor invoice..."
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
                    {invoices.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4">
                            <div className="size-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500 mb-4">
                                <FileText className="size-6" />
                            </div>
                            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">Invoice Kosong</h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center mt-1 max-w-xs">
                                Tidak ada data invoice yang ditemukan.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-neutral-50/50 dark:bg-neutral-900/30">
                                        <TableRow>
                                            <TableHead className="w-[60px]">No</TableHead>
                                            <TableHead>Nomor Invoice</TableHead>
                                            <TableHead>Koordinator / Pelanggan</TableHead>
                                            <TableHead>Metode Bayar</TableHead>
                                            <TableHead>Nominal</TableHead>
                                            <TableHead>Status Pembayaran</TableHead>
                                            <TableHead className="text-right w-[160px]">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {invoices.data.map((inv, idx) => {
                                            return (
                                                <TableRow key={inv.id} className="hover:bg-neutral-50/30 dark:hover:bg-neutral-900/10">
                                                    <TableCell className="font-medium text-neutral-500">
                                                        {(invoices.current_page - 1) * invoices.per_page + idx + 1}
                                                    </TableCell>
                                                    <TableCell className="font-semibold text-neutral-800 dark:text-neutral-200">
                                                        {inv.invoice_number}
                                                    </TableCell>
                                                    <TableCell className="text-neutral-700 dark:text-neutral-300">
                                                        {inv.reservation?.name || '-'}
                                                    </TableCell>
                                                    <TableCell className="uppercase text-neutral-700 dark:text-neutral-300">
                                                        {inv.payment_method || '-'}
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {inv.reservation?.total_amount ? formatRupiah(inv.reservation.total_amount) : '-'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {getStatusBadge(inv.payment_status)}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            {inv.payment_status === 'unpaid' && (
                                                                <Button
                                                                    size="icon"
                                                                    onClick={() => handleUpdateStatus(inv.id, 'paid', 'Lunas (Paid)')}
                                                                    className="size-8 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                                                                    title="Tandai Sudah Dibayar"
                                                                >
                                                                    <Check className="size-4" />
                                                                </Button>
                                                            )}
                                                            {inv.payment_status === 'unpaid' && (
                                                                <Button
                                                                    size="icon"
                                                                    variant="outline"
                                                                    onClick={() => handleUpdateStatus(inv.id, 'cancelled', 'Dibatalkan')}
                                                                    className="size-8 border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700 dark:border-red-950/30 dark:hover:bg-red-950/20"
                                                                    title="Batalkan Invoice"
                                                                >
                                                                    <X className="size-4" />
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
                            {invoices.last_page > 1 && (
                                <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/30 dark:bg-neutral-900/20">
                                    <div className="text-xs text-neutral-500">
                                        Menampilkan <span className="font-medium">{(invoices.current_page - 1) * invoices.per_page + 1}</span> sampai <span className="font-medium">{Math.min(invoices.current_page * invoices.per_page, invoices.total)}</span> dari <span className="font-medium">{invoices.total}</span> hasil
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {invoices.links.map((link, i) => (
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
        </>
    );
}

InvoicesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Invoices',
            href: '/admin/invoices',
        },
    ],
};
