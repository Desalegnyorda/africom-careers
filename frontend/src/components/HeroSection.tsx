import { FC } from "react";



const HeroSection: FC = () => {

  return (

    <header className="relative h-[400px] w-full overflow-hidden">



      {/* Background Image */}

      <div

        className="absolute inset-0 bg-cover bg-center"

        style={{

          backgroundImage: "url('/careerbg.svg')",

        }}

      />



      {/* Dark Gradient Overlay */}

      <div className="absolute inset-0 bg-gradient-to-r from-black/100 via-black/80 to-black/30" />



      {/* Hero Content */}

      <div className="relative z-10 h-full flex items-start pt-36">

        <div className="max-w-[1400px] mx-auto w-full pl-20 pr-8 md:pl-28 lg:pl-36">



          <div className="flex justify-between items-start">

            <span className="text-xs tracking-[4px] text-blue-400 font-semibold block -mt-16">

              <span className="inline-block w-12 h-px bg-blue-400 mr-2 align-middle"></span>OPEN POSITIONS

            </span>

          </div>



          <div className="-mt-4">

            <h1 className="text-6xl font-extrabold text-white">

              Join Our team<span className="text-blue-400">.</span>

            </h1>



            <p className="mt-4 text-blue-200 text-lg max-w-xl leading-relaxed pl-8">

              Build your career with us.<br />

              Discover opportunities that match your<br />

              skills and passion.

            </p>

          </div>



        </div>

      </div>

    </header>

  );

};



export default HeroSection;