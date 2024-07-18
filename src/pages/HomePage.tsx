import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPromotions, createPromotion, updatePromotion, deletePromotion } from '../store/actions/promotionActions';
import { AppState, AppDispatch } from '../store/store';
import PromotionTable from '../components/PromotionTable';
import PromotionForm from '../components/PromotionForm';
import { Promotion } from '../types/promotion';
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Gift } from '../types/gift';
import debounce from 'lodash.debounce';

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { promotions, loading, error } = useSelector((state: AppState) => state.promotion);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [sortColumn, setSortColumn] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<() => void>(() => () => {});

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      dispatch(fetchPromotions({ sortColumn, sortOrder, page, rowsPerPage, searchQuery: query }));
    }, 500),
    [dispatch, sortColumn, sortOrder, page, rowsPerPage]
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [debouncedSearch, searchQuery]);

  useEffect(() => {
    dispatch(fetchPromotions({ sortColumn, sortOrder, page, rowsPerPage, searchQuery }));
  }, [dispatch, sortColumn, sortOrder, page, rowsPerPage, searchQuery]);

  const handleEdit = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    setConfirmationOpen(true);
    setConfirmationAction(() => () => {
      dispatch(deletePromotion(id));
      setConfirmationOpen(false);
    });
  };

  const handleFormSubmit = (promotion: Promotion, gift: Gift | null) => {
    if (promotion.id) {
      setConfirmationOpen(true);
      setConfirmationAction(() => () => {
        dispatch(updatePromotion({ id: promotion.id, promotion }));
        setConfirmationOpen(false);
      });
    } else {
      setConfirmationOpen(true);
      setConfirmationAction(() => () => {
        dispatch(createPromotion(promotion));
        setConfirmationOpen(false);
      });
    }
    // Handle gift submission here if necessary
    if (gift) {
      // Implement gift handling logic
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedPromotion(null);
  };

  const handleSort = (column: string) => {
    const isAsc = sortColumn === column && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortColumn(column);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <h1>Promotions</h1>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
      />
      {loading ? <p>Loading...</p> : error ? <p>{error}</p> : (
        <PromotionTable
          promotions={promotions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSort={handleSort}
          sortColumn={sortColumn}
          sortOrder={sortOrder}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
      <Button variant="outlined" onClick={() => setIsFormOpen(true)}>
        Создать акцию
      </Button>
      {isFormOpen && (
        <PromotionForm
          initialValues={selectedPromotion || { id: 0, name: '', date: '', sentGifts: 0, daysToTakeGift: 0, daysToReceiveGift: 0, description: '', cardNumbers: '' }}
          onSubmit={handleFormSubmit}
          onClose={handleCloseForm}
          open={isFormOpen}
        />
      )}
      <Dialog open={confirmationOpen} onClose={() => setConfirmationOpen(false)}>
        <DialogTitle>Подтверждение</DialogTitle>
        <DialogContent>
          <p>Вы уверены, что хотите выполнить это действие?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmationOpen(false)} color="primary">
            Отмена
          </Button>
          <Button onClick={confirmationAction} color="primary">
            Подтвердить
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HomePage;