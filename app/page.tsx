import { getAllPosts } from "@/lib/notion";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Services from "@/components/Services";
import BlogSection from "@/components/BlogSection";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

export const revalidate = 5;

export default async function HomePage() {
  const posts = await getAllPosts();

  return (
    <>
      <Header />
      <main>
        <Hero />
        <ScrollReveal><About /></ScrollReveal>
        <ScrollReveal><BlogSection posts={posts} /></ScrollReveal>
        <ScrollReveal><Skills /></ScrollReveal>
        <ScrollReveal><Services /></ScrollReveal>
        <ScrollReveal><Contact /></ScrollReveal>
      </main>
      <Footer />
    </>
  );
}
