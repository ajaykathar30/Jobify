import React from "react";
import { Badge } from "./ui/badge";
import { CheckCircle2Icon } from "lucide-react";

const testimonials = [
  {
    name: "Genil Sharma",
    rating: 4.8,
    text: "Got multiple interview calls within a week. The platform is super easy to use and filters really help in finding the right job.",
    img: "https://i.pravatar.cc/100?img=36",
  },
  {
    name: "Shranay Malhotra",
    rating: 4.7,
    text: "I was struggling to find a job after college, but this app made the process so smooth. The support team also guided me whenever I was stuck.",
    img: "https://i.pravatar.cc/100?img=15",
  },
  {
    name: "Harshit Kumar",
    rating: 4.6,
    text: "Very helpful for freshers. The jobs are genuine and the application process is straightforward. I got hired faster than expected!",
    img: "https://i.pravatar.cc/100?img=58",
  },
  {
    name: "Neha Singh",
    rating: 4.8,
    text: "The interface is clean and simple. I loved how quickly I could connect with recruiters and schedule interviews.",
    img: "https://i.pravatar.cc/100?img=12",
  },
  {
    name: "Rohit Sharma",
    rating: 4.5,
    text: "I was able to find a job near my location with the exact salary range I wanted. Highly recommend this platform to everyone.",
    img: "https://i.pravatar.cc/100?img=68",
  },
  {
    name: "Sanya Kaur",
    rating: 4.9,
    text: "This app is a blessing for job seekers. The UI is fantastic and the job recommendations were very accurate for my profile.",
    img: "https://i.pravatar.cc/100?img=21",
  },
  {
    name: "Aditya Raj",
    rating: 4.7,
    text: "What impressed me most was the transparency. You can track your application status and directly chat with recruiters. Amazing feature!",
    img: "https://i.pravatar.cc/100?img=40",
  },
  {
    name: "Muskan Yadav",
    rating: 4.8,
    text: "I found my first internship from here. The whole process was stress-free and quick. Great platform for students!",
    img: "https://i.pravatar.cc/100?img=33",
  },
];

const Testimonials = () => {
  return (
    <div className="bg-blue-100 py-14 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 items-center">

        {/* LEFT CARD */}
        <div className="bg-blue-900 text-white p-8 rounded-2xl shadow-lg flex flex-col justify-between">
          <div>
            <div className="text-blue-300 text-5xl md:text-6xl mb-4">❝</div>

            <h2 className="text-2xl md:text-3xl font-bold mb-5 leading-snug">
              Join the community of <br /> 
              5 crore satisfied job seekers…
            </h2>
          </div>

          <div>
            <p className="text-blue-300 font-medium text-sm md:text-base">
              Play Store Ratings
            </p>
            <div className="text-yellow-400 text-xl md:text-2xl">★★★★☆</div>
          </div>
        </div>

        {/* TESTIMONIAL SLIDER */}
        <div className="md:col-span-2 overflow-x-auto scrollbar-hide flex  snap-x snap-mandatory pb-2">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="min-w-[260px] sm:min-w-[300px] md:min-w-[350px] lg:min-w-[380px]
                         bg-white shadow-md mx-2 rounded-xl p-6 mt-3 snap-center border-l-4 border-blue-600"
            >
              <div className="flex items-center gap-4">
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-14 h-14 rounded-full object-cover"
                />

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-blue-900">
                      {t.name}
                    </h3>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <CheckCircle2Icon size={16}  /> Placed
                    </Badge>
                  </div>

                  <p className="text-yellow-500 text-sm font-medium">★ {t.rating}</p>
                </div>
              </div>

              <p className="text-blue-800 mt-4 text-sm md:text-base leading-relaxed">
                {t.text}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Testimonials;
