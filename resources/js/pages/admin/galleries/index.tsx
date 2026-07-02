import { useState, useEffect } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { Plus, Search, Edit2, Trash2, Image as ImageIcon, Folder, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

interface GalleryItem {
    id: number;
    name: string;
    image: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedGalleries {
    data: GalleryItem[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: PaginationLink[];
    total: number;
    per_page: number;
}

interface PageProps {
    galleries: PaginatedGalleries;
    filters: {
        search?: string;
    };
    flash: {
        success?: string;
        error?: string;
    };
}

export default function GalleriesIndex() {
    const { galleries, filters, flash } = usePage<any>().props as PageProps;

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedGallery, setSelectedGallery] = useState<GalleryItem | null>(null);

    const {
        data: addData,
        setData: setAddData,
        post: postAdd,
        processing: addProcessing,
        errors: addErrors,
        reset: resetAdd,
    } = useForm({
        name: '',
        image: null as File | null,
    });

    const [editData, setEditData] = useState({
        name: '',
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
        router.get(
            '/admin/galleries',
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
        postAdd('/admin/galleries', {
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

    const handleOpenEdit = (gallery: GalleryItem) => {
        setSelectedGallery(gallery);
        setEditData({
            name: gallery.name,
            image: null,
        });
        setEditErrors({});
        setIsEditOpen(true);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedGallery) return;

        setEditProcessing(true);
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('name', editData.name);
        if (editData.image) {
            formData.append('image', editData.image);
        } else {
            // Note: API requires image. If no image is provided, let's keep it empty and the backend will trigger a validation error
        }

        router.post(`/admin/galleries/${selectedGallery.id}`, formData as any, {
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

    const handleOpenDelete = (gallery: GalleryItem) => {
        setSelectedGallery(gallery);
        setIsDeleteOpen(true);
    };

    const handleDeleteSubmit = () => {
        if (!selectedGallery) return;

        router.delete(`/admin/galleries/${selectedGallery.id}`, {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setSelectedGallery(null);
            },
            onError: (errs) => {
                setIsDeleteOpen(false);
                if (errs.error) {
                    toast.error(errs.error);
                } else {
                    toast.error('Gagal menghapus gambar.');
                }
            }
        });
    };

    return (
        <>
            <Head title="Manajemen Galeri" />

            <div className="flex flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Galeri Foto</h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Kelola koleksi foto suasana dan fasilitas kafe Anda.
                        </p>
                    </div>
                    <Button 
                        onClick={handleOpenAdd}
                        className="bg-cafe-primary hover:bg-cafe-primary/90 text-white shadow-sm transition-colors flex items-center gap-2"
                    >
                        <Plus className="size-4" />
                        Tambah Foto
                    </Button>
                </div>

                {/* Search Bar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between bg-white dark:bg-neutral-900/50 p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
                    <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md w-full">
                        <Input
                            placeholder="Cari judul foto..."
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
                    {galleries.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4">
                            <div className="size-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500 mb-4">
                                <Folder className="size-6" />
                            </div>
                            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">Galeri Kosong</h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center mt-1 max-w-xs">
                                Tidak ada foto yang ditemukan. Silakan unggah foto baru.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-neutral-50/50 dark:bg-neutral-900/30">
                                        <TableRow>
                                            <TableHead className="w-[80px]">No</TableHead>
                                            <TableHead className="w-[200px]">Preview Gambar</TableHead>
                                            <TableHead>Nama Judul</TableHead>
                                            <TableHead className="text-right w-[150px]">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {galleries.data.map((item, idx) => (
                                            <TableRow key={item.id} className="hover:bg-neutral-50/30 dark:hover:bg-neutral-900/10">
                                                <TableCell className="font-medium text-neutral-500">
                                                    {(galleries.current_page - 1) * galleries.per_page + idx + 1}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="w-32 h-20 rounded-lg bg-neutral-100 dark:bg-neutral-800 overflow-hidden flex items-center justify-center border border-neutral-200 dark:border-neutral-700 shadow-xs">
                                                        {item.image ? (
                                                            <img 
                                                                src={`/storage/${item.image}`} 
                                                                alt={item.name}
                                                                className="size-full object-cover"
                                                            />
                                                        ) : (
                                                            <ImageIcon className="size-6 text-neutral-400" />
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-semibold text-neutral-800 dark:text-neutral-200">
                                                    {item.name}
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
                            {galleries.last_page > 1 && (
                                <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/30 dark:bg-neutral-900/20">
                                    <div className="text-xs text-neutral-500">
                                        Menampilkan <span className="font-medium">{(galleries.current_page - 1) * galleries.per_page + 1}</span> sampai <span className="font-medium">{Math.min(galleries.current_page * galleries.per_page, galleries.total)}</span> dari <span className="font-medium">{galleries.total}</span> hasil
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {galleries.links.map((link, i) => (
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

            {/* Dialog Tambah Foto */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Tambah Foto</DialogTitle>
                        <DialogDescription className="text-xs text-neutral-500">
                            Pilih dan unggah foto baru untuk ditampilkan di galeri visual kafe Anda.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddSubmit} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="add-name">Judul / Nama Foto</Label>
                            <Input
                                id="add-name"
                                value={addData.name}
                                onChange={(e) => setAddData('name', e.target.value)}
                                placeholder="e.g. Suasana Indoor Lantai 2, Area Outdoor Coffee Bar"
                                className={addErrors.name ? 'border-red-500' : ''}
                            />
                            {addErrors.name && (
                                <p className="text-xs text-red-500 mt-1">{addErrors.name}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="add-image">Pilih Gambar</Label>
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
                                        Mengunggah...
                                    </>
                                ) : (
                                    'Simpan Foto'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Dialog Edit Foto */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Edit Foto</DialogTitle>
                        <DialogDescription className="text-xs text-neutral-500">
                            Perbarui judul dan unggah gambar pengganti untuk data terpilih.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="edit-name">Judul / Nama Foto</Label>
                            <Input
                                id="edit-name"
                                value={editData.name}
                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                placeholder="e.g. Suasana Indoor Lantai 2, Area Outdoor Coffee Bar"
                                className={editErrors.name ? 'border-red-500' : ''}
                            />
                            {editErrors.name && (
                                <p className="text-xs text-red-500 mt-1">{editErrors.name}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="edit-image">Unggah Gambar Baru (Wajib)</Label>
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

            {/* Dialog Hapus Foto */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Hapus Foto</DialogTitle>
                        <DialogDescription className="text-xs text-neutral-500">
                            Tindakan ini tidak bisa dibatalkan. Apakah Anda yakin ingin menghapus gambar ini dari galeri?
                        </DialogDescription>
                    </DialogHeader>
                    {selectedGallery && (
                        <div className="py-3 px-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-100 dark:border-neutral-800 flex items-center gap-3">
                            <div className="w-16 h-12 rounded bg-white dark:bg-neutral-950 flex items-center justify-center border overflow-hidden">
                                {selectedGallery.image && (
                                    <img src={`/storage/${selectedGallery.image}`} alt={selectedGallery.name} className="size-full object-cover" />
                                )}
                            </div>
                            <span className="font-semibold text-neutral-800 dark:text-neutral-200 text-sm">{selectedGallery.name}</span>
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
                            Ya, Hapus Foto
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

GalleriesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Galeri',
            href: '/admin/galleries',
        },
    ],
};
