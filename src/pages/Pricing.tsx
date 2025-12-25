import { Button } from "@/components/ui/button";
import { Footer } from "@/components/ui/footer";
import { Check } from "lucide-react";
export function Pricing(){
    const plans = [
        {
            title: "The Warrior",
            description: "Perfect for building the initial habit of deep work.",
            price: "Rp.0",
            period: "/Month",
            features:[
                "Standard Pomodoro Timer",
                "Basic Task Management",
                "7 Days History Retention"
            ],
            buttonText: "Start for Free",
            isPro: false,
        },

        {
            title: "The Achiever",
            description: "Unlock the full power of TensorFlow AI and historical analytics.",
            price: "Rp.15k",
            period: "/Month",
            features:[
                "Standard Pomodoro Timer",
                "Basic Task Management",
                "7 Days History Retention",
                "AI Duration Prediction",
                "Weekly Productivity Audit"
            ],
            buttonText: "Upgrade to Pro",
            isPro: true,
        }
    ]
    return(
        <>
             <div className="min-h-screen bg-white flex flex-col">
            {/* Container Utama */}
            <div className="grow w-full max-w-7xl mx-auto px-4 py-20">
                
                {/* Header Section */}
                <div className="text-center max-w-5xl mx-auto mb-16">
                <h1 className="font-bold text-4xl md:text-5xl text-gray-900 mb-6">
                    Invest in Your Most Valuable Asset.
                </h1>
                <p className="font-medium text-lg md:text-xl text-gray-500 leading-relaxed">
                    Transparent pricing. No hidden fees. Cancel anytime. Start reclaiming your hours today.
                </p>
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {plans.map((plan, index) => (
                    <div 
                    key={index} 
                    className="bg-gray-50 rounded-2xl p-8 md:p-10 flex flex-col items-center text-center h-full border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                    >
                    {/* Card Header */}
                    <h3 className="font-bold text-2xl text-gray-900 mb-2">{plan.title}</h3>
                    <p className="text-gray-600 text-sm mb-8 min-h-10">
                        {plan.description}
                    </p>

                    {/* Price */}
                    <div className="flex items-baseline justify-center mb-8">
                        <span className="text-4xl md:text-5xl font-bold text-gray-900">
                        {plan.price}
                        </span>
                        <span className="text-xl text-gray-500 font-medium ml-1">
                        {plan.period}
                        </span>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-4 mb-10 w-full text-left">
                        {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                            {/* Icon Centang dalam lingkaran kecil atau polos */}
                            <div className="shrink-0">
                            <Check className="w-5 h-5 text-black" strokeWidth={2} /> 
                            </div>
                            <span className="text-gray-700 font-medium text-sm md:text-base">
                            {feature}
                            </span>
                        </li>
                        ))}
                    </ul>

                    {/* Button (Spacer 'mt-auto' memaksa tombol selalu di bawah) */}
                    <div className="mt-auto w-full">
                        <Button 
                        className="w-full py-6 text-base font-semibold bg-[#1a1b26] hover:bg-black text-white rounded-lg shadow-md transition-all"
                        >
                        {plan.buttonText}
                        </Button>
                    </div>
                    </div>
                ))}
                </div>
                
            </div>

            {/* Footer */}
            <Footer />
            </div>
        </>
    );
}