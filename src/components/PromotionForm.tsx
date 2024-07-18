import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Gift } from '../types/gift';
import { Promotion } from '../types/promotion';
import axios from 'axios';
import { format } from 'date-fns';

interface PromotionFormProps {
  initialValues: Promotion;
  onSubmit: (promotion: Promotion, gift: Gift | null) => void;
  onClose: () => void;
  open: boolean;
}

const PromotionSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  sentGifts: Yup.number().min(1, 'Must be greater than 0').required('Required'),
  date: Yup.date().required('Required'),
  daysToTakeGift: Yup.number().min(2, 'Must be at least 2 days').required('Required'),
  daysToReceiveGift: Yup.number().min(2, 'Must be at least 2 days').required('Required'),
  description: Yup.string().max(500, 'Max length is 500 characters'),
  cardNumbers: Yup.string().matches(/^[0-9,]*$/, 'Only numbers and commas are allowed').max(5000, 'Max length is 5000 characters')
});

const PromotionForm: React.FC<PromotionFormProps> = ({ initialValues, onSubmit, onClose, open }) => {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);

  useEffect(() => {
    // Fetch available gifts from the server
    axios.get<Gift[]>('/api/gifts').then((response) => {
      setGifts(response.data);
    });
  }, []);

  const handleGiftSelect = (gift: Gift | null) => {
    setSelectedGift(gift);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialValues.id ? 'Edit Promotion' : 'Create Promotion'}</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{ ...initialValues, date: initialValues.date ? format(new Date(initialValues.date), 'yyyy-MM-dd') : '' }} // Форматируем дату для формы
          validationSchema={PromotionSchema}
          onSubmit={(values, { resetForm }) => {
            onSubmit(values, selectedGift);
            resetForm();
            onClose();
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <Field
                name="name"
                as={TextField}
                label="Название рассылки"
                variant="outlined"
                margin="normal"
                fullWidth
                error={touched.name && !!errors.name}
                helperText={touched.name && errors.name}
              />
              <Field
                name="date"
                as={TextField}
                label="Дата рассылки"
                type="date"
                variant="outlined"
                margin="normal"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={touched.date && !!errors.date}
                helperText={touched.date && errors.date}
              />
              <Field
                name="sentGifts"
                as={TextField}
                label="Кол-во отправленных подарков"
                type="number"
                variant="outlined"
                margin="normal"
                fullWidth
                error={touched.sentGifts && !!errors.sentGifts}
                helperText={touched.sentGifts && errors.sentGifts}
              />
              <Field
                name="daysToTakeGift"
                as={TextField}
                label="Кол-во дней на взятие подарка"
                type="number"
                variant="outlined"
                margin="normal"
                fullWidth
                error={touched.daysToTakeGift && !!errors.daysToTakeGift}
                helperText={touched.daysToTakeGift && errors.daysToTakeGift}
              />
              <Field
                name="daysToReceiveGift"
                as={TextField}
                label="Кол-во дней на получение подарка"
                type="number"
                variant="outlined"
                margin="normal"
                fullWidth
                error={touched.daysToReceiveGift && !!errors.daysToReceiveGift}
                helperText={touched.daysToReceiveGift && errors.daysToReceiveGift}
              />
              <Field
                name="description"
                as={TextField}
                label="Описание акции"
                variant="outlined"
                margin="normal"
                fullWidth
                multiline
                rows={4}
                error={touched.description && !!errors.description}
                helperText={touched.description && errors.description}
              />
              <Field
                name="cardNumbers"
                as={TextField}
                label="Номера карт"
                variant="outlined"
                margin="normal"
                fullWidth
                multiline
                rows={4}
                error={touched.cardNumbers && !!errors.cardNumbers}
                helperText={touched.cardNumbers && errors.cardNumbers}
              />
              <Button onClick={() => handleGiftSelect(null)} variant="outlined" fullWidth>
                Выбрать подарок
              </Button>
              {gifts.map((gift) => (
                <div key={gift.id} onClick={() => handleGiftSelect(gift)}>
                  <h4>{gift.name}</h4>
                  <p>Осталось подарков: {gift.remaining}</p>
                  <p>Дата сгорания: {format(new Date(gift.expiryDate), 'dd.MM.yyyy')}</p> {/* Форматируем дату */}
                  <p>Номинал: {gift.value}</p>
                </div>
              ))}
              <DialogActions>
                <Button onClick={onClose} color="primary">
                  Отмена
                </Button>
                <Button type="submit" color="primary">
                  {initialValues.id ? 'Сохранить' : 'Создать'}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default PromotionForm;