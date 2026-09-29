import { JsonLd } from "./json-ld";

export type FaqItem = { question: string; answer: string };

export function FaqSection({ items }: { items: FaqItem[] }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }}
      />
      <section
        aria-labelledby="page-faq-title"
        className="text-content page-faq"
      >
        <h2 id="page-faq-title">Frequently asked questions</h2>
        {items.map((item) => (
          <section className="calculator-faq" key={item.question}>
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </section>
        ))}
      </section>
    </>
  );
}
