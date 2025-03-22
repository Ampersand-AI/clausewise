
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "IP Attorney",
    content: "LawBit's investment platform allowed me to diversify my portfolio with legal tech startups I believe in. The returns have exceeded my expectations.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Michael Chen",
    title: "Legal Operations Director",
    content: "As someone who works in legal operations, I appreciate the curated selection of startups that are genuinely solving problems in the industry.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "David Rodriguez",
    title: "Corporate Lawyer",
    content: "The transparency and detailed analysis provided for each investment opportunity make decision-making much easier. My portfolio has grown 14% in just 9 months.",
    rating: 4,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Emily Williams",
    title: "Legal Tech Entrepreneur",
    content: "As a founder myself, I appreciate how LawBit connects legal startups with investors who understand the industry. I've found great opportunities here.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=100&auto=format&fit=crop",
  },
];

export const InvestTestimonials = () => {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-bento-yellow-50/50 dark:bg-bento-brown-800/50 rounded-3xl my-16 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-bento-yellow-300/10 dark:bg-bento-yellow-300/5 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-bento-orange-300/10 dark:bg-bento-orange-300/5 rounded-full filter blur-3xl"></div>
      
      <div className="relative z-10">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-5 h-5 fill-bento-yellow-500 text-bento-yellow-500" />
            ))}
          </div>
          <h2 className="text-3xl font-bold text-bento-gray-900 dark:text-white mb-4">What Our Investors Say</h2>
          <p className="text-bento-gray-600 dark:text-bento-gray-300 max-w-2xl mx-auto">
            Hear from legal professionals who have invested through LawBit
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </div>
  );
};

interface TestimonialCardProps {
  testimonial: typeof testimonials[0];
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  return (
    <Card className="bg-white/80 dark:bg-bento-brown-700/80 backdrop-blur-sm hover-scale transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${
                i < testimonial.rating 
                  ? "fill-bento-yellow-500 text-bento-yellow-500" 
                  : "text-bento-gray-300"
              }`} 
            />
          ))}
        </div>
        
        <p className="text-bento-gray-700 dark:text-bento-gray-300 mb-6">
          "{testimonial.content}"
        </p>
        
        <div className="flex items-center">
          <div className="rounded-full overflow-hidden w-10 h-10 mr-3">
            <img 
              src={testimonial.avatar} 
              alt={testimonial.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-medium text-bento-gray-900 dark:text-white">
              {testimonial.name}
            </p>
            <p className="text-sm text-bento-gray-500 dark:text-bento-gray-400">
              {testimonial.title}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
