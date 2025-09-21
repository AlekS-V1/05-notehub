import type { Note, NewFormNote } from "../types/note";
import axios from 'axios';

interface notesHttpResponse {
    notes: Note[];
    totalPages: number;
}

axios.defaults.baseURL = "https://notehub-public.goit.study/api";
const sui = import.meta.env.VITE_NOTEHUB_TOKEN;

export async function fetchNotes(search: string, page: number, perPage: number = 12): Promise<notesHttpResponse> {
    const response = await axios.get<notesHttpResponse>(
        '/notes', {
            params: {
                search: search,
                page,
                perPage,
            },
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${sui}`,
            }
        }
    ) 
    return response.data;  
}

export async function createNote(data: NewFormNote) {
    const response = await axios.post<notesHttpResponse>(
        '/notes', data, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${sui}`,
            }
        }    
    )
    return response.data;    
}

export async function deleteNote(noteId: string) {
    await axios.delete<notesHttpResponse>(
        `/notes/${noteId}`, {
                headers: {
                accept: 'application/json',
                Authorization: `Bearer ${sui}`,
            }
        }    
    )    
}