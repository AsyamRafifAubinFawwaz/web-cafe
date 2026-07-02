import { useState, useEffect } from 'react';
import { Head, usePage, router, Link } from '@inertiajs/react';
import { 
    Search, 
    CalendarCheck, 
    X, 
    Check,
    Calendar, 
    Phone, 
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

import type { Reservation, PaginatedCollection } from '@/types';

interface PageProps {
    reservations: PaginatedCollection<Reservation>;
    filters: {
        search?: string;
        status?: string;
    };
    flash: {
        success?: string;
        error?: string;
    };
}

export default function ReservationsIndex() {
    const { reservations, filters, flash } = usePage<any>().props as PageProps;

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState<string>(filters.status || 'all');

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleSearchAndFilter = (searchVal = searchTerm, statusVal = statusFilter) => {
        router.get(
            '/admin/reservations',
            { 
                search: searchVal || undefined,
                status: statusVal !== 'all' ? statusVal : undefined
            },
            { preserveState: true, replace: true }
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearchAndFilter(searchTerm, statusFilter);
    };

    const handleResetSearch = () => {
        setSearchTerm('');
        handleSearchAndFilter('', statusFilter);
    };

    const handleStatusFilterChange = (val: string) => {
        setStatusFilter(val);
        handleSearchAndFilter(searchTerm, val);
    };

    const handleUpdateStatus = (id: number, status: string, label: string) => {
        router.put(`/admin/reservations/${id}`, { status }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`Reservasi berhasil diupdate ke status: ${label}`);
            },
            onError: (errs) => {
                if (errs.error) {
                    toast.error(errs.error);
                } else {
                    toast.error('Gagal memperbarui status.');
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
                return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-900/30">Pending Approval</Badge>;
            case 'approved':
                return <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/20 dark:text-sky-300 dark:border-sky-900/30">Approved (ACC)</Badge>;
            case 'invoiced':
                return <Badge variant="outline" className="bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/20 dark:text-violet-300 dark:border-violet-900/30">Invoiced</Badge>;
            case 'paid':
                return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-900/30">Paid (DP / Lunas)</Badge>;
            case 'completed':
                return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-300 dark:border-green-900/30">Completed</Badge>;
            case 'cancelled':
                return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-300 dark:border-red-900/30">Rejected / Cancelled</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <>
            <Head title="Persetujuan Reservasi" />

            <div className="flex flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Validasi & Persetujuan Reservasi</h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                        Tinjau detail rombongan dan menu pesanan koordinator. Anda dapat menyetujui (Accept), menolak (Reject), atau menerbitkan invoice tagihan DP.
                    </p>
                </div>

                {/* Search & Filter Bar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between bg-white dark:bg-neutral-900/50 p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
                    <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md w-full">
                        <Input
                            placeholder="Cari koordinator atau nomor HP..."
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

                    <div className="flex items-center gap-2">
                        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                            <SelectTrigger className="w-[180px] h-9 dark:bg-neutral-950/40">
                                <SelectValue placeholder="Semua Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="pending">Pending Approval</SelectItem>
                                <SelectItem value="approved">Approved (ACC)</SelectItem>
                                <SelectItem value="invoiced">Invoiced</SelectItem>
                                <SelectItem value="paid">Paid (DP / Lunas)</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Rejected / Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white dark:bg-neutral-900/50 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs overflow-hidden">
                    {reservations.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4">
                            <div className="size-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500 mb-4">
                                <CalendarCheck className="size-6" />
                            </div>
                            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">Reservasi Kosong</h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center mt-1 max-w-xs">
                                Tidak ada data reservasi masuk yang perlu diproses.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-neutral-50/50 dark:bg-neutral-900/30">
                                        <TableRow>
                                            <TableHead className="w-[60px]">No</TableHead>
                                            <TableHead>Koordinator</TableHead>
                                            <TableHead>No. HP</TableHead>
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead>Paket Acara</TableHead>
                                            <TableHead>Metode Input</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right w-[160px]">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reservations.data.map((res, idx) => {
                                            return (
                                                <TableRow key={res.id} className="hover:bg-neutral-50/30 dark:hover:bg-neutral-900/10">
                                                    <TableCell className="font-medium text-neutral-500">
                                                        {(reservations.current_page - 1) * reservations.per_page + idx + 1}
                                                    </TableCell>
                                                    <TableCell className="font-semibold text-neutral-800 dark:text-neutral-200">
                                                        {res.name}
                                                    </TableCell>
                                                    <TableCell className="text-neutral-700 dark:text-neutral-300">
                                                        <span className="flex items-center gap-1.5 text-xs">
                                                            <Phone className="size-3.5 text-neutral-400" />
                                                            {res.phone}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-neutral-700 dark:text-neutral-300">
                                                        <span className="flex items-center gap-1.5 text-xs">
                                                            <Calendar className="size-3.5 text-neutral-400" />
                                                            {res.reservation_date}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        {res.reservation_package ? (
                                                            <div className="flex flex-col">
                                                                <span className="font-medium text-sm">{res.reservation_package.name}</span>
                                                                <span className="text-xs text-neutral-500">{formatRupiah(res.reservation_package.price)}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-neutral-400">-</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                                                            res.input_method === 'room_link'
                                                                ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-300'
                                                                : 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/20 dark:text-orange-300'
                                                        }`}>
                                                            {res.input_method === 'room_link' ? 'Room Link' : 'Manual'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {getStatusBadge(res.status)}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <Link href={`/admin/reservations/${res.id}`}>
                                                                <Button
                                                                    size="icon"
                                                                    variant="outline"
                                                                    className="size-8 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                                                    title="Detail Reservasi"
                                                                >
                                                                    <Eye className="size-4" />
                                                                </Button>
                                                            </Link>
                                                            
                                                            {res.status === 'pending' && (
                                                                <Button
                                                                    size="icon"
                                                                    onClick={() => handleUpdateStatus(res.id, 'approved', 'Approved')}
                                                                    className="size-8 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                                                                    title="Accept (Approve)"
                                                                >
                                                                    <Check className="size-4" />
                                                                </Button>
                                                            )}

                                                            {['pending', 'approved'].includes(res.status) && (
                                                                <Button
                                                                    size="icon"
                                                                    variant="outline"
                                                                    onClick={() => handleUpdateStatus(res.id, 'cancelled', 'Rejected')}
                                                                    className="size-8 border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700 dark:border-red-950/30 dark:hover:bg-red-950/20"
                                                                    title="Reject (Cancel)"
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
                            {reservations.last_page > 1 && (
                                <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/30 dark:bg-neutral-900/20">
                                    <div className="text-xs text-neutral-500">
                                        Menampilkan <span className="font-medium">{(reservations.current_page - 1) * reservations.per_page + 1}</span> sampai <span className="font-medium">{Math.min(reservations.current_page * reservations.per_page, reservations.total)}</span> dari <span className="font-medium">{reservations.total}</span> hasil
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {reservations.links.map((link, i) => (
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

ReservationsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Reservasi',
            href: '/admin/reservations',
        },
    ],
};
