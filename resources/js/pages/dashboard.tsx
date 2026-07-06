import { Head, usePage } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { 
    DollarSign, 
    ShoppingBag, 
    Users, 
    Calendar, 
    Clock, 
    Utensils, 
    ChevronRight, 
    Coffee, 
    TrendingUp 
} from 'lucide-react';

export default function Dashboard() {
    const { auth } = usePage().props as any;
    const adminName = auth?.user?.name || 'Admin';

    // Formatting currency helper
    const formatIDR = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Mock data for dashboard visualizations
    const stats = [
        {
            title: 'Pendapatan Hari Ini',
            value: formatIDR(2450000),
            change: '+14% dari kemarin',
            icon: DollarSign,
            color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        },
        {
            title: 'Pesanan Meja Aktif',
            value: '18',
            change: '4 sedang dimasak',
            icon: Utensils,
            color: 'bg-cafe-primary/10 text-cafe-primary border-cafe-primary/25',
        },
        {
            title: 'Reservasi Hari Ini',
            value: '5 Grup',
            change: '3 terbayar DP 50%',
            icon: Calendar,
            color: 'bg-amber-50 text-amber-600 border-amber-100',
        },
        {
            title: 'Pengunjung Aktif',
            value: '42 Orang',
            change: 'Kapasitas meja 65%',
            icon: Users,
            color: 'bg-blue-50 text-blue-600 border-blue-100',
        },
    ];

    const activeOrders = [
        { id: 1, table: 'Meja 08', items: '2 Espresso, 1 Croissant', time: '5 mnt lalu', status: 'dimasak', statusText: 'Sedang Dimasak', statusColor: 'bg-amber-100 text-amber-800' },
        { id: 2, table: 'Meja 04', items: '1 Americano, 1 Nasi Goreng', time: '12 mnt lalu', status: 'menunggu', statusText: 'Antrean Dapur', statusColor: 'bg-neutral-100 text-neutral-800 border border-neutral-200' },
        { id: 3, table: 'Meja 12', items: '1 Caramel Latte, 1 French Fries', time: '18 mnt lalu', status: 'disajikan', statusText: 'Disajikan', statusColor: 'bg-emerald-100 text-emerald-800' },
        { id: 4, table: 'Meja 02', items: '2 Cappuccino, 2 Cheese Cake', time: '25 mnt lalu', status: 'pembayaran', statusText: 'Perlu Pembayaran', statusColor: 'bg-cafe-primary/20 text-cafe-primary font-bold' },
    ];

    const upcomingReservations = [
        { id: 1, name: 'Siska (Gathering Kantor)', package: 'Full Book Area', date: 'Hari ini, 19:00', pax: '45 Pax', dpStatus: 'DP Paid (50%)' },
        { id: 2, name: 'Budi (Ulang Tahun)', package: 'Half Book Area', date: 'Besok, 16:00', pax: '20 Pax', dpStatus: 'DP Paid (50%)' },
        { id: 3, name: 'Rian (Arisan)', package: 'Standard Reservation', date: '6 Jul, 14:00', pax: '10 Pax', dpStatus: 'Pending DP' },
    ];

    return (
        <>
            <Head title="Dashboard Admin" />
            
            <div className="flex flex-1 flex-col gap-6 p-6 overflow-y-auto max-w-7xl mx-auto w-full rounded-2xl">
                {/* Welcome Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-cafe-secondary text-white p-8 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="z-10 max-w-lg">
                        <span className="bg-cafe-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider font-poppins">
                            Cafe Control Center
                        </span>
                        <h1 className="font-chewy text-3xl md:text-4xl mt-3 text-white">
                            Selamat Datang, {adminName}!
                        </h1>
                        <p className="font-poppins text-sm text-white/80 mt-2 leading-relaxed">
                            Panel kendali operasional Nugas Cafe Solution. Pantau pesanan QR meja, kelola reservasi, dan analisis penjualan harian Anda secara real-time.
                        </p>
                    </div>
                    <div className="hidden lg:flex shrink-0 z-10 bg-white/10 p-5 rounded-2xl backdrop-blur-sm border border-white/10">
                        <Coffee className="size-16 text-cafe-primary animate-bounce" />
                    </div>
                    {/* Decorative abstract elements */}
                    <div className="absolute -bottom-8 -right-8 w-64 h-64 rounded-full bg-cafe-primary/10 blur-2xl" />
                    <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-cafe-primary/20 blur-3xl" />
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, i) => (
                        <div 
                            key={i} 
                            className="bg-white rounded-2xl p-5 border border-cafe-secondary/5 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 flex items-center justify-between"
                        >
                            <div className="space-y-1">
                                <p className="text-xs text-cafe-secondary/60 font-medium font-poppins">{stat.title}</p>
                                <p className="text-2xl font-chewy text-cafe-secondary">{stat.value}</p>
                                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-poppins font-medium">
                                    {stat.change}
                                </span>
                            </div>
                            <div className={`p-3.5 rounded-2xl border ${stat.color}`}>
                                <stat.icon className="size-6" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Dashboard Layout Detail */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left 2 Columns: QR Table Orders */}
                    <div className="bg-white rounded-3xl p-6 border border-cafe-secondary/5 shadow-sm lg:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="font-chewy text-xl text-cafe-secondary flex items-center gap-2">
                                    <Utensils className="size-5 text-cafe-primary" />
                                    Antrean Pesanan QR Meja
                                </h2>
                                <p className="text-xs text-cafe-secondary/60 font-poppins mt-1">Daftar pesanan aktif pelanggan dari scan QR Code di meja</p>
                            </div>
                            <span className="text-xs font-bold text-cafe-primary bg-cafe-primary/10 px-3 py-1 rounded-full font-poppins">
                                Live Monitor
                            </span>
                        </div>

                        <div className="flex flex-col gap-4">
                            {activeOrders.map((order) => (
                                <div 
                                    key={order.id}
                                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-2xl border border-cafe-secondary/5 bg-muted/30 hover:bg-muted/60 transition-colors gap-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="bg-cafe-secondary text-white size-10 rounded-xl flex items-center justify-center font-chewy text-lg shrink-0">
                                            {order.table.split(' ')[1]}
                                        </div>
                                        <div>
                                            <p className="font-poppins font-bold text-sm text-cafe-secondary">{order.table}</p>
                                            <p className="font-poppins text-xs text-cafe-secondary/80 mt-0.5 line-clamp-1">{order.items}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                                        <div className="flex items-center gap-1 text-[11px] text-cafe-secondary/50 font-poppins">
                                            <Clock className="size-3" />
                                            {order.time}
                                        </div>
                                        <span className={`text-xs px-3 py-1 rounded-full font-poppins font-semibold shadow-xs ${order.statusColor}`}>
                                            {order.statusText}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Upcoming Reservations */}
                    <div className="bg-white rounded-3xl p-6 border border-cafe-secondary/5 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="font-chewy text-xl text-cafe-secondary flex items-center gap-2">
                                        <Calendar className="size-5 text-cafe-primary" />
                                        Reservasi Acara Terdekat
                                    </h2>
                                    <p className="text-xs text-cafe-secondary/60 font-poppins mt-1">Daftar booking paket grup hari ini & besok</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                {upcomingReservations.map((res) => (
                                    <div 
                                        key={res.id}
                                        className="p-4 rounded-2xl border border-cafe-secondary/5 bg-muted/30 space-y-3"
                                    >
                                        <div className="flex justify-between items-start gap-2">
                                            <div>
                                                <p className="font-poppins font-bold text-sm text-cafe-secondary leading-tight">{res.name}</p>
                                                <p className="font-poppins text-xs text-cafe-primary font-medium mt-0.5">{res.package}</p>
                                            </div>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-poppins font-bold ${
                                                res.dpStatus.includes('Paid') 
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                            }`}>
                                                {res.dpStatus}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs text-cafe-secondary/60 font-poppins border-t border-cafe-secondary/5 pt-2">
                                            <span className="flex items-center gap-1">
                                                <Clock className="size-3" />
                                                {res.date}
                                            </span>
                                            <span className="font-semibold text-cafe-secondary">
                                                {res.pax}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 border-t border-cafe-secondary/5 pt-4">
                            <a 
                                href="/admin/reservations" 
                                className="flex items-center justify-center gap-1.5 w-full bg-muted hover:bg-muted/80 text-cafe-secondary hover:text-cafe-primary font-poppins font-bold text-xs py-3 rounded-2xl transition-colors border border-cafe-secondary/10"
                            >
                                Kelola Seluruh Reservasi
                                <ChevronRight className="size-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};

