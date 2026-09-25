import day1 from './day1.js';

// Add future days here. The lesson engine renders each course's sections.
// Day 2 stays out of the public path until Day 1 has been reviewed and approved.
export const courses = [day1];
export const courseById = Object.fromEntries(courses.map(course => [course.id, course]));
export const getCourse = id => courseById[id] || null;
export const getNextCourse = id => courses[courses.findIndex(course => course.id === id) + 1] || null;
