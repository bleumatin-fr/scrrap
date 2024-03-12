import styled from '@emotion/styled';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import * as yup from 'yup';

import { useFormik } from 'formik';
import TextField from '../project/parameters/TextField';
import BaseBlock from '../ui/Block';
import LoadingButton from '../ui/LoadingButton';
import useUser from './context/useUser';
import PasswordStrengthBar from "react-password-strength-bar";
import { useState } from 'react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  width: 300px;
`;

const Block = styled(BaseBlock)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 32px 38px;
  width: 100%;
`;

const validationSchema = yup.object({
  formerPassword: yup.string().required('Champ obligatoire'),
  password: yup
    .string()
    .min(8, 'Votre mot de passe doit contenir au moins 8 caractères')
    .required('Champ obligatoire'),
});

interface PasswordChangeModalProps {
  open: boolean;
  handleClose: () => void;
}

const PasswordChangeModal = ({
  open,
  handleClose,
}: PasswordChangeModalProps) => {
  const { loading, error, changePassword } = useUser();
  const { enqueueSnackbar } = useSnackbar();
  const [score, setScore] = useState(0);

  const formik = useFormik({
    initialValues: {
      formerPassword: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (score < 3) {
        enqueueSnackbar('Votre mot de passe est trop faible', {
          variant: 'warning',
          anchorOrigin: { horizontal: "center", vertical: "top" }
        });
        return;
      }
      await changePassword({
        formerPassword: values.formerPassword,
        password: values.password,
      });

      enqueueSnackbar('Mot de passe changé avec succès', {
        variant: 'success',
      });
      onClose();
    },
  });

  const onClose = () => {
    formik.resetForm();
    handleClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle id="scroll-dialog-title">
          Mise à jour mot de passe
        </DialogTitle>
        <DialogContent dividers={true}>
          <Container>
            {!!error && <Block accent>{`${error}`}</Block>}
            <TextField
              id="formerPassword"
              name="formerPassword"
              type="password"
              label="Mot de passe actuel"
              value={formik.values.formerPassword}
              onChange={formik.handleChange}
              error={
                formik.touched.formerPassword &&
                Boolean(formik.errors.formerPassword)
              }
              helperText={
                formik.touched.formerPassword && formik.errors.formerPassword
              }
              disabled={loading}
              fullWidth
            />
            <TextField
              id="password"
              name="password"
              type="password"
              label="Nouveau mot de passe"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={
                formik.touched.password && <div>{formik.errors.password}</div>
              }
              disabled={loading}
              fullWidth
            />
            <PasswordStrengthBar
              password={formik.values.password}
              minLength={8}
              shortScoreWord="Mot de passe trop court"
              scoreWords={["Sécurité de votre mot de passe : Faible", "Sécurité de votre mot de passe : Faible", "Sécurité de votre mot de passe : Moyen", "Sécurité de votre mot de passe : Bon", "Sécurité de votre mot de passe : Très bon"]}
              onChangeScore={(score) => setScore(score)}
            />
          </Container>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            type="submit"
            loading={loading}
            color="primary"
            disabled={loading}
          >
            Mettre à jour
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PasswordChangeModal;
