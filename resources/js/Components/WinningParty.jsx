
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";

export default function WinningParty({ data }) {
     // Elimina winningParty de las dependencias

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 text-center max-w-md mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-gray-700 uppercase">
                Partido Ganador
            </h2>
            <div className="mt-4 flex flex-col items-center">
                <FontAwesomeIcon
                    icon={faTrophy}
                    className="text-yellow-500 text-4xl md:text-5xl"
                />
                <p className="text-lg md:text-xl font-bold text-gray-800 mt-2">
                    {data.name} 🏆
                </p>
                <p className="text-sm md:text-base text-gray-600">
                    {data.votes_count} votos
                </p>
            </div>
        </div>
    );
}
