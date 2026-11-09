import { Hero } from "@/components/sections/hero";
import { PromoVideoShowcase } from "@/components/sections/promo-video-showcase";
import { CategoriesSection } from "@/components/sections/categories-section";
import { ProductsSection } from "@/components/sections/products-section";
import { DollarExchangeSection } from "@/components/sections/dollar-exchange";
import { FlashSalesSection } from "@/components/sections/flash-sales";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { TrustSection } from "@/components/sections/trust-section";
import { FAQSection } from "@/components/sections/faq-section";
import { Footer } from "@/components/sections/footer";
import { GamingTopupSection } from "@/components/sections/products-section";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <PromoVideoShowcase />
      <CategoriesSection />
      <ProductsSection title="Trending Products" />
      <GamingTopupSection />
      <DollarExchangeSection />
      <FlashSalesSection />
      <ReviewsSection />
      <TrustSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
