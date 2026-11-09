"use client";

export function TrustSection() {
  const partners = [
    { name: "bKash", color: "from-blue-500 to-blue-600" },
    { name: "Nagad", color: "from-green-500 to-green-600" },
    { name: "Rocket", color: "from-red-500 to-red-600" },
    { name: "SSLCOMMERZ", color: "from-indigo-500 to-indigo-600" },
    { name: "Visa", color: "from-blue-500 to-purple-600" },
    { name: "Mastercard", color: "from-red-500 to-yellow-500" },
  ];

  return (
    <section className="py-16 bg-white dark:bg-slate-950 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground mb-8 uppercase tracking-widest font-medium">
          Trusted payment partners
        </p>
        <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {partners.map((p) => (
            <div key={p.name} className="flex items-center justify-center h-12 w-32 rounded-xl bg-gradient-to-br p-2 text-white font-bold text-sm shadow-lg" style={{ background: `linear-gradient(135deg, ${p.color})` }}>
              {p.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
