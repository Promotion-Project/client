import React from 'react';
import { Gift } from '../types/gift';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { format } from 'date-fns';

interface GiftSelectorProps {
  gifts: Gift[];
  onSelect: (gift: Gift) => void;
}

const GiftSelector: React.FC<GiftSelectorProps> = ({ gifts, onSelect }) => {
  return (
    <Grid container spacing={2}>
      {gifts.map((gift) => (
        <Grid item xs={12} sm={6} md={4} key={gift.id}>
          <Card onClick={() => onSelect(gift)}>
            <CardContent>
              <Typography variant="h5">{gift.name}</Typography>
              <Typography>Осталось: {gift.remaining}</Typography>
              <Typography>Дата сгорания: {format(new Date(gift.expiryDate), 'dd.MM.yyyy')}</Typography>
              <Typography>Номинал: {gift.value}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default GiftSelector;