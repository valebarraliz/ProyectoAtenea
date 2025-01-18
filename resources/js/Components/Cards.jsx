import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function Cards({ data, isDeletable, onDelete, onClick }) {
    return (
        <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0 gap-4">
            {data.map((callout) => (
                <div key={callout.id}>
                    {isDeletable && (
                        <span
                            className="text-sm text-red-400 uppercase py-2 px-3 bg-white absolute z-50 rounded-sm shadow hover:text-red-500 active:text-red-600 cursor-pointer"
                            onClick={() => onDelete(callout)}
                        >
                            <FontAwesomeIcon icon="fa-solid fa-trash" />
                        </span>
                    )}
                    <div
                        className="group relative rounded-md p-2 border divide-y shadow focus:outline outline-blue-200 cursor-pointer"
                        tabIndex="-1"
                        onClick={() => onClick(callout)}
                    >
                        <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white sm:h-64 pb-2 group-hover:opacity-75">
                            <img
                                alt={callout.imageAlt}
                                src={`/storage/${callout.image}`}
                                className="h-full w-full object-scale-down object-center"
                            />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 p-2 text-center">
                            <a href={callout.href}>
                                <span className="absolute inset-0" />
                                {callout.name}
                            </a>
                        </h3>
                        <p className="text-sm text-gray-500 p-2">
                            {callout.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
