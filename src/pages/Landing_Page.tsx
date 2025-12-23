import HeroSection from "@/components/section/hero";
import HowItWorks from "@/components/section/how_it_works";
import Features from "@/components/section/features";

export function LandingPage (){
    return(
        <main className="min-h-screen w-full bg-white">
            <HeroSection/>
            <HowItWorks/>
            <Features/>
        </main>
    );
}