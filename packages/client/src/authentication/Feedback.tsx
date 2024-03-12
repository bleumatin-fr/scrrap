import styled from '@emotion/styled';
import { useState } from 'react';

import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import * as yup from 'yup';
import TextField from '../project/parameters/TextField';

import BaseBlock from '../ui/Block';

import { useLocation } from 'react-router-dom';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import Button from '../ui/Button';

import QuestionMarkRoundedIcon from '@mui/icons-material/QuestionMarkRounded';
import Fab from '@mui/material/Fab';
import { useAuthentication } from './context/useAuthentication';

const validationSchema = yup.object({
  object: yup.string().required('Champ obligatoire'),
  message: yup.string().required('Champ obligatoire'),
});

const Feedback = () => {
  const [open, setOpen] = useState(false);
  const {
    sendMessage,
  } = useAuthentication();
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const formik = useFormik({
    initialValues: {
      object: '',
      message: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await sendMessage(values.object, values.message, location.pathname);
      enqueueSnackbar('Votre message a bien été envoyé', {
        variant: 'success',
      });
      handleClose();
    },
  });
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        id="create_modal"
      >
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle id="scroll-dialog-title">Besoin d'aide ?</DialogTitle>
          <DialogContent dividers={true}>
            <DialogContentText
              sx={{
                fontWeight: '400',
                fontSize: '16px',
                margin: '16px 0 32px',
              }}
            >
              {/* {!!authError && <Block accent>{`${authError}`}</Block>} */}
              <p className="hxr">
                Si vous avez des questions ou des suggestions sur l'application,
                n'hésitez pas à <b>nous contacter !</b> Nous vous répondrons
                dans les plus brefs délais.
              </p>
              <br />
              <p className="hxr">
                Pour nous aider à mieux vous aider, merci de mentionner le nom
                de votre organisation et votre projet, et indiquez précisément
                les paramètre concerné par votre demande.
              </p>
            </DialogContentText>

            <TextField
              id="object"
              name="object"
              label="Objet"
              autoFocus
              value={formik.values.object}
              onChange={formik.handleChange}
              error={formik.touched.object && Boolean(formik.errors.object)}
              helperText={formik.touched.object && formik.errors.object}
              fullWidth
              sx={{ marginBottom: '16px' }}
            />

            <TextField
              id="message"
              name="message"
              label="Message"
              multiline
              rows={4}
              value={formik.values.message}
              onChange={formik.handleChange}
              error={formik.touched.message && Boolean(formik.errors.message)}
              helperText={formik.touched.message && formik.errors.message}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Annuler</Button>
            {/* <Button type="submit" color="primary" disabled={loading}>
              Send
            </Button> */}
          </DialogActions>
        </form>
      </Dialog>
      <Fab
        sx={{
          position: 'fixed',
          right: '16px',
          bottom: '16px',
          backgroundColor: 'var(--bg-feedback)',
          color: 'var(--text-feedback)',
        }}
        onClick={() => setOpen(true)}
      >
        <QuestionMarkRoundedIcon />
      </Fab>
    </>
  );
};

export default Feedback;
