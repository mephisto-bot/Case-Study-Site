/**
 * Dynamic Date Helper Utility for CIH Case Studies
 * Automatically calculates realistic dates based on the current calendar date
 */

export const formatDateShort = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Calculates the exact target Date object for the next session (Wednesday at 10:00 AM).
 * If today is Wednesday:
 * - Before 10:00 AM: Target is TODAY at 10:00 AM.
 * - At or after 10:00 AM: Resets immediately to NEXT Wednesday at 10:00 AM.
 */
export const getNextSessionTargetDate = (): Date => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat

  if (dayOfWeek === 3) {
    // Today is Wednesday
    const todaySession = new Date(now);
    todaySession.setHours(10, 0, 0, 0);

    if (now.getTime() < todaySession.getTime()) {
      // Before 10:00 AM today: Target is today at 10:00 AM
      return todaySession;
    }

    // At or after 10:00 AM today: Reset to next Wednesday at 10:00 AM
    const nextWed = new Date(now);
    nextWed.setDate(now.getDate() + 7);
    nextWed.setHours(10, 0, 0, 0);
    return nextWed;
  } else {
    // Any other day (Sun, Mon, Tue, Thu, Fri, Sat)
    const daysUntilWed = (3 + 7 - dayOfWeek) % 7;
    const nextWed = new Date(now);
    nextWed.setDate(now.getDate() + daysUntilWed);
    nextWed.setHours(10, 0, 0, 0);
    return nextWed;
  }
};

export const getUpcomingWednesdayDate = (): Date => {
  return getNextSessionTargetDate();
};

export const getUpcomingWednesdayFormatted = (): string => {
  const wed = getUpcomingWednesdayDate();
  return `Wed, ${formatDateShort(wed)} • 10:00 AM – 4:00 PM (WAT)`;
};

export const getPastWednesdayDate = (weeksAgo: number = 0): Date => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  let daysSinceWed = (dayOfWeek + 7 - 3) % 7;

  if (dayOfWeek === 3) {
    const today10am = new Date(now);
    today10am.setHours(10, 0, 0, 0);
    if (now.getTime() < today10am.getTime()) {
      daysSinceWed = 7;
    } else {
      daysSinceWed = 0;
    }
  } else if (daysSinceWed === 0) {
    daysSinceWed = 7;
  }

  const daysBack = daysSinceWed + (weeksAgo * 7);
  const pastWed = new Date(now);
  pastWed.setDate(now.getDate() - daysBack);
  return pastWed;
};

export const getPastWednesdayStr = (weeksAgo: number = 0): string => {
  const date = getPastWednesdayDate(weeksAgo);
  if (weeksAgo === 0) {
    return `Recent (${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`;
  }
  return formatDateShort(date);
};
