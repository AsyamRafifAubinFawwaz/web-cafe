import { Head, Link, usePage, router } from '@inertiajs/react';
import { 
    ArrowLeft, 
    Calendar, 
    Phone, 
    Users, 
    ShoppingBag, 
    FileText, 
    Check, 
    X, 
    BadgeCheck, 
    Info 
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

import type { Reservation } from '@/types';

interface PageProps {
    reservation: Reservation;
}

export default function ReservationShow() {
    const { reservation } = usePage<any>().props as PageProps;

    const handleUpdateStatus = (status: string, label: string) => {
        router.put(`/admin/reservations/${reservation.id}`, { status }, {
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

    const calculateItemsTotal = () => {
        let total = 0;
        if (reservation.reservation_members) {
            reservation.reservation_members.forEach((member) => {
                if (member.reservation_items) {
                    member.reservation_items.forEach((item) => {
                        total += item.subtotal;
                    });
                }
            });
        }
        return total;
    };

    const itemsCost = calculateItemsTotal();
    const packageCost = reservation.reservation_package?.price || 0;
    const grandTotal = itemsCost + packageCost;
    const dpAmount = Math.round(grandTotal * 0.5);

    return (
        <>
            <Head title={`Detail Reservasi - ${reservation.name}`} />

            <div className="flex flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                {/* Back Link Header */}
                <div className="flex items-center gap-2">
                    <Link
                        href="/admin/reservations"
                        className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-cafe-primary dark:hover:text-cafe-primary transition-colors"
                    >
                        <ArrowLeft className="size-4" />
                        Kembali ke Daftar Reservasi
                    </Link>
                </div>

                {/* Main Heading and Status */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            Detail Reservasi: {reservation.name}
                        </h1>
                        <p className="text-sm text-neutral-500 mt-1">
                            Kode ID Booking: <span className="font-semibold text-neutral-700 dark:text-neutral-300">#RES-{reservation.id}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {getStatusBadge(reservation.status)}
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Left 2 Columns: Metadata, Members, and Orders */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Summary Info Card */}
                        <Card className="shadow-xs border-neutral-200/80">
                            <CardHeader className="py-4">
                                <CardTitle className="text-sm font-semibold">Informasi Koordinator</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-0 pb-4 text-xs">
                                <div className="space-y-1">
                                    <span className="text-neutral-400">Kontak WhatsApp</span>
                                    <span className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1">
                                        <Phone className="size-3.5 text-neutral-400" />
                                        {reservation.phone}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-neutral-400">Tanggal Acara</span>
                                    <span className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1">
                                        <Calendar className="size-3.5 text-neutral-400" />
                                        {reservation.reservation_date}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-neutral-400">Metode Pendaftaran</span>
                                    <div>
                                        <Badge variant="outline" className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                                            reservation.input_method === 'room_link'
                                                ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20'
                                                : 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/20'
                                        }`}>
                                            {reservation.input_method === 'room_link' ? 'Room Link' : 'Manual'}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Members & Items */}
                        <div className="space-y-4">
                            <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                                <Users className="size-5 text-neutral-500" />
                                Rincian Rombongan Anggota ({reservation.reservation_members?.length || 0} Orang)
                            </h3>

                            {!reservation.reservation_members || reservation.reservation_members.length === 0 ? (
                                <div className="py-12 bg-white dark:bg-neutral-900 rounded-xl border flex flex-col items-center justify-center text-neutral-400">
                                    <Info className="size-6 mb-2 text-neutral-300" />
                                    <span className="text-xs">Rombongan koordinator belum memasukkan nama anggota.</span>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {reservation.reservation_members.map((member) => (
                                        <Card key={member.id} className="shadow-xs dark:bg-neutral-900/60 border-neutral-200/60">
                                            <CardHeader className="py-3 px-4 border-b border-neutral-100 dark:border-neutral-800">
                                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                                    <span className="size-2 rounded-full bg-neutral-400" />
                                                    {member.name}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-0">
                                                {!member.reservation_items || member.reservation_items.length === 0 ? (
                                                    <div className="p-4 text-xs text-neutral-400 italic">
                                                        Anggota rombongan belum memesan makanan/minuman.
                                                    </div>
                                                ) : (
                                                    <Table>
                                                        <TableBody>
                                                            {member.reservation_items.map((item) => (
                                                                <TableRow key={item.id} className="hover:bg-transparent border-0">
                                                                    <TableCell className="py-2.5 pl-4 w-[60px]">
                                                                        <div className="size-10 rounded overflow-hidden bg-neutral-100 flex items-center justify-center border border-neutral-200">
                                                                            {item.menu?.image ? (
                                                                                <img src={`/storage/${item.menu.image}`} alt={item.menu.name} className="size-full object-cover" />
                                                                            ) : (
                                                                                <ShoppingBag className="size-5 text-neutral-400" />
                                                                            )}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="py-2.5 font-medium text-sm text-neutral-800 dark:text-neutral-200">
                                                                        {item.menu?.name ?? 'Unknown Menu'}
                                                                    </TableCell>
                                                                    <TableCell className="py-2.5 text-xs text-neutral-500">
                                                                        {item.menu ? formatRupiah(item.menu.price) : 'Rp 0'} x {item.quantity}
                                                                    </TableCell>
                                                                    <TableCell className="py-2.5 text-right font-bold text-neutral-800 dark:text-neutral-200 pr-4">
                                                                        {formatRupiah(item.subtotal)}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Pricing Breakdown & Workflow Action triggers */}
                    <div className="space-y-6">
                        {/* Billing Calculation Summary */}
                        <Card className="shadow-xs border-neutral-200/80">
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <FileText className="size-4 text-neutral-500" />
                                    Ringkasan Pembayaran
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-xs">
                                <div className="space-y-2 border-b pb-3 border-neutral-100 dark:border-neutral-800">
                                    <div className="flex justify-between text-neutral-500">
                                        <span>Paket Acara ({reservation.reservation_package?.name || '-'})</span>
                                        <span>{formatRupiah(packageCost)}</span>
                                    </div>
                                    <div className="flex justify-between text-neutral-500">
                                        <span>Total Pesanan Menu</span>
                                        <span>{formatRupiah(itemsCost)}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between font-bold text-sm text-cafe-primary dark:text-cafe-primary border-b pb-3 border-neutral-100 dark:border-neutral-800">
                                    <span>Grand Total</span>
                                    <span>{formatRupiah(grandTotal)}</span>
                                </div>

                                <div className="bg-cafe-primary/5 border border-cafe-primary/20 rounded-lg p-3 flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-cafe-primary">Uang Muka (DP 50%)</span>
                                        <span className="text-[10px] text-neutral-400 mt-0.5">Deposit tagihan awal</span>
                                    </div>
                                    <span className="font-bold text-sm text-cafe-primary">{formatRupiah(dpAmount)}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Action Panel */}
                        <Card className="shadow-xs border-neutral-200/80 bg-neutral-50/50 dark:bg-neutral-900/30">
                            <CardHeader>
                                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Aksi Validasi Admin</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {reservation.status === 'pending' && (
                                    <div className="flex flex-col gap-2">
                                        <Button
                                            onClick={() => handleUpdateStatus('approved', 'Approved')}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white w-full text-xs font-semibold py-2 shadow-xs flex items-center justify-center gap-1.5"
                                        >
                                            <Check className="size-4" />
                                            Setujui Reservasi (ACC)
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => handleUpdateStatus('cancelled', 'Rejected')}
                                            className="border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700 dark:border-red-950/30 dark:hover:bg-red-950/20 w-full text-xs font-semibold py-2 flex items-center justify-center gap-1.5"
                                        >
                                            <X className="size-4" />
                                            Tolak / Cancel Reservasi
                                        </Button>
                                    </div>
                                )}

                                {reservation.status === 'approved' && (
                                    <div className="flex flex-col gap-2">
                                        <Button
                                            onClick={() => handleUpdateStatus('invoiced', 'Invoiced')}
                                            className="bg-cafe-primary hover:bg-cafe-primary/90 text-white w-full text-xs font-semibold py-2 shadow-xs flex items-center justify-center gap-1.5"
                                        >
                                            <FileText className="size-4" />
                                            Kirim Invoice Tagihan
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => handleUpdateStatus('cancelled', 'Rejected')}
                                            className="border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700 dark:border-red-950/30 dark:hover:bg-red-950/20 w-full text-xs font-semibold py-2 flex items-center justify-center gap-1.5"
                                        >
                                            <X className="size-4" />
                                            Tolak / Cancel Reservasi
                                        </Button>
                                    </div>
                                )}

                                {reservation.status === 'invoiced' && (
                                    <div className="space-y-4 text-xs">
                                        <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-3 dark:bg-amber-950/10 dark:border-amber-900/30 flex gap-2">
                                            <Info className="size-4 text-amber-600 shrink-0 mt-0.5" />
                                            <span className="text-neutral-600 dark:text-neutral-400">Invoice tagihan pembayaran DP 50% telah dikirim ke pelanggan. Menunggu pembayaran.</span>
                                        </div>

                                        {reservation.invoice && (
                                            <div className="bg-white dark:bg-neutral-900 border rounded-lg p-3 space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-neutral-400">Nomor Invoice</span>
                                                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">{reservation.invoice.invoice_number}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-neutral-400">Status Pembayaran</span>
                                                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100 font-semibold px-2 py-0.5 text-[10px] uppercase">{reservation.invoice.payment_status}</Badge>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {reservation.status === 'paid' && (
                                    <div className="space-y-4 text-xs">
                                        <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-3 dark:bg-emerald-950/10 dark:border-emerald-900/30 flex gap-2">
                                            <BadgeCheck className="size-5 text-emerald-600 shrink-0" />
                                            <span className="text-neutral-600 dark:text-neutral-400">Uang muka / DP 50% telah dikonfirmasi lunas. Reservasi aman untuk dijadwalkan.</span>
                                        </div>

                                        {reservation.invoice && (
                                            <div className="bg-white dark:bg-neutral-900 border rounded-lg p-3 space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-neutral-400">Nomor Invoice</span>
                                                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">{reservation.invoice.invoice_number}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-neutral-400">Status Invoice</span>
                                                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100 font-semibold px-2 py-0.5 text-[10px] uppercase">PAID</Badge>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {['completed', 'cancelled'].includes(reservation.status) && (
                                    <div className="text-xs text-center py-4 text-neutral-400 italic">
                                        Reservasi ini telah selesai diproses.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

ReservationShow.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Reservasi',
            href: '/admin/reservations',
        },
        {
            title: 'Detail',
            href: '',
        },
    ],
};
