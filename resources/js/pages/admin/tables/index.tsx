import { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { Search, X, QrCode, Plus, Pencil, Trash2, Printer } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import type { PaginatedCollection } from '@/types';

interface TableModel {
    id: number;
    table_number: string;
}

interface PageProps {
    tables: PaginatedCollection<TableModel>;
    filters: {
        search?: string;
    };
    flash: {
        success?: string;
        error?: string;
    };
}

export default function TablesIndex() {
    const { tables, filters, flash } = usePage<any>().props as PageProps;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    // Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);

    // Form States
    const [form, setForm] = useState({ table_number: '' });
    const [editForm, setEditForm] = useState({ id: 0, table_number: '' });
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    // QR State
    const [qrTable, setQrTable] = useState<{ id: number; number: string; url: string } | null>(null);

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
            '/admin/tables',
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

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/admin/tables', form, {
            onSuccess: () => {
                setIsAddModalOpen(false);
                setForm({ table_number: '' });
            },
            onError: (errs) => {
                toast.error(errs.table_number || 'Gagal menambahkan meja.');
            }
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.put(`/admin/tables/${editForm.id}`, editForm, {
            onSuccess: () => {
                setIsEditModalOpen(false);
            },
            onError: (errs) => {
                toast.error(errs.table_number || 'Gagal mengupdate meja.');
            }
        });
    };

    const handleDelete = () => {
        if (!itemToDelete) return;
        router.delete(`/admin/tables/${itemToDelete}`, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setItemToDelete(null);
            }
        });
    };

    const openQrModal = (table: TableModel) => {
        setQrTable({
            id: table.id,
            number: table.table_number,
            url: `${window.location.origin}/guest/menu?table_id=${table.id}`
        });
        setIsQrModalOpen(true);
    };

    return (
        <>
            <Head title="Manajemen Meja" />

            <div className="flex flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Master Meja</h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                        Kelola daftar meja dan cetak QR Code untuk tiap meja.
                    </p>
                </div>

                {/* Actions & Search */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between bg-white dark:bg-neutral-900/50 p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
                    <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
                        <Plus className="size-4" />
                        Tambah Meja
                    </Button>

                    <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md w-full ml-auto">
                        <Input
                            placeholder="Cari nomor meja..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-8 h-9"
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

                {/* Table */}
                <div className="bg-white dark:bg-neutral-900/50 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-neutral-50/50 dark:bg-neutral-900/30">
                                <TableRow>
                                    <TableHead className="w-[60px]">No</TableHead>
                                    <TableHead>Nomor / Nama Meja</TableHead>
                                    <TableHead className="text-right w-[200px]">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tables.data.map((table, idx) => (
                                    <TableRow key={table.id} className="hover:bg-neutral-50/30 dark:hover:bg-neutral-900/10">
                                        <TableCell className="font-medium text-neutral-500">
                                            {(tables.current_page - 1) * tables.per_page + idx + 1}
                                        </TableCell>
                                        <TableCell className="font-bold text-neutral-900 dark:text-neutral-100">
                                            {table.table_number}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    onClick={() => openQrModal(table)}
                                                    className="size-8 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                                    title="Cetak QR"
                                                >
                                                    <QrCode className="size-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setEditForm({ id: table.id, table_number: table.table_number });
                                                        setIsEditModalOpen(true);
                                                    }}
                                                    className="size-8 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                >
                                                    <Pencil className="size-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setItemToDelete(table.id);
                                                        setIsDeleteModalOpen(true);
                                                    }}
                                                    className="size-8 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {tables.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-24 text-center">
                                            Tidak ada data meja.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tambah Meja</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="add_table_number">Nomor / Nama Meja</Label>
                                <Input
                                    id="add_table_number"
                                    value={form.table_number}
                                    onChange={(e) => setForm({ ...form, table_number: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Batal</Button>
                            <Button type="submit">Simpan</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Meja</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit_table_number">Nomor / Nama Meja</Label>
                                <Input
                                    id="edit_table_number"
                                    value={editForm.table_number}
                                    onChange={(e) => setEditForm({ ...editForm, table_number: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Batal</Button>
                            <Button type="submit">Simpan Perubahan</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Meja</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus meja ini? Aksi ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Batal</Button>
                        <Button variant="destructive" onClick={handleDelete}>Hapus</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
                <DialogContent className="sm:max-w-md print:shadow-none print:border-none print:w-full">
                    <DialogHeader className="print:hidden">
                        <DialogTitle className="text-center">Cetak QR Code</DialogTitle>
                    </DialogHeader>
                    
                    {qrTable && (
                        <div className="flex flex-col items-center">
                            <div id="printable-qr" className="flex flex-col items-center p-8 bg-white border-2 border-neutral-100 shadow-sm rounded-3xl w-full max-w-sm mb-6 print:shadow-none print:border-none print:w-full">
                                <h2 className="text-xl font-bold text-neutral-800 mb-6 uppercase tracking-widest border-b-2 border-neutral-100 pb-2 w-full text-center">
                                    {qrTable.number}
                                </h2>
                                <QRCodeSVG 
                                    value={qrTable.url} 
                                    size={220}
                                    level="H"
                                    includeMargin={true}
                                />
                                <p className="mt-6 text-sm text-neutral-500 font-medium text-center">
                                    Scan untuk pesan menu
                                </p>
                            </div>
                            <div className="text-center print:hidden">
                                <code className="text-xs bg-neutral-100 dark:bg-neutral-800 p-2 rounded block break-all">
                                    {qrTable.url}
                                </code>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="sm:justify-center mt-4 print:hidden">
                        <Button type="button" onClick={() => window.print()} className="flex items-center gap-2">
                            <Printer className="size-4" />
                            Cetak
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    body * { visibility: hidden; }
                    #printable-qr, #printable-qr * { visibility: visible; }
                    #printable-qr {
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%);
                        width: 100vw;
                        height: 100vh;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                }
            `}} />
        </>
    );
}

TablesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Master Meja', href: '/admin/tables' },
    ],
};
