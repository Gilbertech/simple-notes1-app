import { useState, useEffect } from 'react';
import { Plus, LogOut, StickyNote } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Auth } from './components/Auth';
import { NoteCard } from './components/NoteCard';
import { NoteForm } from './components/NoteForm';
import { notesService } from './services/notesService';
import { Note } from './lib/supabase';

function NotesApp() {
  const { user, signOut, loading: authLoading } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  useEffect(() => {
    if (user) {
      loadNotes();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await notesService.getAllNotes();
      setNotes(data);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (title: string, content: string) => {
    await notesService.createNote({ title, content });
    await loadNotes();
  };

  const handleUpdateNote = async (title: string, content: string) => {
    if (!editingNote) return;
    await notesService.updateNote(editingNote.id, { title, content });
    await loadNotes();
    setEditingNote(null);
  };

  const handleDeleteNote = async (id: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      await notesService.deleteNote(id);
      await loadNotes();
    }
  };

  const handleEditClick = (note: Note) => {
    setEditingNote(note);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingNote(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <StickyNote className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">My Notes</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">{user.email}</span>
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-slate-600">
            {notes.length} {notes.length === 1 ? 'note' : 'notes'}
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg transition font-medium shadow-sm"
          >
            <Plus className="w-5 h-5" />
            <span>New Note</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center text-slate-600 py-12">Loading notes...</div>
        ) : notes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <StickyNote className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No notes yet</h3>
            <p className="text-slate-500 mb-6">Create your first note to get started</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg transition font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Create Note</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={handleEditClick}
                onDelete={handleDeleteNote}
              />
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <NoteForm
          note={editingNote}
          onSubmit={editingNote ? handleUpdateNote : handleCreateNote}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotesApp />
    </AuthProvider>
  );
}

export default App;
