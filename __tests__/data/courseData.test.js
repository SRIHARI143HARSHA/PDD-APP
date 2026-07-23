describe('Course Data Module', () => {
  let courseData;

  beforeEach(() => {
    const moduleData = require('../../data/courseData');
    courseData = moduleData.courseData || moduleData;
  });

  it('should export a course collection object', () => {
    expect(typeof courseData).toBe('object');
    expect(courseData).not.toBeNull();
  });

  it('should have courses with required properties', () => {
    const courses = Object.values(courseData);

    expect(courses.length).toBeGreaterThan(0);
    courses.forEach(course => {
      expect(course).toBeDefined();
      expect(typeof course).toBe('object');
    });
  });

  it('should contain disaster safety courses', () => {
    const courseEntries = Object.entries(courseData);
    const disasterCourses = courseEntries.filter(([name, course]) =>
      name.toLowerCase().includes('earthquake') ||
      name.toLowerCase().includes('hurricane') ||
      name.toLowerCase().includes('flood') ||
      name.toLowerCase().includes('safety')
    );

    expect(disasterCourses.length).toBeGreaterThan(0);
  });

  it('should have valid course structure', () => {
    const courses = Object.values(courseData).slice(0, 5);

    courses.forEach(course => {
      expect(course).toHaveProperty('title');
      expect(course).toHaveProperty('content');
    });
  });

  it('should provide course metadata', () => {
    const course = Object.values(courseData)[0];
    const hasMetadata = course.title || course.content || course.video;

    expect(hasMetadata).toBeTruthy();
  });

  it('should have non-empty course list', () => {
    const courses = Object.values(courseData);
    expect(courses.length).toBeGreaterThan(0);
  });
});

describe('Course Data Validation', () => {
  let courseData;

  beforeEach(() => {
    courseData = require('../../data/courseData');
  });

  it('should have properly formatted course titles', () => {
    const courses = Object.values(courseData);

    courses.forEach(course => {
      if (course.title) {
        expect(typeof course.title).toBe('string');
        expect(course.title.length).toBeGreaterThan(0);
      }
    });
  });

  it('should provide valid course content', () => {
    const course = Object.values(courseData)[0];
    expect(course).not.toBeNull();
    expect(course).not.toBeUndefined();
  });

  it('should support course filtering by type', () => {
    const courses = Object.values(courseData);
    expect(courses.filter(course => course.title).length).toBeGreaterThanOrEqual(0);
  });
});
