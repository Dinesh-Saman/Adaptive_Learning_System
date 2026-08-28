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
import TeacherDashboard from './pages/TeacherDashboard';

// ── Pillar 1: Mathematics (Grade 2, 3, 4 Hubs) ──
import MathModule from './components/math/MathModule';
import MathGrade2AdaptiveModule from './components/math/MathGrade2AdaptiveModule';
import MathGrade3AdaptiveModule from './components/math/MathGrade3AdaptiveModule';
import MathGrade4AdaptiveModule from './components/math/MathGrade4AdaptiveModule';

// ── Pillar 2: English Speech & Pronunciation ──
import EnglishModule from './components/english/EnglishModule';

// ── Pillar 3: Pre-School & Grade 1 (Motor & Creative) ──
import MotorModule from './components/preschool/MotorModule';
import CreativeModule from './components/preschool/CreativeModule';
import OrigamiModule from './components/preschool/OrigamiModule';
import ColoringModule from './components/preschool/ColoringModule';
import PaperCraftModule from './components/preschool/PaperCraftModule';
import StoryDrawingModule from './components/preschool/StoryDrawingModule';

// ── Pillar 4: Sinhala Language Adaptive Learning Systems (Grade 2, 3, 4) ──
import SinhalaModule from './components/sinhala/SinhalaModule';
import SinhalaGrade2AdaptiveSystem from './components/sinhala/grade2/SinhalaGrade2AdaptiveSystem';
import SinhalaGrade3AdaptiveSystem from './components/sinhala/grade3/SinhalaGrade3AdaptiveSystem';
import SinhalaGrade4AdaptiveSystem from './components/sinhala/grade4/SinhalaGrade4AdaptiveSystem';
import AIModelResearchPanel from './components/sinhala/AIModelResearchPanel';

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
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          
          {/* Math Module Routes */}
          <Route path="/module/math" element={<ModuleWrapper Component={MathGrade4AdaptiveModule} />} />
          <Route path="/module/math/grade2" element={<ModuleWrapper Component={MathGrade2AdaptiveModule} />} />
          <Route path="/module/math/grade2-adaptive" element={<ModuleWrapper Component={MathGrade2AdaptiveModule} />} />
          <Route path="/module/math/grade3" element={<ModuleWrapper Component={MathGrade3AdaptiveModule} />} />
          <Route path="/module/math/grade3-adaptive" element={<ModuleWrapper Component={MathGrade3AdaptiveModule} />} />
          <Route path="/module/math/grade4" element={<ModuleWrapper Component={MathGrade4AdaptiveModule} />} />
          <Route path="/module/math/grade4-adaptive" element={<ModuleWrapper Component={MathGrade4AdaptiveModule} />} />
          <Route path="/module/math/grade4-3papers" element={<ModuleWrapper Component={MathGrade4AdaptiveModule} />} />
          <Route path="/module/math/affect-tracker" element={<ModuleWrapper Component={MathModule} />} />
          
          {/* English & Preschool Routes */}
          <Route path="/module/english" element={<ModuleWrapper Component={EnglishModule} />} />
          <Route path="/module/motor" element={<ModuleWrapper Component={MotorModule} />} />
          <Route path="/module/creative" element={<ModuleWrapper Component={CreativeModule} />} />
          <Route path="/module/origami" element={<ModuleWrapper Component={OrigamiModule} />} />
          <Route path="/module/coloring" element={<ModuleWrapper Component={ColoringModule} />} />
          <Route path="/module/papercraft" element={<ModuleWrapper Component={PaperCraftModule} />} />
          <Route path="/module/storydrawing" element={<ModuleWrapper Component={StoryDrawingModule} />} />

          {/* ── Sinhala Module Routes - Pure Adaptive Learning Systems ── */}
          <Route path="/module/sinhala" element={<ModuleWrapper Component={SinhalaModule} />} />
          
          {/* Grade 2 Sinhala Adaptive System */}
          <Route path="/module/sinhala/grade2" element={<ModuleWrapper Component={SinhalaGrade2AdaptiveSystem} />} />
          <Route path="/module/sinhala/grade2-adaptive" element={<ModuleWrapper Component={SinhalaGrade2AdaptiveSystem} />} />
          <Route path="/module/sinhala/grade2-5papers" element={<ModuleWrapper Component={SinhalaGrade2AdaptiveSystem} />} />

          {/* Grade 3 Sinhala Adaptive System */}
          <Route path="/module/sinhala/grade3" element={<ModuleWrapper Component={SinhalaGrade3AdaptiveSystem} />} />
          <Route path="/module/sinhala/grade3-adaptive" element={<ModuleWrapper Component={SinhalaGrade3AdaptiveSystem} />} />
          <Route path="/module/sinhala/grade3-5papers" element={<ModuleWrapper Component={SinhalaGrade3AdaptiveSystem} />} />

          {/* Grade 4 Sinhala Adaptive System */}
          <Route path="/module/sinhala/grade4" element={<ModuleWrapper Component={SinhalaGrade4AdaptiveSystem} />} />
          <Route path="/module/sinhala/grade4-adaptive" element={<ModuleWrapper Component={SinhalaGrade4AdaptiveSystem} />} />
          <Route path="/module/sinhala/grade4-5papers" element={<ModuleWrapper Component={SinhalaGrade4AdaptiveSystem} />} />

          {/* AI Research Panel */}
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