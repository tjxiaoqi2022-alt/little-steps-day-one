export const PROGRESS_KEY = 'little-steps-progress-v1';

export const emptyProgress = () => ({ completedDays: [], lastCourse: null, parentUnlocked: false });

export function normalizeProgress(value) {
  if (!value || typeof value !== 'object') return emptyProgress();
  return {
    completedDays: Array.isArray(value.completedDays) ? [...new Set(value.completedDays.filter(id => typeof id === 'string'))] : [],
    lastCourse: typeof value.lastCourse === 'string' ? value.lastCourse : null,
    parentUnlocked: value.parentUnlocked === true,
  };
}

export function loadProgress(storage = globalThis.localStorage) {
  try { return normalizeProgress(JSON.parse(storage?.getItem(PROGRESS_KEY) || 'null')); }
  catch { return emptyProgress(); }
}

export function saveProgress(progress, storage = globalThis.localStorage) {
  const next = normalizeProgress(progress);
  try { storage?.setItem(PROGRESS_KEY, JSON.stringify(next)); } catch { /* Storage can be unavailable. */ }
  return next;
}

export function completeCourse(progress, courseId) {
  return normalizeProgress({ ...progress, completedDays: [...progress.completedDays, courseId], lastCourse: courseId });
}

export const isCompleted = (progress, courseId) => progress.completedDays.includes(courseId);

export function isCourseUnlocked(courses, index, progress) {
  if (progress.parentUnlocked || index === 0) return true;
  return isCompleted(progress, courses[index - 1].id);
}

export function recommendedCourse(courses, progress) {
  return courses.find((course, index) => isCourseUnlocked(courses, index, progress) && !isCompleted(progress, course.id)) || courses.at(-1);
}
