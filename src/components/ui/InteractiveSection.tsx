/** A section that holds an interactive tool. The `interactive` class hides it in print. */
export default function InteractiveSection({
  id,
  title,
  lede,
  children,
}: {
  id: string;
  title: string;
  lede?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="interactive" aria-labelledby={id + "-title"}>
      <h2 id={id + "-title"}>{title}</h2>
      {lede && <p>{lede}</p>}
      {children}
    </section>
  );
}
