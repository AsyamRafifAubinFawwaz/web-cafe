import { Head } from '@inertiajs/react';
import { CheckCircle, Info } from 'lucide-react';

interface PageProps {
    tableOrder: {
        id: number;
        table_number: string;
        status: string;
        total_amount: number;
    };
}

export default function OrderClosed({ tableOrder }: PageProps) {
    const formatIDR = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    return (
        <div className="min-h-screen bg-cafe-bg flex flex-col items-center justify-center p-4">
            <Head title={`Pesanan Ditutup - Meja ${tableOrder.table_number}`} />

            <div className="max-w-md w-full bg-cafe-white p-8 rounded-3xl shadow-xl text-center border border-cafe-secondary/5">
                <div className="size-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <CheckCircle className="size-10" />
                </div>
                
                <h1 className="font-chewy text-4xl text-cafe-secondary mb-2">Terima Kasih!</h1>
                <p className="font-poppins text-cafe-secondary/70 text-sm mb-8 leading-relaxed">
                    Pesanan untuk Meja <span className="font-bold text-cafe-secondary">{tableOrder.table_number}</span> telah selesai dan sudah lunas. Anda tidak dapat menambahkan pesanan baru pada sesi ini.
                </p>

                <div className="bg-cafe-bg rounded-2xl p-4 flex justify-between items-center border border-cafe-secondary/10 mb-6">
                    <div className="text-left">
                        <p className="font-poppins text-xs text-cafe-secondary/60 font-medium">Total Dibayar</p>
                        <p className="font-chewy text-2xl text-cafe-secondary">{formatIDR(tableOrder.total_amount)}</p>
                    </div>
                    <div className="bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200">
                        <span className="font-poppins font-bold text-xs text-emerald-700 uppercase">LUNAS</span>
                    </div>
                </div>

                <div className="flex items-start gap-3 text-left bg-blue-50 text-blue-800 p-4 rounded-xl text-xs font-poppins leading-relaxed">
                    <Info className="size-5 shrink-0 text-blue-600" />
                    <p>Jika Anda masih ingin memesan menu tambahan, silakan hubungi kasir atau pelayan kami untuk membuka sesi meja baru.</p>
                </div>
            </div>
        </div>
    );
}
