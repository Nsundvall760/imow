import React from 'react';
import { Cpu, Monitor, HardDrive, MemoryStick, Zap, Gamepad2 } from 'lucide-react';

const PCSpecs = () => {
  const gamingPC = {
    title: "GAMING PC",
    icon: Gamepad2,
    specs: [
      { label: "CPU", value: "AMD Ryzen 9 9950X - 16 Core 4.30GHz, 5.70GHz Turbo", icon: Cpu },
      { label: "Motherboard", value: "MSI MAG B650 TOMAHAWK", icon: MemoryStick },
      { label: "Memory (RAM)", value: "32GB (2x16GB) DDR5/5200mhz Corsair Vengeance", icon: MemoryStick },
      { label: "Graphics Card (GPU)", value: "MSI GeForce RTX™ 4090 - 24GB GDDR6X", icon: Monitor },
      { label: "PSU", value: "Corsair RM850e 850W 80+ Gold", icon: Zap },
      { label: "Primary Storage", value: "2TB Kingston NV3", icon: HardDrive },
      { label: "Monitor", value: "LG 27GS95QE 27-inch Ultragear OLED Gaming Monitor QHD 240Hz", icon: Monitor }
    ]
  };

  const streamingPC = {
    title: "STREAMING PC",
    icon: Monitor,
    specs: [
      { label: "CPU", value: "Overclocked Intel® Core™ i9-10920X 12 Core", icon: Cpu },
      { label: "Motherboard", value: "ASUS® ROG STRIX X299-E GAMING II", icon: MemoryStick },
      { label: "Graphics Card", value: "RTX 4070 8gb", icon: Monitor },
      { label: "Memory (RAM)", value: "32GB Corsair VENGEANCE RGB PRO DDR4 3600MHz", icon: MemoryStick },
      { label: "PSU", value: "CORSAIR 850W RMx SERIES™ MODULAR 80 PLUS® GOLD", icon: Zap },
      { label: "Primary Storage", value: "1TB CORSAIR MP400", icon: HardDrive }
    ]
  };

  return (
    <section id="pc-specs" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-gaming font-bold mb-6">
            <span className="glow-text">PC SPECS</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Professional-grade hardware for competitive gaming and high-quality streaming
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Gaming PC */}
          <div className="card-glow p-10 md:p-16 bg-card-bg/80 backdrop-blur-md rounded-2xl shadow-lg">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-neon-blue/20 rounded-full flex items-center justify-center mr-4">
                <gamingPC.icon size={32} className="text-neon-blue" />
              </div>
              <h3 className="text-3xl font-gaming text-neon-blue">{gamingPC.title}</h3>
            </div>
            
            <div className="space-y-6">
              {gamingPC.specs.map((spec, index) => (
                <div key={index} className="flex items-start space-x-4 group hover:scale-105 transition-transform duration-300">
                  <div className="p-3 rounded-lg bg-gray-800/50 group-hover:bg-gray-700/50 transition-colors duration-300">
                    <spec.icon size={24} className="text-neon-blue" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-gaming font-bold text-white mb-1">
                      {spec.label}
                    </h4>
                    <p className="text-gray-300 leading-relaxed">
                      {spec.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Streaming PC */}
          <div className="card-glow p-10 md:p-16 bg-card-bg/80 backdrop-blur-md rounded-2xl shadow-lg">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-neon-purple/20 rounded-full flex items-center justify-center mr-4">
                <streamingPC.icon size={32} className="text-neon-purple" />
              </div>
              <h3 className="text-3xl font-gaming text-neon-purple">{streamingPC.title}</h3>
            </div>
            
            <div className="space-y-6">
              {streamingPC.specs.map((spec, index) => (
                <div key={index} className="flex items-start space-x-4 group hover:scale-105 transition-transform duration-300">
                  <div className="p-3 rounded-lg bg-gray-800/50 group-hover:bg-gray-700/50 transition-colors duration-300">
                    <spec.icon size={24} className="text-neon-purple" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-gaming font-bold text-white mb-1">
                      {spec.label}
                    </h4>
                    <p className="text-gray-300 leading-relaxed">
                      {spec.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PCSpecs; 