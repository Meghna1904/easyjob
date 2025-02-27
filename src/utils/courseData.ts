// src/utils/courseData.ts
interface Course {
    name: string;
    link: string;
  }
  
  export const getCoursesByField = (field: string): Course[] => {
    const courses: Record<string, Course[]> = {
      "Data Science": [
        { name: "Machine Learning A-Z", link: "https://www.udemy.com/course/machinelearning" },
        { name: "Python for Data Science", link: "https://www.coursera.org/learn/python-data-analysis" },
        { name: "Deep Learning Specialization", link: "https://www.coursera.org/specializations/deep-learning" },
        { name: "TensorFlow Developer Certificate", link: "https://www.tensorflow.org/certificate" },
        { name: "Applied Data Science with Python", link: "https://www.coursera.org/specializations/data-science-python" },
        { name: "Statistics for Data Science", link: "https://www.udemy.com/course/statistics-for-data-science" },
        { name: "SQL for Data Analysis", link: "https://www.udacity.com/course/sql-for-data-analysis--ud198" },
        { name: "Data Visualization with Tableau", link: "https://www.coursera.org/specializations/data-visualization" },
        { name: "R Programming", link: "https://www.coursera.org/learn/r-programming" },
        { name: "Natural Language Processing", link: "https://www.coursera.org/specializations/natural-language-processing" }
      ],
      "Web Development": [
        { name: "The Complete Web Developer Course", link: "https://www.udemy.com/course/the-complete-web-developer-course-2" },
        { name: "React - The Complete Guide", link: "https://www.udemy.com/course/react-the-complete-guide-incl-redux" },
        { name: "Node.js Developer Course", link: "https://www.udemy.com/course/the-complete-nodejs-developer-course-2" },
        { name: "JavaScript: Understanding the Weird Parts", link: "https://www.udemy.com/course/understand-javascript" },
        { name: "Full Stack Web Development", link: "https://www.coursera.org/specializations/full-stack-react" },
        { name: "Modern JavaScript", link: "https://www.udemy.com/course/modern-javascript-from-the-beginning" },
        { name: "Angular - The Complete Guide", link: "https://www.udemy.com/course/the-complete-guide-to-angular-2" },
        { name: "Vue JS - The Complete Guide", link: "https://www.udemy.com/course/vuejs-2-the-complete-guide" },
        { name: "PHP & MySQL", link: "https://www.udemy.com/course/php-mysql-tutorial" },
        { name: "Web Security", link: "https://www.coursera.org/learn/web-security" }
      ],
      "Mobile Development": [
        { name: "iOS & Swift - The Complete iOS App Development Bootcamp", link: "https://www.udemy.com/course/ios-13-app-development-bootcamp" },
        { name: "Android Java Masterclass", link: "https://www.udemy.com/course/master-android-7-nougat-java-app-development-step-by-step" },
        { name: "React Native - The Practical Guide", link: "https://www.udemy.com/course/react-native-the-practical-guide" },
        { name: "Flutter & Dart - The Complete Guide", link: "https://www.udemy.com/course/flutter-bootcamp-with-dart" },
        { name: "Kotlin for Android: Beginner to Advanced", link: "https://www.udemy.com/course/kotlinandroid" },
        { name: "iOS Foundation", link: "https://www.udacity.com/course/ios-developer-nanodegree--nd003" },
        { name: "Xamarin Forms", link: "https://www.udemy.com/course/xamarin-forms-course" },
        { name: "Mobile UI/UX Design", link: "https://www.coursera.org/learn/mobile-app-design" },
        { name: "App Marketing", link: "https://www.udemy.com/course/app-marketing-course" },
        { name: "Mobile App Testing", link: "https://www.udemy.com/course/mobile-automation-using-appiumselenium-for-android-ios" }
      ],
      "UI/UX Design": [
        { name: "UI / UX Design Specialization", link: "https://www.coursera.org/specializations/ui-ux-design" },
        { name: "Adobe XD - UI/UX Design", link: "https://www.udemy.com/course/adobe-xd-ui-ux-design" },
        { name: "Figma - UI/UX Design", link: "https://www.udemy.com/course/learn-figma" },
        { name: "Web Design for Usability", link: "https://www.coursera.org/learn/web-design-usability" },
        { name: "UX Research", link: "https://www.coursera.org/learn/ux-research-at-scale" },
        { name: "Adobe Photoshop for UI Design", link: "https://www.udemy.com/course/photoshop-for-ui-design" },
        { name: "Interaction Design", link: "https://www.coursera.org/specializations/interaction-design" },
        { name: "Information Architecture", link: "https://www.udemy.com/course/information-architecture-for-ux" },
        { name: "Design Systems", link: "https://www.udemy.com/course/design-systems" },
        { name: "UI Animation", link: "https://www.udemy.com/course/after-effects-for-ui-animation" }
      ]
    };
    
    // Return courses for the specified field, or default to Web Development if field not found
    return courses[field] || courses["Web Development"];
  };
  
 