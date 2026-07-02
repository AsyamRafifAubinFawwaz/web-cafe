import { useState, useEffect } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { Plus, Search, Edit2, Trash2, BookOpen, Coffee, Utensils, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

import type { Category, Menu, PaginatedCollection } from '@/types';

interface PageProps {
    menus: PaginatedCollection<Menu>;
    categories: Category[];
    filters: {
        search?: string;
        type?: string;
    };
    flash: {
        success?: string;
        error?: string;
    };
}

export default function MenusIndex() {
    const { menus, categories, filters, flash } = usePage<any>().props as PageProps;
    
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

    const {
        data: addData,
        setData: setAddData,
        post: postAdd,
        processing: addProcessing,
        errors: addErrors,
        reset: resetAdd,
    } = useForm({
        name: '',
        description: '',
        price: '',
        category_id: '',
        image: null as File | null,
    });

    const [editData, setEditData] = useState({
        name: '',
        description: '',
        price: 0,
        category_id: 0,
        image: null as File | null,
    });
    const [editErrors, setEditErrors] = useState<Record<string, string>>({});
    const [editProcessing, setEditProcessing] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleSearchAndFilter = (searchVal = searchTerm) => {
        const queryParams: Record<string, string> = {};
        if (searchVal) queryParams.search = searchVal;
        if (filters.type) queryParams.type = filters.type;

        router.get(
            '/admin/menus',
            queryParams,
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
        postAdd('/admin/menus', {
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

    const handleOpenEdit = (menu: Menu) => {
        setSelectedMenu(menu);
        setEditData({
            name: menu.name,
            description: menu.description,
            price: menu.price,
            category_id: menu.category_id,
            image: null,
        });
        setEditErrors({});
        setIsEditOpen(true);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMenu) return;

        setEditProcessing(true);
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('name', editData.name);
        formData.append('description', editData.description);
        formData.append('price', String(editData.price));
        formData.append('category_id', String(editData.category_id));
        if (editData.image) {
            formData.append('image', editData.image);
        }

        router.post(`/admin/menus/${selectedMenu.id}`, formData as any, {
            onSuccess: () => {
                setIsEditOpen(false);
                setEditProcessing(false);
            },
            onError: (errs) => {
                setEditProcessing(false);
                setEditErrors(errs);
                if (errs.error) {
                    toast.error(errs.error);
                }
            }
        });
    };

    const handleOpenDelete = (menu: Menu) => {
        setSelectedMenu(menu);
        setIsDeleteOpen(true);
    };

    const handleDeleteSubmit = () => {
        if (!selectedMenu) return;

        router.delete(`/admin/menus/${selectedMenu.id}`, {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setSelectedMenu(null);
            },
            onError: (errs) => {
                setIsDeleteOpen(false);
                if (errs.error) {
                    toast.error(errs.error);
                } else {
                    toast.error('Gagal menghapus menu.');
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
            <Head title="Manajemen Menu" />

            <div className="flex flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Daftar Menu</h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Kelola produk makanan, minuman, dan detail harga kafe Anda.
                        </p>
                    </div>
                    <Button 
                        onClick={handleOpenAdd}
                        className="bg-cafe-primary hover:bg-cafe-primary/90 text-white shadow-sm transition-colors flex items-center gap-2"
                    >
                        <Plus className="size-4" />
                        Tambah Menu
                    </Button>
                </div>

                {/* Search Bar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between bg-white dark:bg-neutral-900/50 p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
                    <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md w-full">
                        <Input
                            placeholder="Cari nama menu..."
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
                    {menus.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4">
                            <div className="size-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500 mb-4">
                                <BookOpen className="size-6" />
                            </div>
                            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">Menu Kosong</h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center mt-1 max-w-xs">
                                Tidak ada menu yang ditemukan. Silakan tambahkan menu baru.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-neutral-50/50 dark:bg-neutral-900/30">
                                        <TableRow>
                                            <TableHead className="w-[80px]">No</TableHead>
                                            <TableHead>Foto</TableHead>
                                            <TableHead>Nama Menu</TableHead>
                                            <TableHead>Kategori</TableHead>
                                            <TableHead>Harga</TableHead>
                                            <TableHead className="text-right w-[150px]">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {menus.data.map((menu, idx) => (
                                            <TableRow key={menu.id} className="hover:bg-neutral-50/30 dark:hover:bg-neutral-900/10">
                                                <TableCell className="font-medium text-neutral-500">
                                                    {(menus.current_page - 1) * menus.per_page + idx + 1}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="size-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 overflow-hidden flex items-center justify-center border border-neutral-200 dark:border-neutral-700">
                                                        {menu.image ? (
                                                            <img 
                                                                src={`/storage/${menu.image}`} 
                                                                alt={menu.name}
                                                                className="size-full object-cover"
                                                                onError={(e) => {
                                                                    (e.target as HTMLElement).style.display = 'none';
                                                                }}
                                                            />
                                                        ) : (
                                                            <ImageIcon className="size-5 text-neutral-400" />
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">{menu.name}</span>
                                                        <span className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 max-w-[300px]">{menu.description}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {menu.category ? (
                                                        <Badge variant="outline" className={`font-medium px-2 py-0.5 rounded-full flex items-center gap-1.5 w-fit ${
                                                            menu.category.type === 'makanan' 
                                                            ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/30'
                                                            : 'bg-sky-50 dark:bg-sky-950/20 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-900/30'
                                                        }`}>
                                                            {menu.category.type === 'makanan' ? <Utensils className="size-3" /> : <Coffee className="size-3" />}
                                                            {menu.category.name}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-xs text-neutral-400">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="font-medium text-neutral-900 dark:text-neutral-100">
                                                    {formatRupiah(menu.price)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleOpenEdit(menu)}
                                                            className="size-8 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                                        >
                                                            <Edit2 className="size-3.5" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleOpenDelete(menu)}
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
                            {menus.last_page > 1 && (
                                <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/30 dark:bg-neutral-900/20">
                                    <div className="text-xs text-neutral-500">
                                        Menampilkan <span className="font-medium">{(menus.current_page - 1) * menus.per_page + 1}</span> sampai <span className="font-medium">{Math.min(menus.current_page * menus.per_page, menus.total)}</span> dari <span className="font-medium">{menus.total}</span> hasil
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {menus.links.map((link, i) => (
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

            {/* Dialog Tambah Menu */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Tambah Menu</DialogTitle>
                        <DialogDescription className="text-xs text-neutral-500">
                            Masukkan detail menu baru untuk ditambahkan ke daftar katalog kafe.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddSubmit} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="add-name">Nama Menu</Label>
                            <Input
                                id="add-name"
                                value={addData.name}
                                onChange={(e) => setAddData('name', e.target.value)}
                                placeholder="e.g. Espresso Romano, Fettuccine Carbonara"
                                className={addErrors.name ? 'border-red-500' : ''}
                            />
                            {addErrors.name && (
                                <p className="text-xs text-red-500 mt-1">{addErrors.name}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="add-description">Deskripsi</Label>
                            <Textarea
                                id="add-description"
                                value={addData.description}
                                onChange={(e) => setAddData('description', e.target.value)}
                                placeholder="Tuliskan deskripsi singkat menu..."
                                className={addErrors.description ? 'border-red-500' : ''}
                            />
                            {addErrors.description && (
                                <p className="text-xs text-red-500 mt-1">{addErrors.description}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="add-price">Harga (Rp)</Label>
                                <Input
                                    id="add-price"
                                    type="number"
                                    value={addData.price}
                                    onChange={(e) => setAddData('price', e.target.value)}
                                    placeholder="25000"
                                    className={addErrors.price ? 'border-red-500' : ''}
                                />
                                {addErrors.price && (
                                    <p className="text-xs text-red-500 mt-1">{addErrors.price}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="add-category">Kategori</Label>
                                <Select
                                    value={addData.category_id}
                                    onValueChange={(val) => setAddData('category_id', val)}
                                >
                                    <SelectTrigger id="add-category" className={addErrors.category_id ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Pilih Kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={String(cat.id)}>
                                                {cat.name} ({cat.type})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {addErrors.category_id && (
                                    <p className="text-xs text-red-500 mt-1">{addErrors.category_id}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="add-image">Foto Menu</Label>
                            <Input
                                id="add-image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setAddData('image', e.target.files?.[0] || null)}
                                className={addErrors.image ? 'border-red-500' : ''}
                            />
                            {addErrors.image && (
                                <p className="text-xs text-red-500 mt-1">{addErrors.image}</p>
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
                                className="bg-cafe-primary text-white hover:bg-cafe-primary/90 h-9"
                            >
                                {addProcessing ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin mr-1.5" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    'Simpan Menu'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Dialog Edit Menu */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Edit Menu</DialogTitle>
                        <DialogDescription className="text-xs text-neutral-500">
                            Perbarui rincian detail menu terpilih.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="edit-name">Nama Menu</Label>
                            <Input
                                id="edit-name"
                                value={editData.name}
                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                placeholder="e.g. Espresso Romano, Fettuccine Carbonara"
                                className={editErrors.name ? 'border-red-500' : ''}
                            />
                            {editErrors.name && (
                                <p className="text-xs text-red-500 mt-1">{editErrors.name}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="edit-description">Deskripsi</Label>
                            <Textarea
                                id="edit-description"
                                value={editData.description}
                                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                placeholder="Tuliskan deskripsi singkat menu..."
                                className={editErrors.description ? 'border-red-500' : ''}
                            />
                            {editErrors.description && (
                                <p className="text-xs text-red-500 mt-1">{editErrors.description}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-price">Harga (Rp)</Label>
                                <Input
                                    id="edit-price"
                                    type="number"
                                    value={editData.price}
                                    onChange={(e) => setEditData({ ...editData, price: Number(e.target.value) })}
                                    placeholder="25000"
                                    className={editErrors.price ? 'border-red-500' : ''}
                                />
                                {editErrors.price && (
                                    <p className="text-xs text-red-500 mt-1">{editErrors.price}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="edit-category">Kategori</Label>
                                <Select
                                    value={String(editData.category_id)}
                                    onValueChange={(val) => setEditData({ ...editData, category_id: Number(val) })}
                                >
                                    <SelectTrigger id="edit-category" className={editErrors.category_id ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Pilih Kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={String(cat.id)}>
                                                {cat.name} ({cat.type})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {editErrors.category_id && (
                                    <p className="text-xs text-red-500 mt-1">{editErrors.category_id}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="edit-image">Ubah Foto Menu (Opsional)</Label>
                            <Input
                                id="edit-image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setEditData({ ...editData, image: e.target.files?.[0] || null })}
                                className={editErrors.image ? 'border-red-500' : ''}
                            />
                            {editErrors.image && (
                                <p className="text-xs text-red-500 mt-1">{editErrors.image}</p>
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

            {/* Dialog Hapus Menu */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Hapus Menu</DialogTitle>
                        <DialogDescription className="text-xs text-neutral-500">
                            Tindakan ini tidak bisa dibatalkan. Apakah Anda yakin ingin menghapus menu ini dari database?
                        </DialogDescription>
                    </DialogHeader>
                    {selectedMenu && (
                        <div className="py-3 px-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-100 dark:border-neutral-800 flex items-center gap-3">
                            <div className="size-10 rounded bg-white dark:bg-neutral-950 flex items-center justify-center border overflow-hidden">
                                {selectedMenu.image ? (
                                    <img src={`/storage/${selectedMenu.image}`} alt={selectedMenu.name} className="size-full object-cover" />
                                ) : (
                                    <ImageIcon className="size-4 text-neutral-400" />
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-neutral-800 dark:text-neutral-200 text-sm">{selectedMenu.name}</span>
                                <span className="text-xs text-neutral-500">{formatRupiah(selectedMenu.price)}</span>
                            </div>
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
                            Ya, Hapus Menu
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

MenusIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Menu',
            href: '/admin/menus',
        },
    ],
};
