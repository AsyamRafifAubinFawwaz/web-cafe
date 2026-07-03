import { useState, useEffect } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { Plus, Search, Edit2, Trash2, Percent, Tag, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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

import type { Menu, Promo, PaginatedCollection } from '@/types';

interface PageProps {
    promos: PaginatedCollection<Promo>;
    menus: Menu[];
    filters: {
        search?: string;
    };
    flash: {
        success?: string;
        error?: string;
    };
}

export default function PromosIndex() {
    const { promos, menus, filters, flash } = usePage<any>().props as PageProps;

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedPromo, setSelectedPromo] = useState<Promo | null>(null);

    const {
        data: addData,
        setData: setAddData,
        post: postAdd,
        processing: addProcessing,
        errors: addErrors,
        reset: resetAdd,
    } = useForm({
        title: '',
        menu_id: '',
        discount_type: 'percentage' as 'percentage' | 'nominal',
        discount_value: '',
        promo_price: '',
        is_active: true,
        image: null as File | null,
    });

    const [editData, setEditData] = useState({
        title: '',
        menu_id: 0,
        discount_type: 'percentage' as 'percentage' | 'nominal',
        discount_value: 0,
        promo_price: 0,
        is_active: true,
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

    // Auto-calculate add promo price
    useEffect(() => {
        const menu = menus.find((m) => String(m.id) === addData.menu_id);
        if (menu && addData.discount_value !== '') {
            const originalPrice = menu.price;
            const val = Number(addData.discount_value);
            let calculated = originalPrice;
            if (addData.discount_type === 'percentage') {
                calculated = originalPrice - (originalPrice * val) / 100;
            } else {
                calculated = originalPrice - val;
            }
            setAddData('promo_price', String(Math.max(0, Math.round(calculated))));
        }
    }, [addData.menu_id, addData.discount_type, addData.discount_value]);

    // Auto-calculate edit promo price
    const calculateEditPromoPrice = (menuId: number, type: 'percentage' | 'nominal', value: number) => {
        const menu = menus.find((m) => m.id === menuId);
        if (menu) {
            const originalPrice = menu.price;
            let calculated = originalPrice;
            if (type === 'percentage') {
                calculated = originalPrice - (originalPrice * value) / 100;
            } else {
                calculated = originalPrice - value;
            }
            return Math.max(0, Math.round(calculated));
        }
        return 0;
    };

    const handleSearchAndFilter = (searchVal = searchTerm) => {
        router.get(
            '/admin/promos',
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
        postAdd('/admin/promos', {
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

    const handleOpenEdit = (promo: Promo) => {
        setSelectedPromo(promo);
        setEditData({
            title: promo.title,
            menu_id: promo.menu_id,
            discount_type: promo.discount_type,
            discount_value: promo.discount_value,
            promo_price: promo.promo_price,
            is_active: promo.is_active,
            image: null,
        });
        setEditErrors({});
        setIsEditOpen(true);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPromo) return;

        setEditProcessing(true);
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('title', editData.title);
        formData.append('menu_id', String(editData.menu_id));
        formData.append('discount_type', editData.discount_type);
        formData.append('discount_value', String(editData.discount_value));
        formData.append('promo_price', String(editData.promo_price));
        formData.append('is_active', editData.is_active ? '1' : '0');
        if (editData.image) {
            formData.append('image', editData.image);
        }

        router.post(`/admin/promos/${selectedPromo.id}`, formData as any, {
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

    const handleToggleActive = (promo: Promo) => {
        router.put(`/admin/promos/${promo.id}`, {
            is_active: !promo.is_active,
        }, {
            preserveScroll: true,
            onSuccess: () => toast.success(`Promo berhasil ${!promo.is_active ? 'diaktifkan' : 'dinonaktifkan'}`),
        });
    };

    const handleOpenDelete = (promo: Promo) => {
        setSelectedPromo(promo);
        setIsDeleteOpen(true);
    };

    const handleDeleteSubmit = () => {
        if (!selectedPromo) return;

        router.delete(`/admin/promos/${selectedPromo.id}`, {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setSelectedPromo(null);
            },
            onError: (errs) => {
                setIsDeleteOpen(false);
                if (errs.error) {
                    toast.error(errs.error);
                } else {
                    toast.error('Gagal menghapus promo.');
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
            <Head title="Manajemen Promo" />

            <div className="flex flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Katalog Promo</h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Kelola poster promosi, diskon menu, dan harga diskon promo aktif.
                        </p>
                    </div>
                    <Button 
                        onClick={handleOpenAdd}
                        className="bg-cafe-primary hover:bg-cafe-primary/90 text-white shadow-sm transition-colors flex items-center gap-2"
                    >
                        <Plus className="size-4" />
                        Tambah Promo
                    </Button>
                </div>

                {/* Search Bar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between bg-white dark:bg-neutral-900/50 p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
                    <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md w-full">
                        <Input
                            placeholder="Cari judul promo..."
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
                    {promos.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4">
                            <div className="size-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500 mb-4">
                                <Percent className="size-6" />
                            </div>
                            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">Promo Kosong</h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center mt-1 max-w-xs">
                                Tidak ada promo yang ditemukan. Silakan tambahkan promo baru.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-neutral-50/50 dark:bg-neutral-900/30">
                                        <TableRow>
                                            <TableHead className="w-[80px]">No</TableHead>
                                            <TableHead className="w-[120px]">Poster</TableHead>
                                            <TableHead>Judul Promo</TableHead>
                                            <TableHead>Menu</TableHead>
                                            <TableHead>Potongan</TableHead>
                                            <TableHead>Harga Promo</TableHead>
                                            <TableHead className="w-[100px] text-center">Status</TableHead>
                                            <TableHead className="text-right w-[150px]">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {promos.data.map((promo, idx) => (
                                            <TableRow key={promo.id} className="hover:bg-neutral-50/30 dark:hover:bg-neutral-900/10">
                                                <TableCell className="font-medium text-neutral-500">
                                                    {(promos.current_page - 1) * promos.per_page + idx + 1}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="w-20 h-28 rounded-lg bg-neutral-100 dark:bg-neutral-800 overflow-hidden flex items-center justify-center border border-neutral-200 dark:border-neutral-700 shadow-xs">
                                                        {promo.image ? (
                                                            <img 
                                                                src={`/storage/${promo.image}`} 
                                                                alt={promo.title}
                                                                className="size-full object-cover"
                                                            />
                                                        ) : (
                                                            <ImageIcon className="size-5 text-neutral-400" />
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-semibold text-neutral-800 dark:text-neutral-200">
                                                    {promo.title}
                                                </TableCell>
                                                <TableCell>
                                                    {promo.menu ? (
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="font-medium text-neutral-700 dark:text-neutral-300">{promo.menu.name}</span>
                                                            <span className="text-xs text-neutral-500">{formatRupiah(promo.menu.price)}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-neutral-400">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/30 font-medium px-2 py-0.5 rounded-full flex items-center gap-1.5 w-fit">
                                                        <Tag className="size-3" />
                                                        {promo.discount_type === 'percentage' 
                                                            ? `${promo.discount_value}%` 
                                                            : formatRupiah(promo.discount_value)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-bold text-neutral-900 dark:text-neutral-100">
                                                    {formatRupiah(promo.promo_price)}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex justify-center">
                                                        <Switch 
                                                            checked={promo.is_active}
                                                            onCheckedChange={() => handleToggleActive(promo)}
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleOpenEdit(promo)}
                                                            className="size-8 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                                        >
                                                            <Edit2 className="size-3.5" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleOpenDelete(promo)}
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
                            {promos.last_page > 1 && (
                                <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/30 dark:bg-neutral-900/20">
                                    <div className="text-xs text-neutral-500">
                                        Menampilkan <span className="font-medium">{(promos.current_page - 1) * promos.per_page + 1}</span> sampai <span className="font-medium">{Math.min(promos.current_page * promos.per_page, promos.total)}</span> dari <span className="font-medium">{promos.total}</span> hasil
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {promos.links.map((link, i) => (
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

            {/* Dialog Tambah Promo */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Tambah Promo</DialogTitle>
                        <DialogDescription className="text-xs text-neutral-500">
                            Masukkan poster promo dan tautkan ke menu tertentu untuk mengaktifkan potongan harga diskon.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddSubmit} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="add-title">Judul Promo</Label>
                            <Input
                                id="add-title"
                                value={addData.title}
                                onChange={(e) => setAddData('title', e.target.value)}
                                placeholder="e.g. Promo Hemat Gajian Americano, Diskon Spesial Coffee"
                                className={addErrors.title ? 'border-red-500' : ''}
                            />
                            {addErrors.title && (
                                <p className="text-xs text-red-500 mt-1">{addErrors.title}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="add-menu">Pilih Menu Promosi</Label>
                            <Select
                                value={addData.menu_id}
                                onValueChange={(val) => setAddData('menu_id', val)}
                            >
                                <SelectTrigger id="add-menu" className={addErrors.menu_id ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Pilih Menu" />
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
                                <Label htmlFor="add-type">Tipe Diskon</Label>
                                <Select
                                    value={addData.discount_type}
                                    onValueChange={(val: 'percentage' | 'nominal') => setAddData('discount_type', val)}
                                >
                                    <SelectTrigger id="add-type">
                                        <SelectValue placeholder="Pilih Tipe" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="percentage">Persentase (%)</SelectItem>
                                        <SelectItem value="nominal">Nominal Rupiah (Rp)</SelectItem>
                                    </SelectContent>
                                </Select>
                                {addErrors.discount_type && (
                                    <p className="text-xs text-red-500 mt-1">{addErrors.discount_type}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="add-value">Nilai Diskon</Label>
                                <Input
                                    id="add-value"
                                    type="number"
                                    value={addData.discount_value}
                                    onChange={(e) => setAddData('discount_value', e.target.value)}
                                    placeholder={addData.discount_type === 'percentage' ? '20' : '5000'}
                                    className={addErrors.discount_value ? 'border-red-500' : ''}
                                />
                                {addErrors.discount_value && (
                                    <p className="text-xs text-red-500 mt-1">{addErrors.discount_value}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 items-end">
                            <div className="space-y-1.5">
                                <Label htmlFor="add-price">Harga Final Promo (Rp)</Label>
                                <Input
                                    id="add-price"
                                    type="number"
                                    value={addData.promo_price}
                                    onChange={(e) => setAddData('promo_price', e.target.value)}
                                    className="bg-neutral-50 dark:bg-neutral-900/60 font-semibold"
                                    readOnly
                                />
                                {addErrors.promo_price && (
                                    <p className="text-xs text-red-500 mt-1">{addErrors.promo_price}</p>
                                )}
                            </div>

                            <div className="flex items-center space-x-2 pb-2.5">
                                <Switch
                                    id="add-active"
                                    checked={addData.is_active}
                                    onCheckedChange={(checked) => setAddData('is_active', checked)}
                                />
                                <Label htmlFor="add-active" className="cursor-pointer">Status Aktif</Label>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="add-image">Poster Promosi</Label>
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
                                    'Simpan Promo'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Dialog Edit Promo */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Edit Promo</DialogTitle>
                        <DialogDescription className="text-xs text-neutral-500">
                            Perbarui rincian detail promo menu terpilih.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="edit-title">Judul Promo</Label>
                            <Input
                                id="edit-title"
                                value={editData.title}
                                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                placeholder="e.g. Promo Hemat Gajian Americano, Diskon Spesial Coffee"
                                className={editErrors.title ? 'border-red-500' : ''}
                            />
                            {editErrors.title && (
                                <p className="text-xs text-red-500 mt-1">{editErrors.title}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="edit-menu">Pilih Menu Promosi</Label>
                            <Select
                                value={String(editData.menu_id)}
                                onValueChange={(val) => {
                                    const menuId = Number(val);
                                    const computedPrice = calculateEditPromoPrice(menuId, editData.discount_type, editData.discount_value);
                                    setEditData({ ...editData, menu_id: menuId, promo_price: computedPrice });
                                }}
                            >
                                <SelectTrigger id="edit-menu" className={editErrors.menu_id ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Pilih Menu" />
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
                                <Label htmlFor="edit-type">Tipe Diskon</Label>
                                <Select
                                    value={editData.discount_type}
                                    onValueChange={(val: 'percentage' | 'nominal') => {
                                        const computedPrice = calculateEditPromoPrice(editData.menu_id, val, editData.discount_value);
                                        setEditData({ ...editData, discount_type: val, promo_price: computedPrice });
                                    }}
                                >
                                    <SelectTrigger id="edit-type">
                                        <SelectValue placeholder="Pilih Tipe" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="percentage">Persentase (%)</SelectItem>
                                        <SelectItem value="nominal">Nominal Rupiah (Rp)</SelectItem>
                                    </SelectContent>
                                </Select>
                                {editErrors.discount_type && (
                                    <p className="text-xs text-red-500 mt-1">{editErrors.discount_type}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="edit-value">Nilai Diskon</Label>
                                <Input
                                    id="edit-value"
                                    type="number"
                                    value={editData.discount_value}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        const computedPrice = calculateEditPromoPrice(editData.menu_id, editData.discount_type, val);
                                        setEditData({ ...editData, discount_value: val, promo_price: computedPrice });
                                    }}
                                    placeholder={editData.discount_type === 'percentage' ? '20' : '5000'}
                                    className={editErrors.discount_value ? 'border-red-500' : ''}
                                />
                                {editErrors.discount_value && (
                                    <p className="text-xs text-red-500 mt-1">{editErrors.discount_value}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 items-end">
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-price">Harga Final Promo (Rp)</Label>
                                <Input
                                    id="edit-price"
                                    type="number"
                                    value={editData.promo_price}
                                    onChange={(e) => setEditData({ ...editData, promo_price: Number(e.target.value) })}
                                    className="bg-neutral-50 dark:bg-neutral-900/60 font-semibold"
                                    readOnly
                                />
                                {editErrors.promo_price && (
                                    <p className="text-xs text-red-500 mt-1">{editErrors.promo_price}</p>
                                )}
                            </div>

                            <div className="flex items-center space-x-2 pb-2.5">
                                <Switch
                                    id="edit-active"
                                    checked={editData.is_active}
                                    onCheckedChange={(checked) => setEditData({ ...editData, is_active: checked })}
                                />
                                <Label htmlFor="edit-active" className="cursor-pointer">Status Aktif</Label>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="edit-image">Ubah Poster Promo (Opsional)</Label>
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

            {/* Dialog Hapus Promo */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Hapus Promo</DialogTitle>
                        <DialogDescription className="text-xs text-neutral-500">
                            Tindakan ini tidak bisa dibatalkan. Apakah Anda yakin ingin menghapus promo diskon ini?
                        </DialogDescription>
                    </DialogHeader>
                    {selectedPromo && (
                        <div className="py-3 px-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-100 dark:border-neutral-800 flex items-center gap-3">
                            <div className="w-10 h-14 rounded bg-white dark:bg-neutral-950 flex items-center justify-center border overflow-hidden">
                                {selectedPromo.image ? (
                                    <img src={`/storage/${selectedPromo.image}`} alt={selectedPromo.title} className="size-full object-cover" />
                                ) : (
                                    <ImageIcon className="size-4 text-neutral-400" />
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-neutral-800 dark:text-neutral-200 text-sm">{selectedPromo.title}</span>
                                <span className="text-xs text-neutral-500">Final: {formatRupiah(selectedPromo.promo_price)}</span>
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
                            Ya, Hapus Promo
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

PromosIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Promo',
            href: '/admin/promos',
        },
    ],
};
