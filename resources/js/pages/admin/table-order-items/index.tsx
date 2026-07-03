import { useState, useEffect } from 'react';
import { Head, usePage, router, Link } from '@inertiajs/react';
import { 
    ArrowLeft,
    ListOrdered
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import type { TableOrderItem, PaginatedCollection } from '@/types';

interface PageProps {
    tableOrderItems: PaginatedCollection<TableOrderItem>;
    filters: {
        table_order_id?: string;
    };
    flash: {
        success?: string;
        error?: string;
    };
}

export default function TableOrderItemsIndex() {
    const { tableOrderItems, filters, flash } = usePage<any>().props as PageProps;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const formatRupiah = (num: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        }).format(num);
    };

    // Attempt to get table number from the first item, if filters are active
    const tableNumber = tableOrderItems.data.length > 0 
        ? tableOrderItems.data[0].table_order?.table_number 
        : (filters.table_order_id ? `ID: ${filters.table_order_id}` : 'Semua Meja');

    return (
        <>
            <Head title="Detail Pesanan Meja" />

            <div className="flex flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div className="flex items-center gap-4">
                    <Link href="/admin/table-orders">
                        <Button variant="outline" size="icon" className="size-9 shadow-xs">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            Detail Pesanan {filters.table_order_id ? `- Meja ${tableNumber}` : ''}
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Rincian menu yang dipesan oleh pelanggan.
                        </p>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white dark:bg-neutral-900/50 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs overflow-hidden">
                    {tableOrderItems.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4">
                            <div className="size-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500 mb-4">
                                <ListOrdered className="size-6" />
                            </div>
                            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">Belum Ada Item</h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center mt-1 max-w-xs">
                                Tidak ada rincian menu untuk pesanan ini.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-neutral-50/50 dark:bg-neutral-900/30">
                                        <TableRow>
                                            <TableHead className="w-[60px]">No</TableHead>
                                            {!filters.table_order_id && <TableHead>Nomor Meja</TableHead>}
                                            <TableHead>Menu</TableHead>
                                            <TableHead className="text-center w-[100px]">Qty</TableHead>
                                            <TableHead className="text-right">Subtotal</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {tableOrderItems.data.map((item, idx) => {
                                            return (
                                                <TableRow key={item.id} className="hover:bg-neutral-50/30 dark:hover:bg-neutral-900/10">
                                                    <TableCell className="font-medium text-neutral-500">
                                                        {(tableOrderItems.current_page - 1) * tableOrderItems.per_page + idx + 1}
                                                    </TableCell>
                                                    {!filters.table_order_id && (
                                                        <TableCell className="font-bold text-neutral-900 dark:text-neutral-100">
                                                            {item.table_order?.table_number || '-'}
                                                        </TableCell>
                                                    )}
                                                    <TableCell className="font-semibold text-neutral-800 dark:text-neutral-200">
                                                        {item.menu?.name || 'Menu Terhapus'}
                                                    </TableCell>
                                                    <TableCell className="text-center font-medium">
                                                        {item.quantity} x
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium text-cafe-primary">
                                                        {formatRupiah(item.subtotal)}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination Controls */}
                            {tableOrderItems.last_page > 1 && (
                                <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/30 dark:bg-neutral-900/20">
                                    <div className="text-xs text-neutral-500">
                                        Menampilkan <span className="font-medium">{(tableOrderItems.current_page - 1) * tableOrderItems.per_page + 1}</span> sampai <span className="font-medium">{Math.min(tableOrderItems.current_page * tableOrderItems.per_page, tableOrderItems.total)}</span> dari <span className="font-medium">{tableOrderItems.total}</span> hasil
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {tableOrderItems.links.map((link, i) => (
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

TableOrderItemsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Table Orders',
            href: '/admin/table-orders',
        },
        {
            title: 'Items',
            href: '/admin/table-order-items',
        },
    ],
};
