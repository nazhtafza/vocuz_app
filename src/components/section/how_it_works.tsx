import { ListTodo, Play, Coffee, TreePalm, ChartArea } from "lucide-react";
import { cn } from "@/lib/utils";
export default function HowItWorks(){
    const steps = [
        {
          title: "Define Your Mission",
          description: "By locking in your priority task upfront, you bypass the paralysis of choice and reserve your mental energy strictly for execution.",
          icon: <ListTodo className="w-6 h-6 text-white" />,
        },
        {
          title: "Ignite Deep Work",
          description: "Trigger your brain's flow state with a dedicated timer that silences external noise and uses AI to track your engagement in real-time.",
          icon: <Play className="w-6 h-6 text-white fill-white" />, // Fill white agar solid
        },
        {
          title: "The Dopamine Reset",
          description: "Step away for a scientifically timed pause to clear working memory and recharge your neurotransmitters before fatigue sets in.",
          icon: <Coffee className="w-6 h-6 text-white" />,
        },
        {
          title: "The Victory Lap",
          description: "Solidify your progress with a restorative break that refuels your cognitive resources, ensuring you finish the day as strong as you started.",
          icon: <TreePalm className="w-6 h-6 text-white" />,
        },
        {
          title: "The Intelligence Audit",
          description: "Leverage AI-driven insights to decode your behavioral patterns, transforming raw data into a precise roadmap for optimizing tomorrow's focus.",
          icon: <ChartArea className="w-6 h-6 text-white" />,
        },
      ];
    return (
        <>
           <section className="relative w-full py-20 overflow-hidden bg-white">

            <div className="text-center items-center">
                <h1 className="font-bold text-4xl text-center items-center">How It Works</h1>
                <p className="font-medium text-xl text-center text-gray-500 items-center mt-4">
                    A scientifically proven cycle to keep your brain fresh and your output high.
                </p>
            </div>

        <div className="container mx-auto px-4 relative z-10 mt-11">
            
        {/* timeline container */}
            <div className="relative flex flex-col items-center">
            
            {/* bikin garis */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-slate-300 transform md:-translate-x-1/2" />

            {/* looping steps */}
            {steps.map((step, index) => {
                const isEven = index % 2 === 0; 

                return (
                <div 
                    key={index} 
                    className={cn(
                    "relative flex items-center justify-between w-full mb-12 last:mb-0",
                    "flex-row md:flex-row" 
                    )}>

                    <div className={cn(
                    "hidden md:block w-5/12 pr-12", 
                    isEven ? "text-right" : "invisible" )}>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-slate-600 leading-relaxe   d font-medium text-sm lg:text-base">
                        {step.description}
                    </p>
                    </div>

                    {/* --- ICON CENTER --- */}
                    <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-[#111625] shadow-lg z-10">
                    {step.icon}
                    </div>

                    <div className={cn(
                    "w-full pl-16 md:w-5/12 md:pl-12", 
                    !isEven ? "text-left hidden md:block" : "md:invisible block" 
                    )}>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-slate-600 leading-relaxed font-medium text-sm lg:text-base">
                        {step.description}
                    </p>
                    </div>

                    {/*mobile only*/}
                    {isEven && (
                        <div className="block md:hidden w-full pl-16">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">{step.title}</h3>
                            <p className="text-slate-600 leading-relaxed font-medium text-sm">
                                {step.description}
                            </p>
                        </div>
                    )}

                </div>
                );
            })}

            </div>
        </div>
     </section>
</>
    );
}