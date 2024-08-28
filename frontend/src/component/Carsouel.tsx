import  { useState, useEffect } from 'react';
import { MultipleReviewsCard } from './MultipleReviewsCard';
import { MultipleTestiomial } from '../types/types';

export const Carousel = ({ reviews, interval = 3000 }:{reviews:[MultipleTestiomial],interval:number}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      goToNext();
    }, interval);

    return () => clearTimeout(timer);
  }, [currentIndex, reviews.length, interval]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  const visibleReviews = () => {
    const numVisible = {
      base: 1,
      sm: 2,
      md: 3
    };

    return [
      reviews[currentIndex],
      ...reviews.slice(currentIndex + 1),
      ...reviews.slice(0, currentIndex)
    ].slice(0, numVisible.md);
  };

  return (
    <div className="carousel relative">
      <div className="flex overflow-hidden">
        <div className="flex transition-transform duration-300 ease-in-out" style={{
          transform: `translateX(-${currentIndex * (100 / 3)}%)` // Adjust for 3 cards view
        }}>
          {visibleReviews().map((review, index) => (
            <div key={index} className="w-full sm:w-1/2 md:w-1/3 flex-shrink-0 p-2">
              <MultipleReviewsCard Review={review} />
            </div>
          ))}
        </div>
      </div>
      <button 
        onClick={goToPrevious}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
      >
        &lt;
      </button>
      <button 
        onClick={goToNext}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
      >
        &gt;
      </button>
    </div>
  );
};

export default Carousel;