import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Layout
import MainLayout from './components/layout/MainLayout';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Modules (We wrap them to pass the onExit prop which redirects to dashboard)
import MathModule from './components/MathModule';
import EnglishModule from './components/EnglishModule';
import SinhalaModule from './components/SinhalaModule';
import MotorModule from './components/MotorModule';
import CreativeModule from './components/CreativeModule';
import SinhalaExercises from './pages/SinhalaExercises';
import OrigamiModule from './components/OrigamiModule';
import ColoringModule from './components/ColoringModule';
import PaperCraftModule from './components/PaperCraftModule';
import SinhalaWritingModule from './components/SinhalaWritingModule';
import SinhalaGrade2Level1 from './components/SinhalaGrade2Level1';
import SinhalaGrade2Level1Act2 from './components/SinhalaGrade2Level1Act2';
import SinhalaGrade2Level1Act3 from './components/SinhalaGrade2Level1Act3';
import SinhalaGrade2Level1Act4 from './components/SinhalaGrade2Level1Act4';
import SinhalaGrade2Level2Act1 from './components/SinhalaGrade2Level2Act1';
import SinhalaGrade2Level2Act2 from './components/SinhalaGrade2Level2Act2';
import SinhalaGrade2Level2Act3 from './components/SinhalaGrade2Level2Act3';
import SinhalaGrade2Level2Act4 from './components/SinhalaGrade2Level2Act4';
import SinhalaGrade2Level2Act5 from './components/SinhalaGrade2Level2Act5';
import SinhalaGrade2Level3Act1 from './components/SinhalaGrade2Level3Act1';
import SinhalaGrade2Level3Act2 from './components/SinhalaGrade2Level3Act2';
import SinhalaGrade2Level3Act3 from './components/SinhalaGrade2Level3Act3';
import SinhalaGrade2Hub from './components/SinhalaGrade2Hub';
import SinhalaGrade3Hub from './components/SinhalaGrade3Hub';
import SinhalaGrade3Level1Act1 from './components/SinhalaGrade3Level1Act1';
import SinhalaGrade3Level1Act3 from './components/SinhalaGrade3Level1Act3';
import SinhalaGrade3Level1Act4 from './components/SinhalaGrade3Level1Act4';
import SinhalaGrade3Level1Act5 from './components/SinhalaGrade3Level1Act5';
import SinhalaGrade3Level2Act1 from './components/SinhalaGrade3Level2Act1';
import SinhalaGrade3Level2Act2 from './components/SinhalaGrade3Level2Act2';
import SinhalaGrade3Level2Act3 from './components/SinhalaGrade3Level2Act3';
import SinhalaGrade3Level2Act4 from './components/SinhalaGrade3Level2Act4';
import SinhalaGrade3Level2Act5 from './components/SinhalaGrade3Level2Act5';
import SinhalaGrade3Level3Act1 from './components/SinhalaGrade3Level3Act1';
import SinhalaGrade3Level3Act3 from './components/SinhalaGrade3Level3Act3';
import SinhalaGrade3Level3Act4 from './components/SinhalaGrade3Level3Act4';
import SinhalaGrade3Level4Act1 from './components/SinhalaGrade3Level4Act1';
import SinhalaGrade3Level4Act2 from './components/SinhalaGrade3Level4Act2';
import SinhalaGrade3Level4Act3 from './components/SinhalaGrade3Level4Act3';
import SinhalaGrade3Level4Act4 from './components/SinhalaGrade3Level4Act4';
import SinhalaGrade3Level4Act5 from './components/SinhalaGrade3Level4Act5';
import SinhalaGrade4Hub from './components/SinhalaGrade4Hub';
import SinhalaGrade4Level1Act1 from './components/SinhalaGrade4Level1Act1';
import SinhalaGrade4Level1Act2 from './components/SinhalaGrade4Level1Act2';
import SinhalaGrade4Level1Act3 from './components/SinhalaGrade4Level1Act3';
import SinhalaGrade4Level1Act4 from './components/SinhalaGrade4Level1Act4';
import SinhalaGrade4Level2Act1 from './components/SinhalaGrade4Level2Act1';
import SinhalaGrade4Level2Act2 from './components/SinhalaGrade4Level2Act2';
import SinhalaGrade4Level2Act3 from './components/SinhalaGrade4Level2Act3';
import SinhalaGrade4Level3Act1 from './components/SinhalaGrade4Level3Act1';
import SinhalaGrade4Level3Act2 from './components/SinhalaGrade4Level3Act2';
import SinhalaGrade4Level3Act3 from './components/SinhalaGrade4Level3Act3';
import SinhalaGrade4Level3Act4 from './components/SinhalaGrade4Level3Act4';
import SinhalaGrade4Level4Act1 from './components/SinhalaGrade4Level4Act1';
import SinhalaGrade4Level4Act2 from './components/SinhalaGrade4Level4Act2';
import SinhalaGrade4Level4Act3 from './components/SinhalaGrade4Level4Act3';
import SinhalaGrade4Level4Act4 from './components/SinhalaGrade4Level4Act4';
import SinhalaAdaptiveWritingModule from './components/SinhalaAdaptiveWritingModule';
import AIModelResearchPanel from './components/AIModelResearchPanel';

