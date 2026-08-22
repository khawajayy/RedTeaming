import React, { useEffect, useState, useMemo } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  PointerSensor, 
  TouchSensor, 
  KeyboardSensor, 
  useSensor, 
  useSensors, 
  closestCorners 
} from '@dnd-kit/core';
import { collection, onSnapshot, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { seedRoadmapData } from '../data/seedData';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import ProgressStats from './ProgressStats';
import Navbar from './Navbar';
import { 
  Search, 
  Filter, 
  Calendar, 
  Sparkles, 
  AlertTriangle, 
  ShieldAlert, 
  SlidersHorizontal,
  X
} from 'lucide-react';

const COLUMNS = ['To Do', 'In Progress', 'Completed'];
const MONTHS = ['All Months', 'Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'];

export default function KanbanBoard() {
  const { user } = useAuth();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCard, setActiveCard] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('All Months');
  const [searchQuery, setSearchQuery] = useState('');
  const [seedingLoading, setSeedingLoading] = useState(false);
  const [seedSuccessMessage, setSeedSuccessMessage] = useState('');
  const [firestoreError, setFirestoreError] = useState(null);

  // Configure drag sensors with distance activation constraint
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 150,
      tolerance: 5,
    },
  });
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(pointerSensor, touchSensor, keyboardSensor);

  // Real-time Firestore sync via onSnapshot
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    setFirestoreError(null);

    const roadmapColRef = collection(db, 'users', user.uid, 'roadmap');
    const q = query(roadmapColRef, orderBy('order', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loadedCards = [];
        snapshot.forEach((docSnap) => {
          loadedCards.push({ id: docSnap.id, ...docSnap.data() });
        });
        setCards(loadedCards);
        setLoading(false);
      },
      (error) => {
        console.error('Firestore onSnapshot error:', error);
        setFirestoreError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Seeding handler
  const handleSeedData = async (force = false) => {
    if (!user) return;
    setSeedingLoading(true);
    setSeedSuccessMessage('');
    try {
      const result = await seedRoadmapData(user.uid, force);
      if (result.seeded) {
        setSeedSuccessMessage('Successfully initialized 24 AI Red Teaming milestones!');
        setTimeout(() => setSeedSuccessMessage(''), 6000);
      } else {
        setSeedSuccessMessage(result.message);
        setTimeout(() => setSeedSuccessMessage(''), 4000);
      }
    } catch (err) {
      console.error('Error seeding data:', err);
      alert('Error seeding roadmap data: ' + err.message);
    } finally {
      setSeedingLoading(false);
    }
  };

  // Instant update status in Firestore
  const updateCardStatus = async (cardId, newStatus) => {
    if (!user || !cardId || !newStatus) return;

    // Optimistic UI state update
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, status: newStatus } : c))
    );

    try {
      const cardRef = doc(db, 'users', user.uid, 'roadmap', cardId);
      await updateDoc(cardRef, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('Failed to update card status:', err);
      setFirestoreError('Failed to sync changes with Firestore. ' + err.message);
    }
  };

  // Drag event handlers
  const handleDragStart = (event) => {
    const { active } = event;
    const card = cards.find((c) => c.id === active.id);
    setActiveCard(card || null);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Check if dropped onto a column or another card
    let targetStatus = null;
    if (COLUMNS.includes(overId)) {
      targetStatus = overId;
    } else {
      const overCard = cards.find((c) => c.id === overId);
      if (overCard) {
        targetStatus = overCard.status;
      }
    }

    const currentCard = cards.find((c) => c.id === activeId);
    if (currentCard && targetStatus && currentCard.status !== targetStatus) {
      await updateCardStatus(activeId, targetStatus);
    }
  };

  // Filter cards by month & search
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const matchesMonth =
        selectedMonth === 'All Months' || card.month === selectedMonth;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        card.focusArea?.toLowerCase().includes(q) ||
        card.keyConcepts?.toLowerCase().includes(q) ||
        card.actionItem?.toLowerCase().includes(q) ||
        card.week?.toLowerCase().includes(q);

      return matchesMonth && matchesSearch;
    });
  }, [cards, selectedMonth, searchQuery]);

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col font-sans selection:bg-red-500/30 selection:text-red-200">
      {/* Navbar */}
      <Navbar
        hasCards={cards.length > 0}
        totalCards={cards.length}
        onSeedData={handleSeedData}
        seedingLoading={seedingLoading}
        seedSuccessMessage={seedSuccessMessage}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Firestore Permission / Network Error Warning */}
        {firestoreError && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-200">Firestore Sync Notice</p>
              <p className="mt-0.5 text-xs text-slate-300">
                {firestoreError}. Please ensure Firestore Security Rules permit read/write access for your authenticated UID.
              </p>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <div className="w-12 h-12 rounded-full border-2 border-red-500/20 border-t-red-500 animate-spin mb-4" />
            <p className="font-mono text-xs uppercase tracking-widest animate-pulse text-slate-400">
              Synchronizing Mission Roadmap...
            </p>
          </div>
        ) : cards.length === 0 ? (
          /* Empty State - Seed Call to Action */
          <div className="max-w-2xl mx-auto my-12 p-8 sm:p-12 text-center rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 mx-auto flex items-center justify-center mb-6 shadow-glow-red">
              <Sparkles className="w-8 h-8 text-red-400 animate-pulse" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Initialize Your AI Red Teaming Roadmap
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto">
              Your database currently has no active milestones. Click below to automatically batch-populate the full 6-Month, 24-milestone curriculum directly to your secure Firestore collection.
            </p>

            <button
              type="button"
              onClick={() => handleSeedData(false)}
              disabled={seedingLoading}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-medium rounded-xl shadow-xl shadow-red-600/30 border border-red-400/30 transition-all duration-200 cursor-pointer disabled:opacity-50 text-sm sm:text-base group"
            >
              {seedingLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              )}
              <span>Populate 24 Milestones (Batch Write)</span>
            </button>
          </div>
        ) : (
          /* Active Board View */
          <>
            {/* Progress Statistics Header */}
            <ProgressStats cards={cards} />

            {/* Filter & Search Bar */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 sm:p-4 mb-6 backdrop-blur-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              
              {/* Month Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-thin">
                <span className="text-xs font-mono text-slate-500 flex items-center gap-1 mr-1 hidden sm:flex shrink-0">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Timeline:</span>
                </span>
                {MONTHS.map((month) => (
                  <button
                    key={month}
                    onClick={() => setSelectedMonth(month)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all duration-150 ${
                      selectedMonth === month
                        ? 'bg-red-600 text-white shadow-md shadow-red-600/30 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 bg-slate-950/60 border border-slate-800/80'
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search exploits, tools, or concepts..."
                  className="w-full pl-9 pr-8 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-mono"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Dnd-Kit Kanban Grid */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {COLUMNS.map((columnId) => {
                  const columnCards = filteredCards.filter(
                    (card) => (card.status || 'To Do') === columnId
                  );
                  return (
                    <KanbanColumn
                      key={columnId}
                      id={columnId}
                      title={columnId}
                      cards={columnCards}
                      onStatusChange={updateCardStatus}
                    />
                  );
                })}
              </div>

              {/* Drag Overlay Preview */}
              <DragOverlay>
                {activeCard ? <KanbanCard card={activeCard} isOverlay /> : null}
              </DragOverlay>
            </DndContext>
          </>
        )}

      </main>
    </div>
  );
}
