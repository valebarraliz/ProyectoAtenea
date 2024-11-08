export default function Cards({ data, isClickable, onClick }) {
    return (
        <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0 gap-4">
            {data.map((callout) => (
                <div
                    key={callout.id}
                    className={`group relative rounded-md p-2 border divide-y shadow shadow-sm ${
                        isClickable
                            ? "focus:outline outline-blue-200 cursor-pointer"
                            : ""
                    }`}
                    tabIndex="-1"
                    onClick={() => onClick(callout.id)}
                >
                    <div
                        className={`relative h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 ${
                            isClickable ? "group-hover:opacity-75" : ""
                        } sm:h-64 pb-2`}
                    >
                        <img
                            alt={callout.imageAlt}
                            src={`/storage/${callout.image}`}
                            className="h-full w-full object-contains object-center"
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
            ))}
        </div>
    );
}
