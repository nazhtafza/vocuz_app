import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-start pt-20 pb-12 overflow-hidden bg-white">

      <div className="container mx-auto px-4 flex flex-col items-center text-center z-10 space-y-8">
        
        <Badge 
          variant="secondary" 
          className="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200 shadow-sm">
          {/* <Rocket className="w-4 h-4 mr-2 text-orange-500" /> */}
          🚀 Reclaim Your Focus
        </Badge>

        {/* Headline*/}
        <div className="space-y-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900">
            Your Brain Was Built <br />
            for Deep Work.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The world is noisy. Vocuz is your sanctuary. Combine the rhythm of Pomodoro with AI-driven insights to
            enter a state of flow instantly. Stop juggling apps and start mastering your craft.
          </p>
        </div>

        {/*CTA Button*/}
        <Button 
          size="lg" 
          className="bg-[#1e2330] hover:bg-[#2a3040] text-white rounded-md px-8 h-12 text-base shadow-xl"
        >
          Start Locked In Now <ArrowRight className="ml-2 w-4 h-4" />
        </Button>

        {/* Timer card */}
        <div className="mt-16 w-full max-w-5xl relative">
          
          {/* Card Container */}
          <div className="relative w-full aspect-video md:aspect-2/1 bg-[#111625] rounded-xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col items-center justify-center">
            
            <div 
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #475569 1px, transparent 1px),
                  linear-gradient(to bottom, #475569 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px'
              }}
            />
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#111625]/80 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center space-y-8">
              
              {/* Tabs */}
              <div className="flex items-center gap-6 text-sm font-medium">
                <button className="text-white hover:text-white transition-colors">Start Session</button>
                <button className="text-slate-500 hover:text-slate-300 transition-colors">Short Break</button>
                <button className="text-slate-500 hover:text-slate-300 transition-colors">Long Break</button>
              </div>

              {/* Tampilan timer */}
              <div className="text-8xl md:text-9xl font-bold text-white tracking-wider font-mono">
                25:00
              </div>

              {/* tombol CTA Kartu */}
              <Button 
                variant="secondary"
                className="bg-slate-700/50 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-md px-6 py-6"
                id="/login">
                Hold Your Coffee and Start <ArrowRight className="ml-2 w-4 h-4" />
              </Button>

            </div>
          </div>

          <div className="absolute -inset-4 bg-slate-900/10 blur-xl -z-10 rounded-[2rem]" />
        </div>

      </div>
    </section>
  );
}