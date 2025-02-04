import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

function NavigationLinks({ role }) {
    const commonLinks = [
        { name: 'Inicio', route: 'dashboard' },
    ];

    const adminLinks = [
        { name: 'Usuarios', route: 'users' },
        { name: 'Base De Datos', route: 'database' },
    ];

    const links = role === 1
        ? [...commonLinks, ...adminLinks]
        : commonLinks;

    return links.map((link) => (
        <NavLink
            key={link.route}
            href={route(link.route)}
            active={route().current(link.route)}
        >
            {link.name}
        </NavLink>
    ));
}

function DropdownMenu({ user }) {
    return (
        <Dropdown>
            <Dropdown.Trigger>
                <button
                    type="button"
                    className="inline-flex items-center rounded-md border bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                    {user.name}
                    <svg
                        className="ml-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </Dropdown.Trigger>
            <Dropdown.Content>
                <Dropdown.Link href={route('profile.edit')}>Perfil</Dropdown.Link>
                <Dropdown.Link href={route('logout')} method="post" as="button">
                    Cerrar sesión
                </Dropdown.Link>
            </Dropdown.Content>
        </Dropdown>
    );
}

function MobileNavigation({ showing, toggle, user, role }) {
    return (
        <div className={showing ? 'block' : 'hidden'}>
            <div className="space-y-1 pb-3 pt-2">
                <NavigationLinks role={role} />
            </div>
            <div className="border-t border-gray-200 pb-1 pt-4">
                <div className="px-4">
                    <div className="text-base font-medium text-gray-800">{user.name}</div>
                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                </div>
                <div className="mt-3 space-y-1">
                    <ResponsiveNavLink href={route('profile.edit')}>
                        Profile
                    </ResponsiveNavLink>
                    <ResponsiveNavLink href={route('logout')} method="post" as="button">
                        Log Out
                    </ResponsiveNavLink>
                </div>
            </div>
        </div>
    );
}

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const { user } = auth;

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        {/* Left Side */}
                        <div className="flex">
                            <Link href="/" className="flex shrink-0 items-center">
                                <ApplicationLogo className="h-14 w-auto text-gray-800" />
                            </Link>
                            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                                <NavigationLinks role={user.role_id} />
                            </div>
                        </div>

                        {/* Right Side */}
                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <DropdownMenu user={user} />
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((prev) => !prev)}
                                className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                            >
                                <svg
                                    className="h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <MobileNavigation
                    showing={showingNavigationDropdown}
                    toggle={setShowingNavigationDropdown}
                    user={user}
                    role={user.role}
                />
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
