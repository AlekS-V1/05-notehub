import css from '../NoteList/NoteList.module.css';
import type { Note } from '../../types/note';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNotes } from '../../services/noteService';

interface NoteListProps {
    notes: Note[];
    onChange?: (note: Note) => void;
}

export default function NoteList({ notes = [] }: NoteListProps) {

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (noteId: string) => deleteNotes(noteId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["notes"]})
        }
    });
    const handleDelete = (noteId: string) => {
        mutation.mutate(noteId);
        }
    
    return (
        <ul className={css.list}>
            {notes.map((note) => (
            <li key={note.id} className={css.listItem} >
                <h2 className={css.title}>{note.title}</h2>
                <p className={css.content}>{note.content}</p>
                <div className={css.footer}>
                    <span className={css.tag}>{note.tag}</span>
                        <button
                            className={css.button}
                            onClick={() => handleDelete(note.id)}
                        >Delete</button>
                </div>
            </li>))}            
        </ul>

    )
}