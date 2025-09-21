import css from '../App/App.module.css';
import NoteList from '../NoteList/NoteList';
import { fetchNotes } from '../../services/noteService';
import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import SearchBox from '../SearchBox/SearchBox';
import { useDebouncedCallback } from 'use-debounce';
import Pagination from '../Pagination/Pagination';

export default function App() {
    // Стан для зберігання поточної сторінки
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 12
    // Стан для зберігання пошуку
    const [searchQuery, setSearchQuery] = useState('');    
    
    const { data, isLoading } = useQuery({
        queryKey: ["notes", searchQuery, currentPage, perPage],
        queryFn: () => fetchNotes(searchQuery, currentPage, perPage),
        placeholderData: keepPreviousData,
    });    
    const notes = data?.notes;
    const pageCount = data?.totalPages

    const handleSearch = useDebouncedCallback((val: string) => {
        setSearchQuery(val)
    }, 300)    

    // Стан для керування модалкою
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox searchQuery={searchQuery} onSearch={handleSearch} />
                
                {data?.notes && data.notes.length > 0 && (
                    <Pagination pageCount={pageCount} currentPage={currentPage} setCurrentPage={setCurrentPage} />)}

                <button className={css.button} onClick={openModal}>Create note +</button>
            </header>

            {isLoading && <strong >Loading notes...</strong>}
            {notes && !isLoading && <NoteList notes={notes ?? []} />}
            {isModalOpen &&
                <Modal onClose={closeModal}>
                    <NoteForm onClose={closeModal} />
                </Modal>
            }
        </div>
       
    )
}

