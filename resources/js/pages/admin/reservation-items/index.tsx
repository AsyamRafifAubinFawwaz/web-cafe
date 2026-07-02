import { useState, useEffect } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { Plus, Search, Edit2, Trash2, ShoppingBag, X, Loader2, DollarSign } from 'lucide-react';
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

interface ReservationMember {
    id: number;
    name: string;
}

interface Menu {
    id: number;
    name: string;
    price: number;
}

interface ReservationItem {
    id: number;
    reservation_member_id: number;
    menu_id: number;
    quantity: number;
    subtotal: number;
    reservation_member?: ReservationMember;
    menu?: Menu;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedItems {
    data: ReservationItem[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: PaginationLink[];
    total: number;
    per_page: number;
}

interface PageProps {
    reservationItems: PaginatedItems;
    reservationMembers: ReservationMember[];
    menus: Menu[];
    filters: {
        reservation_member_id?: string;
    };
    flash: {
        success?: string;
        error?: string;
    };
}

export default function ReservationItemsIndex() {
    const { reservationItems, reservationMembers, menus, filters, flash } = usePage<any>().props as PageProps;

    const [filterMemberId, setFilterMemberId] = useState<string>(filters.reservation_member_id || 'all');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ReservationItem | null>(null);

    const {
        data: addData,
        setData: setAddData,
        post: postAdd,
        processing: addProcessing,
        errors: addErrors,
        reset: resetAdd,
    } = useForm({
        reservation_member_id: '',
        menu_id: '',
        quantity: '1',
        subtotal: '0',
    });

    const {
        data: editData,
        setData: setEditData,
        put: putEdit,
        processing: editProcessing,
        errors: editErrors,
        reset: resetEdit,
    } = useForm({
        reservation_member_id: '',
        menu_id: '',
        quantity: '1',
        subtotal: '0',
    });

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    // Auto-calculate add subtotal
    useEffect(() => {
        const menu = menus.find((m) => String(m.id) === addData.menu_id);
        if (menu && addData.quantity) {
            const calculated = menu.price * Number(addData.quantity);
            setAddData('subtotal', String(calculated));
        }
    }, [addData.menu_id, addData.quantity]);

    // Auto-calculate edit subtotal
    useEffect(() => {
        const menu = menus.find((m) => String(m.id) === editData.menu_id);
        if (menu && editData.quantity) {
            const calculated = menu.price * Number(editData.quantity);
            setEditData('subtotal', String(calculated));
        }
    }, [editData.menu_id, editData.quantity]);

    const handleSearchAndFilter = (memberVal = filterMemberId) => {
        router.get(
            '/admin/reservation-items',
            { reservation_member_id: memberVal !== 'all' ? memberVal : undefined },
            { preserveState: true, replace: true }
        );
    };

    const handleMemberFilterChange = (val: string) => {
        setFilterMemberId(val);
        handleSearchAndFilter(val);
    };

    const handleOpenAdd = () => {
        resetAdd();
        setIsAddOpen(true);
    };

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postAdd('/admin/reservation-items', {
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

    const handleOpenEdit = (item: ReservationItem) => {
        setSelectedItem(item);
        setEditData({
            reservation_member_id: String(item.reservation_member_id),
            menu_id: String(item.menu_id),
            quantity: String(item.quantity),
            subtotal: String(item.subtotal),
        });
        setIsEditOpen(true);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedItem) return;

        putEdit(`/admin/reservation-items/${selectedItem.id}`, {
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

    const handleOpenDelete = (item: ReservationItem) => {
        setSelectedItem(item);
        setIsDeleteOpen(true);
    };

    const handleDeleteSubmit = () => {
        if (!selectedItem) return;

        router.delete(`/admin/reservation-items/${selectedItem.id}`, {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setSelectedItem(null);
            },
            onError: (errs) => {
                setIsDeleteOpen(false);
                if (errs.error) {
                    toast.error(errs.error);
                } else {
                    toast.error('Gagal menghapus detail item.');
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
            <Head title="Manajemen Item Reservasi" />

            <div className="flex flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Item Pesanan Reservasi</h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Kelola menu makanan & minuman yang dipesan oleh tiap anggota rombongan.
                        </p>
                    </div>
                    <Button 
                        onClick={handleOpenAdd}
                        className="bg-neutral-950 hover:bg-neutral-800 text-neutral-50 dark:bg-neutral-50 dark:hover:bg-neutral-200 dark:text-neutral-950 shadow-sm transition-colors flex items-center gap-2"
                    >
                        <Plus className="size-4" />
                        Tambah Item Pesanan
                    </Button>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between bg-white dark:bg-neutral-900/50 p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
                    <div className="flex items-center gap-3 w-full max-w-md">
                        <Label className="text-neutral-500 text-xs font-medium uppercase tracking-wider whitespace-nowrap">Filter Anggota:</Label>
                        <Select value={filterMemberId} onValueChange={handleMemberFilterChange}>
                            <SelectTrigger className="h-9 dark:bg-neutral-950/40">
                                <SelectValue placeholder="Semua Anggota" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Anggota</SelectItem>
                                {reservationMembers.map((member) => (
                                    <SelectItem key={member.id} value={String(member.id)}>{member.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white dark:bg-neutral-900/50 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs overflow-hidden">
                    {reservationItems.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4">
                            <div className="size-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500 mb-4">
                                <ShoppingBag className="size-6" />
                            </div>
                            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">Item Pesanan Kosong</h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center mt-1 max-w-xs">
                                Tidak ada data menu yang dipesan oleh rombongan.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-neutral-50/50 dark:bg-neutral-900/30">
                                        <TableRow>
                                            <TableHead className="w-[80px]">No</TableHead>
                                            <TableHead>Anggota Rombongan</TableHead>
                                            <TableHead>Menu Dipesan</TableHead>
                                            <TableHead>Harga Satuan</TableHead>
                                            <TableHead className="w-[100px] text-center">Jumlah</TableHead>
                                            <TableHead>Subtotal</TableHead>
                                            <TableHead className="text-right w-[150px]">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reservationItems.data.map((item, idx) => (
                                            <TableRow key={item.id} className="hover:bg-neutral-50/30 dark:hover:bg-neutral-900/10">
                                                <TableCell className="font-medium text-neutral-500">
                                                    {(reservationItems.current_page - 1) * reservationItems.per_page + idx + 1}
                                                </TableCell>
                                                <TableCell className="font-semibold text-neutral-800 dark:text-neutral-200">
                                                    {item.reservation_member ? item.reservation_member.name : <span className="text-neutral-400 font-normal">Tidak Ditemukan</span>}
                                                </TableCell>
                                                <TableCell className="text-neutral-800 dark:text-neutral-200">
                                                    {item.menu ? item.menu.name : <span className="text-neutral-400">Tidak Ditemukan</span>}
                                                </TableCell>
                                                <TableCell className="text-neutral-700 dark:text-neutral-300">
                                                    {item.menu ? formatRupiah(item.menu.price) : 'Rp 0'}
                                                </TableCell>
                                                <TableCell className="text-center font-semibold text-neutral-900 dark:text-neutral-100">
                                                    {item.quantity}
                                                </TableCell>
                                                <TableCell className="font-bold text-neutral-900 dark:text-neutral-100">
                                                    {formatRupiah(item.subtotal)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleOpenEdit(item)}
                                                            className="size-8 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                                        >
                                                            <Edit2 className="size-3.5" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleOpenDelete(item)}
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
                            {reservationItems.last_page > 1 && (
                                <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/30 dark:bg-neutral-900/20">
                                    <div className="text-xs text-neutral-500">
                                        Menampilkan <span className="font-medium">{(reservationItems.current_page - 1) * reservationItems.per_page + 1}</span> sampai <span className="font-medium">{Math.min(reservationItems.current_page * reservationItems.per_page, reservationItems.total)}</span> dari <span className="font-medium">{reservationItems.total}</span> hasil
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {reservationItems.links.map((link, i) => (
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

            {/* Dialog Tambah Item */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Tambah Item Pesanan</DialogTitle>
                        <DialogDescription className="text-xs text-neutral-500">
                            Masukkan menu, kuantitas, dan hitung subtotal otomatis untuk anggota rombongan terpilih.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddSubmit} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="add-member">Pilih Anggota Rombongan</Label>
                            <Select
                                value={addData.reservation_member_id}
                                onValueChange={(val) => setAddData('reservation_member_id', val)}
                            >
                                <SelectTrigger id="add-member" className={addErrors.reservation_member_id ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Pilih Anggota" />
                                </SelectTrigger>
                                <SelectContent>
                                    {reservationMembers.map((member) => (
                                        <SelectItem key={member.id} value={String(member.id)}>{member.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {addErrors.reservation_member_id && (
                                <p className="text-xs text-red-500 mt-1">{addErrors.reservation_member_id}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="add-menu">Pilih Menu</Label>
                            <Select
                                value={addData.menu_id}
                                onValueChange={(val) => setAddData('menu_id', val)}
                            >
                                <SelectTrigger id="add-menu" className={addErrors.menu_id ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Pilih Menu Makanan/Minuman" />
                                </SelectTrigger>
                                <SelectContent>
                                    {menus.map((menu) => (
                                        <SelectItem key={menu.id} value={String(menu.id)}>
                                            {menu.name} ({formatRupiah(menu.price)})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {addErrors.menu_id && (
                                <p className="text-xs text-red-500 mt-1">{addErrors.menu_id}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="add-qty">Jumlah Porsi</Label>
                                <Input
                                    id="add-qty"
                                    type="number"
                                    min="1"
                                    value={addData.quantity}
                                    onChange={(e) => setAddData('quantity', e.target.value)}
                                    placeholder="1"
                                    className={addErrors.quantity ? 'border-red-500' : ''}
                                />
                                {addErrors.quantity && (
                                    <p className="text-xs text-red-500 mt-1">{addErrors.quantity}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="add-subtotal">Subtotal (Rp)</Label>
                                <Input
                                    id="add-subtotal"
                                    type="number"
                                    value={addData.subtotal}
                                    onChange={(e) => setAddData('subtotal', e.target.value)}
                                    className="bg-neutral-50 dark:bg-neutral-900/60 font-semibold"
                                    readOnly
                                />
                                {addErrors.subtotal && (
                                    <p className="text-xs text-red-500 mt-1">{addErrors.subtotal}</p>
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
                                className="bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200 h-9"
                            >
                                {addProcessing ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin mr-1.5" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    'Simpan Item'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Dialog Edit Item */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Edit Item Pesanan</DialogTitle>
                        <DialogDescription className="text-xs text-neutral-500">
                            Perbarui pilihan menu, jumlah porsi, atau hitung ulang subtotal item terpilih.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="edit-member">Pilih Anggota Rombongan</Label>
                            <Select
                                value={editData.reservation_member_id}
                                onValueChange={(val) => setEditData({ ...editData, reservation_member_id: val })}
                            >
                                <SelectTrigger id="edit-member" className={editErrors.reservation_member_id ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Pilih Anggota" />
                                </SelectTrigger>
                                <SelectContent>
                                    {reservationMembers.map((member) => (
                                        <SelectItem key={member.id} value={String(member.id)}>{member.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {editErrors.reservation_member_id && (
                                <p className="text-xs text-red-500 mt-1">{editErrors.reservation_member_id}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="edit-menu">Pilih Menu</Label>
                            <Select
                                value={editData.menu_id}
                                onValueChange={(val) => setEditData({ ...editData, menu_id: val })}
                            >
                                <SelectTrigger id="edit-menu" className={editErrors.menu_id ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Pilih Menu Makanan/Minuman" />
                                </SelectTrigger>
                                <SelectContent>
                                    {menus.map((menu) => (
                                        <SelectItem key={menu.id} value={String(menu.id)}>
                                            {menu.name} ({formatRupiah(menu.price)})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {editErrors.menu_id && (
                                <p className="text-xs text-red-500 mt-1">{editErrors.menu_id}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-qty">Jumlah Porsi</Label>
                                <Input
                                    id="edit-qty"
                                    type="number"
                                    min="1"
                                    value={editData.quantity}
                                    onChange={(e) => setEditData({ ...editData, quantity: e.target.value })}
                                    placeholder="1"
                                    className={editErrors.quantity ? 'border-red-500' : ''}
                                />
                                {editErrors.quantity && (
                                    <p className="text-xs text-red-500 mt-1">{editErrors.quantity}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="edit-subtotal">Subtotal (Rp)</Label>
                                <Input
                                    id="edit-subtotal"
                                    type="number"
                                    value={editData.subtotal}
                                    onChange={(e) => setEditData({ ...editData, subtotal: e.target.value })}
                                    className="bg-neutral-50 dark:bg-neutral-900/60 font-semibold"
                                    readOnly
                                />
                                {editErrors.subtotal && (
                                    <p className="text-xs text-red-500 mt-1">{editErrors.subtotal}</p>
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
                                className="bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200 h-9"
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

            {/* Dialog Hapus Item */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Hapus Item Pesanan</DialogTitle>
                        <DialogDescription className="text-xs text-neutral-500">
                            Tindakan ini tidak bisa dibatalkan. Apakah Anda yakin ingin menghapus item pesanan ini?
                        </DialogDescription>
                    </DialogHeader>
                    {selectedItem && (
                        <div className="py-3 px-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-100 dark:border-neutral-800 flex flex-col gap-1">
                            {selectedItem.reservation_member && (
                                <span className="font-semibold text-neutral-800 dark:text-neutral-200 text-sm">Anggota: {selectedItem.reservation_member.name}</span>
                            )}
                            {selectedItem.menu && (
                                <span className="text-xs text-neutral-500">Menu: {selectedItem.menu.name} ({selectedItem.quantity} Porsi)</span>
                            )}
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
                            Ya, Hapus Item
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

ReservationItemsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Item Reservasi',
            href: '/admin/reservation-items',
        },
    ],
};
