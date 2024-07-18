import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Promotion } from '../../types/promotion';

const API_URL = 'http://localhost:5000';

export const fetchPromotions = createAsyncThunk<Promotion[], { sortColumn: string, sortOrder: 'asc' | 'desc', page: number, rowsPerPage: number, searchQuery: string }>(
  'promotions/fetchPromotions',
  async ({ sortColumn, sortOrder, page, rowsPerPage, searchQuery }) => {
    const response = await axios.get<Promotion[]>(`${API_URL}/api/promotions`, {
      params: {
        sort: sortColumn,
        order: sortOrder,
        page: page + 1,
        limit: rowsPerPage,
        search: searchQuery,
      },
    });
    return response.data;
  }
);

export const createPromotion = createAsyncThunk<Promotion, Promotion>(
  'promotions/createPromotion',
  async (newPromotion) => {
    const response = await axios.post<Promotion>(`${API_URL}/api/promotions`, newPromotion);
    return response.data;
  }
);

export const updatePromotion = createAsyncThunk<Promotion, { id: number; promotion: Promotion }>(
  'promotions/updatePromotion',
  async ({ id, promotion }) => {
    const response = await axios.put<Promotion>(`${API_URL}/api/promotions/${id}`, promotion);
    return response.data;
  }
);

export const deletePromotion = createAsyncThunk<{ id: number }, number>(
  'promotions/deletePromotion',
  async (id) => {
    await axios.delete(`${API_URL}/api/promotions/${id}`);
    return { id };
  }
);