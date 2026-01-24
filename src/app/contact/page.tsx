import ContactHero from "./components/contact-hero";
import FAQ from "./components/contact-faq";
import Header from "../components/header";
import Footer from "../components/footer";
import Image from "next/image";
import ContactForm from "./components/contact-form";

export default function ContactPage() {
  return (
    <>
      <Header />
      <ContactHero />
      <div className="hidden w-full py-10 md:flex bg-black">
        <svg
          width="100%"
          height="3"
          viewBox="0 0 1270 3"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            y1="1.97125"
            x2="1270"
            y2="1.97125"
            stroke="url(#paint0_linear_1541_128)"
            strokeOpacity="0.24"
            strokeWidth="2.05751"
          ></line>
          <line
            x1="131.233"
            y1="1.97125"
            x2="512.233"
            y2="1.97125"
            stroke="url(#paint1_linear_1541_128)"
            strokeOpacity="0.68"
            strokeWidth="2.05751"
          ></line>
          <defs>
            <linearGradient
              id="paint0_linear_1541_128"
              x1="0"
              y1="3.5"
              x2="1270"
              y2="3.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#F9FF38" stopOpacity="0"></stop>
              <stop offset="0.178272" stopColor="#F9FF38"></stop>
              <stop offset="1" stopColor="#F9FF38" stopOpacity="0"></stop>
            </linearGradient>
            <linearGradient
              id="paint1_linear_1541_128"
              x1="131.233"
              y1="3.5"
              x2="512.233"
              y2="3.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#F9FF38" stopOpacity="0"></stop>
              <stop offset="0.178272" stopColor="#F9FF38"></stop>
              <stop offset="1" stopColor="#F9FF38" stopOpacity="0"></stop>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <section className=" bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12">
            <ContactForm />
            <div className="div ">
              <Image
                src="/assets/img/tokenomic.png"
                alt="contact-info"
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      <FAQ />
      <Footer />
    </>
  );
}
