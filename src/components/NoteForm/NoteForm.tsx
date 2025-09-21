import { useMutation, useQueryClient } from '@tanstack/react-query';
import css from '../NoteForm/NoteForm.module.css';
import { createdNotes } from '../../services/noteService';
import type { NewNote } from '../../types/note';
import { Field, Form, Formik, ErrorMessage, type FormikHelpers } from 'formik';
import { useId } from 'react';
import * as Yup from "yup";


const initialValues: NewNote = {
  id: "",
  title: "",
  content: "",
  createdAt: "",
  updatedAt: "",
  tag: "Todo",
};

type NoteFormProps = {
  onClose: () => void;
};

export default function NoteForm({onClose}: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newNote: NewNote) => createdNotes(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["notes"]})
    }
  });
  
  const handleSubmit = (
    values: NewNote,
    actions: FormikHelpers<NewNote>
  ) => {
    mutation.mutate({
      id: values.id,
      title: values.title,
      content: values.content,
      createdAt: values.createdAt,
      updatedAt: values.updatedAt,
      tag: values.tag
    });
    actions.resetForm();
    onClose();
  }
  const fieldId = useId();

  const NoteValidationSchema = Yup.object().shape({
    title: Yup.string().min(3).max(50).required("required"),
    content: Yup.string().max(500),
    tag: Yup.string().required("required")
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping']),
  })

  return (
<Formik initialValues={initialValues} validationSchema={NoteValidationSchema} onSubmit={handleSubmit}>
  <Form className={css.form}>
    <div className={css.formGroup}>
          <label htmlFor={`${ fieldId }-title`}>Title</label>
      <Field id={`${ fieldId }-title`} type="text" name="title" className={css.input} />
      <ErrorMessage name="title" className={css.error} component="span" />
    </div>

    <div className={css.formGroup}>
      <label htmlFor={`${fieldId}-content`}>Content</label>
      <Field as="textarea"
        id={`${fieldId}-content`}
        name="content"
        rows={8}
        className={css.textarea}
      />
      <ErrorMessage name="content" className={css.error} component="span" />
    </div>

    <div className={css.formGroup}>
      <label htmlFor={`${fieldId}-tag`}>Tag</label>
      <Field as="select" id={`${fieldId}-tag`} name="tag" className={css.select}>
        <option value="Todo">Todo</option>
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
        <option value="Meeting">Meeting</option>
        <option value="Shopping">Shopping</option>
      </Field>
      <ErrorMessage name="tag" className={css.error} component="span" />
    </div>

    <div className={css.actions}>
      <button type="button" className={css.cancelButton} onClick={onClose}>
        Cancel
      </button>
      <button
        type="submit"
        className={css.submitButton}
        disabled={false}
      >
        Create note
      </button>
    </div>
  </Form>
</Formik>
    )
}
