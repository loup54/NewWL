
import { useState, useEffect } from 'react';

const ONBOARDING_KEY = 'wordlens-onboarding-completed';
const TOUR_COMPLETED_KEY = 'wordlens-tour-completed';

export const useOnboarding = () => {
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem(ONBOARDING_KEY);
    const hasCompletedTour = localStorage.getItem(TOUR_COMPLETED_KEY);

    if (!hasCompletedOnboarding) {
      setIsFirstVisit(true);
    }

    if (!hasCompletedTour && hasCompletedOnboarding) {
      setShowTour(true);
    }
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setIsFirstVisit(false);
  };

  const completeTour = () => {
    localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
    setShowTour(false);
  };

  const resetOnboarding = () => {
    localStorage.removeItem(ONBOARDING_KEY);
    localStorage.removeItem(TOUR_COMPLETED_KEY);
    setIsFirstVisit(true);
    setShowTour(false);
  };

  return {
    isFirstVisit,
    showTour,
    completeOnboarding,
    completeTour,
    resetOnboarding
  };
};