// Module Wrapper Component
const ModuleWrapper = ({ Component }) => {
  const navigate = useNavigate();
  return <Component onExit={() => navigate('/dashboard')} />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Website Routes wrapped in MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Module Routes */}
          <Route path="/module/math" element={<ModuleWrapper Component={MathModule} />} />
          <Route path="/module/english" element={<ModuleWrapper Component={EnglishModule} />} />
          <Route path="/module/sinhala" element={<ModuleWrapper Component={SinhalaModule} />} />
          <Route path="/module/sinhala/exercises" element={<SinhalaExercises />} />
          <Route path="/module/motor" element={<ModuleWrapper Component={MotorModule} />} />
          <Route path="/module/creative" element={<ModuleWrapper Component={CreativeModule} />} />
          <Route path="/module/origami" element={<ModuleWrapper Component={OrigamiModule} />} />
          <Route path="/module/coloring" element={<ModuleWrapper Component={ColoringModule} />} />
          <Route path="/module/papercraft" element={<ModuleWrapper Component={PaperCraftModule} />} />
          <Route path="/module/sinhala-writing" element={<ModuleWrapper Component={SinhalaWritingModule} />} />
          <Route path="/module/sinhala/grade2" element={<ModuleWrapper Component={SinhalaGrade2Hub} />} />
          <Route path="/module/sinhala/grade2-level1" element={<ModuleWrapper Component={SinhalaGrade2Level1} />} />
          <Route path="/module/sinhala/letter-identification" element={<ModuleWrapper Component={SinhalaGrade2Level1} />} />
          <Route path="/module/sinhala/grade2-level1-act2" element={<ModuleWrapper Component={SinhalaGrade2Level1Act2} />} />
          <Route path="/module/sinhala/picture-letter-matching" element={<ModuleWrapper Component={SinhalaGrade2Level1Act2} />} />
          <Route path="/module/sinhala/grade2-level1-act3" element={<ModuleWrapper Component={SinhalaGrade2Level1Act3} />} />
          <Route path="/module/sinhala/fill-in-the-blanks" element={<ModuleWrapper Component={SinhalaGrade2Level1Act3} />} />
          <Route path="/module/sinhala/grade2-level1-act4" element={<ModuleWrapper Component={SinhalaGrade2Level1Act4} />} />
          <Route path="/module/sinhala/magic-board" element={<ModuleWrapper Component={SinhalaGrade2Level1Act4} />} />
          <Route path="/module/sinhala/grade2-level2-act1" element={<ModuleWrapper Component={SinhalaGrade2Level2Act1} />} />
          <Route path="/module/sinhala/word-building" element={<ModuleWrapper Component={SinhalaGrade2Level2Act1} />} />
          <Route path="/module/sinhala/grade2-level2-act2" element={<ModuleWrapper Component={SinhalaGrade2Level2Act2} />} />
          <Route path="/module/sinhala/magic-words" element={<ModuleWrapper Component={SinhalaGrade2Level2Act2} />} />
          <Route path="/module/sinhala/grade2-level2-act3" element={<ModuleWrapper Component={SinhalaGrade2Level2Act3} />} />
          <Route path="/module/sinhala/letter-train" element={<ModuleWrapper Component={SinhalaGrade2Level2Act3} />} />
          <Route path="/module/sinhala/grade2-level2-act4" element={<ModuleWrapper Component={SinhalaGrade2Level2Act4} />} />
          <Route path="/module/sinhala/picture-word-matching" element={<ModuleWrapper Component={SinhalaGrade2Level2Act4} />} />
          <Route path="/module/sinhala/grade2-level2-act5" element={<ModuleWrapper Component={SinhalaGrade2Level2Act5} />} />
          <Route path="/module/sinhala/word-basket" element={<ModuleWrapper Component={SinhalaGrade2Level2Act5} />} />
          <Route path="/module/sinhala/grade2-level3-act1" element={<ModuleWrapper Component={SinhalaGrade2Level3Act1} />} />
          <Route path="/module/sinhala/sentence-tracing" element={<ModuleWrapper Component={SinhalaGrade2Level3Act1} />} />
          <Route path="/module/sinhala/grade2-level3-act2" element={<ModuleWrapper Component={SinhalaGrade2Level3Act2} />} />
          <Route path="/module/sinhala/sentence-bridge" element={<ModuleWrapper Component={SinhalaGrade2Level3Act2} />} />
          <Route path="/module/sinhala/grade2-level3-act3" element={<ModuleWrapper Component={SinhalaGrade2Level3Act3} />} />
          <Route path="/module/sinhala/drag-fill-blanks" element={<ModuleWrapper Component={SinhalaGrade2Level3Act3} />} />
          
          {/* Grade 3 Routes */}
          <Route path="/module/sinhala/grade3" element={<ModuleWrapper Component={SinhalaGrade3Hub} />} />
          <Route path="/module/sinhala/grade3-hub" element={<ModuleWrapper Component={SinhalaGrade3Hub} />} />
          <Route path="/module/sinhala/grade3-level1-act1" element={<ModuleWrapper Component={SinhalaGrade3Level1Act1} />} />
          <Route path="/module/sinhala/grade3-level2-act1" element={<ModuleWrapper Component={SinhalaGrade3Level2Act1} />} />
          <Route path="/module/sinhala/grade3-act1" element={<ModuleWrapper Component={SinhalaGrade3Level1Act1} />} />
          <Route path="/module/sinhala/grade3-noun-sorting" element={<ModuleWrapper Component={SinhalaGrade3Level2Act1} />} />
          <Route path="/module/sinhala/grade3-level2-act2" element={<ModuleWrapper Component={SinhalaGrade3Level2Act2} />} />
          <Route path="/module/sinhala/grade3-level1-act2" element={<ModuleWrapper Component={SinhalaGrade3Level2Act2} />} />
          <Route path="/module/sinhala/grade3-act2" element={<ModuleWrapper Component={SinhalaGrade3Level2Act2} />} />
          <Route path="/module/sinhala/grade3-level2-act3" element={<ModuleWrapper Component={SinhalaGrade3Level2Act3} />} />
          <Route path="/module/sinhala/grade3-level1-act3" element={<ModuleWrapper Component={SinhalaGrade3Level1Act3} />} />
          <Route path="/module/sinhala/grade3-act3" element={<ModuleWrapper Component={SinhalaGrade3Level2Act3} />} />
          <Route path="/module/sinhala/grade3-level2-act4" element={<ModuleWrapper Component={SinhalaGrade3Level2Act4} />} />
          <Route path="/module/sinhala/grade3-level1-act4" element={<ModuleWrapper Component={SinhalaGrade3Level1Act4} />} />
          <Route path="/module/sinhala/grade3-act4" element={<ModuleWrapper Component={SinhalaGrade3Level2Act4} />} />
          <Route path="/module/sinhala/grade3-picture-word" element={<ModuleWrapper Component={SinhalaGrade3Level1Act4} />} />
          <Route path="/module/sinhala/grade3-sentence-unjumble" element={<ModuleWrapper Component={SinhalaGrade3Level2Act4} />} />
          <Route path="/module/sinhala/grade3-level2-act5" element={<ModuleWrapper Component={SinhalaGrade3Level2Act5} />} />
          <Route path="/module/sinhala/grade3-level1-act5" element={<ModuleWrapper Component={SinhalaGrade3Level1Act5} />} />
          <Route path="/module/sinhala/grade3-act5" element={<ModuleWrapper Component={SinhalaGrade3Level2Act5} />} />
          <Route path="/module/sinhala/grade3-word-pair-matching" element={<ModuleWrapper Component={SinhalaGrade3Level2Act5} />} />
          <Route path="/module/sinhala/grade3-beginning-sound" element={<ModuleWrapper Component={SinhalaGrade3Level1Act5} />} />
          
          <Route path="/module/sinhala/grade3-level3-act1" element={<ModuleWrapper Component={SinhalaGrade3Level3Act1} />} />
          <Route path="/module/sinhala/grade3-synonyms" element={<ModuleWrapper Component={SinhalaGrade3Level3Act1} />} />
          
          <Route path="/module/sinhala/grade3-level3-act3" element={<ModuleWrapper Component={SinhalaGrade3Level3Act3} />} />
          <Route path="/module/sinhala/grade3-riddles" element={<ModuleWrapper Component={SinhalaGrade3Level3Act3} />} />
          
          <Route path="/module/sinhala/grade3-level3-act4" element={<ModuleWrapper Component={SinhalaGrade3Level3Act4} />} />
          <Route path="/module/sinhala/grade3-definitions" element={<ModuleWrapper Component={SinhalaGrade3Level3Act4} />} />
          
          <Route path="/module/sinhala/grade3-level4-act1" element={<ModuleWrapper Component={SinhalaGrade3Level4Act1} />} />
          <Route path="/module/sinhala/grade3-antonyms" element={<ModuleWrapper Component={SinhalaGrade3Level4Act1} />} />
          
          <Route path="/module/sinhala/grade3-level4-act2" element={<ModuleWrapper Component={SinhalaGrade3Level4Act2} />} />
          <Route path="/module/sinhala/grade3-written-grammar" element={<ModuleWrapper Component={SinhalaGrade3Level4Act2} />} />
          <Route path="/module/sinhala/grade3-homophones" element={<ModuleWrapper Component={SinhalaGrade3Level4Act2} />} />

          <Route path="/module/sinhala/grade3-level4-act3" element={<ModuleWrapper Component={SinhalaGrade3Level4Act3} />} />
          <Route path="/module/sinhala/grade3-proverbs" element={<ModuleWrapper Component={SinhalaGrade3Level4Act3} />} />

          <Route path="/module/sinhala/grade3-level4-act4" element={<ModuleWrapper Component={SinhalaGrade3Level4Act4} />} />
          <Route path="/module/sinhala/grade3-invitation" element={<ModuleWrapper Component={SinhalaGrade3Level4Act4} />} />

          <Route path="/module/sinhala/grade3-level4-act5" element={<ModuleWrapper Component={SinhalaGrade3Level4Act5} />} />
          <Route path="/module/sinhala/grade3-comprehension" element={<ModuleWrapper Component={SinhalaGrade3Level4Act5} />} />

          {/* Grade 4 Routes */}
          <Route path="/module/sinhala/grade4" element={<ModuleWrapper Component={SinhalaGrade4Hub} />} />
          <Route path="/module/sinhala/grade4-hub" element={<ModuleWrapper Component={SinhalaGrade4Hub} />} />
          <Route path="/module/sinhala/grade4-level1-act1" element={<ModuleWrapper Component={SinhalaGrade4Level1Act1} />} />
          <Route path="/module/sinhala/grade4-act1" element={<ModuleWrapper Component={SinhalaGrade4Level1Act1} />} />
          
          <Route path="/module/sinhala/grade4-level1-act2" element={<ModuleWrapper Component={SinhalaGrade4Level1Act2} />} />
          <Route path="/module/sinhala/grade4-act2" element={<ModuleWrapper Component={SinhalaGrade4Level1Act2} />} />
          <Route path="/module/sinhala/grade4-odd-one-out" element={<ModuleWrapper Component={SinhalaGrade4Level1Act2} />} />

          <Route path="/module/sinhala/grade4-level1-act3" element={<ModuleWrapper Component={SinhalaGrade4Level1Act3} />} />
          <Route path="/module/sinhala/grade4-act3" element={<ModuleWrapper Component={SinhalaGrade4Level1Act3} />} />
          <Route path="/module/sinhala/grade4-singular-plural" element={<ModuleWrapper Component={SinhalaGrade4Level1Act3} />} />

          <Route path="/module/sinhala/grade4-level1-act4" element={<ModuleWrapper Component={SinhalaGrade4Level1Act4} />} />
          <Route path="/module/sinhala/grade4-act4" element={<ModuleWrapper Component={SinhalaGrade4Level1Act4} />} />
          <Route path="/module/sinhala/grade4-missing-letters" element={<ModuleWrapper Component={SinhalaGrade4Level1Act4} />} />

          <Route path="/module/sinhala/grade4-level2-act1" element={<ModuleWrapper Component={SinhalaGrade4Level2Act1} />} />
          <Route path="/module/sinhala/grade4-punctuation" element={<ModuleWrapper Component={SinhalaGrade4Level2Act1} />} />

          <Route path="/module/sinhala/grade4-level2-act2" element={<ModuleWrapper Component={SinhalaGrade4Level2Act2} />} />
          <Route path="/module/sinhala/grade4-act2-paired" element={<ModuleWrapper Component={SinhalaGrade4Level2Act2} />} />
          <Route path="/module/sinhala/grade4-paired-words" element={<ModuleWrapper Component={SinhalaGrade4Level2Act2} />} />

          <Route path="/module/sinhala/grade4-level2-act3" element={<ModuleWrapper Component={SinhalaGrade4Level2Act3} />} />
          <Route path="/module/sinhala/grade4-level3-act3" element={<ModuleWrapper Component={SinhalaGrade4Level2Act3} />} />
          <Route path="/module/sinhala/grade4-act3-letters" element={<ModuleWrapper Component={SinhalaGrade4Level2Act3} />} />
          <Route path="/module/sinhala/grade4-vowels-consonants" element={<ModuleWrapper Component={SinhalaGrade4Level2Act3} />} />

          <Route path="/module/sinhala/grade4-level3-act1" element={<ModuleWrapper Component={SinhalaGrade4Level3Act1} />} />
          <Route path="/module/sinhala/grade4-sentence-completion" element={<ModuleWrapper Component={SinhalaGrade4Level3Act1} />} />

          <Route path="/module/sinhala/grade4-level3-act2" element={<ModuleWrapper Component={SinhalaGrade4Level3Act2} />} />
          <Route path="/module/sinhala/grade4-comprehension-story" element={<ModuleWrapper Component={SinhalaGrade4Level3Act2} />} />

          <Route path="/module/sinhala/grade4-level3-act3" element={<ModuleWrapper Component={SinhalaGrade4Level3Act3} />} />
          <Route path="/module/sinhala/grade4-tenses-grammar" element={<ModuleWrapper Component={SinhalaGrade4Level3Act3} />} />

          <Route path="/module/sinhala/grade4-level3-act4" element={<ModuleWrapper Component={SinhalaGrade4Level3Act4} />} />
          <Route path="/module/sinhala/grade4-proverbs" element={<ModuleWrapper Component={SinhalaGrade4Level3Act4} />} />
          <Route path="/module/sinhala/grade4-act4-proverbs" element={<ModuleWrapper Component={SinhalaGrade4Level3Act4} />} />
          <Route path="/module/sinhala/grade4-act4-riddles" element={<ModuleWrapper Component={SinhalaGrade4Level3Act4} />} />
          <Route path="/module/sinhala/grade4-riddles" element={<ModuleWrapper Component={SinhalaGrade4Level3Act4} />} />

          <Route path="/module/sinhala/grade4-level4-act1" element={<ModuleWrapper Component={SinhalaGrade4Level4Act1} />} />
          <Route path="/module/sinhala/grade4-act1-level4" element={<ModuleWrapper Component={SinhalaGrade4Level4Act1} />} />
          <Route path="/module/sinhala/grade4-word-builder" element={<ModuleWrapper Component={SinhalaGrade4Level4Act1} />} />

          <Route path="/module/sinhala/grade4-level4-act2" element={<ModuleWrapper Component={SinhalaGrade4Level4Act2} />} />
          <Route path="/module/sinhala/grade4-act2-level4" element={<ModuleWrapper Component={SinhalaGrade4Level4Act2} />} />
          <Route path="/module/sinhala/grade4-punctuation-sentences" element={<ModuleWrapper Component={SinhalaGrade4Level4Act2} />} />

          <Route path="/module/sinhala/grade4-level4-act3" element={<ModuleWrapper Component={SinhalaGrade4Level4Act3} />} />
          <Route path="/module/sinhala/grade4-act3-level4" element={<ModuleWrapper Component={SinhalaGrade4Level4Act3} />} />
          <Route path="/module/sinhala/grade4-antonyms" element={<ModuleWrapper Component={SinhalaGrade4Level4Act3} />} />

          <Route path="/module/sinhala/grade4-level4-act4" element={<ModuleWrapper Component={SinhalaGrade4Level4Act4} />} />
          <Route path="/module/sinhala/grade4-act4-level4" element={<ModuleWrapper Component={SinhalaGrade4Level4Act4} />} />
          <Route path="/module/sinhala/grade4-kimphala-story" element={<ModuleWrapper Component={SinhalaGrade4Level4Act4} />} />

          <Route path="/module/sinhala/adaptive-writing" element={<ModuleWrapper Component={SinhalaAdaptiveWritingModule} />} />
          <Route path="/module/sinhala/ai-research-panel" element={<ModuleWrapper Component={AIModelResearchPanel} />} />
          <Route path="/module/sinhala/research-panel" element={<ModuleWrapper Component={AIModelResearchPanel} />} />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
