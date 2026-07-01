
import { useState, useEffect } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { Plus, Search, Edit2, Trash2, Folder, Coffee, Utensils, X, Loader2, ArrowRight } from 'lucide-react';
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

interface Category {
    id: number;
    name: string;
    type: 'makanan' | 'minuman';
    created_at: string;
    updated_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedCategories {
    data: Category[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: PaginationLink[];
    total: number;
}

interface PageProps {
    categories: PaginatedCategories;
    filters: {
        search?: string;
        type?: string;
    };
    flash: {
        success?: string;
        error?: string;
    };
}

export default function CategoriesIndex() {
    const { categories, filters, flash } = usePage<any>().props as PageProps;
    
    // Search & filter states
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [filterType, setFilterType] = useState<string>(filters.type || 'all');
    
    // Modal states
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    // Form hooks
    const {
        data: addData,
        setData: setAddData,
        post: postAdd,
        processing: addProcessing,
        errors: addErrors,
        reset: resetAdd,
    } = useForm({
        name: '',
        type: 'makanan' as 'makanan' | 'minuman',
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
        type: 'makanan' as 'makanan' | 'minuman',
    });

    // Handle toast notification from flash session
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    // Handle filtering & searching
    const handleSearchAndFilter = (searchVal = searchTerm, typeVal = filterType) => {
        router.get(
            '/admin/categories',
            {
                search: searchVal || undefined,
                type: typeVal !== 'all' ? typeVal : undefined,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    // Trigger filter update on select change
    const handleTypeFilterChange = (val: string) => {
        setFilterType(val);
        handleSearchAndFilter(searchTerm, val);
    };

    // Trigger search on submit
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearchAndFilter(searchTerm, filterType);
    };

    // Reset search
    const handleResetSearch = () => {
        setSearchTerm('');
        handleSearchAndFilter('', filterType);
    };

    // Open add modal
    const handleOpenAdd = () => {
        resetAdd();
        setIsAddOpen(true);
    };

    // Submit add category
    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postAdd('/admin/categories', {
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

    // Open edit modal
    const handleOpenEdit = (category: Category) => {
        setSelectedCategory(category);
        setEditData({
            name: category.name,
            type: category.type,
        });
        setIsEditOpen(true);
    };

    // Submit edit category
    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCategory) return;
        
        putEdit(`/admin/categories/${selectedCategory.id}`, {
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

    // Open delete modal
    const handleOpenDelete = (category: Category) => {
        setSelectedCategory(category);
        setIsDeleteOpen(true);
    };

    // Submit delete category
    const handleDeleteSubmit = () => {
        if (!selectedCategory) return;

        router.delete(`/admin/categories/${selectedCategory.id}`, {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setSelectedCategory(null);
            },
            onError: (errs) => {
                setIsDeleteOpen(false);
                // Menampilkan validation error seperti ON DELETE RESTRICT
                if (errs.error) {
                    toast.error(errs.error);
                } else {
                    toast.error('Gagal menghapus kategori.');
                }
            }
        });
    };

    return (
        <>
            <Head title="Manajemen Kategori" />

            <div className="flex flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Kategori Menu</h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Kelola kategori makanan dan minuman untuk katalog menu kafe Anda.
                        </p>
                    </div>
                    <Button 
                        onClick={handleOpenAdd}
                        className="bg-neutral-950 hover:bg-neutral-800 text-neutral-50 dark:bg-neutral-50 dark:hover:bg-neutral-200 dark:text-neutral-950 shadow-sm transition-colors flex items-center gap-2"
                    >
                        <Plus className="size-4" />
                        Tambah Kategori
                    </Button>
                </div>

                {/* Search & Filter Bar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between bg-white dark:bg-neutral-900/50 p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
                    <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md w-full">
                        <Input
                            placeholder="Cari kategori..."
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

                    <div className="flex items-center gap-3">
                        <Label className="text-neutral-500 text-xs font-medium uppercase tracking-wider hidden md:block">Filter Tipe:</Label>
                        <Select value={filterType} onValueChange={handleTypeFilterChange}>
                            <SelectTrigger className="w-[140px] h-9 dark:bg-neutral-950/40">
                                <SelectValue placeholder="Semua Tipe" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Tipe</SelectItem>
                                <SelectItem value="makanan">Makanan</SelectItem>
                                <SelectItem value="minuman">Minuman</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white dark:bg-neutral-900/50 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs overflow-hidden">
                    {categories.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4">
                            <div className="size-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500 mb-4">
                                <Folder className="size-6" />
                            </div>
                            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">Kategori Kosong</h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center mt-1 max-w-xs">
                                Tidak ada kategori yang ditemukan. Silakan tambahkan kategori baru atau ubah filter Anda.
                            </p>
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader className="bg-neutral-50/50 dark:bg-neutral-900/30">
                                    <TableRow>
                                        <TableHead className="w-[80px]">No</TableHead>
                                        <TableHead>Nama Kategori</TableHead>
                                        <TableHead>Tipe</TableHead>
                                        <TableHead className="text-right w-[150px]">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categories.data.map((category, idx) => (
                                        <TableRow key={category.id} className="hover:bg-neutral-50/30 dark:hover:bg-neutral-900/10">
                                            <TableCell className="font-medium text-neutral-500">
                                                {(categories.current_page - 1) * categories.total + idx + 1}
                                            </TableCell>
                                            <TableCell className="font-semibold text-neutral-800 dark:text-neutral-200">
                                                {category.name}
                                            </TableCell>
                                            <TableCell>
                                                {category.type === 'makanan' ? (
                                                    <Badge variant="outline" className="bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/30 font-medium px-2 py-0.5 rounded-full flex items-center gap-1.5 w-fit">
                                                        <Utensils className="size-3" />
                                                        Makanan
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="bg-sky-50 dark:bg-sky-950/20 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-900/30 font-medium px-2 py-0.5 rounded-full flex items-center gap-1.5 w-fit">
                                                        <Coffee className="size-3" />
                                                        Minuman
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleOpenEdit(category)}
                                                        className="size-8 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                                    >
                                                        <Edit2 className="size-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleOpenDelete(category)}
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

                            {/* Pagination Controls */}
                            {categories.last_page > 1 && (
                                <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/30 dark:bg-neutral-900/20">
                                    <div className="text-xs text-neutral-500">
                                        Menampilkan <span className="font-medium">{(categories.current_page - 1) * categories.total + 1}</span> sampai <span className="font-medium">{Math.min(categories.current_page * categories.total, categories.total)}</span> dari <span className="font-medium">{categories.total}</span> hasil
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {categories.links.map((link, i) => (
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

            {/* Dialog Tambah Kategori */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Tambah Kategori</DialogTitle>
                        <DialogDescription className="text-xs text-neutral-500">
                            Masukkan detail kategori menu baru yang ingin ditambahkan.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddSubmit} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="add-name">Nama Kategori</Label>
                            <Input
                                id="add-name"
                                value={addData.name}
                                onChange={(e) => setAddData('name', e.target.value)}
                                placeholder="e.g. Espresso, Mocktail, Pasta"
                                className={addErrors.name ? 'border-red-500' : ''}
                            />
                            {addErrors.name && (
                                <p className="text-xs text-red-500 mt-1">{addErrors.name}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="add-type">Tipe</Label>
                            <Select
                                value={addData.type}
                                onValueChange={(val: 'makanan' | 'minuman') => setAddData('type', val)}
                            >
                                <SelectTrigger id="add-type">
                                    <SelectValue placeholder="Pilih tipe" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="makanan">Makanan</SelectItem>
                                    <SelectItem value="minuman">Minuman</SelectItem>
                                </SelectContent>
                            </Select>
                            {addErrors.type && (
                                <p className="text-xs text-red-500 mt-1">{addErrors.type}</p>
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
                                    'Simpan Kategori'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Dialog Edit Kategori */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Edit Kategori</DialogTitle>
                        <DialogDescription className="text-xs text-neutral-500">
                            Ubah detail kategori menu terpilih.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="edit-name">Nama Kategori</Label>
                            <Input
                                id="edit-name"
                                value={editData.name}
                                onChange={(e) => setEditData('name', e.target.value)}
                                placeholder="e.g. Espresso, Mocktail, Pasta"
                                className={editErrors.name ? 'border-red-500' : ''}
                            />
                            {editErrors.name && (
                                <p className="text-xs text-red-500 mt-1">{editErrors.name}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="edit-type">Tipe</Label>
                            <Select
                                value={editData.type}
                                onValueChange={(val: 'makanan' | 'minuman') => setEditData('type', val)}
                            >
                                <SelectTrigger id="edit-type">
                                    <SelectValue placeholder="Pilih tipe" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="makanan">Makanan</SelectItem>
                                    <SelectItem value="minuman">Minuman</SelectItem>
                                </SelectContent>
                            </Select>
                            {editErrors.type && (
                                <p className="text-xs text-red-500 mt-1">{editErrors.type}</p>
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
                                        Menyimpan...
                                    </>
                                ) : (
                                    'Perbarui Kategori'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Dialog Konfirmasi Hapus Kategori */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-red-600 dark:text-red-400">Hapus Kategori</DialogTitle>
                        <DialogDescription className="text-sm mt-2 text-neutral-600 dark:text-neutral-400">
                            Apakah Anda yakin ingin menghapus kategori <span className="font-semibold text-neutral-950 dark:text-neutral-50">"{selectedCategory?.name}"</span>?
                            <span className="block mt-2 font-medium text-amber-600 dark:text-amber-400 text-xs">
                                Peringatan: Tindakan ini tidak dapat dibatalkan dan kategori tidak dapat dihapus jika masih ada menu yang terhubung.
                            </span>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="pt-4 gap-2 sm:gap-0 border-t border-neutral-100 dark:border-neutral-800">
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
                            Ya, Hapus Kategori
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

CategoriesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Kategori',
            href: '/admin/categories',
        },
    ],
};

