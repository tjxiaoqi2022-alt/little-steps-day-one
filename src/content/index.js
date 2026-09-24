import day1 from './day1';
// Add a new course here; the lesson engine does not need to change.
export const courses = { [day1.id]: day1 };
export const currentCourse = courses[new URLSearchParams(window.location.search).get('day')] || day1;
