import day1 from './day1.js';
import day2 from './day2.js';

// Add future days here. The lesson engine renders each course's sections.
export const courses = [day1, day2];
export const courseById = Object.fromEntries(courses.map(course => [course.id, course]));
export const getCourse = id => courseById[id] || null;
export const getNextCourse = id => courses[courses.findIndex(course => course.id === id) + 1] || null;
