import { useState, useEffect } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { Plus, Search, Edit2, Trash2, Users, X, Loader2 } from 'lucide-react';
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

interface Reservation {
    id: number;
    name: string;
    phone: string;
}

interface ReservationMember {
    id: number;
    reservation_id: number;
    name: string;
    reservation?: Reservation;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedMembers {
    data: ReservationMember[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: PaginationLink[];
    total: number;
    per_page: number;
}

interface PageProps {
    reservationMembers: PaginatedMembers;
    reservations: Reservation[];
    filters: {
        search?: string;
    };
    flash: {
        success?: string;
        error?: string;
    };
}

export default function ReservationMembersIndex() {
    const { reservationMembers, reservations, filters, flash } = usePage<any>().props as PageProps;

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<ReservationMember | null>(null);

    const {
        data: addData,
        setData: setAddData,
        post: postAdd,
        processing: addProcessing,
        errors: addErrors,
        reset: resetAdd,
    } = useForm({
        name: '',
        reservation_id: '',
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
        reservation_id: '',
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
            '/admin/reservation-members',
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
        postAdd('/admin/reservation-members', {
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

    const handleOpenEdit = (member: ReservationMember) => {
        setSelectedMember(member);
        setEditData({
            name: member.name,
            reservation_id: String(member.reservation_id),
        });
        setIsEditOpen(true);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMember) return;

        putEdit(`/admin/reservation-members/${selectedMember.id}`, {
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

    const handleOpenDelete = (member: ReservationMember) => {
        setSelectedMember(member);
        setIsDeleteOpen(true);
    };

    const handleDeleteSubmit = () => {
        if (!selectedMember) return;

        router.delete(`/admin/reservation-members/${selectedMember.id}`, {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setSelectedMember(null);
            },
            onError: (errs) => {
                setIsDeleteOpen(false);
                if (errs.error) {
                    toast.error(errs.error);
                } else {
                    toast.error('Gagal menghapus anggota.');
                }
            }
        });
    };

    return (
        <>
            <Head title="Manajemen Anggota Reservasi" />

            <div className="flex flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Anggota Rombongan</h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Kelola data nama-nama anggota rombongan yang tergabung dalam tiap sesi reservasi.
                        </p>
                    </div>
                    <Button 
                        onClick={handleOpenAdd}
                        className="bg-neutral-950 hover:bg-neutral-800 text-neutral-50 dark:bg-neutral-50 dark:hover:bg-neutral-200 dark:text-neutral-950 shadow-sm transition-colors flex items-center gap-2"
                    >
                        <Plus className="size-4" />
                        Tambah Anggota
                    </Button>
                </div>

                {/* Search Bar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between bg-white dark:bg-neutral-900/50 p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
                    <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md w-full">
                        <Input
                            placeholder="Cari nama anggota..."
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
                    {reservationMembers.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4">
                            <div className="size-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500 mb-4">
                                <Users className="size-6" />
                            </div>
                            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">Anggota Kosong</h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center mt-1 max-w-xs">
                                Tidak ada data anggota rombongan yang ditemukan.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-neutral-50/50 dark:bg-neutral-900/30">
                                        <TableRow>
                                            <TableHead className="w-[80px]">No</TableHead>
                                            <TableHead>Nama Anggota</TableHead>
                                            <TableHead>Sesi Reservasi (Koordinator)</TableHead>
                                            <TableHead className="text-right w-[150px]">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reservationMembers.data.map((member, idx) => (
                                            <TableRow key={member.id} className="hover:bg-neutral-50/30 dark:hover:bg-neutral-900/10">
                                                <TableCell className="font-medium text-neutral-500">
                                                    {(reservationMembers.current_page - 1) * reservationMembers.per_page + idx + 1}
                                                </TableCell>
                                                <TableCell className="font-semibold text-neutral-800 dark:text-neutral-200">
                                                    {member.name}
                                                </TableCell>
                                                <TableCell>
                                                    {member.reservation ? (
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="font-medium text-neutral-700 dark:text-neutral-300">{member.reservation.name}</span>
                                                            <span className="text-xs text-neutral-500">Phone: {member.reservation.phone}</span>
                                                        </div>
                                                    ) : (
                                                        <Badge variant="outline" className="text-neutral-400 bg-neutral-50">Tidak Ditemukan</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleOpenEdit(member)}
                                                            className="size-8 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                                        >
                                                            <Edit2 className="size-3.5" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleOpenDelete(member)}
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
                            {reservationMembers.last_page > 1 && (
                                <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/30 dark:bg-neutral-900/20">
                                    <div className="text-xs text-neutral-500">
                                        Menampilkan <span className="font-medium">{(reservationMembers.current_page - 1) * reservationMembers.per_page + 1}</span> sampai <span className="font-medium">{Math.min(reservationMembers.current_page * reservationMembers.per_page, reservationMembers.total)}</span> dari <span className="font-medium">{reservationMembers.total}</span> hasil
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {reservationMembers.links?.map((link, i) => (
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

            {/* Dialog Tambah Anggota */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Tambah Anggota</DialogTitle>
                        <DialogDescription className="text-xs text-neutral-500">
                            Tautkan nama anggota rombongan baru ke dalam sesi reservasi terdaftar.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddSubmit} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="add-name">Nama Anggota</Label>
                            <Input
                                id="add-name"
                                value={addData.name}
                                onChange={(e) => setAddData('name', e.target.value)}
                                placeholder="e.g. Dayat, Kukuh, Siska Teman"
                                className={addErrors.name ? 'border-red-500' : ''}
                            />
                            {addErrors.name && (
                                <p className="text-xs text-red-500 mt-1">{addErrors.name}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="add-res">Sesi Reservasi (Koordinator)</Label>
                            <Select
                                value={addData.reservation_id}
                                onValueChange={(val) => setAddData('reservation_id', val)}
                            >
                                <SelectTrigger id="add-res" className={addErrors.reservation_id ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Pilih Reservasi" />
                                </SelectTrigger>
                                <SelectContent>
                                    {reservations.map((res) => (
                                        <SelectItem key={res.id} value={String(res.id)}>
                                            {res.name} (HP: {res.phone})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {addErrors.reservation_id && (
                                <p className="text-xs text-red-500 mt-1">{addErrors.reservation_id}</p>
                            )}
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
                                    'Simpan Anggota'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Dialog Edit Anggota */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Edit Anggota</DialogTitle>
                        <DialogDescription className="text-xs text-neutral-500">
                            Ubah detail nama atau pindahkan anggota ke sesi reservasi lain.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="edit-name">Nama Anggota</Label>
                            <Input
                                id="edit-name"
                                value={editData.name}
                                onChange={(e) => setEditData('name', e.target.value)}
                                placeholder="e.g. Dayat, Kukuh, Siska Teman"
                                className={editErrors.name ? 'border-red-500' : ''}
                            />
                            {editErrors.name && (
                                <p className="text-xs text-red-500 mt-1">{editErrors.name}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="edit-res">Sesi Reservasi (Koordinator)</Label>
                            <Select
                                value={editData.reservation_id}
                                onValueChange={(val) => setEditData('reservation_id', val)}
                            >
                                <SelectTrigger id="edit-res" className={editErrors.reservation_id ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Pilih Reservasi" />
                                </SelectTrigger>
                                <SelectContent>
                                    {reservations.map((res) => (
                                        <SelectItem key={res.id} value={String(res.id)}>
                                            {res.name} (HP: {res.phone})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {editErrors.reservation_id && (
                                <p className="text-xs text-red-500 mt-1">{editErrors.reservation_id}</p>
                            )}
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

            {/* Dialog Hapus Anggota */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Hapus Anggota</DialogTitle>
                        <DialogDescription className="text-xs text-neutral-500">
                            Tindakan ini tidak bisa dibatalkan. Apakah Anda yakin ingin menghapus anggota ini?
                        </DialogDescription>
                    </DialogHeader>
                    {selectedMember && (
                        <div className="py-3 px-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-100 dark:border-neutral-800 flex flex-col gap-1">
                            <span className="font-semibold text-neutral-800 dark:text-neutral-200 text-sm">{selectedMember.name}</span>
                            {selectedMember.reservation && (
                                <span className="text-xs text-neutral-500">Sesi Koor: {selectedMember.reservation.name}</span>
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
                            Ya, Hapus Anggota
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

ReservationMembersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Anggota Reservasi',
            href: '/admin/reservation-members',
        },
    ],
};
