import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchPromotions, createPromotion, updatePromotion, deletePromotion } from '../actions/promotionActions';
import { Promotion } from '../../types/promotion';

interface PromotionState {
  loading: boolean;
  promotions: Promotion[];
  error: string | null;
}

const initialState: PromotionState = {
  loading: false,
  promotions: [],
  error: null,
};

const promotionSlice = createSlice({
  name: 'promotion',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPromotions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPromotions.fulfilled, (state, action: PayloadAction<Promotion[]>) => {
        state.loading = false;
        state.promotions = action.payload;
      })
      .addCase(fetchPromotions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      })
      .addCase(createPromotion.fulfilled, (state, action: PayloadAction<Promotion>) => {
        state.promotions.push(action.payload);
      })
      .addCase(updatePromotion.fulfilled, (state, action: PayloadAction<Promotion>) => {
        const index = state.promotions.findIndex((promotion) => promotion.id === action.payload.id);
        if (index !== -1) {
          state.promotions[index] = action.payload;
        }
      })
      .addCase(deletePromotion.fulfilled, (state, action: PayloadAction<{ id: number }>) => {
        state.promotions = state.promotions.filter((promotion) => promotion.id !== action.payload.id);
      });
  },
});

export default promotionSlice.reducer;