import { Link } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid, Image, Percent, Package, CalendarCheck, Users, ShoppingBag, Folder } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';
import categories from '@/routes/categories';
import menus from '@/routes/menus';
import galleries from '@/routes/galleries';
import promos from '@/routes/promos';
import reservationPackages from '@/routes/reservation-packages';
import reservations from '@/routes/reservations';
import reservationMembers from '@/routes/reservation-members';
import reservationItems from '@/routes/reservation-items';

const overviewNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const catalogNavItems: NavItem[] = [
    {
        title: 'Kategori',
        href: categories.index.url(),
        icon: Folder,
        items: [
            {
                title: 'Makanan',
                href: categories.index.url({ query: { type: 'makanan' } }),
            },
            {
                title: 'Minuman',
                href: categories.index.url({ query: { type: 'minuman' } }),
            },
        ],
    },
    {
        title: 'Menu',
        href: menus.index.url(),
        icon: BookOpen,
        items: [
            {
                title: 'Makanan',
                href: menus.index.url({ query: { type: 'makanan' } }),
            },
            {
                title: 'Minuman',
                href: menus.index.url({ query: { type: 'minuman' } }),
            },
        ],
    },
    {
        title: 'Promo',
        href: promos.index.url(),
        icon: Percent,
    },
    {
        title: 'Galeri',
        href: galleries.index.url(),
        icon: Image,
    },
];

const reservationNavItems: NavItem[] = [
    {
        title: 'Paket Reservasi',
        href: reservationPackages.index.url(),
        icon: Package,
    },
    {
        title: 'Reservasi',
        href: reservations.index.url(),
        icon: CalendarCheck,
    },
];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: FolderGit2,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain groupLabel="Overview" items={overviewNavItems} />
                <NavMain groupLabel="Katalog & Menu" items={catalogNavItems} />
                <NavMain groupLabel="Reservasi" items={reservationNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
