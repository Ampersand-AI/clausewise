
import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface ContractAnimationPreviewProps {
  isGenerating: boolean;
}

const ContractAnimationPreview: React.FC<ContractAnimationPreviewProps> = ({ isGenerating }) => {
  const [dots, setDots] = useState('.');
  const [paragraphs, setParagraphs] = useState<number[]>([]);
  const [visibleParagraphs, setVisibleParagraphs] = useState<number[]>([]);
  const [fillProgress, setFillProgress] = useState(0);

  useEffect(() => {
    if (isGenerating) {
      // Start with 10 placeholder paragraphs
      setParagraphs(Array.from({ length: 10 }, (_, i) => i));
      setVisibleParagraphs([]);
      setFillProgress(0);
      
      // Show dots animation
      const dotsInterval = setInterval(() => {
        setDots(prev => prev.length < 3 ? prev + '.' : '.');
      }, 500);
      
      // Reveal paragraphs one by one
      const paragraphInterval = setInterval(() => {
        setVisibleParagraphs(prev => {
          if (prev.length < paragraphs.length) {
            return [...prev, prev.length];
          }
          return prev;
        });
      }, 600);
      
      // Fill progress animation
      const fillInterval = setInterval(() => {
        setFillProgress(prev => {
          if (prev < 100) {
            return prev + 1;
          }
          return prev;
        });
      }, 120);
      
      return () => {
        clearInterval(dotsInterval);
        clearInterval(paragraphInterval);
        clearInterval(fillInterval);
      };
    }
  }, [isGenerating, paragraphs.length]);

  if (!isGenerating) {
    return null;
  }

  return (
    <div className="w-full flex flex-col items-center justify-center p-6 bg-white dark:bg-bento-brown-800 rounded-lg border border-bento-orange-200 dark:border-bento-brown-700 overflow-hidden shadow-lg h-[500px] mx-auto relative">
      {/* Gradient background with animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-purple-50 to-white opacity-70 rounded-lg"></div>
      <div 
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-200 via-purple-100 to-transparent rounded-lg transition-all duration-100"
        style={{ height: `${fillProgress}%`, opacity: 0.4 }}
      ></div>
      
      {/* Glow effects */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-300 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-300 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
      
      <div className="mb-6 flex items-center justify-center z-10">
        <Sparkles className="w-8 h-8 text-purple-500 mr-3 animate-pulse" />
        <h3 className="text-2xl font-semibold text-purple-700 glow-purple">
          Generating Contract{dots}
        </h3>
      </div>
      
      <div className="w-full max-w-2xl space-y-4 relative z-10">
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent dark:from-bento-brown-800 dark:to-transparent"></div>
        
        <div className="h-[340px] overflow-y-auto pr-2 overflow-x-hidden">
          {visibleParagraphs.map((p) => (
            <div 
              key={p} 
              className="animate-fade-in text-left mb-4"
            >
              <div className="h-4 bg-gradient-to-r from-purple-300 to-pink-200 rounded w-32 mb-2 animate-pulse"></div>
              <div className="space-y-2">
                {Array.from({ length: 3 + Math.floor(Math.random() * 3) }, (_, i) => (
                  <div 
                    key={i} 
                    className="h-3 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-bento-brown-700 dark:to-bento-brown-600 rounded" 
                    style={{ 
                      width: `${70 + Math.random() * 30}%`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent"></div>
      </div>
      
      <div className="mt-6 text-sm text-purple-500 dark:text-purple-300 animate-pulse z-10">
        Crafting detailed legal language, formatting clauses, and organizing document...
      </div>
      
      {/* Progress bar */}
      <div className="w-full max-w-md mt-8 z-10">
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-100"
            style={{ width: `${fillProgress}%` }}
          ></div>
        </div>
        <div className="text-xs text-purple-600 text-right mt-1">{fillProgress}%</div>
      </div>
    </div>
  );
};

export default ContractAnimationPreview;
