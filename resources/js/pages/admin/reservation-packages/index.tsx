import { useState, useEffect } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { Plus, Search, Edit2, Trash2, Package, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

import type { ReservationPackage, PaginatedCollection } from '@/types';

interface PageProps {
    reservationPackages: PaginatedCollection<ReservationPackage>;
    filters: {
        search?: string;
    };
    flash: {
        success?: string;
        error?: string;
    };
}

export default function ReservationPackagesIndex() {
    const { reservationPackages, filters, flash } = usePage<any>().props as PageProps;

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<ReservationPackage | null>(null);

    const {
        data: addData,
        setData: setAddData,
        post: postAdd,
        processing: addProcessing,
        errors: addErrors,
        reset: resetAdd,
    } = useForm({
        name: '',
        price: '',
        price_type: 'free' as 'free' | 'per_hour',
        min_order_per_pax: '',
        min_capacity: '',
        max_capacity: '',
    });

    const {
        data: editData,
        setData: setEditData,
        put: putEdit,
        processing: editProcessing,
        errors: editErrors,
        reset: resetEdit,
    } = useForm({
        name: '',
        price: '',
        price_type: 'free' as 'free' | 'per_hour',
        min_order_per_pax: '',
        min_capacity: '',
        max_capacity: '',
    });

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
            '/admin/reservation-packages',
            { search: searchVal || undefined },
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

    const handleOpenAdd = () => {
        resetAdd();
        setIsAddOpen(true);
    };

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postAdd('/admin/reservation-packages', {
            onSuccess: () => {
                setIsAddOpen(false);
                resetAdd();
            },
            onError: (errs) => {
                if (errs.error) {
                    toast.error(errs.error);
                }
            }
        });
    };

    const handleOpenEdit = (pkg: ReservationPackage) => {
        setSelectedPackage(pkg);
        setEditData({
            name: pkg.name,
            price: String(pkg.price),
            price_type: pkg.price_type,
            min_order_per_pax: String(pkg.min_order_per_pax),
            min_capacity: String(pkg.min_capacity),
            max_capacity: String(pkg.max_capacity),
        });
        setIsEditOpen(true);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPackage) return;

        putEdit(`/admin/reservation-packages/${selectedPackage.id}`, {
            onSuccess: () => {
                setIsEditOpen(false);
                resetEdit();
            },
            onError: (errs) => {
                if (errs.error) {
                    toast.error(errs.error);
                }
            }
        });
    };

    const handleOpenDelete = (pkg: ReservationPackage) => {
        setSelectedPackage(pkg);
        setIsDeleteOpen(true);
    };

    const handleDeleteSubmit = () => {
        if (!selectedPackage) return;

        router.delete(`/admin/reservation-packages/${selectedPackage.id}`, {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setSelectedPackage(null);
            },
            onError: (errs) => {
                setIsDeleteOpen(false);
                if (errs.error) {
                    toast.error(errs.error);
                } else {
                    toast.error('Gagal menghapus paket reservasi.');
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

    return (
        <>
            <Head title="Manajemen Paket Reservasi" />

            <div className="flex flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Paket Reservasi</h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Kelola harga paket booking tempat, minimal order per pax, dan kapasitas meja kafe.
                        </p>
                    </div>
                    <Button 
                        onClick={handleOpenAdd}
                        className="bg-cafe-primary hover:bg-cafe-primary/90 text-white shadow-sm transition-colors flex items-center gap-2"
                    >
                        <Plus className="size-4" />
                        Tambah Paket
                    </Button>
                </div>

                {/* Search Bar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between bg-white dark:bg-neutral-900/50 p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
                    <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md w-full">
                        <Input
                            placeholder="Cari nama paket..."
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
                    {reservationPackages.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4">
                            <div className="size-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500 mb-4">
                                <Package className="size-6" />
                            </div>
                            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">Paket Kosong</h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center mt-1 max-w-xs">
                                Tidak ada paket reservasi yang ditemukan. Silakan tambahkan paket baru.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-neutral-50/50 dark:bg-neutral-900/30">
                                        <TableRow>
                                            <TableHead className="w-[80px]">No</TableHead>
                                            <TableHead>Nama Paket</TableHead>
                                            <TableHead>Harga Sewa</TableHead>
                                            <TableHead>Tipe Biaya</TableHead>
                                            <TableHead>Min. Order / Pax</TableHead>
                                            <TableHead>Kapasitas (Pax)</TableHead>
                                            <TableHead className="text-right w-[150px]">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reservationPackages.data.map((pkg, idx) => (
                                            <TableRow key={pkg.id} className="hover:bg-neutral-50/30 dark:hover:bg-neutral-900/10">
                                                <TableCell className="font-medium text-neutral-500">
                                                    {(reservationPackages.current_page - 1) * reservationPackages.per_page + idx + 1}
                                                </TableCell>
                                                <TableCell className="font-semibold text-neutral-800 dark:text-neutral-200">
                                                    {pkg.name}
                                                </TableCell>
                                                <TableCell className="font-medium text-neutral-900 dark:text-neutral-100">
                                                    {formatRupiah(pkg.price)}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={`font-semibold px-2 py-0.5 rounded-full text-xs ${
                                                        pkg.price_type === 'free'
                                                            ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/30'
                                                            : 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900/30'
                                                    }`}>
                                                        {pkg.price_type === 'free' ? 'Gratis Sewa / DP' : 'Per Jam'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-neutral-700 dark:text-neutral-300">
                                                    {formatRupiah(pkg.min_order_per_pax)}
                                                </TableCell>
                                                <TableCell className="text-neutral-700 dark:text-neutral-300">
                                                    {pkg.min_capacity} - {pkg.max_capacity} Orang
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleOpenEdit(pkg)}
                                                            className="size-8 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                                        >
                                                            <Edit2 className="size-3.5" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleOpenDelete(pkg)}
                                                            className="size-8 text-red-600 dark:text-red-400 hover:text-red-950 dark:hover:text-red-200 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                        >
                                                            <Trash2 className="size-3.5" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination Controls */}
                            {reservationPackages.last_page > 1 && (
                                <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/30 dark:bg-neutral-900/20">
                                    <div className="text-xs text-neutral-500">
                                        Menampilkan <span className="font-medium">{(reservationPackages.current_page - 1) * reservationPackages.per_page + 1}</span> sampai <span className="font-medium">{Math.min(reservationPackages.current_page * reservationPackages.per_page, reservationPackages.total)}</span> dari <span className="font-medium">{reservationPackages.total}</span> hasil
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {reservationPackages.links.map((link, i) => (
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

            {/* Dialog Tambah Paket */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Tambah Paket</DialogTitle>
                        <DialogDescription className="text-xs text-neutral-500">
                            Masukkan parameter kapasitas dan detail harga paket reservasi baru.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddSubmit} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="add-name">Nama Paket</Label>
                            <Input
                                id="add-name"
                                value={addData.name}
                                onChange={(e) => setAddData('name', e.target.value)}
                                placeholder="e.g. Half Book, Full Book, Rent Event"
                                className={addErrors.name ? 'border-red-500' : ''}
                            />
                            {addErrors.name && (
                                <p className="text-xs text-red-500 mt-1">{addErrors.name}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="add-price">Harga Sewa / Booking (Rp)</Label>
                                <Input
                                    id="add-price"
                                    type="number"
                                    value={addData.price}
                                    onChange={(e) => setAddData('price', e.target.value)}
                                    placeholder="80000"
                                    className={addErrors.price ? 'border-red-500' : ''}
                                />
                                {addErrors.price && (
                                    <p className="text-xs text-red-500 mt-1">{addErrors.price}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="add-type">Tipe Harga</Label>
                                <Select
                                    value={addData.price_type}
                                    onValueChange={(val: 'free' | 'per_hour') => setAddData('price_type', val)}
                                >
                                    <SelectTrigger id="add-type">
                                        <SelectValue placeholder="Pilih Tipe" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="free">Gratis Sewa / DP</SelectItem>
                                        <SelectItem value="per_hour">Per Jam</SelectItem>
                                    </SelectContent>
                                </Select>
                                {addErrors.price_type && (
                                    <p className="text-xs text-red-500 mt-1">{addErrors.price_type}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="add-min-order">Minimal Order / Pax (Rp)</Label>
                            <Input
                                id="add-min-order"
                                type="number"
                                value={addData.min_order_per_pax}
                                onChange={(e) => setAddData('min_order_per_pax', e.target.value)}
                                placeholder="15000"
                                className={addErrors.min_order_per_pax ? 'border-red-500' : ''}
                            />
                            {addErrors.min_order_per_pax && (
                                <p className="text-xs text-red-500 mt-1">{addErrors.min_order_per_pax}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="add-min-capacity">Minimal Kapasitas (Orang)</Label>
                                <Input
                                    id="add-min-capacity"
                                    type="number"
                                    value={addData.min_capacity}
                                    onChange={(e) => setAddData('min_capacity', e.target.value)}
                                    placeholder="20"
                                    className={addErrors.min_capacity ? 'border-red-500' : ''}
                                />
                                {addErrors.min_capacity && (
                                    <p className="text-xs text-red-500 mt-1">{addErrors.min_capacity}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="add-max-capacity">Maksimal Kapasitas (Orang)</Label>
                                <Input
                                    id="add-max-capacity"
                                    type="number"
                                    value={addData.max_capacity}
                                    onChange={(e) => setAddData('max_capacity', e.target.value)}
                                    placeholder="50"
                                    className={addErrors.max_capacity ? 'border-red-500' : ''}
                                />
                                {addErrors.max_capacity && (
                                    <p className="text-xs text-red-500 mt-1">{addErrors.max_capacity}</p>
                                )}
                            </div>
                        </div>

                        <DialogFooter className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setIsAddOpen(false)}
                                className="h-9"
                            >
                                Batal
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={addProcessing} 
                                className="bg-cafe-primary text-white hover:bg-cafe-primary/90 h-9"
                            >
                                {addProcessing ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin mr-1.5" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    'Simpan Paket'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Dialog Edit Paket */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Edit Paket</DialogTitle>
                        <DialogDescription className="text-xs text-neutral-500">
                            Perbarui kriteria dan detail harga paket reservasi terpilih.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="edit-name">Nama Paket</Label>
                            <Input
                                id="edit-name"
                                value={editData.name}
                                onChange={(e) => setEditData('name', e.target.value)}
                                placeholder="e.g. Half Book, Full Book, Rent Event"
                                className={editErrors.name ? 'border-red-500' : ''}
                            />
                            {editErrors.name && (
                                <p className="text-xs text-red-500 mt-1">{editErrors.name}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-price">Harga Sewa / Booking (Rp)</Label>
                                <Input
                                    id="edit-price"
                                    type="number"
                                    value={editData.price}
                                    onChange={(e) => setEditData('price', e.target.value)}
                                    placeholder="80000"
                                    className={editErrors.price ? 'border-red-500' : ''}
                                />
                                {editErrors.price && (
                                    <p className="text-xs text-red-500 mt-1">{editErrors.price}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="edit-type">Tipe Harga</Label>
                                <Select
                                    value={editData.price_type}
                                    onValueChange={(val: 'free' | 'per_hour') => setEditData('price_type', val)}
                                >
                                    <SelectTrigger id="edit-type">
                                        <SelectValue placeholder="Pilih Tipe" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="free">Gratis Sewa / DP</SelectItem>
                                        <SelectItem value="per_hour">Per Jam</SelectItem>
                                    </SelectContent>
                                </Select>
                                {editErrors.price_type && (
                                    <p className="text-xs text-red-500 mt-1">{editErrors.price_type}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="edit-min-order">Minimal Order / Pax (Rp)</Label>
                            <Input
                                id="edit-min-order"
                                type="number"
                                value={editData.min_order_per_pax}
                                onChange={(e) => setEditData('min_order_per_pax', e.target.value)}
                                placeholder="15000"
                                className={editErrors.min_order_per_pax ? 'border-red-500' : ''}
                            />
                            {editErrors.min_order_per_pax && (
                                <p className="text-xs text-red-500 mt-1">{editErrors.min_order_per_pax}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-min-capacity">Minimal Kapasitas (Orang)</Label>
                                <Input
                                    id="edit-min-capacity"
                                    type="number"
                                    value={editData.min_capacity}
                                    onChange={(e) => setEditData('min_capacity', e.target.value)}
                                    placeholder="20"
                                    className={editErrors.min_capacity ? 'border-red-500' : ''}
                                />
                                {editErrors.min_capacity && (
                                    <p className="text-xs text-red-500 mt-1">{editErrors.min_capacity}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="edit-max-capacity">Maksimal Kapasitas (Orang)</Label>
                                <Input
                                    id="edit-max-capacity"
                                    type="number"
                                    value={editData.max_capacity}
                                    onChange={(e) => setEditData('max_capacity', e.target.value)}
                                    placeholder="50"
                                    className={editErrors.max_capacity ? 'border-red-500' : ''}
                                />
                                {editErrors.max_capacity && (
                                    <p className="text-xs text-red-500 mt-1">{editErrors.max_capacity}</p>
                                )}
                            </div>
                        </div>

                        <DialogFooter className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setIsEditOpen(false)}
                                className="h-9"
                            >
                                Batal
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={editProcessing} 
                                className="bg-cafe-primary text-white hover:bg-cafe-primary/90 h-9"
                            >
                                {editProcessing ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin mr-1.5" />
                                        Memperbarui...
                                    </>
                                ) : (
                                    'Simpan Perubahan'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Dialog Hapus Paket */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Hapus Paket</DialogTitle>
                        <DialogDescription className="text-xs text-neutral-500">
                            Tindakan ini tidak bisa dibatalkan. Apakah Anda yakin ingin menghapus paket reservasi ini?
                        </DialogDescription>
                    </DialogHeader>
                    {selectedPackage && (
                        <div className="py-3 px-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-100 dark:border-neutral-800 flex flex-col gap-1">
                            <span className="font-semibold text-neutral-800 dark:text-neutral-200 text-sm">{selectedPackage.name}</span>
                            <span className="text-xs text-neutral-500">Harga Sewa: {formatRupiah(selectedPackage.price)}</span>
                        </div>
                    )}
                    <DialogFooter className="pt-2">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsDeleteOpen(false)}
                            className="h-9"
                        >
                            Batal
                        </Button>
                        <Button 
                            type="button"
                            onClick={handleDeleteSubmit}
                            className="bg-red-600 text-white hover:bg-red-700 hover:shadow-xs transition-all h-9"
                        >
                            Ya, Hapus Paket
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

ReservationPackagesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Paket Reservasi',
            href: '/admin/reservation-packages',
        },
    ],
};
