import { Head, Link } from "@inertiajs/react";
import { useEffect, useState, useMemo } from "react";
import BarsChart from "@/Components/BarsChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ApplicationLogo from "@/Components/ApplicationLogo";
import WinningParty from "@/Components/WinningParty";

function NavigationLinks({ role }) {
    const authLinks = [{ name: "Inicio", route: "dashboard" }];

    const commonLinks = [{ name: "Iniciar Sesión", route: "login" }];

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
    winningParty: data,
}) {
    const [winningParty, setWinningParty] = useState(data);

    useEffect(() => {
        const channel = Echo.channel("party-channel");

        channel.listen("PartyCast", (event) => {
            setWinningParty(event.winningParty); // Asegúrate de acceder a la propiedad correcta
        });

        return () => {
            channel.stopListening("PartyCast");
        };
    }, [winningParty]);

    return (
        <>
            <Head title="Bienvenido" />
            <div className="bg-gray-100">
                <header className="grid grid-cols-3 p-4 shadow bg-white sm:px-6 lg:px-8">
                    <div className="col-start-2 flex items-center justify-center">
                        <ApplicationLogo className="h-16" />
                    </div>
                    <nav className="col-start-3 flex items-center justify-center">
                        <NavigationLinks role={auth.user} />
                    </nav>
                </header>
                <div className="py-6 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg p-6 flex flex-col items-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex bg-gray-100 shadow rounded-full items-center p-2">
                                <FontAwesomeIcon
                                    icon="fa-solid fa-ranking-star"
                                    className="text-black/60 text-xl md:text-2xl p-2"
                                />
                                <h2 className="uppercase font-black text-black/60 text-sm md:text-lg">
                                    Ranking de votaciones
                                </h2>
                            </div>
                            <div className="w-full max-w-2xl">
                                {winningParty ? (
                                    <WinningParty data={winningParty} />
                                ) : (
                                    <BarsChart data={voteList} />
                                )}
                            </div>
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
