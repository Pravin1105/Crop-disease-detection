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
      "bg-[var(--green)] text-white hover:bg-[var(--green-dark)] focus-visible:outline-[var(--green)]",
    subtle:
      "border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] hover:border-[var(--green)] focus-visible:outline-[var(--green)]",
    danger:
      "bg-[var(--danger)] text-white hover:opacity-90 focus-visible:outline-[var(--danger)]"
  };

  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${variants[variant]} ${className}`}
      type="button"
      {...props}
    >
      {Icon && iconPosition === "left" ? (
        <Icon aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
      ) : null}
      <span>{children}</span>
      {Icon && iconPosition === "right" ? (
        <Icon aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
      ) : null}
    </button>
  );
}
