export default function Button({
  children,
  className = "",
  icon: Icon,
  iconPosition = "left",
  variant = "primary",
  ...props
}) {
  const variants = {
    primary:
      "bg-brand text-white shadow-soft hover:bg-blue-600 focus-visible:outline-blue-500",
    subtle:
      "border border-border bg-white text-blue-700 hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-blue-500"
  };

  return (
    <button
      className={`inline-flex min-h-12 items-center justify-center gap-3 rounded-lg px-5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${variants[variant]} ${className}`}
      type="button"
      {...props}
    >
      {Icon && iconPosition === "left" ? (
        <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.9} />
      ) : null}
      <span>{children}</span>
      {Icon && iconPosition === "right" ? (
        <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.9} />
      ) : null}
    </button>
  );
}
