
import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface ContractAnimationPreviewProps {
  isGenerating: boolean;
}

const ContractAnimationPreview: React.FC<ContractAnimationPreviewProps> = ({ isGenerating }) => {
  const [dots, setDots] = useState('.');
  const [paragraphs, setParagraphs] = useState<number[]>([]);
  const [visibleParagraphs, setVisibleParagraphs] = useState<number[]>([]);

  useEffect(() => {
    if (isGenerating) {
      // Start with 10 placeholder paragraphs
      setParagraphs(Array.from({ length: 10 }, (_, i) => i));
      setVisibleParagraphs([]);
      
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
      
      return () => {
        clearInterval(dotsInterval);
        clearInterval(paragraphInterval);
      };
    }
  }, [isGenerating, paragraphs.length]);

  if (!isGenerating) {
    return null;
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-white dark:bg-bento-brown-800 rounded-lg border border-bento-orange-200 dark:border-bento-brown-700 overflow-hidden">
      <div className="mb-6 flex items-center justify-center">
        <Sparkles className="w-8 h-8 text-bento-orange-500 mr-3 animate-pulse" />
        <h3 className="text-xl font-semibold text-bento-brown-600 dark:text-bento-orange-400">
          Generating Contract{dots}
        </h3>
      </div>
      
      <div className="w-full max-w-2xl space-y-4 relative">
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent dark:from-bento-brown-800 dark:to-transparent z-10"></div>
        
        <div className="h-[400px] overflow-y-auto pr-2 overflow-x-hidden">
          {visibleParagraphs.map((p) => (
            <div 
              key={p} 
              className="animate-fade-in text-left mb-4"
            >
              <div className="h-4 bg-gradient-to-r from-bento-orange-200 to-bento-yellow-100 dark:from-bento-brown-700 dark:to-bento-brown-600 rounded w-32 mb-2 animate-pulse"></div>
              <div className="space-y-2">
                {Array.from({ length: 3 + Math.floor(Math.random() * 3) }, (_, i) => (
                  <div 
                    key={i} 
                    className="h-3 bg-gradient-to-r from-bento-gray-200 to-bento-gray-100 dark:from-bento-brown-700 dark:to-bento-brown-600 rounded" 
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
        
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent dark:from-bento-brown-800 dark:to-transparent z-10"></div>
      </div>
      
      <div className="mt-6 text-sm text-bento-gray-500 dark:text-bento-gray-400 animate-pulse">
        Crafting detailed legal language, formatting clauses, and organizing document...
      </div>
    </div>
  );
};

export default ContractAnimationPreview;
