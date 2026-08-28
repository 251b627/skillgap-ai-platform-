import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Compass, Users, Building, Cpu, BookOpen, ArrowRight, X } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useDebounce } from '../../hooks/useDebounce';
import { Modal } from './Modal';
import { Badge } from './Badge';

export const GlobalSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ students: [], opportunities: [], companies: [], skills: [], trainings: [] });
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 250);
  const navigate = useNavigate();

  useEffect(() => {
    const searchAll = async () => {
      if (!debouncedQuery.trim()) {
        setResults({ students: [], opportunities: [], companies: [], skills: [], trainings: [] });
        return;
      }
      setLoading(true);
      const term = debouncedQuery.toLowerCase();

      const [students, opps, companies, skills, trainings] = await Promise.all([
        storageService.query('students', (s) => s.name.toLowerCase().includes(term) || s.email.toLowerCase().includes(term)),
        storageService.query('opportunities', (o) => o.title.toLowerCase().includes(term) || o.location.toLowerCase().includes(term)),
        storageService.query('companies', (c) => c.company_name.toLowerCase().includes(term) || c.industry_type.toLowerCase().includes(term)),
        storageService.query('skills', (sk) => sk.skill_name.toLowerCase().includes(term)),
        storageService.query('training_programs', (t) => t.training_name.toLowerCase().includes(term)),
      ]);

      setResults({
        students: students.slice(0, 3),
        opportunities: opps.slice(0, 3),
        companies: companies.slice(0, 3),
        skills: skills.slice(0, 3),
        trainings: trainings.slice(0, 3),
      });
      setLoading(false);
    };

    searchAll();
  }, [debouncedQuery]);

  const handleSelect = (path) => {
    navigate(path);
    onClose();
    setQuery('');
  };

  const hasResults = Object.values(results).some((arr) => arr.length > 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Global Platform Search" size="lg">
      <div className="space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across students, opportunities, companies, skills, trainings..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white text-sm"
          />
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto space-y-3 pt-2">
          {loading && <p className="text-xs text-slate-400 text-center py-4">Searching database records...</p>}

          {!loading && !query && (
            <p className="text-xs text-slate-400 text-center py-6">Type to discover opportunities, candidate skills, and industry partners.</p>
          )}

          {!loading && query && !hasResults && (
            <p className="text-xs text-slate-500 text-center py-6">No matching records found for "{query}".</p>
          )}

          {/* Opportunities */}
          {results.opportunities.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" /> Opportunities
              </div>
              <div className="space-y-1">
                {results.opportunities.map((opp) => (
                  <button
                    key={opp.opportunity_id}
                    onClick={() => handleSelect(`/industry/opportunities/${opp.opportunity_id}`)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 flex items-center justify-between text-sm group"
                  >
                    <div>
                      <span className="font-medium text-slate-800">{opp.title}</span>
                      <span className="text-xs text-slate-400 ml-2">({opp.location})</span>
                    </div>
                    <Badge variant="brand" size="sm">{opp.opportunity_type}</Badge>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Students */}
          {results.students.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Students
              </div>
              <div className="space-y-1">
                {results.students.map((st) => (
                  <button
                    key={st.student_id}
                    onClick={() => handleSelect(`/academia/students/${st.student_id}`)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 flex items-center justify-between text-sm group"
                  >
                    <div>
                      <span className="font-medium text-slate-800">{st.name}</span>
                      <span className="text-xs text-slate-400 ml-2">{st.email}</span>
                    </div>
                    <Badge variant="emerald" size="sm">CGPA {st.cgpa}</Badge>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Companies */}
          {results.companies.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5" /> Companies
              </div>
              <div className="space-y-1">
                {results.companies.map((c) => (
                  <button
                    key={c.company_id}
                    onClick={() => handleSelect(`/industry/companies`)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 flex items-center justify-between text-sm"
                  >
                    <span className="font-medium text-slate-800">{c.company_name}</span>
                    <span className="text-xs text-slate-400">{c.industry_type}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trainings */}
          {results.trainings.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Training Programs
              </div>
              <div className="space-y-1">
                {results.trainings.map((t) => (
                  <button
                    key={t.training_id}
                    onClick={() => handleSelect(`/training/programs`)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 flex items-center justify-between text-sm"
                  >
                    <span className="font-medium text-slate-800">{t.training_name}</span>
                    <span className="text-xs text-slate-400">{t.provider}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
