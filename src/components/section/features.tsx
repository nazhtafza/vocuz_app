export default function Features() {
   
    interface FeatureItem {
      id: string;
      description: string;
      imgSrc: string;
      imgAlt: string;
    }
  
    const features: FeatureItem[] = [
      {
        id: 'focus',
        imgSrc: '/focus.png', 
        imgAlt: 'Focus Timer Interface',
        description: "Forget rigid countdowns. Our timer is designed to trigger a psychological 'start' response, pushing you into deep work instantly while respecting your natural ultradian rhythms."
      },
      {
        id: 'todo',
        imgSrc: '/todo.png',
        imgAlt: 'To-Do List Interface',
        description: "Your day is dynamic, and your schedule should be too. Drag tasks from 'Backlog' to 'Active' effortlessly. Adapt to new priorities without the chaos of rewriting to-do lists.",
      },
      {
        id: 'graf',
        imgSrc: '/graf.png',
        imgAlt: 'Analytics Graph',
        description: "Powered by TensorFlow.js. Vocuz learns your peak hours and fatigue patterns locally on your device. It doesn't just track time; it predicts when you'll be most effective.",
      },
      {
        id: 'note',
        imgSrc: '/note.png',
        imgAlt: 'Note Taking Interface',
        description: "Capture fleeting ideas immediately after a session. Log friction points or breakthroughs while the memory is fresh, turning every work block into a learning opportunity.",
      }
    ];
  
    return (
      <section className="relative w-full py-20 px-4 bg-white overflow-hidden" id="features">
        
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-size-[2rem_2rem] opacity-50"></div>
  
        {/* Header */}
        <div className="relative z-10 max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Features</h1>
          <p className="text-xl text-gray-500 font-medium leading-relaxed">
            No clutter. No bloat. Just the essential tools engineered to induce flow state and sustain high performance.
          </p>
        </div>
  
        {/* Grid content */}
        <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          {features.map((feature) => (
            <article key={feature.id} className="flex flex-col items-center gap-6 group">
              
              {/* Image Container */}
              <div className="w-full aspect-4/3 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 transition-transform duration-300 group-hover:-translate-y-1 bg-gray-50">
                <img
                  src={feature.imgSrc}
                  alt={feature.imgAlt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
  
              {/* Description Text */}
              <p className="text-center text-gray-600 text-sm leading-relaxed max-w-md">
                {feature.description}
              </p>
              
            </article>
          ))}
        </div>
      </section>
    );
  }