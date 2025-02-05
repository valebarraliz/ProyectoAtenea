export default function Cards({
    data,
    onClick,
    selectedId,
    showSelection = false,
}) {
    return (
        <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0 gap-4">
            {data.map((callout) => (
                <div
                    key={callout.id}
                    className={`${callout.discarded && "bg-gray-100"}`}
                >
                    <div
                        className={`group relative rounded-md p-2 border divide-y shadow ${
                            callout.discarded && "opacity-70 outline-gray-300"
                        } ${
                            selectedId === callout.id && "outline"
                        } ${
                            showSelection && "focus:outline active:outline"
                        } outline-blue-200 cursor-pointer`}
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
