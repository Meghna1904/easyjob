import React, { useEffect, useState } from 'react';

interface ResumeScoreProps {
  resumeText: string;
}

export const ResumeScore: React.FC<ResumeScoreProps> = ({ resumeText }) => {
  const [score, setScore] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  
  useEffect(() => {
    const sections = ['Objective', 'Declaration', 'Hobbies', 'Achievements', 'Projects'];
    let calculatedScore = 0;
    
    sections.forEach(section => {
      if (resumeText.includes(section)) {
        calculatedScore += 20;
      }
    });
    
    // Animate the progress bar
    let currentProgress = 0;
    const interval = setInterval(() => {
      if (currentProgress >= calculatedScore) {
        clearInterval(interval);
      } else {
        currentProgress += 1;
        setProgress(currentProgress);
      }
    }, 50);
    
    setScore(calculatedScore);
    
    return () => clearInterval(interval);
  }, [resumeText]);
  
  return (
    <div className="resume-score">
      <h2>Resume Score</h2>
      
      <div className="progress-container">
        <div 
          className="progress-bar" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="score-value">
        Your Resume Writing Score: {score}
      </div>
      
      <div className="score-notes">
        <p>This score is calculated based on the content that you have added in your Resume.</p>
        
        {['Objective', 'Education', 'Experience', 'Achievements', 'Project'].map((section) => (
          <div key={section} className={`section-check ${resumeText.includes(section) ? 'present' : 'missing'}`}>
            {resumeText.includes(section) ? 
              `✓ Great! You have included ${section}` : 
              `✗ Consider adding ${section} to improve your score`}
          </div>
        ))}
      </div>
    </div>
  );
};