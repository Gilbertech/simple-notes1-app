import { Edit2, Trash2 } from 'lucide-react';
import { Note } from '../lib/supabase';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 border border-slate-200">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-slate-800 flex-1 break-words">
          {note.title}
        </h3>
        <div className="flex gap-2 ml-3">
          <button
            onClick={() => onEdit(note)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            title="Edit note"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Delete note"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-slate-600 mb-4 whitespace-pre-wrap break-words">
        {note.content}
      </p>

      <div className="text-xs text-slate-400">
        {formatDate(note.updated_at)}
      </div>
    </div>
  );
}
