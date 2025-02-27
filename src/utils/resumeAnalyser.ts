export const analyzeResume = async (text: string) => {
    // In a real application, this would likely be an API call
    // Here we'll just simulate the parsing and analysis
    
    // Extract basic info
    const name = extractName(text);
    const email = extractEmail(text);
    const mobile = extractMobile(text);
    const skills = extractSkills(text);
    const predicted_field = predictField(skills);
    
    return {
      name,
      email,
      mobile_number: mobile,
      no_of_pages: estimatePages(text),
      skills,
      predicted_field,
    };
  };
  
  const extractName = (text: string): string => {
    // This would use regex or NLP in a real app
    return "John Doe";
  };
  
  const extractEmail = (text: string): string => {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const matches = text.match(emailRegex);
    return matches ? matches[0] : "example@example.com";
  };
  
  const extractMobile = (text: string): string => {
    const phoneRegex = /(\+\d{1,3}[ -]?)?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}/g;
    const matches = text.match(phoneRegex);
    return matches ? matches[0] : "123-456-7890";
  };
  
  const estimatePages = (text: string): number => {
    // Rough estimate based on word count
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 500));
  };
  
  const extractSkills = (text: string): string[] => {
    const commonSkills = [
      "JavaScript", "React", "Node.js", "Python", 
      "Machine Learning", "Data Science", "HTML", "CSS"
    ];
    
    // Find which skills are mentioned in the text
    return commonSkills.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    );
  };
  
  const predictField = (skills: string[]): string => {
    // Map of fields to related skills
    const fieldMappings: Record<string, string[]> = {
      "Data Science": ["Python", "Machine Learning", "Data Science", "TensorFlow"],
      "Web Development": ["JavaScript", "React", "HTML", "CSS", "Node.js"],
      "Mobile Development": ["React Native", "Swift", "Kotlin", "Flutter"],
      "UI/UX Design": ["Figma", "Adobe XD", "UI", "UX"]
    };
    
    // Count matches for each field
    const fieldScores = Object.entries(fieldMappings).map(([field, keywords]) => {
      const score = skills.filter(skill => 
        keywords.some(keyword => skill.toLowerCase().includes(keyword.toLowerCase()))
      ).length;
      
      return { field, score };
    });
    
    // Return the field with the highest score
    const sortedFields = fieldScores.sort((a, b) => b.score - a.score);
    return sortedFields[0]?.field || "General";
  };