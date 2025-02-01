export default function PrimaryButton({
    className = '',
    color = 'bg-gray-800 active:bg-gray-900 hover:bg-gray-700 focus:bg-gray-700',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-md border border-transparent px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    disabled && "opacity-25"
                } ${color } ` +
                className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
