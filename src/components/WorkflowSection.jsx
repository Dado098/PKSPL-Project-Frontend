import React from 'react';
import { ArrowRight } from 'lucide-react';

const WorkflowSection = () => {
  return (
    <section id="workflow" className="bg-gradient-to-br from-blue-600 to-blue-800 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white text-center">
            Panduan Alur Pengisian Form Valuasi
          </h2>
          <p className="text-blue-100 text-lg text-center max-w-2xl mx-auto mt-4">
            Ikuti langkah-langkah berikut untuk mengisi form valuasi ekosistem pesisir dan laut secara lengkap dan akurat.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
          {/* Left Column: Images */}
          <div className="grid grid-cols-2 gap-4">
            <img 
              src="/images/coral-reef.jpg" 
              alt="Terumbu Karang" 
              className="col-span-2 rounded-xl h-48 object-cover w-full border-2 border-white/20" 
            />
            <img 
              src="/images/seagrass-meadow.jpg" 
              alt="Padang Lamun" 
              className="rounded-xl h-40 object-cover w-full border-2 border-white/20" 
            />
            <img 
              src="/images/tropical-island.jpg" 
              alt="Pulau Tropis" 
              className="rounded-xl h-40 object-cover w-full border-2 border-white/20" 
            />
          </div>

          {/* Right Column: Steps */}
          <div className="space-y-6">
            <div className="flex flex-row gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 text-white font-bold flex items-center justify-center flex-shrink-0 border border-white/30">
                1
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Pilih Jenis Ekosistem</h3>
                <p className="text-blue-100 text-sm mt-1">
                  Pilih jenis ekosistem yang akan dianalisis: Mangrove, Terumbu Karang, atau Padang Lamun.
                </p>
              </div>
            </div>

            <div className="flex flex-row gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 text-white font-bold flex items-center justify-center flex-shrink-0 border border-white/30">
                2
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Pilih Komponen Nilai</h3>
                <p className="text-blue-100 text-sm mt-1">
                  Tentukan komponen Use Value dan manfaat langsung maupun tidak langsung yang relevan.
                </p>
              </div>
            </div>

            <div className="flex flex-row gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 text-white font-bold flex items-center justify-center flex-shrink-0 border border-white/30">
                3
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Masukkan Data Parameter</h3>
                <p className="text-blue-100 text-sm mt-1">
                  Input data parameter kuantitatif dan kalkulasi sesuai panduan pengisian form.
                </p>
              </div>
            </div>

            <div className="flex flex-row gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 text-white font-bold flex items-center justify-center flex-shrink-0 border border-white/30">
                4
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Kalkulasi Otomatis TEV</h3>
                <p className="text-blue-100 text-sm mt-1">
                  Sistem menghitung otomatis nilai Total Economic Value berdasarkan data yang dimasukkan.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <button className="bg-white text-blue-700 hover:bg-blue-50 px-10 py-3 rounded-full font-semibold text-lg transition-all hover:shadow-lg inline-flex items-center gap-2">
            Lanjut
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
