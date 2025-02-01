import { Head, Link } from "@inertiajs/react";
import BarsChart from "@/Components/BarsChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ApplicationLogo from "@/Components/ApplicationLogo";

function NavigationLinks({ role }) {
    const authLinks = [{ name: "Dashboard", route: "dashboard" }];

    const commonLinks = [
        { name: "Login", route: "login" },
        { name: "Register", route: "register" },
    ];

    const links = role ? authLinks : commonLinks;

    return links.map((link) => (
        <Link
            key={link.route}
            href={route(link.route)}
            className="hover:text-black/70 hover:font-bold"
        >
            {link.name}
        </Link>
    ));
}

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
    voteList,
}) {

    return (
        <>
            <Head title="Welcome" />
            <div className="bg-gray-100">
                <header className="flex justify-end items-center p-4 shadow bg-white">
                    <div className="flex justify-center">
                        <ApplicationLogo className="h-16"/>
                    </div>
                    <nav className="flex justify-center w-1/2">
                        <div className="flex justify-end w-1/2 gap-2">
                                <NavigationLinks role={auth.user} />
                        </div>
                    </nav>
                </header>
                <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg pb-6 pt-2 flex justify-center items-center">
                        <div className="flex items-center gap-6 lg:flex-col">
                            <div className="flex items-center">
                                <div className="flex bg-gray-100 shadow rounded-full items-center p-2">
                                    <FontAwesomeIcon
                                        icon="fa-solid fa-ranking-star"
                                        className="text-black/60 text-2xl p-2"
                                    />
                                    <h2 className="uppercase font-black p-2 text-black/60">
                                        Ranking de votaciones
                                    </h2>
                                </div>
                            </div>
                            <BarsChart data={voteList} />
                        </div>
                    </div>
                </div>
                <footer className="py-16 text-center text-sm">
                    Laravel v{laravelVersion} (PHP v{phpVersion})
                </footer>
            </div>
        </>
    );
}
